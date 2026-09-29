"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import { useState } from "react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

interface ComparisonFeature {
  feature: string;
  icon?: string;
  us: string;
  competitors: string;
}

interface ComparisonTableProps {
  features: ComparisonFeature[];
  customLabel?: string;
  competitorsLabel?: string;
}

export default function ComparisonTable({
  features,
  customLabel = "Custom Development",
  competitorsLabel = "Website Builders"
}: ComparisonTableProps) {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const toggleFeature = (index: number) => {
    setExpandedFeature(prev => prev === index ? null : index);
    if (expandedFeature !== index) {
      trackEvent(AnalyticsEvents.FEATURE_ADDED, {
        feature_name: features[index]?.feature || `feature-${index}`
      });
    }
  };

  if (!features || features.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No comparison data available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Desktop: Table View */}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-lg lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left font-semibold">Feature</th>
              <th className="p-4 text-center font-semibold text-primary">
                {customLabel}
              </th>
              <th className="p-4 text-center font-semibold">
                {competitorsLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr
                key={index}
                className="border-b border-border/50 transition-colors hover:bg-muted/30"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {feature.icon && (
                      <Icon
                        icon={feature.icon}
                        className="h-6 w-6 text-primary"
                      />
                    )}
                    <span className="font-medium">{feature.feature}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <Icon icon="mdi:check-circle" className="h-5 w-5" />
                    <span>{feature.us}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-destructive">
                    <Icon icon="mdi:alert-circle" className="h-5 w-5" />
                    <span>{feature.competitors}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card View */}
      <div className="space-y-4 lg:hidden">
        {features.map((feature, index) => (
          <m.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-lg border border-border bg-card shadow-md"
          >
            <button
              onClick={() => toggleFeature(index)}
              className="w-full p-4 text-left transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {feature.icon && (
                    <Icon
                      icon={feature.icon}
                      className="h-6 w-6 text-primary"
                    />
                  )}
                  <span className="font-semibold">{feature.feature}</span>
                </div>
                <Icon
                  icon={expandedFeature === index ? "mdi:chevron-up" : "mdi:chevron-down"}
                  className="h-6 w-6 text-muted-foreground"
                />
              </div>
            </button>

            {expandedFeature === index && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-border px-4 pb-4"
              >
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                    <div className="flex items-start gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                      />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          {customLabel}
                        </p>
                        <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                          {feature.us}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                    <div className="flex items-start gap-2">
                      <Icon
                        icon="mdi:alert-circle"
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
                      />
                      <div>
                        <p className="font-medium text-red-900 dark:text-red-100">
                          {competitorsLabel}
                        </p>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                          {feature.competitors}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            )}
          </m.div>
        ))}
      </div>
    </div>
  );
}
