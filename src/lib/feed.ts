import type { BlogPost } from './blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jlang.dev';
const SITE_TITLE = 'Jordan Lang - Full-Stack Developer & Tech Lead';
const SITE_DESCRIPTION = 'Articles on software engineering, leadership, and technology by Jordan Lang';
const SITE_LANGUAGE = 'en-us';
const SITE_AUTHOR = 'Jordan Lang';

/**
 * Escapes XML special characters to prevent malformed XML output.
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats a date string as RFC 822 format for RSS 2.0 (e.g., "Mon, 01 Jan 2024 00:00:00 GMT").
 */
function formatRfc822Date(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString();
}

/**
 * Formats a date string as ISO 8601 format for Atom (e.g., "2024-01-01T00:00:00Z").
 */
function formatIso8601Date(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

/**
 * Generates an RSS 2.0 feed XML string from an array of blog posts.
 *
 * @param posts - Array of blog posts to include in the feed
 * @param siteUrl - Base URL of the site (defaults to SITE_URL constant)
 * @returns RSS 2.0 XML string
 */
export function generateRssFeed(posts: BlogPost[], siteUrl: string = SITE_URL): string {
  const latestPostDate = posts.length > 0 ? formatRfc822Date(posts[0].date) : formatRfc822Date(new Date().toISOString());

  const items = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = formatRfc822Date(post.date);

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author)}</author>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${latestPostDate}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

/**
 * Generates an Atom feed XML string from an array of blog posts.
 *
 * @param posts - Array of blog posts to include in the feed
 * @param siteUrl - Base URL of the site (defaults to SITE_URL constant)
 * @returns Atom XML string
 */
export function generateAtomFeed(posts: BlogPost[], siteUrl: string = SITE_URL): string {
  const updatedDate = posts.length > 0 ? formatIso8601Date(posts[0].date) : formatIso8601Date(new Date().toISOString());

  const entries = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const published = formatIso8601Date(post.date);
      const updated = formatIso8601Date(post.date);

      return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(postUrl)}" rel="alternate"/>
    <id>${escapeXml(postUrl)}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <summary>${escapeXml(post.excerpt)}</summary>
    <author>
      <name>${escapeXml(post.author)}</name>
    </author>
    ${post.tags.map((tag) => `<category term="${escapeXml(tag)}"/>`).join('\n    ')}
  </entry>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <link href="${siteUrl}/blog" rel="alternate"/>
  <link href="${siteUrl}/blog/feed.xml" rel="self" type="application/atom+xml"/>
  <id>${siteUrl}/blog</id>
  <updated>${updatedDate}</updated>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <author>
    <name>${escapeXml(SITE_AUTHOR)}</name>
  </author>
${entries}
</feed>`;
}
