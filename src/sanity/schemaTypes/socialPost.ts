import { defineField, defineType } from "sanity";

export const socialPostType = defineType({
  name: "socialPost",
  title: "Social Posts",
  type: "document",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Twitter", value: "twitter" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Facebook", value: "facebook" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 5,
      description: "The social media post content.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blogPost",
      title: "Blog Post",
      type: "reference",
      to: [{ type: "blogPost" }],
      description: "The blog post this social content is based on.",
      validation: (rule) => rule.required(),
    }),
    // No social-platform integration exists, so posting is manual; status just tracks it.
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      description: "Mark as Posted once you've shared it.",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Posted", value: "published" },
        ],
      },
    }),
  ],
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: {
      title: "content",
      platform: "platform",
      status: "status",
      blogPostTitle: "blogPost.title",
    },
    prepare: ({ title, platform, status, blogPostTitle }) => ({
      title: title ? title.substring(0, 60) + (title.length > 60 ? "..." : "") : "Untitled",
      subtitle: `${platform || "Unknown"} · ${status || "draft"}${blogPostTitle ? ` · ${blogPostTitle}` : ""}`,
    }),
  },
});
