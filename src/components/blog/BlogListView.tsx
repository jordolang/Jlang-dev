"use client";

import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric', timeZone: 'UTC' });
}

export default function BlogListView({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link 
            href="/#blog" 
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-6 inline-block"
          >
            <Icon icon="solar:arrow-left-outline" width={20} height={20} />
            <span className="font-medium">Back to Portfolio</span>
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Blog Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Thoughts on web development, self-hosting, mobile apps, and technology trends
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Icon 
                icon="solar:magnifer-outline" 
                width={20} 
                height={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search posts by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Icon icon="solar:close-circle-bold" width={20} height={20} />
                </button>
              )}
            </div>
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon icon="solar:tag-bold" width={20} height={20} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filter by tag:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedTag === null
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  All Posts
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            {filteredPosts.length === posts.length ? (
              <span>Showing all {posts.length} post{posts.length !== 1 ? 's' : ''}</span>
            ) : (
              <span>Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} out of {posts.length}</span>
            )}
          </div>
        </div>
      </header>

      {/* Blog Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {filteredPosts.length === 0 ? (
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Icon icon="solar:document-text-bold" className="mx-auto text-gray-400 mb-4" width={64} height={64} />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {posts.length === 0 ? 'No blog posts found.' : 'No posts match your search criteria.'}
            </p>
            {(searchQuery || selectedTag) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
              >
                <Icon icon="solar:refresh-outline" width={20} height={20} />
                <span>Clear Filters</span>
              </button>
            )}
          </m.div>
        ) : (
          <AnimatePresence mode="wait">
            <m.div 
              key={`${searchQuery}-${selectedTag}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post, index) => (
              <m.article
                key={post.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link 
                  href={`/blog/${post.slug}`}
                  onClick={() => trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: `Blog: ${post.title}` })}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
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
                          <Icon icon="solar:document-text-bold" className="text-indigo-500" width={48} height={48} />
                        </div>
                      )}
                      
                      {/* Reading Time Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                        <span className="text-white text-xs font-medium flex items-center gap-1">
                          <Icon icon="solar:clock-circle-bold" width={12} height={12} />
                          {post.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Date and Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.date)}
                        </span>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Author and Read More */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">J</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
                        </div>
                        
                        <div className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                          <span>Read More</span>
                          <Icon icon="solar:arrow-right-outline" width={14} height={14} className="transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </m.article>
              ))}
            </m.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
