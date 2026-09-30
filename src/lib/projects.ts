import 'server-only';

import { getSanityClient, sanityIsConfigured } from '@/sanity/lib/client';
import { isDraftMode } from './cms';
import { dimensionsForImage, urlForImage, type SanityImageRef } from '@/sanity/lib/image';
import { logger } from './logger';
import { projects as fallbackProjects } from './fallbackProjects';
import type { PortableTextBlock } from '@portabletext/react';

/**
 * Testimonial interface for case studies
 */
export interface CaseStudyTestimonial {
  author: string;
  role: string;
  company: string;
  content: string;
  rating?: number;
}

/**
 * Case study interface with all required fields
 */
export interface CaseStudy {
  challenge: PortableTextBlock[];
  approach: PortableTextBlock[];
  solution: PortableTextBlock[];
  results: PortableTextBlock[];
  testimonial: CaseStudyTestimonial | null;
}

/**
 * Project interface with slug for routing and optional case study content
 */
export interface Project {
  slug: string;
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
  status: 'Live' | 'In Development';
  category: string;
  highlight: string;
  timeline: string;
  clientType: string;
  group?: 'desktop' | 'mobile' | 'desktopApp';
  fullPagePreview?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  featured?: boolean;
  // Case study fields
  challenge?: PortableTextBlock[];
  approach?: PortableTextBlock[];
  solution?: PortableTextBlock[];
  results?: PortableTextBlock[];
  testimonial?: CaseStudyTestimonial | null;
  // Code showcase examples
  codeExamples?: Array<{
    title: string;
    description: string;
    code: string;
    language: string;
  }>;
}

interface RawProject
  extends Omit<Project, 'image' | 'imageWidth' | 'imageHeight' | 'testimonial'> {
  image: SanityImageRef | null;
  testimonialRef?: CaseStudyTestimonial | null;
}

const IMAGE_PROJECTION = `{ asset->{ _id, url, metadata { dimensions } } }`;

async function getSanityProjects(): Promise<Project[]> {
  if (!sanityIsConfigured) return [];
  const draft = await isDraftMode();

  try {
    const projects = await getSanityClient(draft).fetch<RawProject[]>(
      `*[_type == "project" && defined(slug.current)] | order(order asc, _createdAt asc) {
        "slug": slug.current,
        title, subtitle, description, features, deliverables, tech, github, live,
        gradient, status, category, highlight, timeline, clientType, group,
        fullPagePreview, featured, challenge, approach, solution, results,
        image ${IMAGE_PROJECTION},
        "testimonialRef": *[_type == "testimonial" && _id == ^.testimonialRef._ref && approved == true][0]{ author, role, company, content, rating }
      }`,
      {},
      draft ? { cache: 'no-store' } : { next: { revalidate: 60, tags: ['projects'] } },
    );

    return (projects ?? []).map((project) => {
      const dims = dimensionsForImage(project.image);
      return {
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        image: urlForImage(project.image) ?? '',
        features: project.features ?? [],
        deliverables: project.deliverables ?? [],
        tech: project.tech ?? [],
        github: project.github ?? '',
        live: project.live ?? '',
        gradient: project.gradient,
        status: project.status,
        category: project.category,
        highlight: project.highlight,
        timeline: project.timeline,
        clientType: project.clientType,
        group: project.group,
        fullPagePreview: project.fullPagePreview,
        featured: project.featured,
        imageWidth: dims?.width,
        imageHeight: dims?.height,
        challenge: project.challenge,
        approach: project.approach,
        solution: project.solution,
        results: project.results,
        testimonial: project.testimonialRef ?? null,
      };
    });
  } catch (error) {
    logger.error('Error fetching projects from Sanity:', error);
    return [];
  }
}

/**
 * Get all projects from Sanity CMS, falling back to the bundled list the
 * portfolio shows when Sanity has none, so every project card has a page.
 */
export async function getAllProjects(): Promise<Project[]> {
  const projects = await getSanityProjects();
  return projects.length ? projects : fallbackProjects;
}

/**
 * Get a single project by its slug
 */
export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((project) => project.slug);
}
