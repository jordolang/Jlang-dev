import type { Metadata } from "next";
import ProjectsIndex from "@/components/projects/ProjectsIndex";
import { getAllProjects } from "@/lib/projects";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects | Jordan Lang",
  description: "Every website, web app, mobile app, desktop tool and kiosk Jordan Lang has built, with a case study for each.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Jordan Lang",
    description: "Every website, web app, mobile app, desktop tool and kiosk Jordan Lang has built.",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return (
    <ProjectsIndex
      projects={projects.map((project) => ({
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        image: project.image,
        tech: project.tech,
        live: project.live,
        gradient: project.gradient,
        status: project.status,
        category: project.category,
        timeline: project.timeline,
        group: project.group,
        featured: project.featured,
        pagespeed: project.pagespeed,
      }))}
    />
  );
}
