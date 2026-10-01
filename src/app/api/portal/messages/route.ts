import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProjectMessages } from "@/lib/portal";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

export async function GET(request: Request) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Portal service is not configured." }, { status: 503 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const clientProjectId = searchParams.get("clientProjectId");

  if (!clientProjectId) {
    return NextResponse.json({ error: "clientProjectId is required" }, { status: 400 });
  }

  try {
    // Verify client has access to this project
    const query = `*[_type == "clientProject" && _id == $clientProjectId && client._ref == $clientId][0]{_id}`;
    const project = await sanityClient.fetch<{ _id: string } | null>(query, {
      clientProjectId,
      clientId: session._id,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 403 });
    }

    const messages = await getProjectMessages(clientProjectId);
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Portal service is not configured." }, { status: 503 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const clientProjectId = String(body.clientProjectId || "").trim();
  const message = String(body.message || "").trim();
  const recipient = String(body.recipient || "jordan");

  if (!clientProjectId) {
    return NextResponse.json({ error: "clientProjectId is required" }, { status: 400 });
  }

  if (message.length < 1 || message.length > 5000) {
    return NextResponse.json({ error: "Message must be between 1 and 5000 characters" }, { status: 400 });
  }

  if (recipient !== "jordan" && recipient !== "client") {
    return NextResponse.json({ error: "Invalid recipient" }, { status: 400 });
  }

  try {
    // Verify client has access to this project
    const query = `*[_type == "clientProject" && _id == $clientProjectId && client._ref == $clientId][0]{_id}`;
    const project = await sanityClient.fetch<{ _id: string } | null>(query, {
      clientProjectId,
      clientId: session._id,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 403 });
    }

    const now = new Date().toISOString();
    const newMessage = await sanityClient.create({
      _type: "portalMessage",
      clientProject: {
        _type: "reference",
        _ref: clientProjectId,
      },
      sender: "client",
      recipient,
      message,
      isRead: false,
      createdAt: now,
    });

    revalidateTag("portalMessages");
    return NextResponse.json({ ok: true, message: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
