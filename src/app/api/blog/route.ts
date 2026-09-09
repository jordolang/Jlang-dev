import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    logger.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
