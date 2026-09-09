"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { m } from 'framer-motion';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  tags: string[];
  readTime: string;
  date: string;
}

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
  allPosts: Post[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric', timeZone: 'UTC' });
}

export default function RelatedPosts({ currentSlug, currentTags, allPosts }: RelatedPostsProps) {
  // Find related posts based on shared tags
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => ({
      ...post,
      sharedTags: post.tags.filter(tag => currentTags.includes(tag)).length,
    }))
    .filter(post => post.sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="my-16">
      <div className="flex items-center gap-3 mb-8">
        <Icon icon="solar:documents-bold" width={28} height={28} className="text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Related Posts</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <m.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Link href={`/blog/${post.slug}`} className="block group h-full">
              <div className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-lg hover:shadow-xl">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <Icon icon="solar:document-text-bold" className="text-indigo-500" width={32} height={32} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                    <span className="text-white text-xs font-medium flex items-center gap-1">
                      <Icon icon="solar:clock-circle-bold" width={10} height={10} />
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(post.date)}</span>
                    <span>•</span>
                    <div className="flex gap-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </m.article>
        ))}
      </div>
    </div>
  );
}
