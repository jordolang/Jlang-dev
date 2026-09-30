import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";
import { generateMagicLink } from "@/lib/auth";

interface SendMagicLinkRequest {
  email: string;
}

export async function POST(request: Request) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 503 });
  }

  let body: SendMagicLinkRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  try {
    // Check if client exists and has login enabled
    const query = `*[_type == "client" && email == $email && loginEnabled == true][0]{_id, name, email}`;
    const client = await sanityClient.fetch<{ _id: string; name: string; email: string } | null>(query, { email });

    if (!client) {
      // Return success even if client doesn't exist to prevent email enumeration
      return NextResponse.json({ ok: true });
    }

    // Generate magic link token
    const token = await generateMagicLink(email);
    if (!token) {
      return NextResponse.json({ error: "Failed to generate magic link" }, { status: 500 });
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev").replace(/\/$/, "");
    const magicLinkUrl = `${siteUrl}/portal/login?token=${encodeURIComponent(token)}`;

    // Send magic link email
    const { error } = await getResend().emails.send({
      from: process.env.PORTAL_EMAIL_FROM || "JLang Development <portal@jlang.dev>",
      to: client.email,
      subject: "Your login link for JLang Development Portal",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.65">
          <h1 style="font-size:28px">Your login link is ready</h1>
          <p>Hi ${escapeHtml(client.name)},</p>
          <p>Click the button below to securely log in to your client portal:</p>
          <p><a href="${magicLinkUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">Log in to portal</a></p>
          <p style="font-size:13px;color:#667085">This link will expire in 15 minutes and can only be used once. If you didn't request this login link, you can safely ignore this email.</p>
          <p style="font-size:13px;color:#667085;margin-top:24px">Or copy and paste this URL into your browser:<br/><a href="${magicLinkUrl}" style="color:#4f46e5;word-break:break-all">${magicLinkUrl}</a></p>
        </div>`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send magic link" },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
