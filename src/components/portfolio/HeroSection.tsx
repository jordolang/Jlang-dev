"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
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
  { icon: "skill-icons:wordpress", label: "WordPress" },
  { icon: "vscode-icons:file-type-figma", label: "UI/UX Design" },
  { icon: "material-symbols:responsive-layout", label: "Responsive Design" },
  { icon: "mdi:web-check", label: "Web Accessibility" },
];

const DEFAULT_COPY_COMMAND = "curl https://jlang.dev/api/resume/launch.sh | bash";

export default function HeroSection({ content }: { content?: HeroContent }) {
  const name = content?.name || "Jordan Lang";
  const tagline = content?.tagline || "Creating beautiful, accessible websites that engage users and drive results";
  const logoLight = content?.logoLight || "/JLang-Development.png";
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
      "fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm max-w-md";
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const scrollToOverview = () => {
    document.getElementById("overview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-400/10 rounded-full blur-3xl" />

        {/* Geometric Accents (static) */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-blue-500/30 rounded-full" />
        <div className="absolute bottom-32 left-16 w-1 h-1 bg-purple-500/40 rounded-full" />
        <div className="absolute top-1/2 left-10 w-1.5 h-1.5 bg-pink-500/35 rounded-full" />
      </div>

      <section className="relative z-10 max-w-4xl mx-auto px-6 text-center -mb-8">
        {/* Logo Image — the LCP element. No animation delay so it paints first.
            Two variants toggled purely by the `.dark` CSS class (set before
            paint in layout.tsx). No React state, so the correct logo is in the
            SSR HTML, matches its preload, and is never swapped after hydration.
            The light variant carries `priority` because a fresh visit (no stored
            theme, e.g. Lighthouse) resolves to light, making it the preloaded
            LCP image. */}
        <div className="hero-reveal flex justify-center mb-6">
          <Image
            src={logoLight}
            alt="JLang Development"
            width={1254}
            height={1254}
            sizes="(max-width: 768px) 60vw, 260px"
            priority
            fetchPriority="high"
            className="w-full max-w-[260px] h-auto rounded-2xl shadow-lg dark:hidden"
          />
          <Image
            src={logoDark}
            alt="JLang Development"
            width={1254}
            height={1254}
            sizes="(max-width: 768px) 60vw, 260px"
            className="hidden w-full max-w-[260px] h-auto rounded-2xl shadow-lg dark:block"
          />
        </div>

        {/* Name */}
        <h1 className="hero-reveal text-5xl md:text-6xl font-bold mb-4" style={{ animationDelay: "0.05s" }}>
          <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent z-10">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium transition-transform duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20"
          >
            <Icon icon="material-symbols:terminal" width={20} height={20} />
            <span>Try My CLI Resume</span>
            <code className="text-xs bg-white/20 px-2 py-1 rounded font-mono">{resumeCommand}</code>
          </button>
        </div>

        {/* Social Links */}
        <div className="hero-reveal flex flex-wrap gap-3 justify-center mb-12" style={{ animationDelay: "0.2s" }}>
          {socials.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => trackEvent(AnalyticsEvents.SOCIAL_LINK_CLICKED, { platform: link.label })}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 backdrop-blur-sm rounded-full text-sm transition-transform duration-300 hover:scale-105 active:scale-95 border border-gray-300/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl ${link.color}`}
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
              className="flex items-center gap-2 px-3 py-2 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/30 transition-transform duration-300 hover:scale-105"
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
        className="hero-reveal hidden md:flex absolute bottom-20 left-0 right-0 justify-center pb-8 z-10"
        style={{ animationDelay: "0.35s" }}
      >
        <button
          onClick={scrollToOverview}
          className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <span className="text-sm font-medium tracking-wide">Scroll for more</span>
          <Icon icon="mdi:chevron-down" width={24} height={24} className="text-gray-400 dark:text-gray-500" />
        </button>
      </div>
    </div>
  );
}
