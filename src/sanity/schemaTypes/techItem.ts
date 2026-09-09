import { defineField, defineType } from "sanity";

export const techItemType = defineType({
  name: "techItem",
  title: "Tech stack",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "icon", title: "Icon", type: "string", description: 'Iconify id, e.g. "logos:react".' }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Items are grouped by category in the filter chips.",
      options: { list: ["Frontend", "Backend", "Database", "Cloud & DevOps", "AI & Integration"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      options: { list: ["Beginner", "Intermediate", "Expert"], layout: "radio" },
      initialValue: "Intermediate",
    }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "yearsUsed", title: "Years used", type: "number" }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "category", level: "level" },
    prepare: ({ title, subtitle, level }) => ({ title, subtitle: `${subtitle ?? ""} · ${level ?? ""}` }),
  },
});
