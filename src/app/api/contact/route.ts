import { NextResponse } from "next/server";
import { alertOwner } from "@/lib/alerts";
import { getResend } from "@/lib/resend";
import { checkSpam, clientIp, hashIp } from "@/lib/spam";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

const MAX_MESSAGE_LENGTH = 10000;
const SOURCES = ["contact", "services", "promo"] as const;

/** More than this many inquiries from one sender inside the window is treated as abuse. */
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Contact and order forms post here. Each inquiry is saved to Sanity first (so it survives an email
 * outage), then emailed to the site owner, then acknowledged to the sender. The notification always
 * goes to the site owner, never to a caller-supplied address.
 */
export async function POST(request: Request) {
  const canSave = sanityIsConfigured && Boolean(process.env.SANITY_API_WRITE_TOKEN);
  const canEmail = Boolean(process.env.RESEND_API_KEY);
  if (!canSave && !canEmail) {
    return NextResponse.json({ error: "Email is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const field = (key: string, max = 200) => String(body?.[key] ?? "").trim().slice(0, max);
  const name = field("name");
  const email = field("email", 320);
  const subject = field("subject");
  const message = String(body?.message || "").trim();
  const source = SOURCES.find((s) => s === body?.source) ?? "contact";
  const details = {
    phone: field("phone", 50),
    company: field("company"),
    projectType: field("projectType", 100),
    budget: field("budget", 100),
    timeline: field("timeline", 100),
  };
  const pagePath = field("pagePath", 300);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Please provide your name, a valid email and a message." }, { status: 400 });
  }

  const ip = clientIp(request);
  const verdict = await checkSpam(body ?? {}, ip);
  if (!verdict.ok) {
    if (verdict.silent) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Please complete the verification and try again." }, { status: 400 });
  }

  const ipHash = hashIp(ip);
  if (canSave && ipHash) {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const recent = await sanityClient
      .fetch<number>(`count(*[_type == "lead" && ipHash == $ipHash && createdAt > $since])`, { ipHash, since })
      .catch(() => 0);
    if (recent >= RATE_LIMIT_COUNT) {
      return NextResponse.json({ error: "Too many messages. Please try again later or email me directly." }, { status: 429 });
    }
  }

  // 1. Save the inquiry. This is the record of truth; the email is a notification about it.
  let leadId: string | null = null;
  if (canSave) {
    try {
      const lead = await sanityClient.create({
        _type: "lead",
        status: "new",
        name,
        email,
        subject: subject || undefined,
        message,
        source,
        ...Object.fromEntries(Object.entries(details).filter(([, value]) => value)),
        pagePath: pagePath || undefined,
        ipHash: ipHash || undefined,
        emailDelivered: false,
        createdAt: new Date().toISOString(),
      });
      leadId = lead._id;
    } catch (error) {
      await alertOwner("Could not save an inquiry to Sanity", { error, from: email });
    }
  }

  // 2. Notify the site owner.
  let emailed = false;
  if (canEmail) {
    const detailLines = [
      details.company && `Business: ${details.company}`,
      details.phone && `Phone: ${details.phone}`,
      details.projectType && `Project type: ${details.projectType}`,
      details.budget && `Budget: ${details.budget}`,
      details.timeline && `Timeline: ${details.timeline}`,
    ].filter(Boolean);
    const studioLink = leadId ? `\n\nOpen in Studio: ${siteUrl()}/studio/intent/edit/id=${leadId};type=lead` : "";

    try {
      const { error } = await getResend().emails.send({
        from: fromAddress(),
        to: process.env.CONTACT_EMAIL || "jordan@jlang.dev",
        replyTo: email,
        subject: subject || `New message from ${name}`,
        text: `From: ${name} <${email}>\n${detailLines.length ? `${detailLines.join("\n")}\n` : ""}\n${message}${studioLink}`,
      });
      if (error) throw new Error(error.message);
      emailed = true;
    } catch (error) {
      console.error("Failed to send contact email:", error);
      if (leadId) await alertOwner("Inquiry saved but the notification email failed", { error, from: email, leadId });
    }
  }

  if (leadId && emailed) {
    await sanityClient.patch(leadId).set({ emailDelivered: true }).commit().catch(() => undefined);
  }

  if (!leadId && !emailed) {
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }

  // 3. Let the sender know it arrived. Best effort: the inquiry is already safe.
  if (canEmail) await sendAcknowledgement(name, email);

  return NextResponse.json({ ok: true });
}

/**
 * The confirmation goes to an address anyone can type in, so it never echoes their message back;
 * otherwise the form could be used to send arbitrary text to strangers from this domain.
 */
async function sendAcknowledgement(name: string, email: string) {
  const firstName = name.split(/\s+/)[0].replace(/[^\p{L}'-]/gu, "").slice(0, 40);
  const bookingUrl = await getBookingUrl();
  const lines = [
    `Hi${firstName ? ` ${firstName}` : ""},`,
    "",
    "Thanks for reaching out. Your message came through and I'll reply personally as soon as I can.",
    ...(bookingUrl ? ["", `If it's easier to talk it through, you can grab a time on my calendar: ${bookingUrl}`] : []),
    "",
    "Jordan Lang",
    "JLang Development",
    siteUrl(),
  ];

  try {
    const { error } = await getResend().emails.send({
      from: fromAddress(),
      to: email,
      replyTo: process.env.CONTACT_EMAIL || "jordan@jlang.dev",
      subject: "Thanks, I got your message",
      text: lines.join("\n"),
    });
    if (error) console.error("Failed to send inquiry acknowledgement:", error);
  } catch (error) {
    console.error("Failed to send inquiry acknowledgement:", error);
  }
}

async function getBookingUrl(): Promise<string | null> {
  if (process.env.NEXT_PUBLIC_BOOKING_URL) return process.env.NEXT_PUBLIC_BOOKING_URL;
  if (!sanityIsConfigured) return null;
  return sanityClient.fetch<string | null>(`*[_type == "siteSettings"][0].bookingUrl`).catch(() => null);
}

function fromAddress() {
  return process.env.CONTACT_EMAIL_FROM || "JLang Development <contact@jlang.dev>";
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev").replace(/\/$/, "");
}
