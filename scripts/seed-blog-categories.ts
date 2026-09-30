/**
 * Seed script for blog categories
 *
 *   npx tsx scripts/seed-blog-categories.ts          # create missing categories only
 *   npx tsx scripts/seed-blog-categories.ts --force  # overwrite categories that already exist
 *
 * Safe to re-run: categories use deterministic ids, and without --force existing ones are
 * left alone.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN (check .env.local).");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-01-01", useCdn: false });
const FORCE = process.argv.includes("--force");

/** Stable, readable document ids so re-runs update rather than duplicate. */
const id = (prefix: string, key: string) =>
  `${prefix}.${key.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Create the document, or replace it when --force. */
async function upsert(doc: Record<string, unknown> & { _id: string; _type: string }) {
  if (FORCE) {
    await client.createOrReplace(doc as never);
    return "replaced";
  }
  try {
    await client.create(doc as never);
    return "created";
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 409) return "exists";
    throw error;
  }
}

async function seedGroup(label: string, docs: (Record<string, unknown> & { _id: string; _type: string })[]) {
  const counts: Record<string, number> = {};
  for (const doc of docs) {
    const result = await upsert(doc);
    counts[result] = (counts[result] ?? 0) + 1;
  }
  const summary = Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ");
  console.log(`${label}: ${summary}`);
}

const categories = [
  { name: "Web Development", description: "Articles about web development, frameworks, and best practices" },
  { name: "Business", description: "Business insights, strategies, and entrepreneurship" },
  { name: "Tutorials", description: "Step-by-step guides and how-to articles" },
  { name: "Industry Insights", description: "Analysis and trends in the tech industry" },
];

async function main() {
  console.log(`Seeding blog categories in Sanity project ${projectId}/${dataset}${FORCE ? " (force)" : ""}\n`);

  await seedGroup(
    "Blog categories",
    categories.map((category, index) => ({
      _id: id("category", category.name),
      _type: "category",
      name: category.name,
      slug: { _type: "slug", current: slugify(category.name) },
      description: category.description,
      order: index,
    })),
  );

  console.log("\n✓ Done");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
