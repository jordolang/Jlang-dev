import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

// Auth utilities: generateMagicLink, verifyToken, getSession

export interface MagicLinkToken {
  _id: string;
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
      token,
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
    const query = `*[_type == "magicLinkToken" && token == $token][0]{_id, email, expiresAt, used}`;
    const result = await sanityClient.fetch<MagicLinkToken | null>(query, { token });

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

    // Mark token as used
    await sanityClient.patch(result._id).set({ used: true, usedAt: now.toISOString() }).commit();

    return { valid: true, email: result.email };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { valid: false, error: "Verification failed" };
  }
}

/**
 * Create a session for a client by email
 */
export async function createSession(email: string): Promise<ClientSession | null> {
  if (!sanityIsConfigured || !email) return null;

  try {
    // Fetch the client by email
    const query = `*[_type == "client" && email == $email && loginEnabled == true][0]{_id, name, email, company, role}`;
    const client = await sanityClient.fetch<ClientSession | null>(query, { email });

    if (!client) {
      return null;
    }

    // Update last login
    await sanityClient.patch(client._id).set({ lastLogin: new Date().toISOString() }).commit();

    // Set session cookie
    const cookieStore = await cookies();
    const sessionData = JSON.stringify({
      clientId: client._id,
      email: client.email,
      name: client.name,
    });

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

    const sessionData = JSON.parse(sessionCookie.value);
    if (!sessionData.clientId || !sanityIsConfigured) {
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
