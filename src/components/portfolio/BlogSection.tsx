"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { logger } from "@/lib/logger";
import { isSanityImage, sanityImageLoader } from "@/sanity/lib/loader";
import SectionHeader from "./SectionHeader";
import { useEffect, useState } from "react";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  author: string;
  readTime: string;
}

const MOBILE_PAGE_SIZE = 8;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric', timeZone: 'UTC' });
}

interface BlogSectionProps {
  /** Posts fetched on the server. When omitted the section fetches them itself. */
  posts?: BlogPost[];
  heading?: { tagText?: string; tagIcon?: string; heading?: string; description?: string };
}

export default function BlogSection({ posts: serverPosts, heading }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(serverPosts ?? []);
  const [loading, setLoading] = useState(!serverPosts);

  useEffect(() => {
    if (serverPosts) return; // already have them from the server

    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        logger.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [serverPosts]);

  // Mobile shows posts as compact rows split into swipeable pages.
  const [activePage, setActivePage] = useState(0);
  const pages: BlogPost[][] = [];
  for (let i = 0; i < posts.length; i += MOBILE_PAGE_SIZE) pages.push(posts.slice(i, i + MOBILE_PAGE_SIZE));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const trackOpen = (post: BlogPost) =>
    trackEvent(AnalyticsEvents.PROJECT_LINK_CLICKED, { destination: 'blog', project: post.title });

  if (loading) {
    return (
      <m.section
        className="mb-16 md:mb-24 lg:mb-32 relative overflow-hidden"
      >
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </m.section>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show section if no posts
  }

  return (
    <m.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}
      className="mb-16 md:mb-24 lg:mb-32 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl"
        />
        <div
          style={{ animationDelay: "2s" }}
          className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-violet-400/10 to-pink-400/10 rounded-full blur-xl"
        />
      </div>

      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10"
      >
        {/* Section Header */}
        <SectionHeader
          tagText={heading?.tagText ?? "Latest Insights"}
          tagIcon={heading?.tagIcon ?? "solar:document-text-bold"}
          heading={heading?.heading ?? "Blog Posts"}
          description={heading?.description ?? "Thoughts on web development, self-hosting, mobile apps, and technology trends"}
          showUnderline={true}
          centered={true}
        />

        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop / tablet: compact card grid, up to 15 posts on one screen */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3">
            {posts.map((post) => (
              <m.article key={post.slug} variants={cardVariants} className="group">
                <Link
                  href={`/blog/${post.slug}`}
                  onClick={() => trackOpen(post)}
                  className="block h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-white/30 dark:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative h-20 lg:h-24 overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 250px, 33vw"
                        loader={isSanityImage(post.image) ? sanityImageLoader : undefined}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon icon="solar:document-text-bold" className="text-indigo-500 w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold leading-snug text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                      {post.title}
                    </h3>
                    <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <span>{formatDate(post.date)}</span>
                      {post.readTime && (
                        <span className="flex items-center gap-1 shrink-0">
                          <Icon icon="solar:clock-circle-bold" width={11} height={11} />
                          {post.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </m.article>
            ))}
          </div>

          {/* Mobile: tab-style rows, paged horizontally so every post is a swipe away */}
          <div className="md:hidden">
            <div
              className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4"
              onScroll={(e) => {
                const el = e.currentTarget;
                setActivePage(Math.round(el.scrollLeft / el.clientWidth));
              }}
            >
              {pages.map((page, pageIndex) => (
                <div key={pageIndex} className="w-full shrink-0 snap-start px-4 flex flex-col gap-2">
                  {page.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={() => trackOpen(post)}
                      className="flex items-center gap-3 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-lg border border-white/30 dark:border-gray-700/40 active:scale-[0.98] transition-transform"
                    >
                      <div className="relative w-16 h-11 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        {post.image && (
                          <Image
                            src={post.image}
                            alt=""
                            fill
                            sizes="64px"
                            loader={isSanityImage(post.image) ? sanityImageLoader : undefined}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[13px] font-semibold leading-snug text-gray-900 dark:text-white line-clamp-2">
                          {post.title}
                        </h3>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          {formatDate(post.date)}
                        </span>
                      </div>
                      <Icon icon="solar:alt-arrow-right-linear" width={16} height={16} className="shrink-0 text-gray-400" />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            {pages.length > 1 && (
              <div className="flex justify-center gap-2 mt-4" aria-hidden>
                {pages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activePage ? 'w-6 bg-indigo-500' : 'w-1.5 bg-gray-400/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* View All Blog Posts Link */}
          <m.div
            variants={cardVariants}
            className="text-center mt-6 md:mt-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 dark:border-purple-500/20 rounded-xl hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300"
              onClick={() => trackEvent(AnalyticsEvents.PROJECT_LINK_CLICKED, { destination: 'blog-all', project: 'All Blog Posts' })}
            >
              <Icon icon="solar:document-text-bold" className="text-indigo-500 dark:text-purple-400" width={20} height={20} />
              <span className="text-gray-700 dark:text-gray-300 font-medium">View All Posts</span>
              <Icon icon="solar:arrow-right-outline" width={16} height={16} className="text-indigo-500 dark:text-purple-400" />
            </Link>
          </m.div>
        </div>
      </m.div>
    </m.section>
  );
}
