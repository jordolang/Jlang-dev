"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
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
    <m.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon icon={icon} width={24} height={24} className="text-white" />
        </m.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose prose-lg dark:prose-invert max-w-none"
      >
        <PortableTextContent value={content} />
      </m.div>
    </m.section>
  );
}
