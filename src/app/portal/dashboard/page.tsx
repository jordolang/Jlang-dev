import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getClientProjects } from "@/lib/portal";
import DashboardView from "@/components/portal/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard | Client Portal",
  description: "View your active projects and deliverables",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  // Check if user is authenticated
  const session = await getSession();

  if (!session) {
    redirect("/portal/login");
  }

  // Fetch client's projects
  const projects = await getClientProjects(session._id);

  return <DashboardView session={session} projects={projects} />;
}
