# Business guides in the native blog

These seven documents use the existing Sanity `blogPost` schema: Portable Text paragraphs, headings, lists, image assets, link annotations, and table blocks. The website renders them through its existing `/blog` and `/blog/[slug]` routes, including the table of contents, reading progress, metadata, related posts, and navigation.

The matching MDX files in `content/blog` remain available for the site's existing filesystem fallback. Images are also retained under `public/images/blog/business-guides`. No preview HTML or custom preview styles are needed by the application.

## Import

```sh
npm run blog:import
npm run blog:import -- --write-drafts
npm run blog:import -- --publish
npm run blog:import -- --publish --replace
```

The first command validates without writing. Draft import creates only missing drafts. Publishing uses the current Studio draft when one exists, retains subsequent editorial edits, and publishes all changes in one transaction. Existing live articles are preserved by default. Add `--replace` to update the matching published records without changing their IDs or URLs; revision checks prevent overwriting a concurrent edit. Credentials use the same `.env.local` settings as the existing seed script.

The bundled image and taxonomy references belong to this site's current Sanity project and dataset. They are not a migration bundle for an unrelated dataset.

## Article routes

- `/blog/ohio-contractor-website-checklist`
- `/blog/new-website-or-better-content`
- `/blog/facebook-page-and-business-website`
- `/blog/when-your-business-outgrows-spreadsheets`
- `/blog/website-maintenance-what-you-pay-for`
- `/blog/prepare-for-a-website-project`
- `/blog/local-business-website-rebuild-neff-paving`
