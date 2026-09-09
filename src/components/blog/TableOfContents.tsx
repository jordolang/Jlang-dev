"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { m, AnimatePresence } from 'framer-motion';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    
    const extractedHeadings: Heading[] = matches.map((match) => ({
      id: match[2].toLowerCase().replace(/\s+/g, '-'),
      text: match[2],
      level: match[1].length,
    }));
    
    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="hidden xl:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full mb-4 group"
        >
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Icon icon="solar:list-bold" width={18} height={18} className="text-indigo-600 dark:text-indigo-400" />
            Table of Contents
          </h3>
          <Icon 
            icon={isOpen ? "solar:alt-arrow-up-outline" : "solar:alt-arrow-down-outline"} 
            width={18} 
            height={18} 
            className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors"
          />
        </button>

        {/* TOC List */}
        <AnimatePresence>
          {isOpen && (
            <m.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="space-y-2">
                {headings.map(({ id, text, level }) => (
                  <li
                    key={id}
                    className={`${level === 3 ? 'ml-4' : ''}`}
                  >
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(id);
                        if (element) {
                          const offset = 80;
                          const elementPosition = element.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.scrollY - offset;

                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth',
                          });
                        }
                      }}
                      className={`block text-sm py-1.5 px-3 rounded-lg transition-all duration-200 ${
                        activeId === id
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-medium border-l-2 border-indigo-600 dark:border-indigo-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-2 border-transparent'
                      }`}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </m.nav>
          )}
        </AnimatePresence>

        {/* Scroll to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-6 w-full py-2 px-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="solar:alt-arrow-up-outline" width={16} height={16} />
          Back to Top
        </button>
      </div>
    </div>
  );
}
