import { NextResponse } from "next/server";
import { alertOwner } from "@/lib/alerts";
import { getResend } from "@/lib/resend";
import { checkSpam, clientIp } from "@/lib/spam";

/** Blog newsletter sign-up: adds the address to Resend contacts (and a segment, if one is configured). */
export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "The newsletter isn't available right now." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 320);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const verdict = await checkSpam(body ?? {}, clientIp(request));
  if (!verdict.ok) {
    if (verdict.silent) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Please complete the verification and try again." }, { status: 400 });
  }

  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  try {
    const { error } = await getResend().contacts.create({
      email,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });
    // Signing up twice is not an error from the visitor's point of view.
    if (error && !/already exists/i.test(error.message)) throw new Error(error.message);
  } catch (error) {
    await alertOwner("Newsletter sign-up failed", { error });
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
