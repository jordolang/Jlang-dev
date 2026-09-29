import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/projects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found" };

  const url = `${SITE_URL}/projects/${project.slug}`;
  return {
    title: `${project.title} | Jordan Lang`,
    description: project.description,
    keywords: project.tech?.join(", "),
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url,
      tags: project.tech,
      images: project.image ? [{ url: project.image, alt: project.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  // Dynamically import CaseStudyView to keep it client-side
  const { default: CaseStudyView } = await import("@/components/projects/CaseStudyView");

  return <CaseStudyView project={project} />;
}
