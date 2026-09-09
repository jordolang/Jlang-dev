"use client";

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { m } from 'framer-motion';

interface PostNavigationProps {
  previousPost?: {
    slug: string;
    title: string;
  };
  nextPost?: {
    slug: string;
    title: string;
  };
}

export default function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
      {/* Previous Post */}
      {previousPost ? (
        <m.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link
            href={`/blog/${previousPost.slug}`}
            className="block h-full p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
          >
            <div className="flex items-start gap-3">
              <Icon
                icon="solar:arrow-left-outline"
                width={24}
                height={24}
                className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:-translate-x-1 transition-transform"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Previous Post</p>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {previousPost.title}
                </h3>
              </div>
            </div>
          </Link>
        </m.div>
      ) : (
        <div /> 
      )}

      {/* Next Post */}
      {nextPost && (
        <m.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link
            href={`/blog/${nextPost.slug}`}
            className="block h-full p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
          >
            <div className="flex items-start gap-3 text-right">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Next Post</p>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                  {nextPost.title}
                </h3>
              </div>
              <Icon
                icon="solar:arrow-right-outline"
                width={24}
                height={24}
                className="text-purple-600 dark:text-purple-400 flex-shrink-0 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        </m.div>
      )}
    </div>
  );
}
