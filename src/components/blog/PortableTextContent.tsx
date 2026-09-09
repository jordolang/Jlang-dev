"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { urlForImage } from "@/sanity/lib/image";

/**
 * Anchor id for a heading. Must match how TableOfContents derives its ids
 * (lowercase, whitespace to dashes) or the sidebar links won't resolve.
 */
function headingId(children: React.ReactNode): string {
  const text = Array.isArray(children) ? children.join("") : String(children ?? "");
  return text.toLowerCase().replace(/\s+/g, "-");
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
    h2: ({ children }) => (
      <h2 id={headingId(children)} className="mt-10 mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 id={headingId(children)} className="mt-8 mb-3 text-xl font-bold text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 id={headingId(children)} className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-indigo-500 pl-6 italic text-gray-600 dark:border-indigo-400 dark:text-gray-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">{children}</ul>,
    number: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="mx-0.5 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-pink-600 dark:bg-gray-800 dark:text-pink-400">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const src = urlForImage(value);
      if (!src) return null;
      const alt = (value as { alt?: string })?.alt ?? "";
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 shadow-lg dark:border-gray-800">
            <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
          {alt && <figcaption className="mt-2 text-center text-sm italic text-gray-600 dark:text-gray-400">{alt}</figcaption>}
        </figure>
      );
    },
    table: ({ value }) => {
      const { rows, hasHeader } = (value ?? {}) as { rows?: { cells?: string[] }[]; hasHeader?: boolean };
      if (!rows?.length) return null;
      const [first, ...rest] = rows;
      const bodyRows = hasHeader ? rest : rows;

      return (
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {hasHeader && (
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  {(first.cells ?? []).map((cell, index) => (
                    <th key={index} className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-200 dark:border-gray-800">
                  {(row.cells ?? []).map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    codeBlock: ({ value }) => {
      const { language, code } = (value ?? {}) as { language?: string; code?: string };
      if (!code) return null;
      return (
        <div className="my-6 overflow-hidden rounded-xl border border-gray-200 shadow-lg dark:border-gray-800">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
            <span className="font-mono text-xs uppercase text-gray-400">{language || "code"}</span>
          </div>
          <SyntaxHighlighter language={language || "text"} style={oneDark} customStyle={{ margin: 0, borderRadius: 0 }}>
            {code}
          </SyntaxHighlighter>
        </div>
      );
    },
  },
};

export default function PortableTextContent({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
