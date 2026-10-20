"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Icon } from "@iconify/react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { PROJECT_BUCKETS, projectBucket, type ProjectBucket } from "@/lib/projectBuckets";
import type { PageSpeedResult } from "@/lib/fallbackProjects";
import { PageSpeedScores } from "./PageSpeedScores";

export interface ProjectsIndexItem {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tech: string[];
  live: string;
  gradient: string;
  status: "Live" | "In Development";
  category: string;
  timeline: string;
  group?: string;
  featured?: boolean;
  pagespeed?: PageSpeedResult;
}

type Filter = "all" | ProjectBucket;

export default function ProjectsIndex({ projects }: { projects: ProjectsIndexItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: projects.length, websites: 0, webApps: 0, mobile: 0, desktop: 0 };
    for (const project of projects) result[projectBucket(project)] += 1;
    return result;
  }, [projects]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (filter !== "all" && projectBucket(project) !== filter) return false;
      if (!needle) return true;
      return [project.title, project.subtitle, project.category, ...project.tech].some((text) => text?.toLowerCase().includes(needle));
    });
  }, [projects, filter, query]);

  const tabs: { id: Filter; label: string; icon: string }[] = [
    { id: "all", label: "All", icon: "solar:widget-5-bold" },
    ...PROJECT_BUCKETS.filter((bucket) => counts[bucket.id] > 0),
  ];

  const live = projects.filter((project) => project.status === "Live").length;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#FAF8F3] dark:bg-gray-950 text-gray-900 dark:text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/20 dark:bg-gold-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-6 md:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold-300 transition-colors">
          <Icon icon="solar:arrow-left-outline" width={18} height={18} />
          jlang.dev
        </Link>
        <Link href="/resume" className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-white/15 px-4 py-2 text-sm font-medium hover:border-gold-400 transition-colors">
          <Icon icon="solar:document-text-bold" width={16} height={16} />
          Résumé
        </Link>
      </header>

      <main id="main-content" className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-12 md:px-6 md:pt-16">
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-700 dark:text-gold-300">Portfolio</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
            Every project,{" "}
            <span className="bg-gradient-to-r from-gold-700 via-gold-500 to-gold-800 dark:from-gold-200 dark:via-gold-400 dark:to-gold-200 bg-clip-text text-transparent">
              start to ship
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Websites, web apps, mobile apps, desktop tools and kiosks built by Jordan Lang. {projects.length} projects, {live} live today.
          </p>
        </m.div>

        <div className="sticky top-0 z-20 -mx-4 mt-10 flex flex-col gap-3 bg-[#FAF8F3]/85 dark:bg-gray-950/85 px-4 py-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Filter projects" className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {tabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                    active ? "bg-gradient-to-r from-gold-300 to-gold-500 text-black shadow-md shadow-gold-500/20" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon icon={tab.icon} width={16} height={16} />
                  <span>{tab.label}</span>
                  <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-black/10" : "bg-gray-200 dark:bg-white/10"}`}>{counts[tab.id]}</span>
                </button>
              );
            })}
          </div>
          <label className="relative block md:w-72">
            <span className="sr-only">Search projects</span>
            <Icon icon="solar:magnifer-linear" width={18} height={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or tech"
              className="w-full rounded-full border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
            />
          </label>
        </div>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {visible.map((project, index) => (
              <m.li
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.03 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={() => trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: project.title })}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-gold-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                >
                  <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${project.gradient || "from-gold-500 to-gold-800"}`}>
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/80">
                        <Icon icon="solar:code-square-bold" width={48} height={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span
                      className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
                        project.status === "Live" ? "bg-emerald-500/20 text-emerald-50 ring-1 ring-emerald-300/40" : "bg-amber-500/20 text-amber-50 ring-1 ring-amber-300/40"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${project.status === "Live" ? "bg-emerald-400" : "bg-amber-400"}`} />
                      {project.status}
                    </span>
                    {project.featured && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-xs font-semibold text-black">
                        <Icon icon="solar:star-bold" width={12} height={12} />
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {project.category}
                      {project.timeline ? ` · ${project.timeline}` : ""}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                      {project.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{project.subtitle}</p>
                    {project.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 4).map((tech) => (
                          <span key={tech} className="rounded-full bg-gray-100 dark:bg-white/5 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && <span className="px-1 text-xs text-gray-400">+{project.tech.length - 4}</span>}
                      </div>
                    )}
                    {project.pagespeed && (
                      <div className="mt-5">
                        <PageSpeedScores pagespeed={project.pagespeed} static />
                      </div>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-gold-700 dark:text-gold-300">
                      View case study
                      <Icon icon="solar:arrow-right-outline" width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>

        {visible.length === 0 && (
          <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
            <Icon icon="solar:magnifer-zoom-out-linear" width={40} height={40} className="mx-auto mb-3" />
            No projects match “{query}”.
          </div>
        )}
      </main>
    </div>
  );
}
