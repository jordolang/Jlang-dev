"use client";

import dynamic from "next/dynamic";

// The overlay pulls in the Sanity client and Presentation messaging (~60 kB gzipped). Loading it
// through dynamic() keeps that code out of the bundle every visitor downloads: it is only fetched
// when this component renders, which the root layout does in draft mode only.
const DraftModeOverlay = dynamic(() => import("@/components/DraftModeOverlay"), { ssr: false });

export default function DraftModeTools() {
  return <DraftModeOverlay />;
}
