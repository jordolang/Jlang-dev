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
    defineField({ name: "completedAt", title: "Completed at", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { title: "clientName", company: "company", status: "status" },
    prepare: ({ title, company, status }) => ({ title, subtitle: `${company || ""} · ${status || "draft"}` }),
  },
});
