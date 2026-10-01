import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { generateDownloadToken } from "@/lib/download-tokens";
import { getResend } from "@/lib/resend";
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

      // Generate download token
      const downloadToken = generateDownloadToken(productId, customerEmail);

      // Send purchase confirmation email with download link
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev").replace(/\/$/, "");
      const downloadUrl = `${siteUrl}/api/download/${encodeURIComponent(downloadToken)}`;

      try {
        const { error } = await getResend().emails.send({
          from: process.env.PURCHASE_EMAIL_FROM || "JLang Development <orders@jlang.dev>",
          to: customerEmail,
          subject: "Your purchase is ready - Download now",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.65">
              <h1 style="font-size:28px">Thank you for your purchase!</h1>
              <p>Your digital product is ready to download.</p>
              <p><a href="${downloadUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">Download Now</a></p>
              <p style="font-size:13px;color:#667085">This download link is unique to you and can be used to access your purchase.</p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
              <p style="font-size:13px;color:#667085">Order ID: ${escapeHtml(session.id)}<br>Product ID: ${escapeHtml(productId)}</p>
            </div>`,
        });

        if (error) {
          throw new Error(error.message);
        }

        return NextResponse.json({ ok: true, sessionId: session.id, emailSent: true });
      } catch (emailError) {
        // The email is the only delivery channel, so fail the webhook and let Stripe retry.
        console.error("Failed to send purchase confirmation email:", emailError);
        return NextResponse.json(
          { error: "Failed to send purchase confirmation email", sessionId: session.id },
          { status: 500 }
        );
      }
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

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
