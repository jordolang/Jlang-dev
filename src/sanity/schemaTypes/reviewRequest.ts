import { defineField, defineType } from "sanity";

export const reviewRequestType = defineType({
  name: "reviewRequest",
  title: "Review Requests",
  type: "document",
  fields: [
    defineField({ name: "clientName", title: "Client name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "company", title: "Company", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Role / title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "email", title: "Client email", type: "email", validation: (rule) => rule.required() }),
    defineField({ name: "token", title: "Private share token", type: "string", readOnly: true }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      readOnly: true,
      initialValue: "draft",
      options: { list: ["draft", "queued", "sent", "completed", "failed"] },
    }),
    defineField({ name: "sentAt", title: "Sent at", type: "datetime", readOnly: true }),
    defineField({ name: "viewedAt", title: "Viewed at", type: "datetime", readOnly: true }),
    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime", readOnly: true }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime", readOnly: true }),
    defineField({ name: "completedAt", title: "Completed at", type: "datetime", readOnly: true }),
    defineField({
      name: "interactions",
      title: "Interactions",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "type", title: "Type", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "timestamp", title: "Timestamp", type: "datetime", validation: (rule) => rule.required() }),
            defineField({ name: "metadata", title: "Metadata", type: "object", fields: [] }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "clientName", company: "company", status: "status" },
    prepare: ({ title, company, status }) => ({ title, subtitle: `${company || ""} · ${status || "draft"}` }),
  },
});
