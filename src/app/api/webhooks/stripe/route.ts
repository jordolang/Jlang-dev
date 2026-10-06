import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { alertOwner } from "@/lib/alerts";
import { sendDownloadEmail } from "@/lib/orders";
import { captureServerEvent } from "@/lib/server-analytics";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";
import Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 401 }
      );
    }

    // Verify webhook signature and construct event
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid signature";
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${message}` },
        { status: 401 }
      );
    }

    // Fulfill on completion, or later for delayed payment methods once the payment clears
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        // Delayed payment still pending; async_payment_succeeded will follow if it clears.
        return NextResponse.json({ ok: true, pending: true, sessionId: session.id });
      }

      // Extract customer email and product metadata
      const customerEmail = session.customer_details?.email;
      const productId = session.metadata?.productId;

      if (!customerEmail || !productId) {
        return NextResponse.json(
          { error: "Missing customer email or product ID in session metadata" },
          { status: 400 }
        );
      }

      const productName = session.metadata?.productName || "Your purchase";
      const livemode = event.livemode;

      // Record the order first, so the buyer can recover their links even if this email is lost.
      // The id is derived from the session, so Stripe's retries never create duplicates.
      const orderId = `order-${session.id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
      const canRecord = sanityIsConfigured && Boolean(process.env.SANITY_API_WRITE_TOKEN);
      let alreadyTracked = false;
      if (canRecord) {
        try {
          alreadyTracked = Boolean((await sanityClient.getDocument<{ purchaseTracked?: boolean }>(orderId))?.purchaseTracked);
          await sanityClient.createIfNotExists({
            _id: orderId,
            _type: "order",
            email: customerEmail.toLowerCase(),
            customerName: session.customer_details?.name || undefined,
            product: { _type: "reference", _ref: productId, _weak: true },
            productName,
            amountTotal: typeof session.amount_total === "number" ? session.amount_total / 100 : undefined,
            currency: session.currency || undefined,
            stripeSessionId: session.id,
            livemode,
            purchasedAt: new Date((session.created || Date.now() / 1000) * 1000).toISOString(),
            lastLinkSentAt: new Date().toISOString(),
          });
        } catch (error) {
          await alertOwner("Could not record a paid order in Sanity", { error, sessionId: session.id, customerEmail });
        }
      }

      try {
        await sendDownloadEmail(customerEmail, [{ productId, productName }], { orderId: session.id });
      } catch (emailError) {
        // The email is how the buyer gets their file, so fail the webhook and let Stripe retry.
        console.error("Failed to send purchase confirmation email:", emailError);
        await alertOwner("A buyer paid but their download email failed", { error: emailError, sessionId: session.id, customerEmail });
        return NextResponse.json(
          { error: "Failed to send purchase confirmation email", sessionId: session.id },
          { status: 500 }
        );
      }

      if (!alreadyTracked) {
        // Test-mode purchases are flagged so reports can leave them out.
        await captureServerEvent(session.metadata?.analyticsId || customerEmail.toLowerCase(), "purchase_completed", {
          product: productName,
          product_id: productId,
          revenue: typeof session.amount_total === "number" ? session.amount_total / 100 : undefined,
          currency: session.currency,
          is_test: !livemode,
          $set: { email: customerEmail.toLowerCase() },
        });
        if (canRecord) {
          await sanityClient.patch(orderId).set({ purchaseTracked: true }).commit().catch(() => undefined);
        }
      }

      return NextResponse.json({ ok: true, sessionId: session.id, emailSent: true });
    }

    // Ignore other event types
    return NextResponse.json({ ignored: true, eventType: event.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    await alertOwner("Stripe webhook failed", { error });
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

