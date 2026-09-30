import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { generateDownloadToken } from "@/lib/download-tokens";
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

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract customer email and product metadata
      const customerEmail = session.customer_details?.email;
      const productId = session.metadata?.productId;

      if (!customerEmail || !productId) {
        return NextResponse.json(
          { error: "Missing customer email or product ID in session metadata" },
          { status: 400 }
        );
      }

      // Generate download token
      const downloadToken = generateDownloadToken(productId, customerEmail);

      // TODO: Send confirmation email with download link in phase 5
      // For now, just log the token (will be used in subtask-5-1)
      console.log(`Download token generated for ${customerEmail}: ${downloadToken}`);

      return NextResponse.json({
        ok: true,
        sessionId: session.id,
        customerEmail,
        productId,
        downloadToken,
      });
    }

    // Ignore other event types
    return NextResponse.json({ ignored: true, eventType: event.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
