import { defineField, defineType } from "sanity";

export const clientProjectType = defineType({
  name: "clientProject",
  title: "Client Projects",
  type: "document",
  fields: [
    defineField({
      name: "client",
      title: "Client",
      type: "reference", to: [{ type: "client" }],
      description: "The client associated with this project.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "project" }],
      description: "The project associated with this client.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
          { title: "On Hold", value: "on-hold" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      description: "When the project work began.",
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      description: "When the project was completed or is expected to complete.",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
      description: "Internal notes about this client-project relationship (never shown in the client portal).",
    }),
  ],
  preview: {
    select: {
      clientName: "client.name",
      projectTitle: "project.title",
      status: "status",
    },
    prepare: ({ clientName, projectTitle, status }) => ({
      title: `${clientName || "Unknown Client"} - ${projectTitle || "Unknown Project"}`,
      subtitle: status || "No status",
    }),
  },
});
