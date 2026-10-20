import { defineField, defineType } from "sanity";

const score = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "number",
    validation: (rule) => rule.required().integer().min(0).max(100),
  });

/** The four Lighthouse category scores from one PageSpeed Insights tab. */
export const pagespeedScoresType = defineType({
  name: "pagespeedScores",
  title: "PageSpeed scores",
  type: "object",
  options: { columns: 4 },
  fields: [
    score("performance", "Performance"),
    score("accessibility", "Accessibility"),
    score("bestPractices", "Best Practices"),
    score("seo", "SEO"),
  ],
});

export const projectType = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Unique key for this project. Two projects may share a title (web + mobile), so this must be unique.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({
      name: "image",
      title: "Screenshot",
      type: "image",
      options: { hotspot: true },
      description: "For a full-page preview, upload the tall top-to-bottom capture of the site.",
    }),
    defineField({
      name: "gallery",
      title: "Screenshot gallery",
      type: "array",
      description:
        "Extra screenshots, shown on the project page and from a \"View screenshots\" button on the card. Drop several files here at once to add them all.",
      options: { layout: "grid" },
      of: [
        {
          type: "image",
          fields: [
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({
              name: "video",
              title: "Video URL",
              type: "string",
              description: "Optional. Plays in the lightbox instead of the image, which becomes its poster.",
            }),
          ],
        },
      ],
    }),
    defineField({ name: "features", title: "Key features", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "deliverables", title: "Deliverables", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "tech", title: "Tech stack", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "github", title: "Repository URL", type: "url" }),
    defineField({ name: "live", title: "Live site URL", type: "url" }),
    defineField({
      name: "gradient",
      title: "Card gradient",
      type: "string",
      description: 'Tailwind gradient classes, e.g. "from-amber-700 to-yellow-600".',
      initialValue: "from-blue-600 to-purple-600",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Live", "In Development"], layout: "radio" },
      initialValue: "Live",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "category", title: "Category", type: "string", description: 'e.g. "Web Design", "Web App", "Mobile App".' }),
    defineField({ name: "highlight", title: "Highlight badge", type: "string", description: 'e.g. "Latest Project", "Featured".' }),
    defineField({ name: "timeline", title: "Timeline", type: "string", description: 'e.g. "2026", "3 months", "Ongoing".' }),
    defineField({ name: "clientType", title: "Client type", type: "string" }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      options: {
        list: [
          { title: "Desktop / Web", value: "desktop" },
          { title: "Mobile app", value: "mobile" },
          { title: "Desktop application", value: "desktopApp" },
        ],
        layout: "radio",
      },
      initialValue: "desktop",
    }),
    defineField({
      name: "fullPagePreview",
      title: "Scrollable full-page preview",
      type: "boolean",
      description: "Embeds the whole site in the card so visitors scroll it in place. Requires a tall full-page screenshot.",
      initialValue: false,
    }),
    defineField({
      name: "pagespeed",
      title: "PageSpeed scores",
      type: "object",
      description:
        "Websites only. Run the live URL through pagespeed.web.dev and copy the four scores from each tab. Shown as score rings on the project card; leave empty to hide them.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "mobile", title: "Mobile", type: "pagespeedScores" }),
        defineField({ name: "desktop", title: "Desktop", type: "pagespeedScores" }),
        defineField({ name: "testedAt", title: "Tested on", type: "date" }),
        defineField({
          name: "reportUrl",
          title: "Report link",
          type: "url",
          description: 'Optional. The PageSpeed "Copy Link" URL, shown as "View report" under the rings.',
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured project",
      type: "boolean",
      description: "Shown as the large hero card at the top of the Projects section. Only the first featured project is used.",
      initialValue: false,
    }),
    defineField({
      name: "hidden",
      title: "Hide from the site",
      type: "boolean",
      description: "Keeps the project in Studio but removes it from every page.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 100,
    }),
    // Case study fields
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "blockContent",
      description: "Describe the problem, need, or goal the client had. What challenges did they face?",
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "blockContent",
      description: "Explain the strategy and process you used to tackle the challenge.",
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "blockContent",
      description: "Detail the technical implementation and key features delivered.",
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "blockContent",
      description: "Share measurable outcomes, metrics, and client feedback.",
    }),
    defineField({
      name: "testimonialRef",
      title: "Client testimonial",
      type: "reference",
      to: [{ type: "testimonial" }],
      description: "Link a client testimonial to display in this case study.",
    }),
    defineField({
      name: "codeExamples",
      title: "Code examples",
      type: "array",
      description: "Code snippets shown in the case study's Code Examples section.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "code", title: "Code", type: "text", rows: 20, validation: (rule) => rule.required() }),
            defineField({ name: "language", title: "Language", type: "string", initialValue: "typescript", description: 'e.g. "typescript", "tsx", "css".' }),
          ],
        },
      ],
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image", status: "status", hidden: "hidden" },
    prepare: ({ title, subtitle, media, status, hidden }) => ({
      title,
      subtitle: `${hidden ? "Hidden · " : ""}${status ?? ""} · ${subtitle ?? ""}`,
      media,
    }),
  },
});
