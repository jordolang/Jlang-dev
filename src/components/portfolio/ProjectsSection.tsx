"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { projects, type Project } from "@/lib/fallbackProjects";
import SectionHeader from "./SectionHeader";

export interface SectionHeading {
  tagText?: string;
  tagIcon?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
}

interface ProjectsSectionProps {
  /** Projects from Sanity. Falls back to the list above when the CMS has none. */
  projects?: Project[];
  heading?: SectionHeading;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function StatusBadge({ status }: { status: Project["status"] }) {
  const isLive = status === "Live";
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 backdrop-blur-sm ${
        isLive
          ? "bg-green-500/20 text-green-100 border border-green-400/40"
          : "bg-orange-500/20 text-orange-100 border border-orange-400/40"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-300" : "bg-orange-300"} animate-pulse`} />
      {status}
    </span>
  );
}

/**
 * Title link whose ::after overlay covers the whole card, so the card is clickable without
 * nesting the live-site/repository anchors inside another anchor. Anything interactive in the
 * card (action links, scrollable screenshots) sits above the overlay with `relative z-10`.
 */
function CaseStudyLink({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() => trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: project.title })}
      className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-indigo-500"
    >
      {project.title}
    </Link>
  );
}

function ProjectLinks({ project, light = false }: { project: Project; light?: boolean }) {
  const primaryClass = light
    ? "bg-white text-gray-900 hover:bg-gray-100"
    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90";
  const secondaryClass = light
    ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700";

  return (
    <div className="relative z-10 flex flex-wrap items-center gap-3">
      {project.live && (
        <Link
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(AnalyticsEvents.PROJECT_LINK_CLICKED, { destination: "demo", project: project.title })}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 active:scale-95 ${primaryClass}`}
        >
          <Icon icon="solar:arrow-right-up-linear" width={18} height={18} />
          <span>View Live Site</span>
        </Link>
      )}
      {project.github && (
        <Link
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(AnalyticsEvents.PROJECT_LINK_CLICKED, { destination: "github", project: project.title })}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 active:scale-95 ${secondaryClass}`}
        >
          <Icon icon="solar:code-bold" width={18} height={18} />
          <span>Repository</span>
        </Link>
      )}
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <m.div variants={itemVariants} className="group">
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-xl overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-2xl">
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          {/* Left: details, laid out top to bottom */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
                <Icon icon="solar:star-bold" width={13} height={13} />
                {project.highlight}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {project.timeline}
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
              <CaseStudyLink project={project} />
            </h3>
            <p className="text-lg md:text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-4">
              {project.subtitle}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                Key Features
              </h4>
              <ul className="space-y-2.5">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300">
                    <Icon icon="solar:check-circle-bold" className="text-green-500 mt-0.5 flex-shrink-0 w-5 h-5" />
                    <span className="text-sm md:text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <ProjectLinks project={project} />
            </div>
          </div>

          {/* Right: full top-to-bottom site screenshot */}
          <div className="relative bg-gray-100 dark:bg-gray-950 border-t lg:border-t-0 lg:border-l border-gray-200/60 dark:border-gray-800">
            <div className="relative z-10 h-[420px] sm:h-[560px] lg:h-full lg:max-h-[860px] overflow-y-auto">
              <Image
                src={project.image}
                alt={`${project.title} – full page screenshot`}
                width={project.imageWidth ?? 1280}
                height={project.imageHeight ?? 7101}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-[11px] font-medium backdrop-blur-sm flex items-center gap-1.5">
              <Icon icon="solar:mouse-bold" width={12} height={12} />
              Scroll to explore full page
            </span>
          </div>
        </div>
      </div>
    </m.div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const isMobile = project.group === "mobile";
  const isFullPagePreview = project.fullPagePreview === true;

  return (
    <m.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
      {/* Screenshot — portrait & fully visible for mobile apps, wide crop for web */}
      <div
        className={`relative ${
          isMobile
            ? "aspect-[9/16] overflow-hidden bg-gray-900"
            : isFullPagePreview
              ? "z-10 aspect-[16/10] overflow-y-auto bg-gray-100 dark:bg-gray-800"
              : "aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800"
        }`}
      >
        {isFullPagePreview ? (
          <Image
            src={project.image}
            alt={`${project.title} – full page screenshot`}
            width={project.imageWidth ?? 1440}
            height={project.imageHeight ?? 12000}
            className="h-auto w-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <Image
            src={project.image}
            alt={`${project.title} app screenshot`}
            fill
            className={
              isMobile
                ? "object-contain"
                : "object-cover object-top transition-transform duration-500 group-hover:scale-105"
            }
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <StatusBadge status={project.status} />
        </div>
        <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${project.gradient}`} />
        {isFullPagePreview && (
          <span className="pointer-events-none sticky bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <Icon icon="solar:mouse-bold" width={12} height={12} />
            Scroll to explore full page
          </span>
        )}
      </div>

      {/* Body: title + brief overview */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {project.category}
          </span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">{project.timeline}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
          <CaseStudyLink project={project} />
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
          {project.subtitle}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-[11px] font-medium border border-gray-200 dark:border-gray-700"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-0.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <ProjectLinks project={project} />
        </div>
      </div>
    </m.div>
  );
}

/**
 * Mobile app card — a large full portrait screenshot fills the top (the majority
 * of the card), with the project name and a brief, space-saving info block below.
 */
function MobileProjectCard({ project }: { project: Project }) {
  return (
    <m.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-gray-300 hover:shadow-2xl dark:border-gray-700/40 dark:bg-gray-900/80 dark:hover:border-gray-600"
      >
      {/* Full portrait screenshot — the visual majority of the card */}
      <div className="relative aspect-[9/16] overflow-hidden bg-zinc-950">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} mobile app screenshot`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br ${project.gradient} px-5 text-center text-white`}
          >
            <Icon icon="solar:smartphone-2-bold" width={52} height={52} className="opacity-90" />
            <span className="text-xl font-bold leading-tight">{project.title}</span>
            <span className="rounded-full bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm">
              In Development
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <StatusBadge status={project.status} />
        </div>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          <Icon icon="solar:smartphone-2-bold" width={11} height={11} />
          {project.highlight}
        </span>
        <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${project.gradient}`} />
      </div>

      {/* Brief info below — name + main points only */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
          <CaseStudyLink project={project} />
        </h3>
        <p className="mt-0.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {project.subtitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2 dark:text-gray-300">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <ProjectLinks project={project} />
        </div>
      </div>
    </m.div>
  );
}

/**
 * "View N screenshots" button plus a native <dialog> lightbox. The dialog gives
 * focus trapping, Esc-to-close and the backdrop for free; arrow keys and the
 * prev/next buttons step through the set.
 */
function ScreenshotGallery({ project }: { project: Project }) {
  const shots = project.gallery ?? [];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  if (!shots.length) return null;

  const step = (delta: number) => setIndex((i) => (i + delta + shots.length) % shots.length);
  const shot = shots[index];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          dialogRef.current?.showModal();
          trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: project.title, action: "gallery" });
        }}
        className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-700 transition-all duration-300 hover:bg-indigo-500/20 active:scale-95 dark:text-indigo-300"
      >
        <Icon icon="solar:gallery-wide-bold" width={18} height={18} />
        View {shots.length} screenshots
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`${project.title} screenshots`}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto w-[min(1200px,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-2xl bg-gray-950 p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="truncate text-sm font-semibold">
            {project.title}
            <span className="ml-2 font-normal text-gray-400">
              {index + 1} / {shots.length}
            </span>
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close screenshots"
            className="rounded-lg p-1.5 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Icon icon="solar:close-circle-bold" width={24} height={24} />
          </button>
        </div>
        <div className="relative aspect-[16/10] w-full bg-black">
          <Image key={shot.src} src={shot.src} alt={shot.caption} fill className="object-contain" sizes="(max-width: 1200px) 100vw, 1200px" />
          {shots.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous screenshot"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm hover:bg-black/80"
              >
                <Icon icon="solar:alt-arrow-left-linear" width={24} height={24} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next screenshot"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm hover:bg-black/80"
              >
                <Icon icon="solar:alt-arrow-right-linear" width={24} height={24} />
              </button>
            </>
          )}
        </div>
        <p className="px-4 py-3 text-center text-sm text-gray-300">{shot.caption}</p>
        <div className="flex gap-2 overflow-x-auto px-4 pb-4">
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}: ${s.caption}`}
              aria-current={i === index}
              className={`relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition ${
                i === index ? "border-indigo-400" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={s.src} alt="" fill className="object-cover object-top" sizes="96px" />
            </button>
          ))}
        </div>
      </dialog>
    </>
  );
}

