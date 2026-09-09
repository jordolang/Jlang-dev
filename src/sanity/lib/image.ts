import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export interface SanityImageRef {
  asset?: { _ref?: string; url?: string; metadata?: { dimensions?: { width: number; height: number } } };
}

/** Resolve a Sanity image to a URL, or return null so callers can fall back to a bundled asset. */
export function urlForImage(source: Image | SanityImageRef | null | undefined): string | null {
  if (!source || !("asset" in source) || !source.asset) return null;
  try {
    return builder.image(source as Image).auto("format").fit("max").url();
  } catch {
    return null;
  }
}

/** Intrinsic dimensions of an uploaded image, when the metadata was projected in the query. */
export function dimensionsForImage(source: SanityImageRef | null | undefined): { width: number; height: number } | null {
  const dims = source?.asset?.metadata?.dimensions;
  return dims?.width && dims?.height ? { width: dims.width, height: dims.height } : null;
}
