import "server-only";
import { getResend } from "./resend";

/** One alert per subject per window, so a failing dependency doesn't flood the inbox. */
const THROTTLE_MS = 10 * 60 * 1000;
/** And a hard cap per instance per hour, in case many different things break at once. */
const HOURLY_CAP = 20;
const lastSent = new Map<string, number>();
let sentThisHour: number[] = [];

/**
 * Emails the site owner that something went wrong on the server. Never throws: an alert that
 * fails to send is logged and dropped, so callers can fire it from any error path.
 */
export async function alertOwner(subject: string, details: Record<string, unknown> = {}): Promise<void> {
  console.error(`[alert] ${subject}`, details);

  const now = Date.now();
  const previous = lastSent.get(subject);
  if (previous && now - previous < THROTTLE_MS) return;
  sentThisHour = sentThisHour.filter((time) => now - time < 60 * 60 * 1000);
  if (sentThisHour.length >= HOURLY_CAP) return;
  lastSent.set(subject, now);
  sentThisHour.push(now);

  if (!process.env.RESEND_API_KEY) return;
  try {
    const { error } = await getResend().emails.send({
      from: process.env.ALERT_EMAIL_FROM || process.env.CONTACT_EMAIL_FROM || "JLang Development <alerts@jlang.dev>",
      to: process.env.ALERT_EMAIL || process.env.CONTACT_EMAIL || "jordan@jlang.dev",
      subject: `[jlang.dev alert] ${subject}`,
      text: [
        subject,
        "",
        ...Object.entries(details).map(([key, value]) => `${key}: ${formatValue(value)}`),
        "",
        `Time: ${new Date(now).toISOString()}`,
        `Environment: ${process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown"}`,
      ].join("\n"),
    });
    if (error) console.error("[alert] failed to send alert email:", error);
  } catch (error) {
    console.error("[alert] failed to send alert email:", error);
  }
}

function formatValue(value: unknown): string {
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Test hook: forget throttling state between tests. */
export function resetAlertThrottle() {
  lastSent.clear();
  sentThisHour = [];
}
