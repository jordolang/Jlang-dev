import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader that lets Sanity's CDN do the resizing. Without it, Next's optimizer
 * downloads the full-size original (often several MB) before shrinking it for a thumbnail.
 */
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

export const isSanityImage = (src: string | undefined): boolean => !!src?.startsWith("https://cdn.sanity.io/");
