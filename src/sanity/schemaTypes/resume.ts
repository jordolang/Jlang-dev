import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Content for the /resume page. Prior roles come from the Experience documents and the
 * project list from Projects, so this document only holds what is specific to the résumé.
 */
export const resumeType = defineType({
  name: "resume",
  title: "Résumé",
  type: "document",
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "current", title: "Current role" },
    { name: "credentials", title: "Credentials" },
    { name: "skills", title: "Skills & education" },
    { name: "projects", title: "Projects" },
  ],
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string", group: "profile", description: 'e.g. "Web Developer & IT Specialist".' }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 5, group: "profile" }),
    defineField({ name: "location", title: "Location", type: "string", group: "profile" }),
    defineField({ name: "email", title: "Email", type: "string", group: "profile" }),
    defineField({ name: "phone", title: "Phone", type: "string", group: "profile", description: "Optional. Leave empty to keep it off the public page." }),
    defineField({ name: "photo", title: "Photo", type: "image", group: "profile", options: { hotspot: true } }),
    defineField({
      name: "stats",
      title: "Headline numbers",
      type: "array",
      group: "profile",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),

    defineField({
      name: "currentRole",
      title: "Current role",
      type: "object",
      group: "current",
      fields: [
        defineField({ name: "role", title: "Role", type: "string" }),
        defineField({ name: "company", title: "Company", type: "string" }),
        defineField({ name: "period", title: "Period", type: "string", description: 'e.g. "2025 — Present".' }),
        defineField({ name: "website", title: "Company website", type: "url" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({ name: "highlights", title: "Highlights", type: "array", of: [{ type: "string" }] }),
      ],
    }),

    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      group: "credentials",
      description: "Certificates, licenses and diplomas issued in your name. Shown exactly as entered.",
      of: [
        defineArrayMember({
          type: "object",
          name: "credential",
          fields: [
            defineField({ name: "title", title: "Credential name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "issuer", title: "Issued by", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "issued", title: "Issue date", type: "date", options: { dateFormat: "MMMM YYYY" } }),
            defineField({ name: "expires", title: "Expiry date", type: "date", options: { dateFormat: "MMMM YYYY" } }),
            defineField({ name: "credentialId", title: "Credential ID", type: "string" }),
            defineField({ name: "url", title: "Verification link", type: "url" }),
            defineField({ name: "image", title: "Certificate image", type: "image", options: { hotspot: true } }),
            defineField({ name: "file", title: "Certificate PDF", type: "file", options: { accept: "application/pdf" } }),
          ],
          preview: {
            select: { title: "title", subtitle: "issuer", media: "image" },
          },
        }),
      ],
    }),

    defineField({
      name: "skillGroups",
      title: "Skill groups",
      type: "array",
      group: "skills",
      of: [
        defineArrayMember({
          type: "object",
          name: "skillGroup",
          fields: [
            defineField({ name: "title", title: "Group", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "skills", title: "Skills", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      group: "skills",
      of: [
        defineArrayMember({
          type: "object",
          name: "educationItem",
          fields: [
            defineField({ name: "school", title: "School", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "program", title: "Program or degree", type: "string" }),
            defineField({ name: "period", title: "Period", type: "string" }),
          ],
          preview: { select: { title: "school", subtitle: "program" } },
        }),
      ],
    }),

    defineField({
      name: "recentProjects",
      title: "Recent projects",
      type: "array",
      group: "projects",
      description: "Pick the projects to feature, in order. Leave empty to show the newest projects automatically.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: { prepare: () => ({ title: "Résumé" }) },
});
