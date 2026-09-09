import { defineField, defineType } from "sanity";

export const certificationType = defineType({
  name: "certification",
  title: "Certifications",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "provider", title: "Provider", type: "string", description: 'e.g. "IBM", "Meta", "Google".' }),
    defineField({ name: "platform", title: "Platform", type: "string", description: 'e.g. "Coursera", "HarvardX".' }),
    defineField({ name: "issued", title: "Issued", type: "string", description: 'e.g. "November 2023".' }),
    defineField({ name: "credentialId", title: "Credential ID", type: "string" }),
    defineField({ name: "skills", title: "Skills", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "providerIcon", title: "Provider icon", type: "string", description: "Iconify id." }),
    defineField({ name: "platformIcon", title: "Platform icon", type: "string", description: "Iconify id." }),
    defineField({ name: "providerIconSize", title: "Provider icon size", type: "number", initialValue: 44 }),
    defineField({ name: "platformIconSize", title: "Platform icon size", type: "number", initialValue: 44 }),
    defineField({ name: "color", title: "Card gradient", type: "string", description: "Tailwind gradient classes." }),
    defineField({ name: "certificatePreview", title: "Certificate image", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "provider", media: "certificatePreview" },
  },
});
