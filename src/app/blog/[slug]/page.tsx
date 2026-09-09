import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/react";
import BlogPostView from "@/components/blog/BlogPostView";
import { getAdjacentPosts, getAllBlogPosts, getBlogPost } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Blog Post Not Found" };

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | Jordan Lang`,
    description: post.excerpt,
    keywords: post.tags?.join(", "),
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image ? [{ url: post.image, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

/** TableOfContents parses markdown headings, so give it an outline it understands. */
function tocSourceFor(content: string, body?: PortableTextBlock[]): string {
  if (content) return content;
  if (!body?.length) return "";

  return body
    .filter((block) => block._type === "block" && /^h[2-4]$/.test(String(block.style ?? "")))
    .map((block) => {
      const level = Number(String(block.style).slice(1));
      const text = Array.isArray(block.children)
        ? (block.children as { text?: string }[]).map((child) => child.text ?? "").join("")
        : "";
      return `${"#".repeat(level)} ${text}`;
    })
    .join("\n\n");
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [post, allPosts, adjacent] = await Promise.all([
    getBlogPost(slug),
    getAllBlogPosts(),
    getAdjacentPosts(slug),
  ]);

  if (!post) notFound();

  return (
    <BlogPostView
      post={post}
      allPosts={allPosts}
      previousPost={adjacent.previous ? { slug: adjacent.previous.slug, title: adjacent.previous.title } : undefined}
      nextPost={adjacent.next ? { slug: adjacent.next.slug, title: adjacent.next.title } : undefined}
      tocSource={tocSourceFor(post.content, post.body)}
    />
  );
}
