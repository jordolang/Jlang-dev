"use client";

import { defineConfig, type AssetSource } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { assist } from "@sanity/assist";
import { media, mediaAssetSource as untypedMediaAssetSource } from "sanity-plugin-media";
import { schemaTypes, SINGLETON_TYPES } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { locations } from "./src/sanity/presentation/locations";
import { SendReviewRequestAction } from "./src/sanity/actions/SendReviewRequestAction";
import { DraftWithClaudeAction } from "./src/sanity/actions/DraftWithClaudeAction";
import { dataset, projectId } from "./src/sanity/env";

const singletons: readonly string[] = SINGLETON_TYPES;

// The plugin's icon is a forwardRef component, which doesn't structurally match Sanity's
// ComponentType<EmptyProps> under React 18 types. Harmless at runtime; assert past it.
const mediaAssetSource = untypedMediaAssetSource as unknown as AssetSource;

export default defineConfig({
  name: "jlang-development",
  title: "JLang Development Content",
  projectId,
  dataset,
  basePath: "/studio",

  plugins: [
    structureTool({ structure }),
    // Side-by-side editing against the real site. The Studio is served from the same origin as the
    // site, so the preview URL is just a path.
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
      resolve: { locations },
    }),
    // Searchable asset browser + drag-and-drop uploads.
    media(),
    // "Generate with AI" on fields and documents, powered by Sanity's own AI.
    assist(),
    visionTool(),
  ],

  // Sanity's org-wide Media Library. Must also be enabled for the project in sanity.io/manage.
  mediaLibrary: { enabled: true },

  form: {
    // Offer the media browser everywhere an image or file is uploaded, alongside the default sources.
    image: {
      assetSources: (previous) => [...previous, mediaAssetSource],
    },
    file: {
      assetSources: (previous) => [...previous, mediaAssetSource],
    },
  },

  schema: {
    types: schemaTypes,
    // Singletons are reached through the structure above, so keep them out of the "create new" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },

  document: {
    actions: (previous, context) => {
      if (singletons.includes(context.schemaType)) {
        return previous.filter(({ action }) => action !== "duplicate" && action !== "delete" && action !== "unpublish");
      }
      // Studio shows only the first action as a button; the rest hide behind the chevron.
      // Put these first so they're visible — Publish stays available in the dropdown.
      if (context.schemaType === "reviewRequest") return [SendReviewRequestAction, ...previous];
      if (context.schemaType === "blogPost") return [DraftWithClaudeAction, ...previous];
      return previous;
    },
  },
});
