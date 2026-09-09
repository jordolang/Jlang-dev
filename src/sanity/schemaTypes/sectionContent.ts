import { defineField, defineType } from "sanity";

export const sectionContentType = defineType({
  name: "sectionContent",
  title: "Section headings",
  type: "document",
  description: "The eyebrow, heading and description at the top of each home-page section.",
  fields: [
    defineField({
      name: "sectionId",
      title: "Section",
      type: "string",
      description: "Which section on the site this heading belongs to.",
      options: {
        list: [
          { title: "About / Overview", value: "overview" },
          { title: "Blog", value: "blog" },
          { title: "Tech stack", value: "stack" },
          { title: "Experience", value: "experience" },
          { title: "Projects", value: "projects" },
          { title: "Services", value: "services" },
          { title: "Testimonials", value: "testimonials" },
          { title: "Contact", value: "contact" },
          { title: "Certifications", value: "certifications" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "tagText", title: "Eyebrow text", type: "string" }),
    defineField({ name: "tagIcon", title: "Eyebrow icon", type: "string", description: "Iconify id." }),
    defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "ctaText", title: "Call to action", type: "string", description: "Optional CTA line shown below the section." }),
  ],
  preview: {
    select: { title: "heading", subtitle: "sectionId" },
  },
});
