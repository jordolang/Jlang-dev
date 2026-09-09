"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { LazyOnScroll } from "../LazyOnScroll";

// Interactive below-the-fold sections. dynamic(ssr:false) keeps their JS out of
// the initial bundle; LazyOnScroll defers mounting (and hydration) until each is
// about to scroll into view (or a nav action requests it). The `loading` fallback
// reserves height while the chunk loads so layout never collapses, and the anchor
// `id` lives on the LazyOnScroll wrapper so nav links resolve even before mount.
//
// CMS content is fetched on the server in page.tsx and passed down as props, so a
// section renders its content the moment it mounts — no client-side fetch waterfall.

const reserve = (minHeight: number) => {
  const Spacer = () => <div style={{ minHeight }} aria-hidden />;
  Spacer.displayName = "SectionSpacer";
  return Spacer;
};

const BlogSection = dynamic(() => import("./BlogSection"), { ssr: false, loading: reserve(500) });
const TechStackSection = dynamic(() => import("./TechStackSection"), { ssr: false, loading: reserve(600) });
const CertificationsSection = dynamic(() => import("./CertificationsSection"), { ssr: false, loading: reserve(400) });
const ProjectsSection = dynamic(() => import("./ProjectsSection"), { ssr: false, loading: reserve(800) });
const ServicesSection = dynamic(() => import("./ServicesSection"), { ssr: false, loading: reserve(700) });
const TestimonialsSection = dynamic(() => import("./TestimonialsSection"), { ssr: false, loading: reserve(500) });
const ContactSection = dynamic(() => import("./ContactSection"), { ssr: false, loading: reserve(500) });

export function LazyBlogSection(props: ComponentProps<typeof BlogSection>) {
  return (
    <LazyOnScroll id="blog" minHeight={500}>
      <BlogSection {...props} />
    </LazyOnScroll>
  );
}

export function LazyTechStackSection(props: ComponentProps<typeof TechStackSection>) {
  return (
    <LazyOnScroll id="stack" minHeight={600}>
      <TechStackSection {...props} />
    </LazyOnScroll>
  );
}

export function LazyCertificationsSection(props: ComponentProps<typeof CertificationsSection>) {
  return (
    <LazyOnScroll id="certifications" minHeight={400}>
      <CertificationsSection {...props} />
    </LazyOnScroll>
  );
}

export function LazyProjectsSection(props: ComponentProps<typeof ProjectsSection>) {
  return (
    <LazyOnScroll id="projects" minHeight={800}>
      <ProjectsSection {...props} />
    </LazyOnScroll>
  );
}

export function LazyServicesSection(props: ComponentProps<typeof ServicesSection>) {
  return (
    <LazyOnScroll id="services" minHeight={700}>
      <ServicesSection {...props} />
    </LazyOnScroll>
  );
}

export function LazyTestimonialsSection(props: ComponentProps<typeof TestimonialsSection>) {
  return (
    <LazyOnScroll id="testimonials" minHeight={500}>
      <TestimonialsSection {...props} />
    </LazyOnScroll>
  );
}

export function LazyContactSection(props: ComponentProps<typeof ContactSection>) {
  return (
    <LazyOnScroll id="contact" minHeight={500}>
      <ContactSection {...props} />
    </LazyOnScroll>
  );
}
