"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MessageThread from "./MessageThread";
import DeliverablesList from "./DeliverablesList";
import type { ClientProject, ProjectMessage, ProjectDeliverable } from "@/lib/portal";

interface ProjectDetailViewProps {
  project: ClientProject;
  messages: ProjectMessage[];
  deliverables: ProjectDeliverable[];
}

/**
 * Project detail view for client portal.
 * Shows project timeline, messages, and deliverables in a clean layout.
 */
export default function ProjectDetailView({
  project,
  messages,
  deliverables,
}: ProjectDetailViewProps) {
  // Convert project messages to message thread format
  const formattedMessages = messages.map((msg) => ({
    id: msg._id,
    sender: (msg.sender === "jordan" ? "jordan" : "client") as "jordan" | "client",
    senderName: msg.sender === "jordan" ? "Jordan Lang" : "You",
    content: msg.message,
    timestamp: msg.createdAt,
    read: msg.isRead,
  }));

  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    setSendError("");
    const response = await fetch("/api/portal/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientProjectId: project._id, message: draft }),
    }).catch(() => null);
    setSending(false);
    if (!response?.ok) {
      const result = await response?.json().catch(() => null);
      setSendError(result?.error || "Could not send message.");
      return;
    }
    setDraft("");
    router.refresh();
  };

  // Sanity `date` values are midnight UTC; format in UTC so western time zones don't show the previous day
  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Icon icon="solar:refresh-circle-bold" width={16} height={16} />
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Icon icon="solar:check-circle-bold" width={16} height={16} />
            Completed
          </span>
        );
      case "on-hold":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Icon icon="solar:pause-circle-bold" width={16} height={16} />
            On Hold
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <Icon icon="solar:clock-circle-bold" width={16} height={16} />
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 px-5 py-8 text-gray-900 dark:from-gray-950 dark:via-slate-950 dark:to-indigo-950 dark:text-white">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/portal/dashboard"
              className="mb-4 inline-flex items-center gap-2 font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:rounded dark:text-indigo-400 dark:hover:text-indigo-300"
              aria-label="Return to dashboard"
            >
              <Icon icon="solar:arrow-left-outline" width={20} height={20} aria-hidden="true" />
              Back to Dashboard
            </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {project.projectTitle}
              </h1>
            </div>
            <div>{getStatusBadge(project.status)}</div>
          </div>

          {/* Project meta info */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {project.startDate && (
              <div className="flex items-center gap-1.5">
                <Icon icon="solar:calendar-outline" width={16} height={16} aria-hidden="true" />
                <span>Started: {formatDate(project.startDate)}</span>
              </div>
            )}
            {project.endDate && (
              <div className="flex items-center gap-1.5">
                <Icon icon="solar:calendar-mark-outline" width={16} height={16} aria-hidden="true" />
                <span>
                  {project.status === "completed" ? "Completed" : "Due"}:{" "}
                  {formatDate(project.endDate)}
                </span>
              </div>
            )}
          </div>
        </m.div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - Messages */}
          <div className="space-y-8 lg:col-span-2">
            {/* Messages Section */}
            <m.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 md:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <Icon
                  icon="solar:chat-line-outline"
                  width={28}
                  height={28}
                  className="text-indigo-600 dark:text-indigo-400"
                  aria-hidden="true"
                />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Messages
                </h2>
              </div>
              <MessageThread messages={formattedMessages} />
              <form onSubmit={sendMessage} className="mt-6">
                <label htmlFor="portal-message" className="sr-only">Message to Jordan</label>
                <textarea
                  id="portal-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={5000}
                  rows={3}
                  required
                  placeholder="Write a message to Jordan…"
                  aria-invalid={Boolean(sendError)}
                  aria-describedby={sendError ? "portal-message-error" : undefined}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950"
                />
                {sendError && (
                  <p id="portal-message-error" role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {sendError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  aria-busy={sending}
                  className="mt-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 font-bold text-white shadow-lg transition-opacity disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </form>
            </m.section>
          </div>

          {/* Sidebar - Deliverables */}
          <div className="lg:col-span-1">
            <m.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 sticky top-8"
            >
              <DeliverablesList deliverables={deliverables} />
            </m.section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
