import { defineField, defineType } from "sanity";

export const aboutContentType = defineType({
  name: "aboutContent",
  title: "About / Overview",
  type: "document",
  description: "The 'About Me' block on the home page, plus the headline stats reused across the site. There is only one of these.",
  fields: [
    defineField({ name: "greeting", title: "Greeting", type: "string", description: 'e.g. "Hello, I\'m Jordan Lang".' }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "age", title: "Age", type: "string" }),
    defineField({ name: "yearsExperience", title: "Years of experience", type: "string", description: 'e.g. "12+".' }),
    defineField({
      name: "bio",
      title: "Bio paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "Each entry is a paragraph.",
    }),
    defineField({
      name: "coreCompetencies",
      title: "Core competencies",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "coreCompetenciesLabel",
      title: "Core competencies heading",
      type: "string",
      initialValue: "Core Competencies (10+ Years Experience)",
    }),
    defineField({
      name: "emergingSectors",
      title: "Emerging sectors of focus",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "emergingSectorsLabel",
      title: "Emerging sectors heading",
      type: "string",
    }),
    defineField({
      name: "achievements",
      title: "Achievements",
      type: "array",
      of: [
        {
          type: "object",
          name: "achievement",
          fields: [
            defineField({ name: "text", title: "Text", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "string", description: "Iconify id." }),
            defineField({ name: "color", title: "Colour", type: "string", description: "Tailwind classes." }),
          ],
          preview: { select: { title: "text", subtitle: "icon" } },
        },
      ],
    }),
    defineField({
      name: "availability",
      title: "Available for hire",
      type: "array",
      of: [{ type: "string" }],
      description: 'e.g. "Open to New Opportunities", "Remote Service Nationwide".',
    }),
    defineField({
      name: "currentRole",
      title: "Professional role card",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
        defineField({ name: "period", title: "Period", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "badge", title: "Badge", type: "string" }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Headline stats",
      type: "object",
      description: "Shown under the Experience section.",
      fields: [
        defineField({ name: "yearsExperience", title: "Years experience", type: "string" }),
        defineField({ name: "websitesCreated", title: "Websites created", type: "string" }),
        defineField({ name: "clientSatisfaction", title: "Client satisfaction", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "About / Overview" }) },
});
