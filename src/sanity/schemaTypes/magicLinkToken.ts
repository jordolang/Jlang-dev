import { defineField, defineType } from "sanity";

export const magicLinkTokenType = defineType({
  name: "magicLinkToken",
  title: "Magic Link Tokens",
  type: "document",
  fields: [
    defineField({ name: "token", title: "Token", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "email", title: "Email", type: "email", validation: (rule) => rule.required() }),
    defineField({ name: "expiresAt", title: "Expires at", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "createdAt", title: "Created at", type: "datetime", readOnly: true }),
    defineField({
      name: "used",
      title: "Used",
      type: "boolean",
      initialValue: false,
      readOnly: true,
    }),
    defineField({ name: "usedAt", title: "Used at", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { title: "email", expiresAt: "expiresAt", used: "used" },
    prepare: ({ title, expiresAt, used }) => ({
      title,
      subtitle: `${used ? "Used" : "Active"} · Expires: ${expiresAt ? new Date(expiresAt).toLocaleString() : "N/A"}`,
    }),
  },
});
