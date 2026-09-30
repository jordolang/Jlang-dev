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
 * The newest post date, so the feed's timestamp only moves when content does.
 * Falls back to the current time for an empty feed.
 */
function latestPostDate(posts: BlogPost[]): string {
  if (posts.length === 0) return new Date().toISOString();
  const newest = Math.max(...posts.map((post) => new Date(post.date).getTime()));
  return new Date(newest).toISOString();
}

/**
 * Generates an RSS 2.0 feed XML string from an array of blog posts.
 *
 * @param posts - Array of blog posts to include in the feed
 * @param siteUrl - Base URL of the site (defaults to SITE_URL constant)
 * @returns RSS 2.0 XML string
 */
export function generateRssFeed(posts: BlogPost[], siteUrl: string = SITE_URL): string {
  const lastBuildDate = formatRfc822Date(latestPostDate(posts));
  const safeSiteUrl = escapeXml(siteUrl);

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
      <dc:creator>${escapeXml(post.author)}</dc:creator>
      ${post.tags.map((tag) => `<category>${escapeXml(tag.name)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${safeSiteUrl}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${safeSiteUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
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
  const updatedDate = formatIso8601Date(latestPostDate(posts));
  const safeSiteUrl = escapeXml(siteUrl);

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
    ${post.tags.map((tag) => `<category term="${escapeXml(tag.name)}"/>`).join('\n    ')}
  </entry>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <link href="${safeSiteUrl}/blog" rel="alternate"/>
  <link href="${safeSiteUrl}/blog/feed.xml" rel="self" type="application/atom+xml"/>
  <id>${safeSiteUrl}/blog</id>
  <updated>${updatedDate}</updated>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <author>
    <name>${escapeXml(SITE_AUTHOR)}</name>
  </author>
${entries}
</feed>`;
}

/**
 * Cache-Control for feed responses. In draft mode the feed can include unpublished posts,
 * so it must never land in a shared cache where a public reader could be served it.
 */
export function feedCacheControl(draft: boolean): string {
  return draft ? 'private, no-store' : 'public, s-maxage=3600, stale-while-revalidate=86400';
}
