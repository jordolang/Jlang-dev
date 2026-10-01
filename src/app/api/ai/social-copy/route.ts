import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { apiVersion, projectId } from "@/sanity/env";

export const maxDuration = 60;

/**
 * The Studio runs in the browser, so this route is publicly reachable and would otherwise be a free
 * Claude endpoint for anyone who finds it. The Studio sends the signed-in user's own Sanity token;
 * we hand it straight back to Sanity on a project-scoped host, which 401s unless the token belongs
 * to a real member of *this* project. No shared secret to leak into the client bundle.
 */
async function authenticatedSanityUser(request: Request): Promise<string | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const response = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const user = (await response.json()) as { id?: string };
  return user?.id ?? null;
}

const SOCIAL_POST_SCHEMA = {
  type: "object",
  properties: {
    twitter: {
      type: "object",
      properties: {
        content: { type: "string" },
        hashtags: { type: "array", items: { type: "string" } },
      },
      required: ["content", "hashtags"],
      additionalProperties: false,
    },
    linkedin: {
      type: "object",
      properties: {
        content: { type: "string" },
        hashtags: { type: "array", items: { type: "string" } },
      },
      required: ["content", "hashtags"],
      additionalProperties: false,
    },
  },
  required: ["twitter", "linkedin"],
  additionalProperties: false,
} as const;

const SYSTEM = `You generate social media posts for Jordan Lang's web development portfolio — he writes about building real projects for real clients.

Write in his voice: direct, concrete, first person, conversational but professional. Focus on practical takeaways and real-world insights.

For Twitter:
- Hashtags are appended after the content, so keep the content short enough that content plus hashtags stays within 280 characters
- Hook readers in the first line
- Include 2-3 relevant hashtags
- Keep it punchy and engaging

For LinkedIn:
- More professional tone but still conversational
- Can be longer (2-3 paragraphs)
- Include context and insights
- Include 3-5 relevant hashtags
- Encourage discussion or shares

Return both platform variants as structured JSON.`;

export async function POST(request: Request) {
  // Authenticate before anything else — an unauthenticated caller should learn nothing about how
  // this server is configured.
  let userId: string | null;
  try {
    userId = await authenticatedSanityUser(request);
  } catch (error) {
    console.error("[ai/social-copy] Sanity auth check failed:", error);
    return NextResponse.json({ error: "Could not verify your Sanity session." }, { status: 502 });
  }
  if (!userId) {
    return NextResponse.json({ error: "Sign in to Sanity Studio to use AI social copy generation." }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as {
    blogPostId?: string;
    title?: string;
    excerpt?: string;
    platforms?: string[];
  } | null;
  if (!body) {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const { blogPostId, title, excerpt, platforms } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Blog post title is required." }, { status: 400 });
  }

  if (!excerpt?.trim()) {
    return NextResponse.json({ error: "Blog post excerpt is required." }, { status: 400 });
  }

  if (!platforms || platforms.length === 0) {
    return NextResponse.json({ error: "At least one platform must be specified." }, { status: 400 });
  }

  const anthropic = new Anthropic();

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      system: SYSTEM,
      output_config: { format: { type: "json_schema", schema: SOCIAL_POST_SCHEMA } },
      messages: [
        {
          role: "user",
          content: `Generate social media posts for this blog post:\n\nTitle: "${title}"\n\nExcerpt: ${excerpt}\n\nGenerate posts for: ${platforms.join(", ")}`,
        },
      ],
    });

    if (message.stop_reason === "refusal") {
      return NextResponse.json({ error: "Claude declined to generate social copy for this post." }, { status: 422 });
    }

    const text = message.content.find((block) => block.type === "text");
    if (!text) {
      return NextResponse.json({ error: "Claude returned no social copy." }, { status: 502 });
    }

    const result = JSON.parse(text.text);

    // Filter result to only include requested platforms
    const filtered: Record<string, unknown> = {};
    for (const platform of platforms) {
      if (result[platform]) {
        filtered[platform] = result[platform];
      }
    }

    return NextResponse.json({ blogPostId, platforms: filtered });
  } catch (error) {
    console.error("[ai/social-copy] failed:", error);
    return NextResponse.json({ error: "Social copy generation failed. Check the server logs." }, { status: 502 });
  }
}
