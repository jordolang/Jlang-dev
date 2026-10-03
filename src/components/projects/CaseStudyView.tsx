"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import CaseStudySection from "@/components/projects/CaseStudySection";
import dynamic from "next/dynamic";
import { LazyOnScroll } from "@/components/LazyOnScroll";
import { ScreenshotLightbox, type Screenshot } from "@/components/projects/ScreenshotLightbox";

// Keep the showcase and its Prism highlighter out of the route bundle; most projects have no examples.
const CodeShowcase = dynamic(
  () => import("@/components/showcase/CodeShowcase").then((mod) => mod.CodeShowcase),
  { ssr: false, loading: () => <div style={{ minHeight: 600 }} aria-hidden /> },
);

export interface CaseStudyViewProject {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  features: string[];
  deliverables: string[];
  tech: string[];
  github: string;
  live: string;
  gradient: string;
  status: 'Live' | 'In Development';
  category: string;
  highlight: string;
  timeline: string;
  clientType: string;
  gallery?: Screenshot[];
  // Case study fields
  challenge?: PortableTextBlock[];
  approach?: PortableTextBlock[];
  solution?: PortableTextBlock[];
  results?: PortableTextBlock[];
  testimonial?: {
    author: string;
    role: string;
    company: string;
    content: string;
    rating?: number;
  } | null;
  // Code showcase examples
  codeExamples?: Array<{
    title: string;
    description: string;
    code: string;
    language: string;
  }>;
}

interface CaseStudyViewProps {
  project: CaseStudyViewProject;
}

