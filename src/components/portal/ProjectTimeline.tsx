"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  deliverables?: string[];
}

interface ProjectTimelineProps {
  milestones: Milestone[];
  projectTitle?: string;
}

export default function ProjectTimeline({ milestones, projectTitle }: ProjectTimelineProps) {
  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 dark:bg-green-600';
      case 'in-progress':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'upcoming':
        return 'bg-gray-300 dark:bg-gray-700';
      default:
        return 'bg-gray-300 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'solar:check-circle-bold';
      case 'in-progress':
        return 'solar:refresh-circle-bold';
      case 'upcoming':
        return 'solar:clock-circle-bold';
      default:
        return 'solar:clock-circle-bold';
    }
  };

  const getStatusText = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Upcoming';
    }
  };

  return (
    <div className="w-full">
      {projectTitle && (
        <m.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-gray-900 dark:text-white"
        >
          {projectTitle}
        </m.h2>
      )}

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

        {/* Milestones */}
        <div className="space-y-8">
          {milestones.map((milestone, idx) => (
            <m.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-16"
            >
              {/* Status Icon */}
              <div
                className={`absolute left-3 -translate-x-1/2 w-6 h-6 rounded-full ${getStatusColor(
                  milestone.status
                )} flex items-center justify-center ring-4 ring-white dark:ring-gray-950`}
              >
                <Icon
                  icon={getStatusIcon(milestone.status)}
                  className="text-white"
                  width={16}
                  height={16}
                />
              </div>

              {/* Milestone Card */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {milestone.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                        milestone.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : milestone.status === 'in-progress'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {getStatusText(milestone.status)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {milestone.description}
                </p>

                {/* Dates */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Icon icon="solar:calendar-outline" width={16} height={16} />
                    <span>Due: {milestone.dueDate}</span>
                  </div>
                  {milestone.completedDate && (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                      <Icon icon="solar:check-circle-outline" width={16} height={16} />
                      <span>Completed: {milestone.completedDate}</span>
                    </div>
                  )}
                </div>

                {/* Deliverables */}
                {milestone.deliverables && milestone.deliverables.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deliverables:
                    </h4>
                    <ul className="space-y-1.5">
                      {milestone.deliverables.map((deliverable, delIdx) => (
                        <li
                          key={delIdx}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <Icon
                            icon="solar:check-square-outline"
                            width={16}
                            height={16}
                            className={`mt-0.5 flex-shrink-0 ${
                              milestone.status === 'completed'
                                ? 'text-green-500 dark:text-green-400'
                                : 'text-gray-400 dark:text-gray-600'
                            }`}
                          />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <Icon
                icon="solar:check-circle-bold"
                className="text-green-600 dark:text-green-400"
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {milestones.filter((m) => m.status === 'completed').length}
              </p>
              <p className="text-sm text-green-700 dark:text-green-500">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Icon
                icon="solar:refresh-circle-bold"
                className="text-blue-600 dark:text-blue-400"
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {milestones.filter((m) => m.status === 'in-progress').length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-500">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Icon
                icon="solar:clock-circle-bold"
                className="text-gray-600 dark:text-gray-400"
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {milestones.filter((m) => m.status === 'upcoming').length}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-500">Upcoming</p>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
}
