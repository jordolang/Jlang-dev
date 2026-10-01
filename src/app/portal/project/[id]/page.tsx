import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getClientProject,
  getProjectMessages,
  getProjectDeliverables,
} from "@/lib/portal";
import ProjectDetailView from "@/components/portal/ProjectDetailView";

export const metadata: Metadata = {
  title: "Project Details | Client Portal",
  description: "View project timeline, messages, and deliverables",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check if user is authenticated
  const session = await getSession();

  if (!session) {
    redirect("/portal/login");
  }

  // Get project ID from params
  const { id } = await params;

  // Fetch project data
  const project = await getClientProject(id);

  if (!project) {
    notFound();
  }

  // Verify the project belongs to the authenticated client
  if (project.clientId !== session._id) {
    notFound();
  }

  // Fetch project messages and deliverables in parallel
  const [messages, deliverables] = await Promise.all([
    getProjectMessages(id),
    getProjectDeliverables(id),
  ]);

  return (
    <ProjectDetailView
      project={project}
      messages={messages}
      deliverables={deliverables}
    />
  );
}
