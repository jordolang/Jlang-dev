import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";
import { cookies } from "next/headers";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

// Auth utilities: generateMagicLink, verifyToken, getSession

export interface MagicLinkToken {
  _id: string;
  _rev: string;
  token: string;
  email: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
  createdAt: string;
}

export interface ClientSession {
  _id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
}

const SESSION_COOKIE_NAME = "client_session";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const MAGIC_LINK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// ponytail: falls back to the Sanity write token so existing deploys keep working; set PORTAL_SESSION_SECRET to rotate sessions independently
const sessionSecret = () => process.env.PORTAL_SESSION_SECRET || process.env.SANITY_API_WRITE_TOKEN;

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

/** Tokens are stored hashed so a leaked Sanity document can't be replayed as a login link. */
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Encode session data as `<base64url json>.<hmac>` so the cookie can't be forged client-side. */
function encodeSession(data: Record<string, string>): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({ ...data, exp: Date.now() + SESSION_DURATION })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

/** Returns the session payload only if the signature matches and it hasn't expired. */
export function decodeSession(value: string): { clientId?: string; exp?: number } | null {
  const secret = sessionSecret();
  const [payload, sig] = value.split(".");
  if (!secret || !payload || !sig) return null;
  const expected = Buffer.from(sign(payload, secret));
  const actual = Buffer.from(sig);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.exp === "number" && data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

/**
 * Generate a secure random token for magic links
 */
function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Generate a magic link token and store it in Sanity
 */
export async function generateMagicLink(email: string): Promise<string | null> {
  if (!sanityIsConfigured || !email) return null;

  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_DURATION).toISOString();

  try {
    await sanityClient.create({
      _type: "magicLinkToken",
      token: hashToken(token),
      email,
      expiresAt,
      createdAt: new Date().toISOString(),
      used: false,
    });

    return token;
  } catch (error) {
    console.error("Error creating magic link token:", error);
    return null;
  }
}

/**
 * Verify a magic link token is valid and unused
 */
export async function verifyToken(token: string): Promise<{ valid: boolean; email?: string; error?: string }> {
  if (!sanityIsConfigured || !token) {
    return { valid: false, error: "Invalid configuration" };
  }

  try {
    const query = `*[_type == "magicLinkToken" && token == $magicToken][0]{_id, _rev, email, expiresAt, used}`;
    const result = await sanityClient.fetch<MagicLinkToken | null>(query, { magicToken: hashToken(token) });

    if (!result) {
      return { valid: false, error: "Token not found" };
    }

    if (result.used) {
      return { valid: false, error: "Token already used" };
    }

    const now = new Date();
    const expiresAt = new Date(result.expiresAt);
    if (now > expiresAt) {
      return { valid: false, error: "Token expired" };
    }

    // Mark token as used; ifRevisionId makes a concurrent second consume fail instead of also succeeding
    try {
      await sanityClient.patch(result._id).ifRevisionId(result._rev).set({ used: true, usedAt: now.toISOString() }).commit();
    } catch {
      return { valid: false, error: "Token already used" };
    }

    return { valid: true, email: result.email };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { valid: false, error: "Verification failed" };
  }
}

/**
 * Resolve an email to exactly one login-enabled client. Duplicates are rejected rather than
 * guessing, since picking one would hide (or expose) the wrong account's projects.
 */
export async function findLoginClient(email: string): Promise<ClientSession | null> {
  const query = `*[_type == "client" && email == $email && loginEnabled == true]{_id, name, email, company, role}`;
  const clients = await sanityClient.fetch<ClientSession[]>(query, { email });
  if (clients.length > 1) console.error(`Portal login refused: ${clients.length} clients share one email`);
  return clients.length === 1 ? clients[0] : null;
}

/**
 * Create a session for a client by email
 */
export async function createSession(email: string): Promise<ClientSession | null> {
  if (!sanityIsConfigured || !email) return null;

  try {
    const client = await findLoginClient(email);

    if (!client) {
      return null;
    }

    // Update last login
    await sanityClient.patch(client._id).set({ lastLogin: new Date().toISOString() }).commit();

    // Set session cookie
    const cookieStore = await cookies();
    const sessionData = encodeSession({
      clientId: client._id,
      email: client.email,
      name: client.name,
    });
    if (!sessionData) {
      return null;
    }

    cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION / 1000, // Convert to seconds
      path: "/",
    });

    return client;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<ClientSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const sessionData = decodeSession(sessionCookie.value);
    if (!sessionData?.clientId || !sanityIsConfigured) {
      return null;
    }

    // Fetch fresh client data
    const query = `*[_type == "client" && _id == $clientId && loginEnabled == true][0]{_id, name, email, company, role}`;
    const client = await sanityClient.fetch<ClientSession | null>(query, { clientId: sessionData.clientId });

    return client;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Clear the current session
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
