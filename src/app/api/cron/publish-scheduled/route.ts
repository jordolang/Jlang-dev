import { NextResponse } from "next/server";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

export async function GET(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  const suppliedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 503 });
  }

  const now = new Date().toISOString();

  try {
    // Raw perspective so Studio drafts (`drafts.<id>`) are visible — a scheduled post is usually
    // still a draft. When a base id has both versions, the draft wins: it's what the editor scheduled.
    const due = await sanityClient.fetch<Array<{ _id: string; title: string } & Record<string, unknown>>>(
      `*[_type == "blogPost" && scheduledPublishDate <= $now && published == false]`,
      { now },
      { perspective: "raw" }
    );
    const byBaseId = new Map<string, (typeof due)[number]>();
    for (const doc of due) {
      const baseId = doc._id.replace(/^drafts\./, "");
      if (!byBaseId.has(baseId) || doc._id.startsWith("drafts.")) byBaseId.set(baseId, doc);
    }
    const postsToPublish = [...byBaseId.entries()];

    if (postsToPublish.length === 0) {
      return NextResponse.json({ published: 0, message: "No posts ready to publish" });
    }

    // Publish each post: promote a draft to the published id (and drop the draft), or flip the
    // flag on an already-published document.
    const results = await Promise.all(
      postsToPublish.map(([baseId, post]) => {
        const tx = sanityClient.transaction();
        if (post._id.startsWith("drafts.")) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _rev, _createdAt, _updatedAt, ...fields } = post;
          tx.createOrReplace({ ...fields, _id: baseId, _type: "blogPost", published: true }).delete(post._id);
        } else {
          tx.patch(baseId, (p) => p.set({ published: true }));
        }
        return tx
          .commit()
          .then(() => ({ id: baseId, title: post.title, success: true }))
          .catch((error) => ({ id: baseId, title: post.title, success: false, error: error.message }));
      })
    );

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      published: successful.length,
      failed: failed.length,
      posts: successful.map((r) => ({ id: r.id, title: r.title })),
      errors: failed.length > 0 ? failed : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to publish scheduled posts" },
      { status: 500 }
    );
  }
}
