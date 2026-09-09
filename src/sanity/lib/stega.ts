import type { FilterDefault } from "@sanity/client/stega";

/**
 * Stega encoding hides the "edit this field" pointer inside the string itself, as zero-width
 * characters. That is invisible in prose but *fatal* anywhere a string is used as a machine value:
 * a gradient becomes an unknown Tailwind class, an icon name misses its Iconify lookup, an image
 * `_id` builds a broken CDN URL.
 *
 * So we only encode strings that are rendered as human-readable copy. Anything below is a value the
 * code parses, matches, or concatenates — it must stay byte-exact.
 */
const MACHINE_VALUE_FIELDS = new Set([
  // Icon + colour tokens (Iconify names, Tailwind class fragments, hex codes)
  "icon",
  "tagIcon",
  "companyIcon",
  "providerIcon",
  "platformIcon",
  "color",
  "companyColor",
  "gradient",
  // Links and identifiers
  "href",
  "url",
  "live",
  "github",
  "website",
  "email",
  "publicEmail",
  "slug",
  "current",
  "sectionId",
  "credentialId",
  "token",
  // Values matched against unions/enums or used as record keys
  "category",
  "level",
  "status",
  "group",
  // Commands copied verbatim to a terminal
  "resumeCommand",
  "resumeCopyCommand",
  // Chips whose text doubles as an icon/lookup key
  "tech",
  "technologies",
  "skills",
  // Sliced character-by-character by the typewriter, which would reveal the hidden characters
  "typewriterRoles",
  // Code blocks are rendered verbatim by the syntax highlighter
  "code",
  "language",
]);

export const stegaFilter: FilterDefault = (props) => {
  // `sourcePath` includes array indices, so check every string segment, not just the last one.
  // This also covers nested shapes like `socials[0].icon` and `image.asset._id`.
  for (const segment of props.sourcePath) {
    if (typeof segment === "string" && (MACHINE_VALUE_FIELDS.has(segment) || segment === "asset" || segment.startsWith("_"))) {
      return false;
    }
  }
  return props.filterDefault(props);
};
