"use client";

import React, { ReactNode, useState } from 'react';
import { Icon } from '@iconify/react';
import { m } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeShowcaseProps {
  /** The code to display in the code pane */
  code: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** The live preview component to render */
  preview?: ReactNode;
  /** Title for the showcase */
  title?: string;
  /** Description text to display above the showcase */
  description?: string;
  /** Default view mode: 'split' (horizontal), 'code', or 'preview' */
  defaultView?: 'split' | 'code' | 'preview';
  /** Whether to show the copy button */
  showCopy?: boolean;
  /** Custom height for the showcase (default: auto) */
  height?: string;
}

export function CodeShowcase({
  code,
  language = 'typescript',
  preview,
  title,
  description,
  defaultView = 'split',
  showCopy = true,
  height = 'auto',
}: CodeShowcaseProps) {
  const [activeView, setActiveView] = useState<'split' | 'code' | 'preview'>(defaultView);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const showCode = activeView === 'split' || activeView === 'code';
  const showPreview = (activeView === 'split' || activeView === 'preview') && preview;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="my-8 space-y-4"
    >
      {/* Header */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* View Toggle Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {preview && (
            <button
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                activeView === 'preview'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon icon="solar:eye-outline" width={16} height={16} />
              Preview
            </button>
          )}
          {preview && (
            <button
              onClick={() => setActiveView('split')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                activeView === 'split'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon icon="solar:display-outline" width={16} height={16} />
              Split
            </button>
          )}
          <button
            onClick={() => setActiveView('code')}
            className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
              activeView === 'code'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon icon="solar:code-outline" width={16} height={16} />
            Code
          </button>
        </div>

        {showCopy && showCode && (
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-1.5"
          >
            <Icon
              icon={copied ? "solar:check-circle-bold" : "solar:copy-outline"}
              width={16}
              height={16}
            />
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div
        className={`rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg ${
          activeView === 'split' && preview ? 'grid grid-cols-1 lg:grid-cols-2' : ''
        }`}
        style={{ height: height !== 'auto' ? height : undefined }}
      >
        {/* Preview Pane */}
        {showPreview && (
          <div className="bg-white dark:bg-gray-900 p-6 flex items-center justify-center min-h-[300px] border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800">
            <div className="w-full max-w-lg">
              {preview}
            </div>
          </div>
        )}

        {/* Code Pane */}
        {showCode && (
          <div className="flex flex-col">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono uppercase">
                {language}
              </span>
              {showCopy && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 lg:hidden"
                >
                  <Icon
                    icon={copied ? "solar:check-circle-bold" : "solar:copy-outline"}
                    width={14}
                    height={14}
                  />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto">
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  height: '100%',
                  minHeight: '300px',
                }}
                showLineNumbers={true}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </m.div>
  );
}
