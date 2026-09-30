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
    // Query for posts that should be published
    const postsToPublish = await sanityClient.fetch<Array<{ _id: string; title: string }>>(
      `*[_type == "blogPost" && scheduledPublishDate <= $now && published == false] { _id, title }`,
      { now }
    );

    if (postsToPublish.length === 0) {
      return NextResponse.json({ published: 0, message: "No posts ready to publish" });
    }

    // Publish each post
    const results = await Promise.all(
      postsToPublish.map((post) =>
        sanityClient
          .patch(post._id)
          .set({ published: true })
          .commit()
          .then(() => ({ id: post._id, title: post.title, success: true }))
          .catch((error) => ({ id: post._id, title: post.title, success: false, error: error.message }))
      )
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
