import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

interface RouteParams {
  params: Promise<{ requestId: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Review service is not configured." }, { status: 503 });
  }

  const { requestId } = await params;
  const body = await request.json();
  const message = String(body.message || "").trim();
  const action = String(body.action || "").toLowerCase();

  if (!requestId) {
    return NextResponse.json({ error: "Review request ID is required." }, { status: 400 });
  }

  const reviewRequest = await sanityClient.fetch(
    `*[_type == "reviewRequest" && _id == $requestId][0]{_id, clientName, email, status, interactions}`,
    { requestId }
  );

  if (!reviewRequest) {
    return NextResponse.json({ error: "Review request not found." }, { status: 404 });
  }

  if (reviewRequest.status !== "submitted" && reviewRequest.status !== "completed") {
    return NextResponse.json({ error: "Can only respond to submitted reviews." }, { status: 400 });
  }

  if (!message || message.length < 1 || message.length > 2000) {
    return NextResponse.json({ error: "Please provide a response message (1-2000 characters)." }, { status: 400 });
  }

  if (!["respond", "publish"].includes(action)) {
    return NextResponse.json({ error: "Action must be 'respond' or 'publish'." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const interaction = {
    _key: `interaction-${Date.now()}`,
    type: action === "publish" ? "published" : "response",
    timestamp: now,
    metadata: { message },
  };

  const existingInteractions = reviewRequest.interactions || [];
  const updatedInteractions = [...existingInteractions, interaction];

  const updates: Record<string, unknown> = {
    interactions: updatedInteractions,
  };

  if (action === "publish") {
    updates.status = "published";
    updates.publishedAt = now;

    const testimonialId = `testimonial-${requestId.replace(/^drafts\./, "")}`;
    await sanityClient
      .transaction()
      .patch(requestId, (patch) => patch.set(updates))
      .patch(testimonialId, (patch) => patch.set({ approved: true }))
      .commit();
  } else {
    await sanityClient.patch(requestId).set(updates).commit();
  }

  // Send email notification to client
  try {
    const { error } = await getResend().emails.send({
      from: process.env.REVIEW_EMAIL_FROM || "JLang Development <reviews@jlang.dev>",
      to: reviewRequest.email,
      subject: "Jordan responded to your review",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.65">
          <h1 style="font-size:28px">Jordan responded to your review</h1>
          <p>Hi ${escapeHtml(reviewRequest.clientName)},</p>
          <p>Jordan has responded to your review:</p>
          <blockquote style="border-left:4px solid #4f46e5;padding-left:16px;margin:20px 0;color:#374151;font-style:italic">
            ${escapeHtml(message)}
          </blockquote>
          ${action === "publish" ? '<p style="color:#059669;font-weight:600">Your review has been published. Thank you for sharing your experience!</p>' : '<p>Thank you for your feedback!</p>'}
        </div>`,
    });
    if (error) {
      throw new Error(error.message);
    }
  } catch {
    // Email failure should not prevent response from being recorded
  }

  revalidateTag("testimonials");
  revalidateTag("reviewRequests");
  revalidatePath("/");

  return NextResponse.json({ ok: true, action, message: "Response recorded successfully." });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
