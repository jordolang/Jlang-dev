import { defineField, defineType } from "sanity";

export const portalMessageType = defineType({
  name: "portalMessage",
  title: "Portal Messages",
  type: "document",
  fields: [
    defineField({
      name: "clientProject",
      title: "Client Project",
      type: "reference",
      to: [{ type: "clientProject" }],
      description: "The client project this message belongs to.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sender",
      title: "Sender",
      type: "string",
      description: "Who sent this message: 'client' or 'jordan'",
      options: {
        list: [
          { title: "Client", value: "client" },
          { title: "Jordan", value: "jordan" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "recipient",
      title: "Recipient",
      type: "string",
      description: "Who receives this message: 'client' or 'jordan'",
      options: {
        list: [
          { title: "Client", value: "client" },
          { title: "Jordan", value: "jordan" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 5,
      description: "The message content.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isRead",
      title: "Is read",
      type: "boolean",
      description: "Whether the recipient has read this message.",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "readAt",
      title: "Read at",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      sender: "sender",
      message: "message",
      createdAt: "createdAt",
    },
    prepare: ({ sender, message, createdAt }) => {
      const preview = message?.substring(0, 50) + (message?.length > 50 ? "..." : "");
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : "";
      return {
        title: `${sender === "client" ? "Client" : "Jordan"}: ${preview}`,
        subtitle: date,
      };
    },
  },
});
