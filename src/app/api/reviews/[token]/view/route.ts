import { NextResponse } from "next/server";
import { getReviewRequest } from "@/lib/reviews";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Review service is not configured." }, { status: 503 });
  }

  const { token } = await params;
  const reviewRequest = await getReviewRequest(token);

  if (!reviewRequest) {
    return NextResponse.json({ error: "This review link is invalid." }, { status: 400 });
  }

  if (reviewRequest.status === "completed") {
    return NextResponse.json({ ok: true });
  }

  // Keep the first view's timestamp; revisits shouldn't overwrite it.
  const updates: Record<string, unknown> = reviewRequest.viewedAt ? {} : { viewedAt: new Date().toISOString() };

  if (reviewRequest.status === "sent") {
    updates.status = "viewed";
  }

  if (Object.keys(updates).length > 0) {
    await sanityClient.patch(reviewRequest._id).set(updates).commit();
  }

  return NextResponse.json({ ok: true });
}
