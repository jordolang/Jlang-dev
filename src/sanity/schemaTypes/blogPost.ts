import { defineField, defineType } from "sanity";

export const blogPostType = defineType({
  name: "blogPost",
  title: "Blog posts",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The URL of the post: /blog/<slug>. Changing this breaks existing links.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", title: "Publish date", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "image", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "author", title: "Author", type: "string", initialValue: "Jordan Lang" }),
    defineField({
      name: "readTime",
      title: "Read time",
      type: "string",
      description: 'Leave empty to calculate automatically from the body, or override, e.g. "8 min read".',
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Unpublished posts are hidden from the site but stay editable here.",
      initialValue: true,
    }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "date", media: "image", published: "published" },
    prepare: ({ title, subtitle, media, published }) => ({
      title: published ? title : `${title} (draft)`,
      subtitle,
      media,
    }),
  },
});
