import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getReviewRequest } from "@/lib/reviews";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

export async function POST(request: Request) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Review service is not configured." }, { status: 503 });
  }

  const body = await request.json();
  const token = String(body.token || "");
  const content = String(body.content || "").trim();
  const rating = Number(body.rating);
  const reviewRequest = await getReviewRequest(token);

  if (!reviewRequest || reviewRequest.status === "completed") {
    return NextResponse.json({ error: "This review link is invalid or has already been used." }, { status: 400 });
  }
  if (content.length < 10 || content.length > 3000 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Please provide a review and select a rating." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const testimonialId = `testimonial-${reviewRequest._id.replace(/^drafts\./, "")}`;
  await sanityClient
    .transaction()
    .createIfNotExists({
      _id: testimonialId,
      _type: "testimonial",
      content,
      rating,
      author: reviewRequest.clientName,
      company: reviewRequest.company,
      role: reviewRequest.role,
      approved: true,
      featured: false,
      requestId: reviewRequest._id,
      submittedAt: now,
    })
    .patch(reviewRequest._id, (patch) => patch.set({ status: "completed", completedAt: now }))
    .commit();

  revalidateTag("testimonials");
  revalidatePath("/");
  return NextResponse.json({ ok: true, googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "" });
}
