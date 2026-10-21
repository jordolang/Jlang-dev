"use client";

import type { ComponentType } from "react";
import VisualEditingComponent, { type VisualEditingProps } from "next-sanity/visual-editing/client-component";
import { DisableDraftMode } from "@/components/DisableDraftMode";

// Typed as returning ReactNode, which this project's React 18 types don't accept as a JSX component.
const VisualEditing = VisualEditingComponent as ComponentType<VisualEditingProps>;

/** Studio preview overlay and the exit-preview link. Loaded by DraftModeTools. */
export default function DraftModeOverlay() {
  return (
    <>
      <VisualEditing trailingSlash={false} />
      <DisableDraftMode />
    </>
  );
}
