import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

interface RouteParams {
  params: Promise<{ requestId: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Review service is not configured." }, { status: 503 });
  }

  const { requestId } = await params;
  const body = await request.json();
  const message = String(body.message || "").trim();
  const action = String(body.action || "").toLowerCase();

  if (!requestId) {
    return NextResponse.json({ error: "Review request ID is required." }, { status: 400 });
  }

  const reviewRequest = await sanityClient.fetch(
    `*[_type == "reviewRequest" && _id == $requestId][0]{_id, clientName, status, interactions}`,
    { requestId }
  );

  if (!reviewRequest) {
    return NextResponse.json({ error: "Review request not found." }, { status: 404 });
  }

  if (reviewRequest.status !== "submitted" && reviewRequest.status !== "completed") {
    return NextResponse.json({ error: "Can only respond to submitted reviews." }, { status: 400 });
  }

  if (!message || message.length < 1 || message.length > 2000) {
    return NextResponse.json({ error: "Please provide a response message (1-2000 characters)." }, { status: 400 });
  }

  if (!["respond", "publish"].includes(action)) {
    return NextResponse.json({ error: "Action must be 'respond' or 'publish'." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const interaction = {
    _key: `interaction-${Date.now()}`,
    type: action === "publish" ? "published" : "response",
    timestamp: now,
    metadata: { message },
  };

  const existingInteractions = reviewRequest.interactions || [];
  const updatedInteractions = [...existingInteractions, interaction];

  const updates: Record<string, unknown> = {
    interactions: updatedInteractions,
  };

  if (action === "publish") {
    updates.status = "completed";
    updates.publishedAt = now;

    const testimonialId = `testimonial-${requestId.replace(/^drafts\./, "")}`;
    await sanityClient
      .transaction()
      .patch(requestId, (patch) => patch.set(updates))
      .patch(testimonialId, (patch) => patch.set({ approved: true }))
      .commit();
  } else {
    await sanityClient.patch(requestId).set(updates).commit();
  }

  revalidateTag("testimonials");
  revalidateTag("reviewRequests");
  revalidatePath("/");

  return NextResponse.json({ ok: true, action, message: "Response recorded successfully." });
}
