import { defineField, defineType } from "sanity";

export const servicePackageType = defineType({
  name: "servicePackage",
  title: "Service packages",
  type: "document",
  description: "Powers the pricing cards on the home page, the /services order form, and the /promo page.",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: 'Used by the /services?package=<slug> deep link. Keep as "launchpad", "professional", "enterprise".',
      options: { source: "name", maxLength: 32 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "price", title: "Display price", type: "string", description: 'e.g. "$499", "Starting at $1,499+", "Custom Pricing".' }),
    defineField({
      name: "basePrice",
      title: "Base price (number)",
      type: "number",
      description: "Used to total up add-ons on the order form. Leave empty for custom-priced packages.",
    }),
    defineField({ name: "promoPrice", title: "Promo display price", type: "string", description: "Shown on /promo instead of the normal price." }),
    defineField({ name: "promoBasePrice", title: "Promo base price (number)", type: "number" }),
    defineField({ name: "gradient", title: "Card gradient", type: "string", description: "Tailwind gradient classes." }),
    defineField({ name: "highlights", title: "Highlights", type: "array", of: [{ type: "string" }], description: "Short bullets shown on the pricing card." }),
    defineField({
      name: "featureGroups",
      title: "Included features",
      type: "array",
      description: "Grouped feature list shown on the pricing card and the order form.",
      of: [
        {
          type: "object",
          name: "featureGroup",
          fields: [
            defineField({ name: "category", title: "Category heading", type: "string", description: 'Include the emoji, e.g. "🎨 Design & Build".' }),
            defineField({ name: "items", title: "Features", type: "array", of: [{ type: "string" }] }),
          ],
          preview: {
            select: { title: "category", items: "items" },
            prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} features` }),
          },
        },
      ],
    }),
    defineField({
      name: "addons",
      title: "Add-ons",
      type: "array",
      of: [
        {
          type: "object",
          name: "addon",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "price", title: "Price", type: "number" }),
            defineField({
              name: "feature",
              title: "Linked add-on feature",
              type: "reference",
              to: [{ type: "addonFeature" }],
              description: "Links the card add-on to the matching feature on the order form.",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "price" },
            prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `$${subtitle}` : "" }),
          },
        },
      ],
    }),
    defineField({ name: "addonsNote", title: "Add-ons note", type: "string" }),
    defineField({ name: "popular", title: "Mark as most popular", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "price", popular: "popular" },
    prepare: ({ title, subtitle, popular }) => ({ title: popular ? `${title} ★` : title, subtitle }),
  },
});
