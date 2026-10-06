import type { Instrumentation } from "next";

export function register() {}

/** Emails the site owner when a page or API route throws in production, so failures don't go unseen. */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;
  const { alertOwner } = await import("./lib/alerts");
  const err = error as Error & { digest?: string };
  await alertOwner(`Server error on ${request.method} ${request.path.split("?")[0]}`, {
    error: err,
    digest: err.digest,
    route: context.routePath,
    routeType: context.routeType,
  });
};
