import { defineField, defineType } from "sanity";

export const addonFeatureType = defineType({
  name: "addonFeature",
  title: "Add-on features",
  type: "document",
  description: "The optional extras listed on the /services and /promo order forms.",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "desc", title: "Description", type: "string" }),
    defineField({ name: "price", title: "Price (USD)", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "icon", title: "Icon", type: "string", description: 'Iconify id, e.g. "solar:cart-3-bold".' }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "price" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `$${subtitle}` : "" }),
  },
});
