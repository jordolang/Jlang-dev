import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { authenticatedSanityUser } from "@/sanity/lib/auth";

/** Drafting a full post takes a while; give it more than the default budget. */
export const maxDuration = 120;

const BODY_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    excerpt: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    body: {
      type: "array",
      items: {
        type: "object",
        properties: {
          style: { type: "string", enum: ["normal", "h2", "h3"] },
          text: { type: "string" },
        },
        required: ["style", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "excerpt", "tags", "body"],
  additionalProperties: false,
} as const;

const SYSTEM = `You draft blog posts for Jordan Lang's portfolio site — he is a web developer and IT specialist who writes about building real projects for real clients.

Write in his voice: direct, concrete, first person, no marketing filler. Prefer specifics over adjectives. Do not open with "In today's fast-paced world" or any variant of it.

Return the post as an ordered list of blocks. Use "h2" for section headings, "h3" only for sub-points, and "normal" for paragraphs. Each block's text is plain prose — no markdown syntax, no bullet characters. Aim for 600-900 words, an excerpt of at most 200 characters, and 3-5 lowercase tags.`;

export async function POST(request: Request) {
  // Authenticate before anything else — an unauthenticated caller should learn nothing about how
  // this server is configured.
  const userId = await authenticatedSanityUser(request);
  if (!userId) {
    return NextResponse.json({ error: "Sign in to Sanity Studio to use AI drafting." }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured." }, { status: 500 });
  }

  const { title, notes } = (await request.json()) as { title?: string; notes?: string };
  if (!title?.trim()) {
    return NextResponse.json({ error: "Give the post a title first — that's the brief." }, { status: 400 });
  }

  const anthropic = new Anthropic();

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      output_config: { format: { type: "json_schema", schema: BODY_SCHEMA } },
      messages: [
        {
          role: "user",
          content: notes?.trim()
            ? `Draft a post titled "${title}".\n\nWork from these notes:\n${notes}`
            : `Draft a post titled "${title}".`,
        },
      ],
    });

    if (message.stop_reason === "refusal") {
      return NextResponse.json({ error: "Claude declined to draft this one." }, { status: 422 });
    }

    const text = message.content.find((block) => block.type === "text");
    if (!text) {
      return NextResponse.json({ error: "Claude returned no draft." }, { status: 502 });
    }

    return NextResponse.json(JSON.parse(text.text));
  } catch (error) {
    console.error("[ai/draft] failed:", error);
    return NextResponse.json({ error: "Drafting failed. Check the server logs." }, { status: 502 });
  }
}
