"use client";

import { Icon } from "@iconify/react";
import type { PortableTextBlock } from "@portabletext/react";
import PortableTextContent from "@/components/blog/PortableTextContent";

interface CaseStudySectionProps {
  title: string;
  icon: string;
  gradient: string;
  content: PortableTextBlock[];
}

/**
 * Reusable case study section component for challenge, approach, solution, and results sections.
 * Renders a section with an icon, title, and portable text content.
 */
export default function CaseStudySection({ title, icon, gradient, content }: CaseStudySectionProps) {
  if (!content || content.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon icon={icon} width={24} height={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <PortableTextContent value={content} />
      </div>
    </section>
  );
}
