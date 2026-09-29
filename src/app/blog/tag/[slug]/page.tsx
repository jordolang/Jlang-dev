import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListView from "@/components/blog/BlogListView";
import { getAllTags, getPostsByTag } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev";

export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getAllTags();
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) return { title: "Tag Not Found" };

  const url = `${SITE_URL}/blog/tag/${tag.slug}`;
  const title = `${tag.name} Articles`;
  const description = tag.description || `Browse all blog posts tagged with ${tag.name}`;

  return {
    title: `${title} | Jordan Lang`,
    description,
    alternates: { canonical: `/blog/tag/${tag.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [tags, posts] = await Promise.all([
    getAllTags(),
    getPostsByTag(slug),
  ]);

  const tag = tags.find((t) => t.slug === slug);

  if (!tag) notFound();

  // Map BlogPost objects to the format expected by BlogListView
  const mappedPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    image: post.image,
    tags: post.tags.map((tag) => tag.name),
    author: post.author,
    readTime: post.readTime,
  }));

  return <BlogListView posts={mappedPosts} />;
}
