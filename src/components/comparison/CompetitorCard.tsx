"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";

interface PainPoint {
  issue: string;
  source?: string;
}

export interface CompetitorCardProps {
  name: string;
  logo?: string;
  tagline?: string;
  monthlyCost?: string;
  performanceScore?: number;
  seoCapabilities?: string;
  customization?: string;
  ownership?: string;
  support?: string;
  painPoints?: PainPoint[];
  isCustom?: boolean;
  index?: number;
}

export default function CompetitorCard({
  name,
  logo,
  tagline,
  monthlyCost,
  performanceScore,
  seoCapabilities,
  customization,
  ownership,
  support,
  painPoints,
  isCustom = false,
  index = 0,
}: CompetitorCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Determine performance score color
  const getPerformanceColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <m.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`
        rounded-lg border bg-card p-6 shadow-lg transition-all hover:shadow-xl
        ${isCustom
          ? "border-primary/50 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent"
          : "border-border"
        }
      `}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {logo && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
              {logo.startsWith("http") ? (
                <img src={logo} alt={name} className="h-full w-full rounded-lg object-contain" />
              ) : (
                <span>{logo}</span>
              )}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">
              {name}
              {isCustom && (
                <Icon icon="mdi:star" className="ml-2 inline-block h-5 w-5 text-primary" />
              )}
            </h3>
            {tagline && (
              <p className="text-sm text-muted-foreground">{tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-4">
        {monthlyCost && (
          <div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon icon="mdi:currency-usd" className="h-4 w-4" />
              <span>Monthly Cost</span>
            </div>
            <p className="mt-1 font-semibold">{monthlyCost}</p>
          </div>
        )}
        {performanceScore !== undefined && (
          <div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon icon="mdi:speedometer" className="h-4 w-4" />
              <span>Performance</span>
            </div>
            <p className={`mt-1 font-semibold ${getPerformanceColor(performanceScore)}`}>
              {performanceScore}/100
            </p>
          </div>
        )}
      </div>

      {/* Detailed Features */}
      <div className="space-y-3">
        {seoCapabilities && (
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:magnify" className="h-4 w-4 text-primary" />
              <span>SEO Capabilities</span>
            </div>
            <p className="text-sm text-muted-foreground">{seoCapabilities}</p>
          </div>
        )}

        {customization && (
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:palette" className="h-4 w-4 text-primary" />
              <span>Customization</span>
            </div>
            <p className="text-sm text-muted-foreground">{customization}</p>
          </div>
        )}

        {ownership && (
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:shield-check" className="h-4 w-4 text-primary" />
              <span>Ownership</span>
            </div>
            <p className="text-sm text-muted-foreground">{ownership}</p>
          </div>
        )}

        {support && (
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:headset" className="h-4 w-4 text-primary" />
              <span>Support</span>
            </div>
            <p className="text-sm text-muted-foreground">{support}</p>
          </div>
        )}
      </div>

      {/* Pain Points */}
      {painPoints && painPoints.length > 0 && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <Icon icon="mdi:alert-circle" className="h-5 w-5 text-destructive" />
            <span>Known Limitations</span>
          </div>
          <ul className="space-y-2">
            {painPoints.map((point, idx) => (
              <li key={idx} className="text-sm">
                <p className="text-foreground">{point.issue}</p>
                {point.source && (
                  <p className="mt-0.5 text-xs italic text-muted-foreground">
                    Source: {point.source}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </m.div>
  );
}
