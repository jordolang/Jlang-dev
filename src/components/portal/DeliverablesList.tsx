"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";

interface Deliverable {
  _id: string;
  title: string;
  description?: string;
  fileType?: string;
  version?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  uploadedAt?: string;
  downloadCount: number;
}

interface DeliverablesListProps {
  deliverables: Deliverable[];
}

/**
 * Deliverables list component for displaying and downloading project files.
 * Shows file cards with download functionality, file info, and version tracking.
 */
export default function DeliverablesList({ deliverables }: DeliverablesListProps) {
  // Format file size for display
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    const mb = kb / 1024;

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else {
      return `${kb.toFixed(2)} KB`;
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get icon based on file type
  const getFileIcon = (fileType?: string, fileName?: string) => {
    if (!fileType && !fileName) return "mdi:file-outline";

    const type = fileType?.toLowerCase() || "";
    const name = fileName?.toLowerCase() || "";

    if (type.includes("pdf") || name.endsWith(".pdf")) {
      return "mdi:file-pdf-box";
    } else if (type.includes("image") || name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
      return "mdi:file-image-outline";
    } else if (type.includes("video") || name.match(/\.(mp4|mov|avi|webm)$/)) {
      return "mdi:file-video-outline";
    } else if (type.includes("zip") || type.includes("archive") || name.match(/\.(zip|rar|7z|tar|gz)$/)) {
      return "mdi:folder-zip-outline";
    } else if (type.includes("word") || name.match(/\.(doc|docx)$/)) {
      return "mdi:file-word-outline";
    } else if (type.includes("excel") || type.includes("spreadsheet") || name.match(/\.(xls|xlsx|csv)$/)) {
      return "mdi:file-excel-outline";
    } else if (type.includes("powerpoint") || type.includes("presentation") || name.match(/\.(ppt|pptx)$/)) {
      return "mdi:file-powerpoint-outline";
    } else if (type.includes("text") || name.match(/\.(txt|md)$/)) {
      return "mdi:file-document-outline";
    } else if (type.includes("code") || name.match(/\.(js|ts|jsx|tsx|html|css|json|xml)$/)) {
      return "mdi:file-code-outline";
    }

    return "mdi:file-outline";
  };

  // Handle download with tracking
  const handleDownload = async (deliverable: Deliverable) => {
    try {
      // Open file in new tab for download
      window.open(deliverable.fileUrl, "_blank");

      // TODO: Track download count via API endpoint
      // This would increment downloadCount and update lastDownloadedAt in Sanity
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="my-8">
      <div className="flex items-center gap-3 mb-6">
        <Icon
          icon="mdi:download-box-outline"
          width={28}
          height={28}
          className="text-indigo-600 dark:text-indigo-400"
          aria-hidden="true"
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Deliverables
        </h2>
      </div>

      {deliverables.length === 0 ? (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900"
          role="status"
        >
          <Icon
            icon="mdi:folder-open-outline"
            width={64}
            height={64}
            className="mx-auto mb-4 text-gray-400"
            aria-hidden="true"
          />
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            No Deliverables Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Files and deliverables will appear here as they become available
          </p>
        </m.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((deliverable, index) => {
            const fileIcon = getFileIcon(deliverable.fileType, deliverable.fileName);
            const uploadDate = formatDate(deliverable.uploadedAt);

            return (
              <m.div
                key={deliverable._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:border-indigo-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
              >
                {/* File icon header */}
                <div className="relative h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center" aria-hidden="true">
                  <Icon
                    icon={fileIcon}
                    width={48}
                    height={48}
                    className="text-indigo-600 dark:text-indigo-400"
                    aria-hidden="true"
                  />
                  {deliverable.version && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                      <span className="text-white text-xs font-medium">
                        v{deliverable.version}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {deliverable.title}
                  </h3>

                  {deliverable.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {deliverable.description}
                    </p>
                  )}

                  {/* File metadata */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:file-outline" width={14} height={14} aria-hidden="true" />
                      <span className="truncate max-w-[120px] sm:max-w-[160px]">{deliverable.fileName}</span>
                    </div>
                    <span>•</span>
                    <span>{formatFileSize(deliverable.fileSize)}</span>
                  </div>

                  {/* Upload date and download count */}
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
                    {uploadDate && (
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:calendar-outline" width={14} height={14} aria-hidden="true" />
                        <span>{uploadDate}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:download-outline" width={14} height={14} aria-hidden="true" />
                      <span>{deliverable.downloadCount} downloads</span>
                    </div>
                  </div>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(deliverable)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    aria-label={`Download ${deliverable.title}`}
                  >
                    <Icon icon="mdi:download" width={18} height={18} aria-hidden="true" />
                    <span>Download</span>
                  </button>
                </div>

                {/* Gradient accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </m.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
