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

  // Temporary simple rendering - will be replaced with CaseStudyView in phase 4
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="mx-auto max-w-4xl px-4 py-16">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {project.subtitle}
          </p>
        </header>

        {project.image && (
          <div className="mb-12">
            <img
              src={project.image}
              alt={project.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">{project.description}</p>

          {project.features && project.features.length > 0 && (
            <section className="mt-8">
              <h2>Features</h2>
              <ul>
                {project.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          {project.tech && project.tech.length > 0 && (
            <section className="mt-8">
              <h2>Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {project.testimonial && (
            <section className="mt-12 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
              <blockquote className="text-lg italic">
                "{project.testimonial.content}"
              </blockquote>
              <footer className="mt-4">
                <p className="font-semibold">{project.testimonial.author}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.testimonial.role}
                </p>
              </footer>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
