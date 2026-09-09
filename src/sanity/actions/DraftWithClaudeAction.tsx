"use client";

import { useState } from "react";
import { useToast } from "@sanity/ui";
import { useClient, type DocumentActionComponent } from "sanity";
import { apiVersion } from "../env";

interface DraftBlock {
  style: "normal" | "h2" | "h3";
  text: string;
}

interface Draft {
  title: string;
  excerpt: string;
  tags: string[];
  body: DraftBlock[];
}

/** Claude returns flat blocks; Portable Text wants keyed blocks with keyed spans. */
function toPortableText(blocks: DraftBlock[]) {
  return blocks.map((block) => ({
    _type: "block",
    _key: crypto.randomUUID(),
    style: block.style,
    markDefs: [],
    children: [{ _type: "span", _key: crypto.randomUUID(), text: block.text, marks: [] }],
  }));
}

/**
 * Drafts a whole post from its title (plus whatever is already in the excerpt, treated as notes).
 * Field-level generation is handled by AI Assist — this is the "write me the first version" button.
 */
export const DraftWithClaudeAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const toast = useToast();
  const [working, setWorking] = useState(false);

  const document = (props.draft ?? props.published) as Record<string, unknown> | null;
  const title = typeof document?.title === "string" ? document.title : "";
  const notes = typeof document?.excerpt === "string" ? document.excerpt : "";

  return {
    label: working ? "Drafting…" : "Draft with Claude",
    disabled: working || !title.trim(),
    title: title.trim() ? "Write a first draft from the title" : "Add a title first",
    onHandle: async () => {
      setWorking(true);
      try {
        // The Studio's own client carries the signed-in user's token; the API route verifies it
        // against Sanity so the endpoint can't be used by anyone who isn't an editor here.
        const token = client.config().token;
        if (!token) throw new Error("No Sanity session token available.");

        const response = await fetch("/api/ai/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title, notes }),
        });

        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error ?? "Drafting failed.");

        const draft = payload as Draft;
        await client
          .patch(props.id)
          .set({
            title: draft.title,
            excerpt: draft.excerpt,
            tags: draft.tags,
            body: toPortableText(draft.body),
          })
          .commit();

        toast.push({ status: "success", title: "Draft written", description: "Review it before publishing." });
        props.onComplete();
      } catch (error) {
        toast.push({
          status: "error",
          title: "Could not draft this post",
          description: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setWorking(false);
      }
    },
  };
};
