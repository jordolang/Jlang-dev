import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { PortableTextBlock } from '@portabletext/react';
import { getSanityClient, sanityIsConfigured } from '@/sanity/lib/client';
import { isDraftMode } from './cms';
import { urlForImage, type SanityImageRef } from '@/sanity/lib/image';
import { logger } from './logger';

export interface Category {
  slug: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Tag {
  slug: string;
  name: string;
  description?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category?: Category;
  tags: Tag[];
  author: string;
  readTime: string;
  /** Raw MDX source. Only present for posts still living in content/blog. */
  content: string;
  /** Rich text from Sanity. Present for CMS-authored posts. */
  body?: PortableTextBlock[];
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category?: string;
  tags: string[];
  author: string;
  readTime: string;
}

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog');

const POST_PROJECTION = `{
  "slug": slug.current,
  title, date, excerpt, author, readTime, body,
  image { asset->{ _id, url } },
  category->{ slug, name, color, description },
  "tags": tags[]->{ slug, name, description }
}`;

interface RawSanityPost extends Omit<BlogPost, 'image' | 'content' | 'category' | 'tags'> {
  image: SanityImageRef | null;
  category?: Category | null;
  tags?: Tag[] | null;
}

/** Rough reading time from the plain text inside a Portable Text body. */
function estimateReadTime(body: PortableTextBlock[] | undefined): string {
  if (!body?.length) return '5 min read';
  const words = body
    .flatMap((block) =>
      block._type === 'block' && Array.isArray(block.children)
        ? (block.children as { text?: string }[]).map((child) => child.text ?? '')
        : [],
    )
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function normalizeSanityPost(post: RawSanityPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    image: urlForImage(post.image) ?? '/images/blog/default.svg',
    category: post.category ?? undefined,
    tags: post.tags ?? [],
    author: post.author || 'Jordan Lang',
    readTime: post.readTime || estimateReadTime(post.body),
    content: '',
    body: post.body,
  };
}

async function getSanityBlogPosts(): Promise<BlogPost[]> {
  if (!sanityIsConfigured) return [];
  const draft = await isDraftMode();
  // In Presentation, an unpublished post is exactly the thing the editor wants to look at, so the
  // `published` gate only applies to the live site.
  const filter = draft
    ? `*[_type == "blogPost" && defined(slug.current)]`
    : `*[_type == "blogPost" && published == true && defined(slug.current)]`;
  try {
    const posts = await getSanityClient(draft).fetch<RawSanityPost[]>(
      `${filter} | order(date desc) ${POST_PROJECTION}`,
      {},
      draft ? { cache: 'no-store' } : { next: { revalidate: 60, tags: ['blogPosts'] } },
    );
    return (posts ?? []).map(normalizeSanityPost);
  } catch (error) {
    logger.error('Error fetching blog posts from Sanity:', error);
    return [];
  }
}

/** Posts still authored as MDX files on disk. Used as a fallback while the CMS has none. */
export function getMdxBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOG_DIRECTORY)) return [];

    return fs
      .readdirSync(BLOG_DIRECTORY)
      .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
      .map((name) => {
        const slug = name.replace(/\.(mdx?|md)$/, '');
        const fileContents = fs.readFileSync(path.join(BLOG_DIRECTORY, name), 'utf8');
        const { data, content } = matter(fileContents);
        const frontmatter = data as BlogFrontmatter;

        // Convert string tags to Tag objects for MDX posts
        const tags: Tag[] = (frontmatter.tags || []).map((tagName) => ({
          slug: tagName.toLowerCase().replace(/\s+/g, '-'),
          name: tagName,
        }));

        // Convert category string to Category object for MDX posts
        const category: Category | undefined = frontmatter.category
          ? {
              slug: frontmatter.category.toLowerCase().replace(/\s+/g, '-'),
              name: frontmatter.category,
            }
          : undefined;

        return {
          slug,
          title: frontmatter.title,
          date: frontmatter.date,
          excerpt: frontmatter.excerpt,
          image: frontmatter.image || '/images/blog/default.svg',
          category,
          tags,
          author: frontmatter.author || 'Jordan Lang',
          readTime: frontmatter.readTime || '5 min read',
          content,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    logger.error('Error reading blog posts:', error);
    return [];
  }
}

/** Sanity is the source of truth; the MDX files stand in only while the CMS has no posts. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const fromSanity = await getSanityBlogPosts();
  return fromSanity.length > 0 ? fromSanity : getMdxBlogPosts();
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** Compile an MDX-authored post. Returns null for CMS posts, which render as Portable Text instead. */
export async function compileMdxPost(post: BlogPost) {
  if (!post.content) return null;
  try {
    const { content } = await compileMDX({
      source: post.content,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
        },
      },
    });
    return content;
  } catch (error) {
    logger.error('Error compiling MDX post:', error);
    return null;
  }
}

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  return (await getAllBlogPosts()).slice(0, limit);
}

export async function getAdjacentPosts(currentSlug: string) {
  const allPosts = await getAllBlogPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  return {
    previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}

/** Get all unique categories from blog posts. */
export async function getAllCategories(): Promise<Category[]> {
  const posts = await getAllBlogPosts();
  const categoryMap = new Map<string, Category>();

  posts.forEach((post) => {
    if (post.category) {
      categoryMap.set(post.category.slug, post.category);
    }
  });

  return Array.from(categoryMap.values());
}

/** Get all unique tags from blog posts. */
export async function getAllTags(): Promise<Tag[]> {
  const posts = await getAllBlogPosts();
  const tagMap = new Map<string, Tag>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag.slug, tag);
    });
  });

  return Array.from(tagMap.values());
}

/** Get all posts in a specific category. */
export async function getPostsByCategory(slug: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => post.category?.slug === slug);
}

/** Get all posts with a specific tag. */
export async function getPostsByTag(slug: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => post.tags.some((tag) => tag.slug === slug));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric', timeZone: 'UTC' });
}
