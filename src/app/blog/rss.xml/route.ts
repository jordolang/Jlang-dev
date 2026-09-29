import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog';
import { isDraftMode } from '@/lib/cms';
import { feedCacheControl, generateRssFeed } from '@/lib/feed';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    const rss = generateRssFeed(posts);

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': feedCacheControl(await isDraftMode()),
      },
    });
  } catch (error) {
    logger.error('Error generating RSS feed:', error);
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}
