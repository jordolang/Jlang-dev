import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import CopyCodeButton from './CopyCodeButton';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';

interface CodeProps {
  children?: ReactNode;
  className?: string;
  inline?: boolean;
}

function Code({ children, className, inline }: CodeProps) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 mx-0.5 text-sm bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded font-mono">
        {children}
      </code>
    );
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-mono uppercase">{language || 'code'}</span>
        {typeof children === 'string' && <CopyCodeButton code={children} />}
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers={true}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  children: ReactNode;
}

function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
  };

  const icons = {
    info: 'solar:info-circle-bold',
    warning: 'solar:danger-triangle-bold',
    success: 'solar:check-circle-bold',
    error: 'solar:close-circle-bold',
  };

  const iconColors = {
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className={`my-6 p-4 rounded-xl border ${styles[type]} flex gap-3`}>
      <Icon icon={icons[type]} width={24} height={24} className={`flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
      <div className="flex-1 prose-sm dark:prose-invert">{children}</div>
    </div>
  );
}

interface ImageGalleryProps {
  images: { src: string; alt: string; caption?: string }[];
}

function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </div>
          {image.caption && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center italic">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

interface VideoEmbedProps {
  src: string;
  title?: string;
}

function VideoEmbed({ src, title = 'Video' }: VideoEmbedProps) {
  return (
    <div className="my-8">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}

interface QuoteProps {
  children: ReactNode;
  author?: string;
}

function Quote({ children, author }: QuoteProps) {
  return (
    <blockquote className="my-8 pl-6 border-l-4 border-indigo-500 dark:border-indigo-400 italic">
      <div className="text-lg text-gray-700 dark:text-gray-300 mb-2">{children}</div>
      {author && (
        <cite className="text-sm text-gray-600 dark:text-gray-400 not-italic">
          — {author}
        </cite>
      )}
    </blockquote>
  );
}

export const MDXComponents = {
  // Standard HTML elements with enhanced styling
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-4xl font-bold mt-12 mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white scroll-mt-20">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-2xl font-bold mt-8 mb-3 text-gray-900 dark:text-white scroll-mt-20">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: ReactNode }) => (
    <h4 className="text-xl font-bold mt-6 mb-2 text-gray-900 dark:text-white">
      {children}
    </h4>
  ),
  p: ({ children }: { children: ReactNode }) => (
    <p className="my-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
      {children}
    </p>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="my-6 space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300 ml-4">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="my-6 space-y-2 list-decimal list-inside text-gray-700 dark:text-gray-300 ml-4">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="my-1 leading-relaxed">{children}</li>
  ),
  code: Code,
  pre: ({ children }: { children: ReactNode }) => <>{children}</>,
  a: ({ href, children }: { href?: string; children: ReactNode }) => (
    <Link
      href={href || '#'}
      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-4 transition-colors"
    >
      {children}
    </Link>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <div className="my-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
      <Image
        src={src || ''}
        alt={alt || ''}
        width={1200}
        height={600}
        className="w-full h-auto"
      />
    </div>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <Quote>{children}</Quote>
  ),
  hr: () => (
    <hr className="my-12 border-t border-gray-200 dark:border-gray-800" />
  ),
  table: ({ children }: { children: ReactNode }) => (
    <div className="my-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: ReactNode }) => (
    <thead className="bg-gray-50 dark:bg-gray-900">{children}</thead>
  ),
  tbody: ({ children }: { children: ReactNode }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">{children}</tbody>
  ),
  tr: ({ children }: { children: ReactNode }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">{children}</tr>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
      {children}
    </td>
  ),
  
  // Custom components
  Callout,
  ImageGallery,
  VideoEmbed,
  Quote,
};
