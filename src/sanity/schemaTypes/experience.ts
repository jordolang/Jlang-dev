import { defineField, defineType } from "sanity";

export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "role", title: "Role", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "company", title: "Company", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "period", title: "Period", type: "string", description: 'e.g. "2022 — Current".' }),
    defineField({
      name: "type",
      title: "Engagement type",
      type: "string",
      options: { list: ["Contract", "Freelance", "Volunteer", "Full-time"] },
    }),
    defineField({ name: "companyIcon", title: "Company icon", type: "string", description: 'Iconify id, e.g. "solar:buildings-2-bold".' }),
    defineField({ name: "companyColor", title: "Company gradient", type: "string", description: "Tailwind gradient classes." }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "achievements", title: "Achievements", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "technologies", title: "Technologies", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "role", subtitle: "company", period: "period" },
    prepare: ({ title, subtitle, period }) => ({ title, subtitle: `${subtitle ?? ""} · ${period ?? ""}` }),
  },
});
