import { stegaClean } from "@sanity/client/stega";

/**
 * Résumé content model and the bundled defaults the /resume page falls back to when
 * Studio has no Résumé document (or leaves a field empty).
 */

export interface ResumeCredential {
  title: string;
  issuer: string;
  issued?: string;
  expires?: string;
  credentialId?: string;
  url?: string;
  image?: string;
  file?: string;
}

export interface ResumeRole {
  role: string;
  company: string;
  period: string;
  type?: string;
  website?: string;
  description: string;
  highlights: string[];
  technologies?: string[];
}

export interface ResumeProject {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  status: "Live" | "In Development";
  timeline: string;
  image: string;
  gradient: string;
  tech: string[];
  live: string;
}

export interface ResumeContent {
  name: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  phone?: string;
  website: string;
  photo?: string;
  links: { label: string; href: string; icon: string }[];
  stats: { value: string; label: string }[];
  currentRole: ResumeRole;
  experience: ResumeRole[];
  credentials: ResumeCredential[];
  skillGroups: { title: string; skills: string[] }[];
  education: { school: string; program?: string; period?: string }[];
  projects: ResumeProject[];
}

export const DEFAULT_RESUME: Omit<ResumeContent, "experience" | "projects"> = {
  name: "Jordan Lang",
  headline: "Web Developer & IT Specialist",
  summary:
    "Independent developer from Zanesville, Ohio who designs, builds and runs software for small businesses: marketing sites and online stores, web apps, macOS and Windows tools, and self-order kiosks. I own every step myself, from brand and UX through code, hosting, payments and the support calls after launch.",
  location: "Zanesville, OH",
  email: "jordan@jlang.dev",
  website: "jlang.dev",
  photo: "/images/jordan-lang.webp",
  links: [
    { label: "jlang.dev", href: "https://jlang.dev", icon: "solar:global-bold" },
    { label: "GitHub", href: "https://github.com/jordolang", icon: "simple-icons:github" },
    { label: "LinkedIn", href: "https://linkedin.com/in/jordolang", icon: "simple-icons:linkedin" },
  ],
  stats: [
    { value: "2015", label: "Building for clients since" },
    { value: "25+", label: "Websites shipped" },
    { value: "50+", label: "Tech clients served" },
  ],
  currentRole: {
    role: "Founder & Lead Developer",
    company: "JLang Development",
    period: "2015 — Present",
    type: "Self-employed",
    website: "https://jlang.dev",
    description:
      "Run a one-person studio that takes small businesses from idea to a working product, then keeps it running with hosting, content management and on-site IT support.",
    highlights: [
      "Designed and launched sites and stores for Ohio businesses including The Leather Outlet, Black Label Barbecue and Muskingum Materials.",
      "Built a macOS admin app and a self-order kiosk for Jose Madrid Salsa, alongside its website.",
      "Shipped desktop lead-generation tools, Local Lead Scraper Pro and FestivalNet Scraper.",
      "Run jlang.dev itself: a Sanity-managed portfolio with a services order flow, digital product store and private client portal.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Sanity", "Stripe", "Vercel"],
  },
  credentials: [],
  skillGroups: [
    { title: "Frontend", skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5 / CSS3"] },
    { title: "Backend & data", skills: ["Node.js", "Prisma", "PostgreSQL", "Sanity CMS", "Stripe", "WebSockets"] },
    { title: "Apps & desktop", skills: ["React Native", "Expo", "Swift", "Python", "Qt", "Kiosk systems"] },
    { title: "Design", skills: ["UI/UX", "Figma", "Photoshop", "Illustrator", "Brand identity"] },
    { title: "Ops & IT", skills: ["Vercel", "Docker", "Self-hosting", "Domains & DNS", "On-site IT support"] },
  ],
  education: [],
};

/** "2026-03-01" → "Mar 2026". Leaves anything that isn't an ISO date as written. */
export function formatCredentialDate(value?: string): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return value;
  const month = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)).toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  return `${month} ${match[1]}`;
}

/**
 * Projects for the résumé when Studio doesn't pick them: the newest work (dated this year or
 * marked ongoing), in display order, falling back to the first few projects.
 */
export function pickRecentProjects<T extends { timeline?: string }>(projects: T[], limit = 8, year = new Date().getFullYear()): T[] {
  const recent = projects.filter((project) => {
    const timeline = stegaClean(project.timeline ?? "");
    return timeline.includes(String(year)) || /ongoing/i.test(timeline);
  });
  return (recent.length ? recent : projects).slice(0, limit);
}

/** Same company, ignoring case, spacing and the invisible edit markers added in Studio previews. */
export function sameCompany(a: string, b: string): boolean {
  return stegaClean(a).trim().toLowerCase() === stegaClean(b).trim().toLowerCase();
}

/** Non-empty CMS values win; empty strings and empty arrays fall through to the default. */
export function pick<T>(value: T | null | undefined, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}
