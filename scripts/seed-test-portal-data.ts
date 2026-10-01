/**
 * Seed script for test client portal data
 *
 *   npx tsx scripts/seed-test-portal-data.ts          # create test data only if missing
 *   npx tsx scripts/seed-test-portal-data.ts --force  # overwrite existing test data
 *
 * Creates:
 * - Test client with login enabled
 * - Test project (if needed)
 * - Client-project relationship
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

async function main() {
  console.log(`Seeding test portal data in Sanity project ${projectId}/${dataset}${FORCE ? " (force)" : ""}\n`);

  // Create test client
  const testClientId = id("client", "test-client");
  await seedGroup(
    "Test clients",
    [
      {
        _id: testClientId,
        _type: "client",
        name: "Test Client",
        email: "testclient@example.com",
        company: "Test Company Inc.",
        role: "Product Manager",
        phone: "+1-555-0100",
        loginEnabled: true,
        createdAt: new Date().toISOString(),
      },
    ],
  );

  // Create test project
  const testProjectId = id("project", "test-portal-project");
  await seedGroup(
    "Test projects",
    [
      {
        _id: testProjectId,
        _type: "project",
        title: "Test Portal Project",
        slug: { _type: "slug", current: "test-portal-project" },
        subtitle: "A test project for portal development",
        description: "This is a test project created to demonstrate and test the client portal functionality. It includes milestones, deliverables, and messaging capabilities.",
        features: [
          "Project timeline tracking",
          "Milestone management",
          "File deliverables",
          "Client-Jordan messaging",
        ],
        deliverables: ["Design mockups", "Source code", "Documentation"],
        tech: ["Next.js", "TypeScript", "Sanity CMS"],
        status: "In Development",
        category: "Web App",
        timeline: "3 months",
        gradient: "from-blue-600 to-purple-600",
      },
    ],
  );

  // Create client-project relationship
  await seedGroup(
    "Client-project relationships",
    [
      {
        _id: id("clientProject", "test-client-test-project"),
        _type: "clientProject",
        client: { _type: "reference", _ref: testClientId },
        project: { _type: "reference", _ref: testProjectId },
        status: "active",
        startDate: "2026-09-01",
        endDate: "2026-12-01",
        notes: "Test client-project relationship for portal development and testing.",
      },
    ],
  );

  console.log("\n✓ Done");
  console.log(`\nTest client email: testclient@example.com`);
  console.log(`Test project slug: test-portal-project`);
  console.log(`\nYou can now:`);
  console.log(`1. View the client in Sanity Studio: http://localhost:3009/studio/structure/client;${testClientId}`);
  console.log(`2. View the project in Sanity Studio: http://localhost:3009/studio/structure/project;${testProjectId}`);
  console.log(`3. Test login at: http://localhost:3009/portal/login with email testclient@example.com`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
