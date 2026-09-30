import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

interface CheckoutRequestBody {
  productId: string;
  priceId: string;
  productName?: string;
  productDescription?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequestBody;
    const { productId, priceId, productName, productDescription } = body;

    if (!productId || !priceId) {
      return NextResponse.json(
        { error: "Missing required fields: productId and priceId" },
        { status: 400 }
      );
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev").replace(/\/$/, "");
    const successUrl = `${siteUrl}/products/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/products/${encodeURIComponent(productId)}`;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        productId,
        productName: productName || "",
        productDescription: productDescription || "",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create checkout session"
      },
      { status: 500 }
    );
  }
}
