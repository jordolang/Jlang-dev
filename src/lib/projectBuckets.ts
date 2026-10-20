/**
 * The filter tabs on /projects. Each project lands in exactly one bucket, worked out from the
 * Group and Category fields it already has in Studio.
 */
export const PROJECT_BUCKETS = [
  { id: "websites", label: "Websites", icon: "solar:global-bold" },
  { id: "webApps", label: "Web apps", icon: "solar:window-frame-bold" },
  { id: "mobile", label: "Mobile apps", icon: "solar:smartphone-bold" },
  { id: "desktop", label: "Desktop & kiosks", icon: "solar:monitor-smartphone-bold" },
] as const;

export type ProjectBucket = (typeof PROJECT_BUCKETS)[number]["id"];

export function projectBucket(project: { group?: string; category?: string }): ProjectBucket {
  const category = (project.category ?? "").toLowerCase();
  if (project.group === "mobile") return "mobile";
  if (project.group === "desktopApp" || /desktop|kiosk/.test(category)) return "desktop";
  if (/mobile/.test(category) && !/web/.test(category)) return "mobile";
  if (/app|self-hosted|platform|tool/.test(category)) return "webApps";
  return "websites";
}
