import { defineField, defineType } from "sanity";

export const LEAD_STATUSES = [
  { title: "New", value: "new" },
  { title: "Contacted", value: "contacted" },
  { title: "Qualified", value: "qualified" },
  { title: "Proposal sent", value: "proposal" },
  { title: "Won", value: "won" },
  { title: "Lost", value: "lost" },
  { title: "Spam", value: "spam" },
];

export const LEAD_SOURCES = [
  { title: "Contact form", value: "contact" },
  { title: "Services order form", value: "services" },
  { title: "Promo order form", value: "promo" },
];

/** Every inquiry from the site's forms, saved before any email is sent so none can be lost. */
export const leadType = defineType({
  name: "lead",
  title: "Inquiries",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: LEAD_STATUSES, layout: "radio", direction: "horizontal" },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "notes", title: "Your notes", type: "text", rows: 4 }),
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", readOnly: true }),
    defineField({ name: "company", title: "Business", type: "string", readOnly: true }),
    defineField({ name: "source", title: "Form", type: "string", options: { list: LEAD_SOURCES }, readOnly: true }),
    defineField({ name: "projectType", title: "Project type", type: "string", readOnly: true }),
    defineField({ name: "budget", title: "Budget", type: "string", readOnly: true }),
    defineField({ name: "timeline", title: "Timeline", type: "string", readOnly: true }),
    defineField({ name: "subject", title: "Subject", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", rows: 10, readOnly: true }),
    defineField({ name: "pagePath", title: "Sent from page", type: "string", readOnly: true }),
    defineField({
      name: "emailDelivered",
      title: "Notification email delivered",
      type: "boolean",
      readOnly: true,
      description: "False means the email to you failed; this record is the only copy.",
    }),
    defineField({ name: "createdAt", title: "Received", type: "datetime", readOnly: true }),
    defineField({ name: "ipHash", title: "Sender fingerprint", type: "string", readOnly: true, hidden: true }),
  ],
  orderings: [{ title: "Newest first", name: "createdAtDesc", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", company: "company", status: "status", budget: "budget", createdAt: "createdAt" },
    prepare: ({ name, company, status, budget, createdAt }) => ({
      title: company ? `${name} · ${company}` : name,
      subtitle: [
        LEAD_STATUSES.find((s) => s.value === status)?.title ?? status,
        budget,
        createdAt ? new Date(createdAt).toLocaleDateString() : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
