"use client";

import { useState } from "react";
import { useToast } from "@sanity/ui";
import { useClient, type DocumentActionComponent } from "sanity";
import { apiVersion } from "../env";

interface SocialPostResponse {
  blogPostId: string;
  platforms: {
    twitter?: {
      content: string;
      hashtags: string[];
    };
    linkedin?: {
      content: string;
      hashtags: string[];
    };
  };
}

const TWITTER_LIMIT = 280;

/**
 * Generates platform-specific social media posts from a published blog post.
 * Creates separate socialPost documents for Twitter and LinkedIn variants.
 */
export const GenerateSocialCopyAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const toast = useToast();
  const [working, setWorking] = useState(false);

  // Only the live version counts: unpublished draft edits shouldn't end up advertised on social.
  const document = props.published as Record<string, unknown> | null;
  const title = typeof document?.title === "string" ? document.title : "";
  const excerpt = typeof document?.excerpt === "string" ? document.excerpt : "";
  const published = document?.published === true;

  const isReady = published && title.trim() && excerpt.trim();

  return {
    label: working ? "Generating…" : "Generate Social Copy",
    disabled: working || !isReady,
    title: !published
      ? "Publish the post first"
      : !title.trim()
        ? "Add a title first"
        : !excerpt.trim()
          ? "Add an excerpt first"
          : "Generate Twitter and LinkedIn posts",
    tone: "positive",
    onHandle: async () => {
      setWorking(true);
      try {
        // The Studio's own client carries the signed-in user's token; the API route verifies it
        // against Sanity so the endpoint can't be used by anyone who isn't an editor here.
        const token = client.config().token;
        if (!token) throw new Error("No Sanity session token available.");

        const response = await fetch("/api/ai/social-copy", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            blogPostId: props.id,
            title,
            excerpt,
            platforms: ["twitter", "linkedin"],
          }),
        });

        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error ?? "Social copy generation failed.");

        const result = payload as SocialPostResponse;

        // Create every variant in one transaction so a partial failure can't leave orphans behind.
        const tx = client.transaction();
        let created = 0;

        if (result.platforms.twitter) {
          const { content, hashtags } = result.platforms.twitter;
          const tags = hashtags.map((tag) => `#${tag.replace(/^#/, "")}`);
          // Drop trailing hashtags until the whole tweet fits; the copy itself is never truncated.
          let formattedContent = `${content}\n\n${tags.join(" ")}`.trim();
          while (formattedContent.length > TWITTER_LIMIT && tags.length > 0) {
            tags.pop();
            formattedContent = `${content}\n\n${tags.join(" ")}`.trim();
          }
          if (formattedContent.length > TWITTER_LIMIT) {
            throw new Error(`Generated tweet is ${formattedContent.length} characters (limit ${TWITTER_LIMIT}). Try again.`);
          }

          tx.create({
            _type: "socialPost",
            platform: "twitter",
            content: formattedContent,
            blogPost: { _type: "reference", _ref: props.id },
            status: "draft",
          });
          created++;
        }

        if (result.platforms.linkedin) {
          const { content, hashtags } = result.platforms.linkedin;
          const formattedContent = `${content}\n\n${hashtags.map((tag) => `#${tag.replace(/^#/, "")}`).join(" ")}`;

          tx.create({
            _type: "socialPost",
            platform: "linkedin",
            content: formattedContent,
            blogPost: { _type: "reference", _ref: props.id },
            status: "draft",
          });
          created++;
        }

        if (created === 0) throw new Error("Claude returned no social copy.");
        await tx.commit();

        toast.push({
          status: "success",
          title: "Social copy generated",
          description: `Created ${created} social post${created > 1 ? "s" : ""}. Edit them before publishing.`,
        });
        props.onComplete();
      } catch (error) {
        toast.push({
          status: "error",
          title: "Could not generate social copy",
          description: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setWorking(false);
      }
    },
  };
};
