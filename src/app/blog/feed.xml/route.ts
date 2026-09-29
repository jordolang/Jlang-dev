import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog';
import { logger } from '@/lib/logger';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jlang.dev';
const SITE_TITLE = 'Jordan Lang';
const SITE_DESCRIPTION = 'Full-stack developer, entrepreneur, and technical writer sharing insights on web development, startups, and technology.';
const SITE_AUTHOR = 'Jordan Lang';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatAtomDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

export async function GET() {
  try {
    const posts = await getAllBlogPosts();

    const atomEntries = posts
      .map(
        (post) => `
    <entry>
      <title>${escapeXml(post.title)}</title>
      <link href="${SITE_URL}/blog/${post.slug}" rel="alternate" type="text/html" />
      <id>${SITE_URL}/blog/${post.slug}</id>
      <updated>${formatAtomDate(post.date)}</updated>
      <published>${formatAtomDate(post.date)}</published>
      <author>
        <name>${escapeXml(post.author)}</name>
      </author>
      <summary type="text">${escapeXml(post.excerpt)}</summary>
      ${post.tags.map((tag) => `<category term="${escapeXml(tag)}" />`).join('\n      ')}
    </entry>`
      )
      .join('');

    const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <link href="${SITE_URL}" rel="alternate" type="text/html" />
  <link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/atom+xml" />
  <id>${SITE_URL}/</id>
  <updated>${new Date().toISOString()}</updated>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <author>
    <name>${escapeXml(SITE_AUTHOR)}</name>
  </author>${atomEntries}
</feed>`;

    return new NextResponse(atom, {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    logger.error('Error generating Atom feed:', error);
    return NextResponse.json({ error: 'Failed to generate Atom feed' }, { status: 500 });
  }
}
