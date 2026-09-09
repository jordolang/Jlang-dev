export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id";

/** Where the embedded Studio lives. Presentation and stega both need it to build "edit" links. */
export const studioUrl = "/studio";

export const sanityIsConfigured = projectId !== "missing-project-id";
