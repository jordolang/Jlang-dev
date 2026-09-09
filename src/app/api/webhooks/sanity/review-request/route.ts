import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

interface ReviewRequestDocument {
  _id: string;
  _type: string;
  clientName: string;
  company: string;
  role: string;
  email: string;
  token: string;
  status: string;
}

export async function POST(request: Request) {
  const expectedSecret = process.env.SANITY_WEBHOOK_SECRET;
  const suppliedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 503 });
  }

  const document = (await request.json()) as ReviewRequestDocument;
  if (document._type !== "reviewRequest" || document.status !== "queued") {
    return NextResponse.json({ ignored: true });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev").replace(/\/$/, "");
  const reviewUrl = `${siteUrl}/review/${encodeURIComponent(document.token)}`;

  try {
    const { error } = await getResend().emails.send({
      from: process.env.REVIEW_EMAIL_FROM || "JLang Development <reviews@jlang.dev>",
      to: document.email,
      subject: `${document.clientName}, would you review JLang Development?`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.65">
          <h1 style="font-size:28px">A quick review would mean a lot</h1>
          <p>Hi ${escapeHtml(document.clientName)},</p>
          <p>Thank you for trusting JLang Development with ${escapeHtml(document.company)}. Would you take a moment to share your experience?</p>
          <p><a href="${reviewUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">Write your review</a></p>
          <p style="font-size:13px;color:#667085">This private link is intended for you and can be used once.</p>
        </div>`,
    });
    if (error) throw new Error(error.message);
    await sanityClient.patch(document._id).set({ status: "sent", sentAt: new Date().toISOString() }).commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    await sanityClient.patch(document._id).set({ status: "failed" }).commit();
    return NextResponse.json({ error: error instanceof Error ? error.message : "Email failed" }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
