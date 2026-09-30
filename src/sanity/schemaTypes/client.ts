import { defineField, defineType } from "sanity";

export const clientType = defineType({
  name: "client",
  title: "Clients",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Client name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "email", title: "Email", type: "email", validation: (rule) => rule.required() }),
    defineField({ name: "phone", title: "Phone number", type: "string" }),
    defineField({ name: "company", title: "Company", type: "string" }),
    defineField({ name: "role", title: "Role / title", type: "string" }),
    defineField({ name: "passwordHash", title: "Password hash", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "loginEnabled",
      title: "Login enabled",
      type: "boolean",
      initialValue: false
    }),
    defineField({ name: "authToken", title: "Authentication token", type: "string", readOnly: true, hidden: true }),
    defineField({ name: "createdAt", title: "Created at", type: "datetime", readOnly: true }),
    defineField({ name: "lastLogin", title: "Last login", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { title: "name", email: "email", company: "company" },
    prepare: ({ title, email, company }) => ({ title, subtitle: `${email || ""} ${company ? `· ${company}` : ""}` }),
  },
});
