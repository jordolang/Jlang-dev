import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

/** Tracked download: checks ownership, bumps download stats, then redirects to the file. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Portal service is not configured." }, { status: 503 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deliverable = await sanityClient.fetch<{ fileUrl?: string } | null>(
    `*[_type == "portalDeliverable" && _id == $id && isVisible == true && clientProject->client._ref == $clientId][0]{ "fileUrl": file.asset->url }`,
    { id, clientId: session._id }
  );
  if (!deliverable?.fileUrl) {
    return NextResponse.json({ error: "Deliverable not found" }, { status: 404 });
  }

  try {
    await sanityClient
      .patch(id)
      .setIfMissing({ downloadCount: 0 })
      .inc({ downloadCount: 1 })
      .set({ lastDownloadedAt: new Date().toISOString() })
      .commit();
  } catch (error) {
    // Stats are best-effort; never block the client's download on them
    console.error("Error tracking deliverable download:", error);
  }

  // ?dl forces Sanity's CDN to serve the file as an attachment
  return NextResponse.redirect(`${deliverable.fileUrl}?dl=`);
}
