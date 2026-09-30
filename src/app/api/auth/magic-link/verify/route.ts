import { NextResponse } from "next/server";
import { verifyToken, createSession } from "@/lib/auth";
import { sanityIsConfigured } from "@/sanity/lib/client";

interface VerifyMagicLinkRequest {
  token: string;
}

export async function POST(request: Request) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 503 });
  }

  let body: VerifyMagicLinkRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { token } = body;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    // Verify the token and get the associated email
    const verification = await verifyToken(token);

    if (!verification.valid || !verification.email) {
      return NextResponse.json(
        { error: verification.error || "Invalid token" },
        { status: 401 }
      );
    }

    // Create session for the client (cookies().set() is called inside createSession to set the session cookie)
    const session = await createSession(verification.email);

    if (!session) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      client: {
        name: session.name,
        email: session.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify magic link" },
      { status: 500 }
    );
  }
}
