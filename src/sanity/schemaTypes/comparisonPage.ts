import { defineField, defineType } from "sanity";

export const comparisonPageType = defineType({
  name: "comparisonPage",
  title: "Comparison page",
  type: "document",
  description: "Content for the /why-custom competitor comparison landing page.",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      description: "Main heading for the page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL path for the page. Keep as 'why-custom'.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Introductory text shown below the title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO metadata",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 2 }),
        defineField({
          name: "keywords",
          title: "Target keywords",
          type: "array",
          of: [{ type: "string" }],
          description: "Long-tail keywords like 'custom website vs squarespace', 'hire developer vs website builder'.",
        }),
      ],
    }),
    defineField({
      name: "competitors",
      title: "Competitors",
      type: "array",
      description: "List of platforms to compare against custom development.",
      of: [
        {
          type: "object",
          name: "competitor",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "logo", title: "Logo URL or emoji", type: "string" }),
            defineField({ name: "tagline", title: "Tagline", type: "string", description: "Short description of the platform." }),
            defineField({
              name: "monthlyCost",
              title: "Monthly cost",
              type: "string",
              description: "Display value, e.g. '$23-$65', 'Free-$500'.",
            }),
            defineField({
              name: "performanceScore",
              title: "Lighthouse performance score",
              type: "number",
              description: "Real Lighthouse score (0-100).",
              validation: (rule) => rule.min(0).max(100),
            }),
            defineField({ name: "seoCapabilities", title: "SEO capabilities", type: "text", rows: 2 }),
            defineField({ name: "customization", title: "Customization level", type: "text", rows: 2 }),
            defineField({ name: "ownership", title: "Ownership & control", type: "text", rows: 2 }),
            defineField({ name: "support", title: "Support model", type: "string" }),
            defineField({
              name: "painPoints",
              title: "Pain points",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "issue", title: "Issue", type: "string" }),
                    defineField({ name: "source", title: "Source attribution", type: "string", description: "Optional citation or reference." }),
                  ],
                },
              ],
            }),
            defineField({ name: "isCustom", title: "Mark as 'Custom Development'", type: "boolean", initialValue: false }),
          ],
          preview: {
            select: { title: "name", subtitle: "tagline", isCustom: "isCustom" },
            prepare: ({ title, subtitle, isCustom }) => ({
              title: isCustom ? `${title} ⭐` : title,
              subtitle,
            }),
          },
        },
      ],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "comparisonCategories",
      title: "Comparison categories",
      type: "array",
      description: "Dimensions to compare across (e.g., Performance, Cost, SEO).",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "category", title: "Category name", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "string", description: "Iconify id." }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "category", subtitle: "description" },
          },
        },
      ],
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA heading",
      type: "string",
      description: "Call-to-action section heading.",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "ctaPrimary",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Button text", type: "string" }),
        defineField({ name: "url", title: "URL", type: "string" }),
      ],
    }),
    defineField({
      name: "ctaSecondary",
      title: "Secondary CTA",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Button text", type: "string" }),
        defineField({ name: "url", title: "URL", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `/${subtitle}` : "" }),
  },
});
