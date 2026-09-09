import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityIsConfigured, studioUrl } from "../env";
import { stegaFilter } from "./stega";

export const sanityClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

/**
 * Token used to read drafts in Presentation. A dedicated Viewer token is the right thing here, but
 * fall back to the write token so preview still works on setups that only have the one secret.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

/**
 * Preview client: reads drafts and stega-encodes the response so Presentation can map rendered text
 * back to the field that produced it. See ./stega for why the encoding is filtered.
 */
export const previewClient = sanityClient.withConfig({
  token: readToken,
  perspective: "drafts",
  useCdn: false,
  stega: { enabled: true, studioUrl, filter: stegaFilter },
});

/** Published content for the live site, drafts + click-to-edit inside Presentation. */
export function getSanityClient(draft: boolean) {
  return draft ? previewClient : sanityClient;
}

export { sanityIsConfigured };
