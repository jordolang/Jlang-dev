/**
 * Import the seven business guides using the blog's existing Sanity schema.
 * npm run blog:import                    Validate bundled documents (no writes).
 * npm run blog:import -- --write-drafts   Create missing drafts, preserving edits.
 * npm run blog:import -- --publish        Publish drafts; preserve existing live posts.
 * Add --replace to update existing posts from the complete native drafts.
 */
import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "next-sanity";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

async function main() {
  const args = process.argv.slice(2);
  const publish = args.includes("--publish");
  const writeDrafts = args.includes("--write-drafts");
  const replace = args.includes("--replace");
  if (args.some((arg) => !["--publish", "--write-drafts", "--replace"].includes(arg)) || (publish && writeDrafts) || (replace && !publish)) {
    throw new Error("Use --publish [--replace], --write-drafts, or no arguments for validation only.");
  }

  const directory = path.join(process.cwd(), "content/blog/native");
  const documents = fs.readdirSync(directory).filter((name) => name.endsWith(".json")).map((name) => {
    const document = JSON.parse(fs.readFileSync(path.join(directory, name), "utf8"));
    const slug = document.slug?.current;
    if (document._type !== "blogPost" || !slug || document._id !== `drafts.blogPost.${slug}`) {
      throw new Error(`Unexpected blog document identity: ${name}`);
    }
    if (!document.title || !document.excerpt || !document.image?.asset?._ref || !document.body?.length) {
      throw new Error(`Incomplete article: ${name}`);
    }
    const images = document.body.filter((block: { _type: string }) => block._type === "image");
    if (images.length < 2 || images.some((image: { alt?: string; asset?: { _ref?: string } }) => !image.alt || !image.asset?._ref)) {
      throw new Error(`Missing inline images or alternative text: ${name}`);
    }
    return document;
  });

  console.log(`Validated ${documents.length} native Sanity articles.`);
  if (!publish && !writeDrafts) {
    console.log("No writes. Use --write-drafts or --publish to import.");
  } else {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!projectId || !token) throw new Error("Missing Sanity project ID or write token.");
    const client = createClient({ projectId, token, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: "2026-01-01", useCdn: false, perspective: "raw" });
    const transaction = client.transaction();
    for (const source of documents) {
      if (!publish) {
        transaction.createIfNotExists({ ...source, published: false });
        continue;
      }
      const id = source._id.replace(/^drafts\./, "");
      const existing = await client.fetch<{ _id: string; _rev: string }[]>(
        '*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))]{_id,_rev}',
        { slug: source.slug.current },
      );
      if (existing.length > 1) throw new Error(`Duplicate live slugs: ${source.slug.current}`);
      if (existing.length && !replace) {
        console.log(`Already published; preserved: ${source.slug.current}`);
        continue;
      }
      // Publish the current Studio draft so edits made after export are retained.
      const draft = await client.getDocument(source._id);
      const document = { ...(draft || source), _id: existing[0]?._id || id, published: true };
      for (const field of ["_rev", "_createdAt", "_updatedAt"]) delete (document as Record<string, unknown>)[field];
      if (existing.length) {
        const { _id, ...fields } = document;
        transaction.patch(_id, (patch) => patch.ifRevisionId(existing[0]._rev).set(fields));
      } else {
        transaction.create(document);
      }
      transaction.delete(source._id);
      console.log(`Publish: ${source.slug.current}`);
    }
    await transaction.commit();
    console.log(publish ? "Published native blog posts." : "Created missing drafts.");
  }

}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
