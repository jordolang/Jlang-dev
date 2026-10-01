"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import type { CoreWebVitals as CoreWebVitalsType } from "@/lib/performance";

interface CoreWebVitalsProps {
  vitals: CoreWebVitalsType;
  strategy?: "mobile" | "desktop";
}

interface VitalMetric {
  name: string;
  icon: string;
  key: "lcp" | "fid" | "cls";
  description: string;
  threshold: string;
}

const VITALS_CONFIG: VitalMetric[] = [
  {
    name: "LCP",
    icon: "mdi:speedometer",
    key: "lcp",
    description: "Largest Contentful Paint",
    threshold: "≤ 2.5s",
  },
  {
    name: "FID",
    icon: "mdi:cursor-default-click",
    key: "fid",
    description: "First Input Delay",
    threshold: "≤ 100ms",
  },
  {
    name: "CLS",
    icon: "mdi:page-layout-body",
    key: "cls",
    description: "Cumulative Layout Shift",
    threshold: "≤ 0.1",
  },
];

// `pass` is null when the metric has no data (e.g. FID without field data).
function statusStyles(pass: boolean | null) {
  if (pass === null) {
    return {
      card: "border-border bg-muted/30",
      icon: "text-muted-foreground",
      value: "text-muted-foreground",
      badge: "bg-gray-500 text-white",
      badgeIcon: "mdi:help-circle",
      label: "No data",
    };
  }
  return pass
    ? {
        card: "border-green-500/30 bg-green-50 dark:bg-green-950/20",
        icon: "text-green-600 dark:text-green-400",
        value: "text-green-700 dark:text-green-300",
        badge: "bg-green-600 text-white dark:bg-green-500",
        badgeIcon: "mdi:check-circle",
        label: "Pass",
      }
    : {
        card: "border-red-500/30 bg-red-50 dark:bg-red-950/20",
        icon: "text-red-600 dark:text-red-400",
        value: "text-red-700 dark:text-red-300",
        badge: "bg-red-600 text-white dark:bg-red-500",
        badgeIcon: "mdi:alert-circle",
        label: "Fail",
      };
}

export default function CoreWebVitals({
  vitals,
  strategy = "mobile",
}: CoreWebVitalsProps) {
  if (!vitals) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No Core Web Vitals data available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Desktop: Grid View */}
      <div className="hidden grid-cols-3 gap-6 lg:grid">
        {VITALS_CONFIG.map((metric, index) => {
          const vital = vitals[metric.key];
          const s = statusStyles(vital.pass);

          return (
            <m.div
              key={metric.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`rounded-lg border p-6 shadow-md transition-all hover:shadow-lg ${s.card}`}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    icon={metric.icon}
                    className={`h-8 w-8 ${s.icon}`}
                  />
                  <div>
                    <h3 className="text-lg font-bold">{metric.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Value */}
              <div className="mb-3">
                <div className={`text-3xl font-bold ${s.value}`}>
                  {vital.displayValue}
                </div>
              </div>

              {/* Pass/Fail Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Target: {metric.threshold}
                </span>
                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${s.badge}`}
                >
                  <Icon icon={s.badgeIcon} className="h-4 w-4" />
                  {s.label}
                </div>
              </div>
            </m.div>
          );
        })}
      </div>

      {/* Mobile: Card Stack */}
      <div className="space-y-4 lg:hidden">
        {VITALS_CONFIG.map((metric, index) => {
          const vital = vitals[metric.key];
          const s = statusStyles(vital.pass);

          return (
            <m.div
              key={metric.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`rounded-lg border p-5 shadow-md ${s.card}`}
            >
              {/* Header Row */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    icon={metric.icon}
                    className={`h-7 w-7 ${s.icon}`}
                  />
                  <div>
                    <h3 className="font-bold">{metric.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}
                >
                  <Icon icon={s.badgeIcon} className="h-3.5 w-3.5" />
                  {s.label}
                </div>
              </div>

              {/* Value and Threshold */}
              <div className="flex items-end justify-between">
                <div className={`text-2xl font-bold ${s.value}`}>
                  {vital.displayValue}
                </div>
                <span className="text-sm text-muted-foreground">
                  Target: {metric.threshold}
                </span>
              </div>
            </m.div>
          );
        })}
      </div>

      {/* Info Footer */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 rounded-lg border border-border bg-muted/30 p-4"
      >
        <div className="flex items-start gap-3">
          <Icon
            icon="mdi:information"
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
          />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              Core Web Vitals ({strategy})
            </p>
            <p className="mt-1">
              These metrics measure real-world user experience. Passing all three
              indicates excellent performance that contributes to better SEO
              rankings and user satisfaction.
            </p>
          </div>
        </div>
      </m.div>
    </div>
  );
}
