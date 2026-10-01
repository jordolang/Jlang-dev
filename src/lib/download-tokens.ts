import crypto from "crypto";

const TOKEN_EXPIRY_HOURS = 24;

interface DownloadTokenPayload {
  productId: string;
  email: string;
  purchaseDate: number;
  expiresAt: number;
}

function getSecret(): string {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!secret) {
    throw new Error("DOWNLOAD_TOKEN_SECRET is not configured");
  }
  return secret;
}

/**
 * Generate a secure download token for a purchased product
 * @param productId - The product ID from Sanity
 * @param email - Customer's email address
 * @returns Encoded token string
 */
export function generateDownloadToken(
  productId: string,
  email: string
): string {
  const now = Date.now();
  const expiresAt = now + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;

  const payload: DownloadTokenPayload = {
    productId,
    email,
    purchaseDate: now,
    expiresAt,
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString).toString("base64url");

  // Create HMAC signature
  const secret = getSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify and decode a download token
 * @param token - The token to verify
 * @returns Decoded payload if valid, null if invalid or expired
 */
export function verifyDownloadToken(
  token: string
): DownloadTokenPayload | null {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) {
      return null;
    }

    // Verify signature
    const secret = getSecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const payloadString = Buffer.from(payloadBase64, "base64url").toString(
      "utf-8"
    );
    const payload: DownloadTokenPayload = JSON.parse(payloadString);

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired without full verification
 * @param token - The token to check
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const [payloadBase64] = token.split(".");
    if (!payloadBase64) return true;

    const payloadString = Buffer.from(payloadBase64, "base64url").toString(
      "utf-8"
    );
    const payload: DownloadTokenPayload = JSON.parse(payloadString);

    return Date.now() > payload.expiresAt;
  } catch {
    return true;
  }
}
