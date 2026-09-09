import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient, readToken } from "@/sanity/lib/client";

/**
 * Presentation calls this to turn on draft mode. next-sanity validates the signed URL it was given
 * against Sanity before setting the cookie, so this cannot be used to flip the site into preview
 * without a valid Studio session.
 */
export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token: readToken }),
});
