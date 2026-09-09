import { defineArrayMember, defineField, defineType } from "sanity";

/** Rich-text body used by blog posts. Mirrors what the MDX posts could express: headings, lists, links, code, images. */
export const blockContentType = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({ name: "href", title: "URL", type: "url", validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto"] }) }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineArrayMember({
      type: "object",
      name: "table",
      title: "Table",
      fields: [
        defineField({
          name: "hasHeader",
          title: "First row is a header",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            {
              type: "object",
              name: "tableRow",
              fields: [defineField({ name: "cells", title: "Cells", type: "array", of: [{ type: "string" }] })],
              preview: {
                select: { cells: "cells" },
                prepare: ({ cells }) => ({ title: (cells ?? []).join(" | ") }),
              },
            },
          ],
        }),
      ],
      preview: {
        select: { rows: "rows" },
        prepare: ({ rows }) => ({ title: "Table", subtitle: `${rows?.length ?? 0} rows` }),
      },
    }),
    defineArrayMember({
      type: "object",
      name: "codeBlock",
      title: "Code block",
      fields: [
        defineField({ name: "language", title: "Language", type: "string", initialValue: "typescript" }),
        defineField({ name: "code", title: "Code", type: "text", rows: 12 }),
      ],
      preview: {
        select: { language: "language", code: "code" },
        prepare: ({ language, code }) => ({ title: language || "code", subtitle: (code || "").split("\n")[0] }),
      },
    }),
  ],
});
