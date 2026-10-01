"use client";

import { ReactNode, useState } from 'react';
import { Icon } from '@iconify/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ViewSourceToggleProps {
  /** The rendered component/content to display */
  children: ReactNode;
  /** The source code to reveal when toggled */
  code: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Optional title for the source code view */
  title?: string;
  /** Whether to show initially in source mode */
  defaultShowSource?: boolean;
  /** Whether to show the copy button */
  showCopy?: boolean;
  /** Label for the toggle button */
  toggleLabel?: string;
  /** Position of the toggle button */
  togglePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ViewSourceToggle({
  children,
  code,
  language = 'typescript',
  title,
  defaultShowSource = false,
  showCopy = true,
  toggleLabel = 'View Source',
  togglePosition = 'top-right',
}: ViewSourceToggleProps) {
  const [showSource, setShowSource] = useState(defaultShowSource);
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

  const getTogglePositionClasses = () => {
    const baseClasses = 'absolute z-10';
    switch (togglePosition) {
      case 'top-left':
        return `${baseClasses} top-3 left-3`;
      case 'bottom-right':
        return `${baseClasses} bottom-3 right-3`;
      case 'bottom-left':
        return `${baseClasses} bottom-3 left-3`;
      case 'top-right':
      default:
        return `${baseClasses} top-3 right-3`;
    }
  };

  return (
    <div className="relative group">
      {/* Toggle Button */}
      <button
        onClick={() => setShowSource(!showSource)}
        className={`${getTogglePositionClasses()} px-3 py-1.5 text-xs rounded-md bg-gray-900/80 dark:bg-gray-800/80 text-white backdrop-blur-sm hover:bg-gray-900 dark:hover:bg-gray-700 transition-all flex items-center gap-1.5 shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100`}
        title={showSource ? 'View Rendered' : toggleLabel}
      >
        <Icon
          icon={showSource ? 'solar:eye-outline' : 'solar:code-outline'}
          width={14}
          height={14}
        />
        <span>{showSource ? 'View Rendered' : toggleLabel}</span>
      </button>

      {/* Content Area */}
      <div className="relative">
        {!showSource ? (
          // Rendered Content View
          <div className="relative">
            {children}
          </div>
        ) : (
          // Source Code View
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
            {/* Code Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono uppercase">
                  {language}
                </span>
                {title && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs text-gray-400">
                      {title}
                    </span>
                  </>
                )}
              </div>
              {showCopy && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Icon
                    icon={copied ? "solar:check-circle-bold" : "solar:copy-outline"}
                    width={14}
                    height={14}
                  />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            {/* Code Content */}
            <div className="overflow-auto max-h-[500px]">
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                }}
                showLineNumbers={true}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
