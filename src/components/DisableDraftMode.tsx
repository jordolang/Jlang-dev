"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/**
 * Escape hatch for when draft mode is left on outside the Studio. Inside Presentation the Studio
 * already owns that toggle, so showing it there would just be a second, confusing exit.
 */
export function DisableDraftMode() {
  if (useIsPresentationTool() !== false) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 left-4 z-50 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-neutral-800"
    >
      Exit preview
    </a>
  );
}
