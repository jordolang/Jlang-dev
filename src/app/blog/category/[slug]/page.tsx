import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListView from "@/components/blog/BlogListView";
import { getAllCategories, getPostsByCategory } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) return { title: "Category Not Found" };

  const url = `${SITE_URL}/blog/category/${category.slug}`;
  const title = `${category.name} Articles`;
  const description = category.description || `Browse all blog posts in the ${category.name} category`;

  return {
    title: `${title} | Jordan Lang`,
    description,
    alternates: { canonical: `/blog/category/${category.slug}` },
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [categories, posts] = await Promise.all([
    getAllCategories(),
    getPostsByCategory(slug),
  ]);

  const category = categories.find((cat) => cat.slug === slug);

  if (!category) notFound();

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
