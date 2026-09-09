import type { Metadata } from "next";
import BlogListView from "@/components/blog/BlogListView";
import { getAllBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Jordan Lang",
  description: "Thoughts on web development, self-hosting, mobile apps, and technology trends.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Jordan Lang",
    description: "Thoughts on web development, self-hosting, mobile apps, and technology trends.",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  return <BlogListView posts={posts} />;
}
