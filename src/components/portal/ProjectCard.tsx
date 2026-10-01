"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";

interface ProjectCardProps {
  id: string;
  title: string;
  status: "active" | "completed" | "on-hold" | "archived";
  timeline: {
    startDate?: string;
    endDate?: string;
  };
  description?: string;
}

/**
 * Project card component for displaying client projects on the portal dashboard.
 * Shows project title, status badge, timeline information, and links to project detail page.
 */
export default function ProjectCard({ id, title, status, timeline, description }: ProjectCardProps) {
  // Status configuration with appropriate colors and icons
  const statusConfig = {
    active: {
      label: "Active",
      icon: "mdi:clock-outline",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    completed: {
      label: "Completed",
      icon: "mdi:check-circle-outline",
      gradient: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      textColor: "text-emerald-700 dark:text-emerald-300",
    },
    "on-hold": {
      label: "On Hold",
      icon: "mdi:pause-circle-outline",
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      textColor: "text-amber-700 dark:text-amber-300",
    },
    archived: {
      label: "Archived",
      icon: "mdi:archive-outline",
      gradient: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-50 dark:bg-gray-950/30",
      textColor: "text-gray-700 dark:text-gray-300",
    },
  };

  const config = statusConfig[status];

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const startDate = formatDate(timeline.startDate);
  const endDate = formatDate(timeline.endDate);
  const timelineText = startDate && endDate ? `${startDate} - ${endDate}` : startDate || "No timeline set";

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        href={`/portal/project/${id}`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-2xl"
        aria-label={`View project: ${title}`}
      >
        <m.article
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
          transition={{ duration: 0.2 }}
          className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all dark:border-gray-800 dark:bg-gray-900"
        >
          {/* Status badge */}
          <div className="flex items-center justify-between mb-4">
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`flex items-center gap-2 rounded-full ${config.bgColor} px-3 py-1.5`}
              role="status"
              aria-label={`Project status: ${config.label}`}
            >
              <Icon icon={config.icon} width={16} height={16} className={config.textColor} aria-hidden="true" />
              <span className={`text-sm font-semibold ${config.textColor}`}>{config.label}</span>
            </m.div>

            {/* Arrow icon indicating link */}
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-gray-400 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              aria-hidden="true"
            >
              <Icon icon="mdi:arrow-right" width={24} height={24} aria-hidden="true" />
            </m.div>
          </div>

          {/* Project title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>

          {/* Description if provided */}
          {description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Timeline */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:calendar-outline" width={16} height={16} aria-hidden="true" />
            <span className="text-sm">{timelineText}</span>
          </div>

          {/* Gradient accent bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
        </m.article>
      </Link>
    </m.div>
  );
}
