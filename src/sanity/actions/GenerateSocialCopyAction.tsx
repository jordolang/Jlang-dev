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

/**
 * Generates platform-specific social media posts from a published blog post.
 * Creates separate socialPost documents for Twitter and LinkedIn variants.
 */
export const GenerateSocialCopyAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const toast = useToast();
  const [working, setWorking] = useState(false);

  const document = (props.draft ?? props.published) as Record<string, unknown> | null;
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

        // Create socialPost documents for each platform
        const createdPosts: string[] = [];

        if (result.platforms.twitter) {
          const { content, hashtags } = result.platforms.twitter;
          const formattedContent = `${content}\n\n${hashtags.map((tag) => `#${tag}`).join(" ")}`;

          const twitterPost = await client.create({
            _type: "socialPost",
            platform: "twitter",
            content: formattedContent,
            blogPost: { _type: "reference", _ref: props.id },
            status: "draft",
          });
          createdPosts.push(twitterPost._id);
        }

        if (result.platforms.linkedin) {
          const { content, hashtags } = result.platforms.linkedin;
          const formattedContent = `${content}\n\n${hashtags.map((tag) => `#${tag}`).join(" ")}`;

          const linkedinPost = await client.create({
            _type: "socialPost",
            platform: "linkedin",
            content: formattedContent,
            blogPost: { _type: "reference", _ref: props.id },
            status: "draft",
          });
          createdPosts.push(linkedinPost._id);
        }

        toast.push({
          status: "success",
          title: "Social copy generated",
          description: `Created ${createdPosts.length} social post${createdPosts.length > 1 ? "s" : ""}. Edit them before publishing.`,
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
