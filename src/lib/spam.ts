import crypto from "crypto";

/** Hidden form field real visitors never fill in. Bots that fill every input give themselves away. */
export const HONEYPOT_FIELD = "website";

/** A human can't read and fill a form faster than this; scripted posts usually do it in milliseconds. */
const MIN_FILL_MS = 2500;

export interface SpamFields {
  [HONEYPOT_FIELD]?: unknown;
  /** Epoch ms when the form was first rendered, sent back by the client. */
  startedAt?: unknown;
  /** Cloudflare Turnstile response token, when the widget is enabled. */
  turnstileToken?: unknown;
}

export type SpamVerdict =
  /** Looks human. */
  | { ok: true }
  /** Almost certainly a bot: answer as if it worked so it learns nothing, but do nothing. */
  | { ok: false; silent: true; reason: string }
  /** Failed a check a human can retry (the Turnstile challenge). */
  | { ok: false; silent: false; reason: string };

/**
 * Cheap bot checks every public form runs before doing any work: the honeypot, a minimum fill
 * time, and Cloudflare Turnstile when TURNSTILE_SECRET_KEY is set.
 */
export async function checkSpam(fields: SpamFields, ip: string | null): Promise<SpamVerdict> {
  if (String(fields[HONEYPOT_FIELD] ?? "").trim()) {
    return { ok: false, silent: true, reason: "honeypot" };
  }

  const startedAt = Number(fields.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, silent: true, reason: "too-fast" };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret) {
    const token = String(fields.turnstileToken ?? "");
    if (!token || !(await verifyTurnstile(secret, token, ip))) {
      return { ok: false, silent: false, reason: "turnstile" };
    }
  }

  return { ok: true };
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    // If Cloudflare is unreachable, don't turn every real visitor away; the other checks still apply.
    console.error("Turnstile verification failed:", error);
    return true;
  }
}

/** The caller's IP as Vercel reports it. */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
}

/** A salted hash, so rate limits can match repeat senders without storing their raw IP. */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.DOWNLOAD_TOKEN_SECRET || process.env.SANITY_API_WRITE_TOKEN || "jlang.dev";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
