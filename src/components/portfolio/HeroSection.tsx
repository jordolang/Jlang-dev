"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import TypewriterRole from "./TypewriterRole";

// Above-the-fold hero. Entrance animation is pure CSS (`hero-reveal`) so it
// paints immediately instead of waiting for framer-motion to hydrate — the fix
// that keeps FCP/LCP fast. Hover/tap feedback uses Tailwind transforms, so this
// component ships no framer-motion JS on the critical path.
export interface HeroContent {
  name?: string;
  tagline?: string;
  logoLight?: string | null;
  logoDark?: string | null;
  typewriterRoles?: string[];
  availabilityBanner?: string;
  resumeCommand?: string;
  resumeCopyCommand?: string;
  socials?: { label: string; href: string; icon: string; color: string }[];
  skillsPreview?: { label: string; icon: string }[];
}

const DEFAULT_SOCIALS = [
  { href: "https://facebook.com/jordolang", icon: "simple-icons:facebook", label: "Facebook", color: "hover:text-blue-600" },
  { href: "https://x.com/jordolang", icon: "simple-icons:x", label: "X (Twitter)", color: "hover:text-gray-900 dark:hover:text-white" },
  { href: "https://linkedin.com/in/jordolang", icon: "simple-icons:linkedin", label: "LinkedIn", color: "hover:text-blue-700" },
  { href: "https://github.com/jordolang", icon: "simple-icons:github", label: "GitHub", color: "hover:text-gray-900 dark:hover:text-white" },
  { href: "mailto:jordan@jlang.dev", icon: "material-icon-theme:email", label: "Email", color: "hover:text-green-600" },
];

const DEFAULT_SKILLS = [
  { icon: "skill-icons:html", label: "HTML/CSS" },
  { icon: "skill-icons:nextjs-dark", label: "Next.js" },
  { icon: "logos:figma", label: "UI/UX Design" },
  { icon: "material-symbols:responsive-layout", label: "Responsive Design" },
  { icon: "mdi:web-check", label: "Web Accessibility" },
];

const DEFAULT_COPY_COMMAND = "curl https://jlang.dev/api/resume/launch.sh | bash";

export default function HeroSection({ content }: { content?: HeroContent }) {
  const name = content?.name || "Jordan Lang";
  const tagline = content?.tagline || "Creating beautiful, accessible websites that engage users and drive results";
  const logoDark = content?.logoDark || "/JLang-Development-Black.png";
  const availability = content?.availabilityBanner || "Available for contract web design & App Development & Various IT projects";
  const resumeCommand = content?.resumeCommand || "curl jlang.dev/resume | bash";
  const resumeCopyCommand = content?.resumeCopyCommand || DEFAULT_COPY_COMMAND;
  const socials = content?.socials?.length ? content.socials : DEFAULT_SOCIALS;
  const skills = content?.skillsPreview?.length ? content.skillsPreview : DEFAULT_SKILLS;

  const copyResumeCommand = () => {
    navigator.clipboard.writeText(resumeCopyCommand);
    const notification = document.createElement("div");
    notification.textContent = `Command copied to clipboard: ${resumeCopyCommand}`;
    notification.className =
      "fixed top-4 right-4 bg-neutral-900 border border-gold-400/40 text-gold-100 px-4 py-2 rounded-lg shadow-lg z-50 text-sm max-w-md";
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const scrollToStory = () => {
    document.getElementById("process")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Background loop: the poster <Image> paints first (it's the LCP candidate);
  // the video fades in over it once it is actually playing. Reduced-motion
  // visitors never get it: every <source> is gated on the media query, so the
  // browser selects no file and downloads nothing, with no hydration race.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    // `dark` scopes the hero to its dark styling in both themes: it always sits on the video.
    <div className="dark relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Cinematic background */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/media/hero/hero-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <Image
          src="/media/hero/hero-poster-mobile.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setVideoReady(true)}
        >
          <source
            src="/media/hero/hero-mobile.mp4"
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference) and (max-width: 767px)"
          />
          <source
            src="/media/hero/hero-desktop.mp4"
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference)"
          />
        </video>
        {/* Scrims keep the copy legible over any frame */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.65)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 md:pt-20 md:pb-10 text-center">
        {/* Logo — the hero is always dark (it sits on the video), so only the
            dark-background variant is needed and it can be preloaded directly. */}
        <div className="hero-reveal flex justify-center mb-6">
          <Image
            src={logoDark}
            alt="JLang Development"
            width={1254}
            height={1254}
            sizes="(max-width: 768px) 50vw, 220px"
            priority
            fetchPriority="high"
            className="w-full max-w-[200px] md:max-w-[220px] h-auto rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-gold-400/20"
          />
        </div>

        {/* Name */}
        <h1 className="hero-reveal text-5xl md:text-6xl font-bold mb-4" style={{ animationDelay: "0.05s" }}>
          <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-silver-200 dark:to-gold-200 bg-clip-text text-transparent z-10">
            {name}
          </span>
        </h1>

        {/* Typewriter Role Component */}
        <TypewriterRole roles={content?.typewriterRoles} />

        {/* Tagline */}
        <p
          className="hero-reveal text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{ animationDelay: "0.1s" }}
        >
          {tagline}
        </p>

        {/* CLI Resume Button */}
        <div className="hero-reveal flex justify-center mb-8" style={{ animationDelay: "0.15s" }}>
          <button
            onClick={copyResumeCommand}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black rounded-full font-semibold transition-transform duration-300 shadow-lg shadow-gold-500/25 hover:shadow-xl hover:scale-105 active:scale-95 border border-gold-200/40"
          >
            <Icon icon="material-symbols:terminal" width={20} height={20} />
            <span>Try My CLI Resume</span>
            <code className="text-xs bg-black/15 px-2 py-1 rounded font-mono">{resumeCommand}</code>
          </button>
        </div>

        {/* Social Links */}
        <div className="hero-reveal flex flex-wrap gap-3 justify-center mb-12" style={{ animationDelay: "0.2s" }}>
          {socials.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => trackEvent(AnalyticsEvents.SOCIAL_LINK_CLICKED, { platform: link.label })}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-silver-100 backdrop-blur-md rounded-full text-sm transition-transform duration-300 hover:scale-105 active:scale-95 border border-white/15 hover:border-gold-300/50 ${link.color}`}
            >
              <Icon icon={link.icon} width={18} height={18} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Skills Preview */}
        <div className="hero-reveal flex flex-wrap justify-center gap-3 mb-10" style={{ animationDelay: "0.25s" }}>
          {skills.map((skill) => (
            <div
              key={skill.label}
              className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-md rounded-lg border border-white/10 transition-transform duration-300 hover:scale-105"
            >
              <Icon icon={skill.icon} width={16} height={16} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{skill.label}</span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div
          className="hero-reveal inline-flex items-center gap-2 px-4 py-2 bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-full backdrop-blur-sm"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <Link href="#contact">
            <span className="text-green-700 dark:text-green-300 text-sm font-medium">
              {availability}
            </span>
          </Link>
        </div>
      </section>

      {/* Scroll for more indicator */}
      <div
        className="hero-reveal hidden md:flex [@media(max-height:900px)]:!hidden absolute bottom-6 left-0 right-0 justify-center z-10"
        style={{ animationDelay: "0.35s" }}
      >
        <button
          onClick={scrollToStory}
          className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <span className="text-sm font-medium tracking-wide">Scroll for more</span>
          <Icon icon="mdi:chevron-down" width={24} height={24} className="text-gray-400 dark:text-gray-500" />
        </button>
      </div>
    </div>
  );
}
