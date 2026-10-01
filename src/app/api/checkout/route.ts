import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sanityClient } from "@/sanity/lib/client";

interface CheckoutRequestBody {
  productSlug?: string;
}

interface CheckoutProduct {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  basePrice: number;
}

export async function POST(request: Request) {
  try {
    const { productSlug } = (await request.json()) as CheckoutRequestBody;

    if (!productSlug) {
      return NextResponse.json(
        { error: "Missing required field: productSlug" },
        { status: 400 }
      );
    }

    // Price and product identity come from Sanity, never from the caller.
    const product = await sanityClient.fetch<CheckoutProduct | null>(
      `*[_type == "digitalProduct" && published == true && slug.current == $slug][0]{ _id, "slug": slug.current, name, description, basePrice }`,
      { slug: productSlug }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const unitAmount = Math.round(product.basePrice * 100);
    if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
      return NextResponse.json(
        { error: "This product is not available for purchase" },
        { status: 400 }
      );
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev").replace(/\/$/, "");
    const successUrl = `${siteUrl}/products/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/products/${encodeURIComponent(product.slug)}`;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: product.name,
              ...(product.description ? { description: product.description } : {}),
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        productId: product._id,
        productName: product.name,
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