export default function CaseStudyView({ project }: CaseStudyViewProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.PROJECT_VIEWED, { project: project.title });
  }, [project.title]);

  const hasCaseStudy = project.challenge || project.approach || project.solution || project.results;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <Icon icon="solar:arrow-left-outline" width={20} height={20} />
            <span className="font-medium">Back to Projects</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <m.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Image */}
          {project.image && (
            <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <div className={`absolute inset-0 ${project.gradient || 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20'}`} />
              <Image
                src={project.image}
                alt={`${project.title} project hero image showcasing ${project.subtitle}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}

          {/* Title and Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
              project.status === 'Live'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
            }`}>
              {project.status}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-400">{project.category}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-400">{project.timeline}</span>
            {project.clientType && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">{project.clientType}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            {project.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium mb-8">
            {project.subtitle}
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            {project.description}
          </p>

          {/* Technologies */}
          {project.tech && project.tech.length > 0 && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, idx) => (
                  <m.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="px-3 py-1.5 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    {tech}
                  </m.span>
                ))}
              </div>
            </m.div>
          )}

          <ScreenshotsSection title={project.title} shots={project.gallery ?? []} />

          {/* Case Study Sections */}
          {hasCaseStudy && (
            <div className="space-y-12">
              <CaseStudySection
                title="The Challenge"
                icon="solar:danger-triangle-bold"
                gradient="from-red-500 to-orange-600"
                content={project.challenge ?? []}
              />
              <CaseStudySection
                title="The Approach"
                icon="solar:lightbulb-bolt-bold"
                gradient="from-blue-500 to-indigo-600"
                content={project.approach ?? []}
              />
              <CaseStudySection
                title="The Solution"
                icon="solar:code-square-bold"
                gradient="from-purple-500 to-pink-600"
                content={project.solution ?? []}
              />
              <CaseStudySection
                title="The Results"
                icon="solar:chart-2-bold"
                gradient="from-green-500 to-emerald-600"
                content={project.results ?? []}
              />
            </div>
          )}

          {/* Code Examples Section */}
          {project.codeExamples && project.codeExamples.length > 0 && (
            <m.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Icon icon="solar:code-square-bold" width={24} height={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Code Examples</h2>
              </div>
              <div className="space-y-8">
                {project.codeExamples.map((example, idx) => (
                  <LazyOnScroll
                    key={idx}
                    id={`code-example-${idx}`}
                    minHeight={600}
                    rootMargin="800px"
                  >
                    <m.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <CodeShowcase
                        title={example.title}
                        description={example.description}
                        code={example.code}
                        language={example.language}
                        defaultView="code"
                        showCopy={true}
                      />
                    </m.div>
                  </LazyOnScroll>
                ))}
              </div>
            </m.section>
          )}

          {/* Features Section */}
          {project.features && project.features.length > 0 && (
            <m.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, idx) => (
                  <m.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Icon icon="solar:check-circle-bold" width={24} height={24} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{feature}</span>
                  </m.li>
                ))}
              </ul>
            </m.section>
          )}

          {/* Deliverables Section */}
          {project.deliverables && project.deliverables.length > 0 && (
            <m.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Deliverables</h2>
              <ul className="space-y-3">
                {project.deliverables.map((deliverable, idx) => (
                  <m.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Icon icon="solar:box-bold" width={24} height={24} className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{deliverable}</span>
                  </m.li>
                ))}
              </ul>
            </m.section>
          )}

          {/* Testimonial Section */}
          {project.testimonial && (
            <m.section
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-12"
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-8 md:p-12 border border-indigo-100 dark:border-indigo-900/30 shadow-xl">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Icon icon="solar:chat-round-quote-bold" width={24} height={24} className="text-white" />
                  </div>
                </div>
                <blockquote className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed mb-6 italic">
                  &ldquo;{project.testimonial.content}&rdquo;
                </blockquote>
                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">
                      {project.testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{project.testimonial.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.testimonial.role ? `${project.testimonial.role} · ` : ''}{project.testimonial.company}
                    </p>
                  </div>
                  {project.testimonial.rating && (
                    <div className="ml-auto flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          icon={i < (project.testimonial?.rating ?? 0) ? "solar:star-bold" : "solar:star-outline"}
                          width={20}
                          height={20}
                          className={i < (project.testimonial?.rating ?? 0) ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}
                        />
                      ))}
                    </div>
                  )}
                </footer>
              </div>
            </m.section>
          )}

          {/* Project Links */}
          <div className="flex flex-wrap gap-4 mt-12">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Icon icon="solar:eye-bold" width={20} height={20} />
                <span>View Live Project</span>
                <Icon icon="solar:arrow-right-up-outline" width={16} height={16} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                <Icon icon="solar:code-circle-bold" width={20} height={20} />
                <span>View Source Code</span>
                <Icon icon="solar:arrow-right-up-outline" width={16} height={16} />
              </a>
            )}
          </div>

          {/* Back to Projects Link */}
          <div className="text-center mt-12">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl hover:from-indigo-500/20 hover:to-purple-500/20 transition-all"
            >
              <Icon icon="solar:arrow-left-outline" width={20} height={20} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">View All Projects</span>
            </Link>
          </div>
        </m.article>
      </div>
    </div>
  );
}

/** Grid of the project's gallery screenshots; each opens the lightbox at that shot. */
function ScreenshotsSection({ title, shots }: { title: string; shots: Screenshot[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  if (!shots.length) return null;

  return (
    <m.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Screenshots</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {shots.map((shot, idx) => (
          <button
            key={shot.video ?? shot.src}
            type="button"
            onClick={() => {
              setIndex(idx);
              dialogRef.current?.showModal();
              trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: title, action: "gallery" });
            }}
            aria-label={`Open screenshot ${idx + 1}${shot.caption ? `: ${shot.caption}` : ""}`}
            className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 shadow-md hover:shadow-xl transition-shadow"
          >
            <Image
              src={shot.src}
              alt={shot.caption || `${title} screenshot ${idx + 1}`}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 300px"
            />
            {shot.video && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Icon icon="solar:play-circle-bold" width={48} height={48} className="text-white drop-shadow" />
              </span>
            )}
          </button>
        ))}
      </div>
      <ScreenshotLightbox ref={dialogRef} title={title} shots={shots} index={index} onIndexChange={setIndex} />
    </m.section>
  );
}