/**
 * Desktop app card — the app's own window fills the top of the card, framed by a
 * title bar so a screenshot of a native window reads as one rather than as a web
 * page. These ship as installers, so there is usually no live URL to link.
 */
function DesktopAppCard({ project }: { project: Project }) {
  return (
    <m.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-gray-300 hover:shadow-2xl dark:border-gray-700/40 dark:bg-gray-900/80 dark:hover:border-gray-600"
      >
      {/* Window chrome + the app's own screenshot */}
      <div className="relative bg-gray-200 dark:bg-gray-800">
        <div className="flex items-center gap-1.5 border-b border-gray-300/70 px-3 py-2 dark:border-gray-700">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-2 truncate text-[11px] font-medium text-gray-500 dark:text-gray-400">
            {project.title}
          </span>
        </div>
        {/* object-contain, not cover: a cropped desktop window loses the layout that
            makes it recognisable as an application rather than a web page. */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Image
            src={project.image}
            alt={`${project.title} desktop application screenshot`}
            fill
            className="object-contain object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <StatusBadge status={project.status} />
          </div>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            <Icon icon="solar:monitor-bold" width={11} height={11} />
            {project.highlight}
          </span>
        </div>
        <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${project.gradient}`} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
          <CaseStudyLink project={project} />
        </h3>
        <p className="mt-0.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">{project.subtitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3 dark:text-gray-300">
          {project.description}
        </p>

        <ul className="mt-3 space-y-1.5">
          {project.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Icon icon="solar:check-circle-bold" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" />
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto space-y-3 pt-4">
          <ScreenshotGallery project={project} />
          <ProjectLinks project={project} />
        </div>
      </div>
    </m.div>
  );
}

export default function ProjectsSection({ projects: cmsProjects, heading }: ProjectsSectionProps) {
  const allProjects = cmsProjects?.length ? cmsProjects : projects;
  const desktopProjects = allProjects.filter(
    (project) => project.group !== "mobile" && project.group !== "desktopApp",
  );
  const mobileProjects = allProjects.filter((project) => project.group === "mobile");
  const desktopApps = allProjects.filter((project) => project.group === "desktopApp");
  // Every project flagged featured gets the hero slot; with none flagged, the first one does.
  const flagged = desktopProjects.filter((project) => project.featured);
  const featured = flagged.length ? flagged : desktopProjects.slice(0, 1);
  const desktopRest = desktopProjects.filter((project) => !featured.includes(project));

  return (
    <m.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}
      className="mb-16 md:mb-24 lg:mb-32 relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-5 md:top-20 right-2 md:right-16 w-12 sm:w-16 md:w-32 h-12 sm:h-16 md:h-32 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl md:blur-3xl" />
        <div className="absolute bottom-5 md:bottom-20 left-2 md:left-16 w-16 sm:w-20 md:w-40 h-16 sm:h-20 md:h-40 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-xl md:blur-2xl" />
      </div>

      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10"
      >
        <SectionHeader
          tagText={heading?.tagText ?? "Portfolio Showcase"}
          tagIcon={heading?.tagIcon ?? "solar:code-square-bold"}
          heading={heading?.heading ?? "Featured Projects"}
          description={
            heading?.description ??
            "Explore my web design portfolio featuring modern, responsive websites and digital solutions for diverse industries"
          }
          showUnderline={true}
          centered={true}
        />

        <div className="max-w-7xl mx-auto px-3 md:px-4">
          {/* Featured projects */}
          <div className="space-y-8 md:space-y-12">
            {featured.map((project) => (
              <FeaturedProject key={project.slug} project={project} />
            ))}
          </div>

          {/* Desktop Web Apps — 3 across */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-12 md:mt-16 mb-6 md:mb-8">
            Desktop Web Apps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {desktopRest.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>

          {/* Mobile Applications — iPhone mockups stacked vertically */}
          {mobileProjects.length > 0 && (
            <>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-12 md:mt-16 mb-6 md:mb-8">
                Mobile Applications (iOS &amp; Android)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mobileProjects.map((project) => (
                  <MobileProjectCard key={project.title} project={project} />
                ))}
              </div>
            </>
          )}

          {/* Desktop Applications — native apps that ship as installers */}
          {desktopApps.length > 0 && (
            <>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-12 md:mt-16 mb-6 md:mb-8">
                Programs (Windows &amp; macOS)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {desktopApps.map((project) => (
                  <DesktopAppCard key={project.title} project={project} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Call to Action */}
        <m.div variants={itemVariants} className="text-center mt-12 md:mt-16 lg:mt-20 px-4 mb-12">
          <Link href="#contact">
            <m.div
              className="inline-flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 dark:border-purple-500/20 rounded-xl md:rounded-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <Icon icon="solar:programming-bold" className="text-blue-500 dark:text-purple-400 w-5 h-5 md:w-6 md:h-6" />
              <span className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base text-center">
                {heading?.ctaText ?? "Interested in working together? Let's create something amazing!"}
              </span>
            </m.div>
          </Link>
        </m.div>
      </m.div>
    </m.section>
  );
}
