"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import type { ClientSession } from "@/lib/auth";
import type { ClientProject } from "@/lib/portal";
import ProjectCard from "./ProjectCard";

interface DashboardViewProps {
  session: ClientSession;
  projects: ClientProject[];
}

/**
 * Dashboard view component for authenticated clients
 * Displays welcome message, project overview, and project cards
 */
export default function DashboardView({ session, projects }: DashboardViewProps) {
  // Filter projects by status
  const activeProjects = projects.filter((p) => p.status === "active");
  const completedProjects = projects.filter((p) => p.status === "completed");
  const otherProjects = projects.filter((p) => p.status !== "active" && p.status !== "completed");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 px-5 py-8 text-gray-900 dark:from-gray-950 dark:via-slate-950 dark:to-indigo-950 dark:text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
            <Icon icon="mdi:arrow-left" width={20} height={20} />
            JLang Development
          </Link>
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Icon icon="mdi:account-circle" width={20} height={20} />
            {session.name}
          </m.button>
        </div>

        {/* Welcome section */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session.name.split(" ")[0]}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here's an overview of your projects with JLang Development
          </p>
        </m.div>

        {/* Project stats */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-950/30">
                <Icon icon="mdi:clock-outline" width={24} height={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeProjects.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-950/30">
                <Icon icon="mdi:check-circle-outline" width={24} height={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedProjects.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-950/30">
                <Icon icon="mdi:briefcase-outline" width={24} height={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
              </div>
            </div>
          </div>
        </m.div>

        {/* Projects section */}
        {projects.length === 0 ? (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <Icon icon="mdi:briefcase-outline" width={64} height={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">No Projects Yet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your projects will appear here once they're created
            </p>
          </m.div>
        ) : (
          <>
            {/* Active Projects */}
            {activeProjects.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Active Projects</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      id={project._id}
                      title={project.projectTitle}
                      status={project.status as "active" | "completed" | "on-hold" | "archived"}
                      timeline={{
                        startDate: project.startDate,
                        endDate: project.endDate,
                      }}
                      description={project.notes}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Projects */}
            {completedProjects.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Completed Projects</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {completedProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      id={project._id}
                      title={project.projectTitle}
                      status={project.status as "active" | "completed" | "on-hold" | "archived"}
                      timeline={{
                        startDate: project.startDate,
                        endDate: project.endDate,
                      }}
                      description={project.notes}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Projects (On Hold / Archived) */}
            {otherProjects.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Other Projects</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {otherProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      id={project._id}
                      title={project.projectTitle}
                      status={project.status as "active" | "completed" | "on-hold" | "archived"}
                      timeline={{
                        startDate: project.startDate,
                        endDate: project.endDate,
                      }}
                      description={project.notes}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
