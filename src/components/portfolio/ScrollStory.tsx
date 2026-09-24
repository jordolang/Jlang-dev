"use client";

import { Icon } from "@iconify/react";
import {
  m,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Scroll-driven "how I work" story. The section is N viewports tall with a
// sticky full-screen stage; as you scroll, each chapter's video wipes up over
// the previous one (clip-path) while slowly settling from a zoom, and its copy
// slides in. Only the chapters actually on screen (at most two, mid-wipe) mount
// a video; the rest show their poster still.

interface Chapter {
  key: string;
  label: string;
  title: string;
  body: string;
  video: string;
  poster: string;
}

const CHAPTERS: Chapter[] = [
  {
    key: "discover",
    label: "Discover",
    title: "It starts with a conversation.",
    body: "Before a single pixel is placed, we map your goals, your customers and your competition, so the site is built around how your business actually earns.",
    video: "/media/story/discover.mp4",
    poster: "/media/story/discover.webp",
  },
  {
    key: "design",
    label: "Design",
    title: "Design that looks like your brand.",
    body: "Custom layouts, typography and motion, designed to earn trust at a glance and turn visitors into calls, bookings and sales on every screen size.",
    video: "/media/story/design.mp4",
    poster: "/media/story/design.webp",
  },
  {
    key: "build",
    label: "Build",
    title: "Engineered for speed.",
    body: "Hand-built with Next.js, React and modern tooling. Fast loads, clean code, accessible by default and ready for search engines from day one.",
    video: "/media/story/build.mp4",
    poster: "/media/story/build.webp",
  },
  {
    key: "launch",
    label: "Launch",
    title: "Launched on every device.",
    body: "Responsive from phone to widescreen and deployed on a global edge network, with analytics, SEO, domain and hosting handled for you.",
    video: "/media/story/launch.mp4",
    poster: "/media/story/launch.webp",
  },
  {
    key: "grow",
    label: "Grow",
    title: "Rooted in Zanesville. Serving nationwide.",
    body: "On-site support across Southeastern Ohio and remote clients coast to coast, with ongoing care so your site keeps growing alongside your business.",
    video: "/media/story/local.mp4",
    poster: "/media/story/local.webp",
  },
];

const N = CHAPTERS.length;
/** Fraction of a chapter's scroll span spent wiping into the next one. */
const WIPE = 0.45;

/**
 * Scroll offsets must stay inside [0, 1] and be non-decreasing: framer-motion
 * hands opacity ranges to a native ScrollTimeline, which rejects anything else.
 */
const range = (...stops: number[]) => {
  let prev = 0;
  return stops.map((v) => (prev = Math.max(prev, Math.min(1, Math.max(0, v)))));
};

function ChapterLayer({
  chapter,
  index,
  progress,
  live,
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number>;
  /** On screen and allowed to move: mount and play the video. */
  live: boolean;
}) {
  const start = index / N;
  const span = 1 / N;

  // Wipe in from the bottom over the tail of the previous chapter.
  const reveal = useTransform(
    progress,
    index === 0 ? [0, 1] : range(start - span * WIPE, start),
    index === 0 ? [0, 0] : [100, 0],
  );
  const clipPath = useMotionTemplate`inset(${reveal}% 0% 0% 0%)`;
  // Settle from a slight zoom as it arrives, then keep drifting in while it holds.
  const scale = useTransform(progress, range(start - span * WIPE, start + span), [1.18, 1]);
  // Copy: rise in once the wipe completes, fade out before the next wipe starts.
  const copyOpacity = useTransform(
    progress,
    range(start - span * 0.1, start + span * 0.15, start + span * (1 - WIPE), start + span * (1 - WIPE * 0.4)),
    index === 0 ? [1, 1, 1, 0] : index === N - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const copyY = useTransform(progress, range(start - span * 0.1, start + span * 0.15), index === 0 ? [0, 0] : [60, 0]);

  return (
    <m.div className="absolute inset-0" style={{ clipPath, zIndex: index }}>
      <m.div className="absolute inset-0" style={{ scale }}>
        {/* A chapter's <video> exists only while that chapter is on screen; the
            poster stands in otherwise. Chromium pauses muted, script-started
            videos once they're hidden (fully clipped counts) and drops their
            frame, so a long-lived element comes back black. Mounting fresh on
            each entrance always paints, and caps decoding at two videos. */}
        {live ? (
          <video
            className="h-full w-full object-cover"
            src={chapter.video}
            poster={chapter.poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={chapter.poster} alt="" className="h-full w-full object-cover" loading="lazy" />
        )}
      </m.div>

      {/* Legibility scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      <m.div
        className="absolute inset-x-0 bottom-0 px-6 pb-24 md:pb-28 md:px-12 lg:px-20"
        style={{ opacity: copyOpacity, y: copyY }}
      >
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-4">
            <span className="font-mono text-sm tracking-[0.3em] text-gold-300">
              {String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-gold-400 to-transparent" />
            <span className="text-sm uppercase tracking-[0.3em] text-silver-300">{chapter.label}</span>
          </div>
          <h3 className="mb-5 text-4xl font-bold leading-[1.05] text-white md:text-6xl">
            {chapter.title}
          </h3>
          <p className="max-w-xl text-base leading-relaxed text-silver-200 md:text-lg">{chapter.body}</p>

          {index === N - 1 && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 px-6 py-3 font-semibold text-black shadow-lg shadow-gold-500/20 transition-transform hover:scale-105 active:scale-95"
              >
                Start your project
                <Icon icon="solar:arrow-right-linear" width={18} height={18} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-silver-300/40 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                View packages
              </Link>
            </div>
          )}
        </div>
      </m.div>
    </m.div>
  );
}

export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  // [chapter fully revealed underneath, chapter wiping in over it (if any)].
  const [[base, wipingIn], setVisible] = useState<[number, number | null]>([0, null]);
  const [inView, setInView] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Switch the "active" chapter halfway through each wipe.
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N + WIPE * 0.5)));
    setActive(idx);
    // Which layers are actually visible: the one fully revealed underneath and,
    // during a wipe, the one sliding over it.
    const under = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    const over = under < N - 1 && v * N - under > 1 - WIPE ? under + 1 : null;
    setVisible((prev) => (prev[0] === under && prev[1] === over ? prev : [under, over]));
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const viewObs = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    viewObs.observe(el);
    return () => viewObs.disconnect();
  }, []);

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * (i + 0.2)) / N, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-label="How I work"
      className="dark relative bg-black"
      style={{ height: `${N * 100}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {CHAPTERS.map((chapter, i) => (
          <ChapterLayer
            key={chapter.key}
            chapter={chapter}
            index={i}
            progress={scrollYProgress}
            live={!reduceMotion && inView && (i === base || i === wipingIn)}
          />
        ))}

        {/* Section eyebrow */}
        <div className="pointer-events-none absolute left-6 top-24 z-20 md:left-12 lg:left-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-black/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold-200 backdrop-blur-md">
            <Icon icon="solar:routing-2-bold" width={14} height={14} />
            How I work
          </span>
        </div>

        {/* Chapter rail (desktop) */}
        <nav
          aria-label="Process chapters"
          className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-5 md:flex lg:right-12"
        >
          {CHAPTERS.map((chapter, i) => (
            <button
              key={chapter.key}
              onClick={() => jumpTo(i)}
              className="group flex items-center justify-end gap-3"
              aria-current={i === active ? "step" : undefined}
            >
              <span
                className={`text-xs uppercase tracking-[0.25em] transition-all duration-500 ${
                  i === active ? "text-gold-200 opacity-100" : "text-silver-400 opacity-0 group-hover:opacity-100"
                }`}
              >
                {chapter.label}
              </span>
              <span
                className={`block h-2 rounded-full transition-all duration-500 ${
                  i === active ? "w-8 bg-gold-400" : "w-2 bg-silver-400/60 group-hover:bg-silver-200"
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[2px] bg-white/10">
          <m.div
            className="h-full origin-left bg-gradient-to-r from-silver-300 via-gold-300 to-gold-500"
            style={{ scaleX: barScale }}
          />
        </div>
      </div>
    </section>
  );
}
