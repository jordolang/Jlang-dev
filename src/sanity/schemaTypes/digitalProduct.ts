import { defineField, defineType } from "sanity";

export const digitalProductType = defineType({
  name: "digitalProduct",
  title: "Digital products",
  type: "document",
  description: "Downloadable digital products like templates, guides, and resources.",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The URL of the product: /store/<slug>. Changing this breaks existing links.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "price", title: "Display price", type: "string", description: 'e.g. "$29", "$49", "Free".', validation: (rule) => rule.required() }),
    defineField({
      name: "basePrice",
      title: "Base price (number)",
      type: "number",
      description: "Numeric price for calculations. Use 0 for free products.",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "downloadUrl",
      title: "Download URL",
      type: "url",
      description: "Direct link to the downloadable file or resource.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "previewImage",
      title: "Preview image",
      type: "image",
      options: { hotspot: true },
      description: "Product preview or cover image.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Product category (e.g., Templates, Guides, Resources).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      description: "Key features or highlights of the product.",
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Unpublished products are hidden from the store but stay editable here.",
      initialValue: true,
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "price", media: "previewImage", published: "published" },
    prepare: ({ title, subtitle, media, published }) => ({
      title: published ? title : `${title} (draft)`,
      subtitle,
      media,
    }),
  },
});
