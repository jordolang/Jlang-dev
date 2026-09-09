import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description: "Global identity, hero, contact details, navigation, footer and SEO. There is only one of these.",
  groups: [
    { name: "identity", title: "Identity" },
    { name: "hero", title: "Hero" },
    { name: "contact", title: "Contact" },
    { name: "nav", title: "Navigation & footer" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // Identity
    defineField({ name: "name", title: "Name", type: "string", group: "identity", initialValue: "Jordan Lang" }),
    defineField({ name: "logoLight", title: "Logo (light mode)", type: "image", group: "identity" }),
    defineField({ name: "logoDark", title: "Logo (dark mode)", type: "image", group: "identity" }),

    // Hero
    defineField({ name: "tagline", title: "Tagline", type: "text", rows: 2, group: "hero" }),
    defineField({
      name: "typewriterRoles",
      title: "Rotating roles",
      type: "array",
      of: [{ type: "string" }],
      group: "hero",
      description: "Cycled by the typewriter effect under your name.",
    }),
    defineField({ name: "availabilityBanner", title: "Availability banner", type: "string", group: "hero" }),
    defineField({
      name: "skillsPreview",
      title: "Hero skill chips",
      type: "array",
      group: "hero",
      of: [
        {
          type: "object",
          name: "skillChip",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "string", description: "Iconify id." }),
          ],
          preview: { select: { title: "label", subtitle: "icon" } },
        },
      ],
    }),
    defineField({ name: "resumeCommand", title: "CLI resume command", type: "string", group: "hero", description: "Shown in the hero code snippet." }),
    defineField({ name: "resumeCopyCommand", title: "CLI resume command (copied)", type: "string", group: "hero", description: "The full command copied to the clipboard." }),

    // Contact
    defineField({ name: "email", title: "Primary email", type: "string", group: "contact", description: "Where the contact form is delivered." }),
    defineField({ name: "publicEmail", title: "Public email", type: "string", group: "contact", description: "Shown as the direct 'email me' link." }),
    defineField({ name: "location", title: "Location", type: "string", group: "contact" }),
    defineField({ name: "website", title: "Website", type: "string", group: "contact" }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          name: "social",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "URL", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "string", description: "Iconify id." }),
            defineField({ name: "color", title: "Hover colour", type: "string", description: "Tailwind classes." }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),

    // Navigation & footer
    defineField({
      name: "navItems",
      title: "Navigation items",
      type: "array",
      group: "nav",
      of: [
        {
          type: "object",
          name: "navItem",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              description: 'A page path like "/services", or an on-page anchor like "/#projects".',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({ name: "footerText", title: "Footer text", type: "string", group: "nav" }),

    // SEO
    defineField({ name: "seoTitle", title: "Title", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", title: "Description", type: "text", rows: 3, group: "seo" }),
    defineField({ name: "seoKeywords", title: "Keywords", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "seo" }),
    defineField({ name: "ogTitle", title: "Social share title", type: "string", group: "seo" }),
    defineField({ name: "ogDescription", title: "Social share description", type: "text", rows: 3, group: "seo" }),
    defineField({ name: "ogImage", title: "Social share image", type: "image", group: "seo", description: "Recommended 1200×630." }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
