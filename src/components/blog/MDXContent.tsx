import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MDXComponents } from './MDXComponents';

interface MDXContentProps {
  content: string;
}

// Rendered on the server (from the blog post page), so the markdown parser never ships to the browser.
export default function MDXContent({ content }: MDXContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      components={MDXComponents as any}
    >
      {content}
    </ReactMarkdown>
  );
}
