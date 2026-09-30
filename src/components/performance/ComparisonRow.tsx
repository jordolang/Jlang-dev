"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";

export interface BenchmarkComparison {
  metric: string;
  icon?: string;
  baseline: number;
  current: number;
  unit: string;
  lowerIsBetter?: boolean;
}

export interface ComparisonRowProps {
  comparison: BenchmarkComparison;
  index?: number;
  showDetails?: boolean;
}

export default function ComparisonRow({
  comparison,
  index = 0,
  showDetails = true,
}: ComparisonRowProps) {
  const { metric, icon, baseline, current, unit, lowerIsBetter = true } = comparison;

  // Calculate percentage difference
  const calculateDifference = () => {
    if (baseline === 0) return 0;
    return ((current - baseline) / baseline) * 100;
  };

  const percentDiff = calculateDifference();
  const isImprovement = lowerIsBetter
    ? current < baseline
    : current > baseline;
  const hasChange = Math.abs(percentDiff) > 0.1;

  // Determine display values
  const getDisplayIcon = () => {
    if (!hasChange) return "mdi:minus";
    return isImprovement ? "mdi:trending-down" : "mdi:trending-up";
  };

  const getColorClasses = () => {
    if (!hasChange) {
      return {
        bg: "bg-muted/30",
        text: "text-muted-foreground",
        icon: "text-muted-foreground",
        badge: "bg-gray-500 text-white",
      };
    }
    if (isImprovement) {
      return {
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-700 dark:text-green-300",
        icon: "text-green-600 dark:text-green-400",
        badge: "bg-green-600 text-white dark:bg-green-500",
      };
    }
    return {
      bg: "bg-red-50 dark:bg-red-950/20",
      text: "text-red-700 dark:text-red-300",
      icon: "text-red-600 dark:text-red-400",
      badge: "bg-red-600 text-white dark:bg-red-500",
    };
  };

  const colors = getColorClasses();
  const trendIcon = getDisplayIcon();

  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-lg border border-border p-4 shadow-sm transition-all hover:shadow-md ${colors.bg}`}
    >
      {/* Desktop Layout */}
      <div className="hidden items-center justify-between lg:flex">
        {/* Left: Metric Name */}
        <div className="flex items-center gap-3 flex-1">
          {icon && (
            <Icon
              icon={icon}
              className={`h-6 w-6 ${colors.icon}`}
            />
          )}
          <span className="font-semibold">{metric}</span>
        </div>

        {/* Middle: Values */}
        <div className="flex items-center gap-6 flex-1 justify-center">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Baseline</div>
            <div className="font-mono text-sm">
              {baseline.toFixed(2)} {unit}
            </div>
          </div>
          <Icon
            icon="mdi:arrow-right"
            className="h-4 w-4 text-muted-foreground"
          />
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Current</div>
            <div className={`font-mono text-sm font-semibold ${colors.text}`}>
              {current.toFixed(2)} {unit}
            </div>
          </div>
        </div>

        {/* Right: Change Indicator */}
        <div className="flex items-center justify-end gap-3 flex-1">
          {showDetails && (
            <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
              <Icon icon={trendIcon} className="h-4 w-4" />
              {hasChange ? (
                <span>
                  {isImprovement ? "-" : "+"}
                  {Math.abs(percentDiff).toFixed(1)}%
                </span>
              ) : (
                <span>No change</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="space-y-3 lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <Icon
                icon={icon}
                className={`h-5 w-5 ${colors.icon}`}
              />
            )}
            <span className="font-semibold text-sm">{metric}</span>
          </div>
          {showDetails && (
            <div className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}>
              <Icon icon={trendIcon} className="h-3.5 w-3.5" />
              {hasChange ? (
                <span>
                  {isImprovement ? "-" : "+"}
                  {Math.abs(percentDiff).toFixed(1)}%
                </span>
              ) : (
                <span>No change</span>
              )}
            </div>
          )}
        </div>

        {/* Values */}
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Baseline</div>
            <div className="font-mono text-sm mt-1">
              {baseline.toFixed(2)} {unit}
            </div>
          </div>
          <Icon
            icon="mdi:arrow-right"
            className="h-4 w-4 text-muted-foreground"
          />
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Current</div>
            <div className={`font-mono text-sm font-semibold mt-1 ${colors.text}`}>
              {current.toFixed(2)} {unit}
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}
