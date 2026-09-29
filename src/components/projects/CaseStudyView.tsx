"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import PortableTextContent from "@/components/blog/PortableTextContent";

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
  // Case study fields
  challenge?: PortableTextBlock[];
  approach?: PortableTextBlock[];
  solution?: PortableTextBlock[];
  results?: PortableTextBlock[];
  testimonial?: {
    author: string;
    role: string;
    content: string;
    rating?: number;
  } | null;
}

interface CaseStudyViewProps {
  project: CaseStudyViewProject;
}

export default function CaseStudyView({ project }: CaseStudyViewProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: project.title });
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
                alt={project.title}
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
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Case Study Sections */}
          {hasCaseStudy && (
            <div className="space-y-12">
              {/* Challenge Section */}
              {project.challenge && project.challenge.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon icon="solar:danger-triangle-bold" width={24} height={24} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Challenge</h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <PortableTextContent value={project.challenge} />
                  </div>
                </section>
              )}

              {/* Approach Section */}
              {project.approach && project.approach.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon icon="solar:lightbulb-bolt-bold" width={24} height={24} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Approach</h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <PortableTextContent value={project.approach} />
                  </div>
                </section>
              )}

              {/* Solution Section */}
              {project.solution && project.solution.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon icon="solar:code-square-bold" width={24} height={24} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Solution</h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <PortableTextContent value={project.solution} />
                  </div>
                </section>
              )}

              {/* Results Section */}
              {project.results && project.results.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon icon="solar:chart-2-bold" width={24} height={24} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Results</h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <PortableTextContent value={project.results} />
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Features Section */}
          {project.features && project.features.length > 0 && (
            <section className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Icon icon="solar:check-circle-bold" width={24} height={24} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Deliverables Section */}
          {project.deliverables && project.deliverables.length > 0 && (
            <section className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Deliverables</h2>
              <ul className="space-y-3">
                {project.deliverables.map((deliverable, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Icon icon="solar:box-bold" width={24} height={24} className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Testimonial Section */}
          {project.testimonial && (
            <section className="mb-12">
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.testimonial.role}</p>
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
            </section>
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
