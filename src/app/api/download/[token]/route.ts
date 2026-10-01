import { NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/download-tokens";
import { sanityClient } from "@/sanity/lib/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Verify the download token
    const payload = verifyDownloadToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired download token" },
        { status: 401 }
      );
    }

    // Fetch the product from Sanity to get the download URL
    const product = await sanityClient.fetch<{ downloadUrl: string } | null>(
      `*[_type == "digitalProduct" && _id == $productId][0]{ downloadUrl }`,
      { productId: payload.productId }
    );

    if (!product || !product.downloadUrl) {
      return NextResponse.json(
        { error: "Product or download URL not found" },
        { status: 404 }
      );
    }

    // Redirect to the download URL
    return NextResponse.redirect(product.downloadUrl, 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
