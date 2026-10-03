import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

const MAX_MESSAGE_LENGTH = 10000;

/** Contact and order forms post here; the message always goes to the site owner, never to a caller-supplied address. */
export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim().slice(0, 200);
  const email = String(body?.email || "").trim().slice(0, 320);
  const subject = String(body?.subject || "").trim().slice(0, 200);
  const message = String(body?.message || "").trim();

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Please provide your name, a valid email and a message." }, { status: 400 });
  }

  const { error } = await getResend().emails.send({
    from: process.env.CONTACT_EMAIL_FROM || "JLang Development <contact@jlang.dev>",
    to: process.env.CONTACT_EMAIL || "jordan@jlang.dev",
    replyTo: email,
    subject: subject || `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("Failed to send contact email:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
