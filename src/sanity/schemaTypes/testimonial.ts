import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({ name: "content", title: "Review", type: "text", rows: 5, validation: (rule) => rule.required().min(10) }),
    defineField({ name: "author", title: "Client name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "company", title: "Company", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "rating", title: "Rating", type: "number", validation: (rule) => rule.required().integer().min(1).max(5) }),
    defineField({ name: "approved", title: "Show on website", type: "boolean", initialValue: true }),
    defineField({ name: "featured", title: "Featured review", type: "boolean", initialValue: false }),
    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime", readOnly: true }),
    defineField({ name: "requestId", title: "Review request ID", type: "string", readOnly: true, hidden: true }),
  ],
  preview: {
    select: { title: "author", subtitle: "company", rating: "rating" },
    prepare: ({ title, subtitle, rating }) => ({ title, subtitle: `${"★".repeat(rating || 0)} · ${subtitle || ""}` }),
  },
});
