import { defineField, defineType } from "sanity";

export const portalDeliverableType = defineType({
  name: "portalDeliverable",
  title: "Portal Deliverables",
  type: "document",
  fields: [
    defineField({
      name: "clientProject",
      title: "Client Project",
      type: "reference",
      to: [{ type: "clientProject" }],
      description: "The client project this deliverable belongs to.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Name of the deliverable (e.g., 'Final Website Files', 'Logo Package').",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Brief description of what this deliverable contains.",
    }),
    defineField({ name: "file", title: "File", type: "file", description: "The deliverable file to share with the client.", validation: (rule) => rule.required() }),
    defineField({
      name: "fileType",
      title: "File type",
      type: "string",
      description: "Type of deliverable (e.g., 'Source Files', 'Assets', 'Documentation').",
      options: {
        list: [
          { title: "Source Files", value: "source" },
          { title: "Assets", value: "assets" },
          { title: "Documentation", value: "documentation" },
          { title: "Build/Compiled", value: "build" },
          { title: "Other", value: "other" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: "Version number or identifier (e.g., 'v1.0', 'Final').",
    }),
    defineField({
      name: "isVisible",
      title: "Visible to client",
      type: "boolean",
      description: "Whether this deliverable is visible in the client portal.",
      initialValue: true,
    }),
    defineField({
      name: "uploadedAt",
      title: "Uploaded at",
      type: "datetime",
      description: "When this deliverable was uploaded.",
    }),
    defineField({
      name: "downloadCount",
      title: "Download count",
      type: "number",
      description: "Number of times this file has been downloaded.",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "lastDownloadedAt",
      title: "Last downloaded at",
      type: "datetime",
      description: "When this file was last downloaded by the client.",
      readOnly: true,
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 2,
      description: "Internal notes about this deliverable (not visible to client).",
    }),
  ],
  preview: {
    select: {
      title: "title",
      fileType: "fileType",
      fileName: "file.asset.originalFilename",
      isVisible: "isVisible",
    },
    prepare: ({ title, fileType, fileName, isVisible }) => {
      const visibility = isVisible ? "👁️ Visible" : "🔒 Hidden";
      const type = fileType ? `[${fileType}]` : "";
      return {
        title: title || "Untitled Deliverable",
        subtitle: `${visibility} ${type} ${fileName || ""}`.trim(),
      };
    },
  },
});
