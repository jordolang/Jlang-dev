import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getReviewRequest } from "@/lib/reviews";
import { getResend } from "@/lib/resend";
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

  if (!reviewRequest || reviewRequest.status === "submitted") {
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
    .patch(reviewRequest._id, (patch) => patch.set({ status: "submitted", completedAt: now }))
    .commit();

  // Send notification email to Jordan
  try {
    const notificationEmail = process.env.REVIEW_NOTIFICATION_EMAIL;
    if (notificationEmail) {
      const stars = "⭐".repeat(rating);
      const contentPreview = content.length > 200 ? content.slice(0, 200) + "..." : content;
      await getResend().emails.send({
        from: process.env.REVIEW_EMAIL_FROM || "JLang Development <reviews@jlang.dev>",
        to: notificationEmail,
        subject: `New ${rating}-star review from ${reviewRequest.clientName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.65">
            <h1 style="font-size:28px">New Review Submitted</h1>
            <p><strong>Client:</strong> ${escapeHtml(reviewRequest.clientName)}</p>
            <p><strong>Company:</strong> ${escapeHtml(reviewRequest.company)}</p>
            <p><strong>Role:</strong> ${escapeHtml(reviewRequest.role)}</p>
            <p><strong>Rating:</strong> ${stars} (${rating}/5)</p>
            <h2 style="font-size:20px;margin-top:24px">Review Content</h2>
            <p style="background:#f9fafb;padding:16px;border-radius:8px;border-left:4px solid #4f46e5">${escapeHtml(contentPreview)}</p>
            <p style="font-size:13px;color:#667085;margin-top:24px">Submitted at ${new Date(now).toLocaleString()}</p>
          </div>`,
      });
    }
  } catch (error) {
    // Log error but don't fail the request since the review was already saved
    console.error("Failed to send notification email:", error);
  }

  revalidateTag("testimonials");
  revalidatePath("/");
  return NextResponse.json({ ok: true, googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "" });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
