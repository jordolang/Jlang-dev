import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog';
import { isDraftMode } from '@/lib/cms';
import { feedCacheControl, generateAtomFeed } from '@/lib/feed';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    const atom = generateAtomFeed(posts);

    return new NextResponse(atom, {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': feedCacheControl(await isDraftMode()),
      },
    });
  } catch (error) {
    logger.error('Error generating Atom feed:', error);
    return NextResponse.json({ error: 'Failed to generate Atom feed' }, { status: 500 });
  }
}
