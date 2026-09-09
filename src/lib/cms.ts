import "server-only";

import { draftMode } from "next/headers";
import { getSanityClient, sanityIsConfigured } from "@/sanity/lib/client";
import { dimensionsForImage, urlForImage, type SanityImageRef } from "@/sanity/lib/image";

/**
 * Server-side content layer.
 *
 * Every getter returns `null` (or an empty array) when Sanity is unconfigured, unreachable, or simply
 * has no content for that section. Callers fall back to the content bundled in the components, so an
 * empty CMS can never blank out the live site.
 */

const IMAGE_PROJECTION = `{ asset->{ _id, url, metadata { dimensions } } }`;

/**
 * `draftMode()` throws outside a request scope (sitemap, robots, build-time metadata). Those are
 * never previews, so treat the absence of a request as "not a draft" instead of failing the query.
 */
export async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

async function query<T>(groq: string, tags: string[], params: Record<string, unknown> = {}): Promise<T | null> {
  if (!sanityIsConfigured) return null;
  const draft = await isDraftMode();
  try {
    // Previews must never be served from the ISR cache, or the editor edits and sees nothing change.
    return await getSanityClient(draft).fetch<T>(
      groq,
      params,
      draft ? { cache: "no-store" } : { next: { revalidate: 60, tags } },
    );
  } catch (error) {
    console.error(`[cms] query failed (${tags.join(",")}):`, error);
    return null;
  }
}

