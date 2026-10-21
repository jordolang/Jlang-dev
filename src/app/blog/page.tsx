import type { Metadata } from "next";
import BlogListView from "@/components/blog/BlogListView";
import { getAllBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Jordan Lang",
  description: "Thoughts on web development, self-hosting, mobile apps, and technology trends.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/rss.xml",
      "application/atom+xml": "/blog/feed.xml",
    },
  },
  openGraph: {
    title: "Blog | Jordan Lang",
    description: "Thoughts on web development, self-hosting, mobile apps, and technology trends.",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  // The list never shows the article text; leaving it out keeps it out of the page payload.
  const cards = posts.map(({ slug, title, date, excerpt, image, category, tags, author, readTime }) => ({
    slug, title, date, excerpt, image, category, tags, author, readTime,
  }));
  return <BlogListView posts={cards} />;
}
