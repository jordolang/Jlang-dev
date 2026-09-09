"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import MDXContent from "@/components/blog/MDXContent";
import PortableTextContent from "@/components/blog/PortableTextContent";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import PostNavigation from "@/components/blog/PostNavigation";
import RelatedPosts from "@/components/blog/RelatedPosts";
import Newsletter from "@/components/blog/Newsletter";

export interface BlogPostViewPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  author: string;
  readTime: string;
  content: string;
  body?: PortableTextBlock[];
}

interface BlogPostViewProps {
  post: BlogPostViewPost;
  allPosts: BlogPostViewPost[];
  previousPost?: { slug: string; title: string };
  nextPost?: { slug: string; title: string };
  /** Markdown-shaped heading outline the TableOfContents parses. */
  tocSource: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: "numeric", month: "long", day: "numeric", timeZone: 'UTC' });
}

export default function BlogPostView({ post, allPosts, previousPost, nextPost, tocSource }: BlogPostViewProps) {
  const [postUrl, setPostUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setPostUrl(window.location.href);
  }, []);

  useEffect(() => {
    trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: `Blog Post: ${post.title}` });
  }, [post.title]);

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <Icon icon="solar:arrow-left-outline" width={20} height={20} />
              <span className="font-medium">Back to Blog</span>
            </Link>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-12">
            <m.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {post.image && (
                <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                  <Image src={post.image} alt={post.title} fill className="object-cover" priority />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">J</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{post.author}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">{formatDate(post.date)}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Icon icon="solar:clock-circle-bold" width={16} height={16} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 pb-8 border-b border-gray-200 dark:border-gray-800 font-medium">
                {post.excerpt}
              </p>

              <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                <ShareButtons title={post.title} url={postUrl} />
              </div>

              {/* CMS posts render as Portable Text; posts still in content/blog render as MDX. */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {post.body?.length ? <PortableTextContent value={post.body} /> : <MDXContent content={post.content} />}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <ShareButtons title={post.title} url={postUrl} />
              </div>

              <PostNavigation previousPost={previousPost} nextPost={nextPost} />

              <RelatedPosts currentSlug={post.slug} currentTags={post.tags} allPosts={allPosts} />

              <Newsletter />

              <div className="text-center mt-12">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl hover:from-indigo-500/20 hover:to-purple-500/20 transition-all"
                >
                  <Icon icon="solar:arrow-left-outline" width={20} height={20} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">View All Posts</span>
                </Link>
              </div>
            </m.article>

            <TableOfContents content={tocSource} />
          </div>
        </div>
      </div>
    </>
  );
}