/** Empty arrays mean "nothing in the CMS" — treat that the same as unconfigured so the fallback wins. */
function orNull<T>(items: T[] | null): T[] | null {
  return items && items.length > 0 ? items : null;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export interface CmsProject {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  deliverables: string[];
  tech: string[];
  github: string;
  live: string;
  gradient: string;
  status: "Live" | "In Development";
  category: string;
  highlight: string;
  timeline: string;
  clientType: string;
  group?: "desktop" | "mobile";
  fullPagePreview?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  featured?: boolean;
}

interface RawProject extends Omit<CmsProject, "image" | "imageWidth" | "imageHeight"> {
  image: SanityImageRef | null;
}

export async function getProjects(): Promise<CmsProject[] | null> {
  const raw = await query<RawProject[]>(
    `*[_type == "project"] | order(order asc, _createdAt asc) {
      title, subtitle, description, features, deliverables, tech, github, live,
      gradient, status, category, highlight, timeline, clientType, group,
      fullPagePreview, featured,
      image ${IMAGE_PROJECTION}
    }`,
    ["projects"],
  );
  if (!raw?.length) return null;

  const projects = raw.map((project) => {
    const dims = dimensionsForImage(project.image);
    return {
      ...project,
      image: urlForImage(project.image) ?? "",
      features: project.features ?? [],
      deliverables: project.deliverables ?? [],
      tech: project.tech ?? [],
      github: project.github ?? "",
      live: project.live ?? "",
      imageWidth: dims?.width,
      imageHeight: dims?.height,
    };
  });

  // The section renders the first project as the big hero card, so hoist the featured one.
  const featuredIndex = projects.findIndex((project) => project.featured && project.group !== "mobile");
  if (featuredIndex > 0) {
    const [featured] = projects.splice(featuredIndex, 1);
    projects.unshift(featured);
  }
  return projects;
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export interface CmsExperience {
  role: string;
  company: string;
  period: string;
  type: string;
  companyColor: string;
  companyIcon: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export async function getExperience(): Promise<CmsExperience[] | null> {
  return orNull(
    await query<CmsExperience[]>(
      `*[_type == "experience"] | order(order asc, _createdAt asc) {
        role, company, period, type, companyColor, companyIcon, description,
        "achievements": coalesce(achievements, []),
        "technologies": coalesce(technologies, [])
      }`,
      ["experience"],
    ),
  );
}

// ---------------------------------------------------------------------------
// Tech stack — flat in Sanity, grouped by category for the UI
// ---------------------------------------------------------------------------

export interface CmsTechItem {
  name: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Expert";
  category: string;
  description: string;
  yearsUsed?: number;
}

export async function getTechStack(): Promise<Record<string, CmsTechItem[]> | null> {
  const items = await query<CmsTechItem[]>(
    `*[_type == "techItem"] | order(order asc, name asc) {
      name, icon, level, category, description, yearsUsed
    }`,
    ["techStack"],
  );
  if (!items?.length) return null;

  return items.reduce<Record<string, CmsTechItem[]>>((grouped, item) => {
    (grouped[item.category] ??= []).push(item);
    return grouped;
  }, {});
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

export interface CmsCertification {
  title: string;
  provider: string;
  platform: string;
  issued: string;
  credentialId: string;
  skills: string[];
  providerIcon: string;
  platformIcon: string;
  color: string;
  certificatePreview: string;
  providerIconSize: number;
  platformIconSize: number;
}

interface RawCertification extends Omit<CmsCertification, "certificatePreview"> {
  certificatePreview: SanityImageRef | null;
}

export async function getCertifications(): Promise<CmsCertification[] | null> {
  const raw = await query<RawCertification[]>(
    `*[_type == "certification"] | order(order asc, _createdAt asc) {
      title, provider, platform, issued, credentialId, providerIcon, platformIcon,
      color, providerIconSize, platformIconSize,
      "skills": coalesce(skills, []),
      certificatePreview ${IMAGE_PROJECTION}
    }`,
    ["certifications"],
  );
  if (!raw?.length) return null;

  return raw.map((cert) => ({ ...cert, certificatePreview: urlForImage(cert.certificatePreview) ?? "" }));
}

// ---------------------------------------------------------------------------
// Services: packages, add-on features, FAQs
// ---------------------------------------------------------------------------

export interface CmsAddonFeature {
  name: string;
  desc: string;
  price: number;
  icon: string;
}

export interface CmsServicePackage {
  name: string;
  slug: string;
  description: string;
  price: string;
  basePrice: number | null;
  promoPrice: string | null;
  promoBasePrice: number | null;
  gradient: string;
  highlights: string[];
  /** Flattened for the UI, which uses "" as a spacer and an emoji-led line as a category header. */
  features: string[];
  addons: { label: string; price?: number; feature?: string }[];
  addonsNote?: string;
  popular: boolean;
}

interface RawServicePackage extends Omit<CmsServicePackage, "slug" | "features" | "addons"> {
  slug: { current: string };
  featureGroups: { category: string; items: string[] }[] | null;
  addons: { label: string; price?: number; feature?: { name: string } | null }[] | null;
}

/** Rebuild the flat feature list the UI expects: a category header, its items, then a blank spacer. */
function flattenFeatureGroups(groups: RawServicePackage["featureGroups"]): string[] {
  if (!groups?.length) return [];
  const flat: string[] = [];
  groups.forEach((group, index) => {
    if (group.category) flat.push(group.category);
    flat.push(...(group.items ?? []));
    if (index < groups.length - 1) flat.push("");
  });
  return flat;
}

export async function getServicePackages(): Promise<CmsServicePackage[] | null> {
  const raw = await query<RawServicePackage[]>(
    `*[_type == "servicePackage"] | order(order asc, _createdAt asc) {
      name, slug, description, price, basePrice, promoPrice, promoBasePrice, gradient,
      addonsNote, popular,
      "highlights": coalesce(highlights, []),
      featureGroups[] { category, items },
      addons[] { label, price, "feature": feature->{ name } }
    }`,
    ["servicePackages"],
  );
  if (!raw?.length) return null;

  return raw.map((pkg) => ({
    ...pkg,
    slug: pkg.slug?.current ?? "",
    features: flattenFeatureGroups(pkg.featureGroups),
    addons: (pkg.addons ?? []).map(({ label, price, feature }) => ({
      label,
      price,
      feature: feature?.name,
    })),
  }));
}

export async function getAddonFeatures(): Promise<CmsAddonFeature[] | null> {
  return orNull(
    await query<CmsAddonFeature[]>(
      `*[_type == "addonFeature"] | order(order asc, name asc) { name, desc, price, icon }`,
      ["addonFeatures"],
    ),
  );
}

export interface CmsFaq {
  question: string;
  answer: string;
}

export async function getFaqs(): Promise<CmsFaq[] | null> {
  return orNull(
    await query<CmsFaq[]>(`*[_type == "faq"] | order(order asc, _createdAt asc) { question, answer }`, ["faqs"]),
  );
}

// ---------------------------------------------------------------------------
// Section headings
// ---------------------------------------------------------------------------

export interface CmsSectionHeading {
  sectionId: string;
  tagText?: string;
  tagIcon?: string;
  heading: string;
  description?: string;
  ctaText?: string;
}

export type CmsSectionHeadings = Record<string, CmsSectionHeading>;

export async function getSectionHeadings(): Promise<CmsSectionHeadings | null> {
  const sections = await query<CmsSectionHeading[]>(
    `*[_type == "sectionContent"] { sectionId, tagText, tagIcon, heading, description, ctaText }`,
    ["sections"],
  );
  if (!sections?.length) return null;

  return Object.fromEntries(sections.map((section) => [section.sectionId, section]));
}

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

export interface CmsSiteSettings {
  name: string;
  logoLight: string | null;
  logoDark: string | null;
  tagline: string;
  typewriterRoles: string[];
  availabilityBanner: string;
  skillsPreview: { label: string; icon: string }[];
  resumeCommand: string;
  resumeCopyCommand: string;
  email: string;
  publicEmail: string;
  location: string;
  website: string;
  socials: { label: string; href: string; icon: string; color: string }[];
  navItems: { label: string; href: string }[];
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
}

interface RawSiteSettings extends Omit<CmsSiteSettings, "logoLight" | "logoDark" | "ogImage"> {
  logoLight: SanityImageRef | null;
  logoDark: SanityImageRef | null;
  ogImage: SanityImageRef | null;
}

export async function getSiteSettings(): Promise<CmsSiteSettings | null> {
  const raw = await query<RawSiteSettings | null>(
    `*[_type == "siteSettings"][0] {
      name, tagline, availabilityBanner, resumeCommand, resumeCopyCommand,
      email, publicEmail, location, website, footerText,
      seoTitle, seoDescription, ogTitle, ogDescription,
      "typewriterRoles": coalesce(typewriterRoles, []),
      "seoKeywords": coalesce(seoKeywords, []),
      "skillsPreview": coalesce(skillsPreview[]{ label, icon }, []),
      "socials": coalesce(socials[]{ label, href, icon, color }, []),
      "navItems": coalesce(navItems[]{ label, href }, []),
      logoLight ${IMAGE_PROJECTION},
      logoDark ${IMAGE_PROJECTION},
      ogImage ${IMAGE_PROJECTION}
    }`,
    ["siteSettings"],
  );
  if (!raw) return null;

  return {
    ...raw,
    logoLight: urlForImage(raw.logoLight),
    logoDark: urlForImage(raw.logoDark),
    ogImage: urlForImage(raw.ogImage),
  };
}

export interface CmsAboutContent {
  greeting: string;
  role: string;
  age: string;
  yearsExperience: string;
  bio: string[];
  coreCompetencies: string[];
  coreCompetenciesLabel: string;
  emergingSectors: string[];
  emergingSectorsLabel: string;
  achievements: { text: string; icon: string; color: string }[];
  availability: string[];
  currentRole: { title: string; subtitle: string; period: string; description: string; badge: string } | null;
  stats: { yearsExperience: string; websitesCreated: string; clientSatisfaction: string } | null;
}

export async function getAboutContent(): Promise<CmsAboutContent | null> {
  return query<CmsAboutContent | null>(
    `*[_type == "aboutContent"][0] {
      greeting, role, age, yearsExperience, coreCompetenciesLabel, emergingSectorsLabel,
      "bio": coalesce(bio, []),
      "coreCompetencies": coalesce(coreCompetencies, []),
      "emergingSectors": coalesce(emergingSectors, []),
      "achievements": coalesce(achievements[]{ text, icon, color }, []),
      "availability": coalesce(availability, []),
      currentRole { title, subtitle, period, description, badge },
      stats { yearsExperience, websitesCreated, clientSatisfaction }
    }`,
    ["aboutContent"],
  );
}

export interface CmsPromoContent {
  eyebrow: string;
  headline: string;
  subhead: string;
  attributionOffer: string;
  attributionCheckboxLabel: string;
  active: boolean;
}

export async function getPromoContent(): Promise<CmsPromoContent | null> {
  return query<CmsPromoContent | null>(
    `*[_type == "promoContent"][0] {
      eyebrow, headline, subhead, attributionOffer, attributionCheckboxLabel, active
    }`,
    ["promoContent"],
  );
}
