"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { m } from 'framer-motion';
import { logger } from '@/lib/logger';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error('Failed to copy link:', error);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Share this post:
      </span>
      
      <div className="flex items-center gap-2">
        {/* Twitter */}
        <m.a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 rounded-xl transition-colors"
          aria-label="Share on Twitter"
        >
          <Icon icon="ri:twitter-x-fill" width={18} height={18} />
        </m.a>

        {/* LinkedIn */}
        <m.a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 rounded-xl transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Icon icon="ri:linkedin-fill" width={18} height={18} />
        </m.a>

        {/* Facebook */}
        <m.a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 rounded-xl transition-colors"
          aria-label="Share on Facebook"
        >
          <Icon icon="ri:facebook-fill" width={18} height={18} />
        </m.a>

        {/* Copy Link */}
        <m.button
          onClick={handleCopyLink}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2.5 rounded-xl transition-all ${
            copied
              ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label={copied ? 'Link copied!' : 'Copy link'}
        >
          <Icon 
            icon={copied ? "solar:check-circle-bold" : "solar:link-bold"} 
            width={18} 
            height={18} 
          />
        </m.button>
      </div>

      {/* Copied Tooltip */}
      {copied && (
        <m.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs text-green-600 dark:text-green-400 font-medium"
        >
          Link copied!
        </m.span>
      )}
    </div>
  );
}
