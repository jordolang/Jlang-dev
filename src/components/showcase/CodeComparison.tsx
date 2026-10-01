'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { m } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeComparisonProps {
  before: string;
  after: string;
  language?: string;
  beforeLabel?: string;
  afterLabel?: string;
  showLineNumbers?: boolean;
}

export function CodeComparison({
  before,
  after,
  language = 'typescript',
  beforeLabel = 'Before',
  afterLabel = 'After',
  showLineNumbers = true,
}: CodeComparisonProps) {
  const [copiedSide, setCopiedSide] = useState<'before' | 'after' | null>(null);

  const handleCopy = async (code: string, side: 'before' | 'after') => {
    await navigator.clipboard.writeText(code);
    setCopiedSide(side);
    setTimeout(() => setCopiedSide(null), 2000);
  };

  const getDiffLines = () => {
    const beforeLines = before.split('\n');
    const afterLines = after.split('\n');
    const maxLines = Math.max(beforeLines.length, afterLines.length);

    const addedLines: number[] = [];
    const removedLines: number[] = [];

    // A replaced line counts as removed on the before side and added on the after side.
    for (let i = 0; i < maxLines; i++) {
      const beforeLine = beforeLines[i];
      const afterLine = afterLines[i];

      if (beforeLine !== afterLine) {
        if (beforeLine !== undefined) removedLines.push(i + 1);
        if (afterLine !== undefined) addedLines.push(i + 1);
      }
    }

    return { addedLines, removedLines };
  };

  const { addedLines, removedLines } = getDiffLines();

  const getLineProps = (lineNumber: number, side: 'before' | 'after') => {
    const isAdded = side === 'after' && addedLines.includes(lineNumber);
    const isRemoved = side === 'before' && removedLines.includes(lineNumber);

    if (isAdded) {
      return {
        style: {
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderLeft: '3px solid rgb(34, 197, 94)',
          display: 'block',
        },
      };
    }

    if (isRemoved) {
      return {
        style: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderLeft: '3px solid rgb(239, 68, 68)',
          display: 'block',
        },
      };
    }

    return {
      style: {
        display: 'block',
      },
    };
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* Before Panel */}
      <m.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg"
      >
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="solar:arrow-left-outline" width={16} height={16} className="text-red-400" />
            <span className="text-xs text-gray-400 font-mono uppercase">{beforeLabel}</span>
            <span className="text-xs text-gray-500 font-mono">{language}</span>
          </div>
          <button
            onClick={() => handleCopy(before, 'before')}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <Icon
              icon={copiedSide === 'before' ? 'solar:check-circle-bold' : 'solar:copy-outline'}
              width={14}
              height={14}
            />
            {copiedSide === 'before' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber) => getLineProps(lineNumber, 'before')}
        >
          {before.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </m.div>

      {/* After Panel */}
      <m.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg"
      >
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="solar:arrow-right-outline" width={16} height={16} className="text-green-400" />
            <span className="text-xs text-gray-400 font-mono uppercase">{afterLabel}</span>
            <span className="text-xs text-gray-500 font-mono">{language}</span>
          </div>
          <button
            onClick={() => handleCopy(after, 'after')}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <Icon
              icon={copiedSide === 'after' ? 'solar:check-circle-bold' : 'solar:copy-outline'}
              width={14}
              height={14}
            />
            {copiedSide === 'after' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber) => getLineProps(lineNumber, 'after')}
        >
          {after.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </m.div>
    </m.div>
  );
}
