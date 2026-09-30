"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import { useState } from "react";
import type { PerformanceMetrics as PerformanceMetricsType } from "@/lib/performance";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import ScoreCircle from "./ScoreCircle";
import CoreWebVitals from "./CoreWebVitals";
import ComparisonRow, { type BenchmarkComparison } from "./ComparisonRow";

interface PerformanceMetricsProps {
  data: PerformanceMetricsType;
}

type Strategy = "mobile" | "desktop";

// Benchmark data for comparison (average scores for Squarespace and WordPress)
const BENCHMARK_DATA = {
  performance: 65,
  accessibility: 80,
  bestPractices: 75,
  seo: 85,
};

const SCORE_CATEGORIES = [
  {
    key: "performance" as const,
    label: "Performance",
    icon: "mdi:speedometer",
  },
  {
    key: "accessibility" as const,
    label: "Accessibility",
    icon: "mdi:human-wheelchair",
  },
  {
    key: "bestPractices" as const,
    label: "Best Practices",
    icon: "mdi:shield-check",
  },
  {
    key: "seo" as const,
    label: "SEO",
    icon: "mdi:search-web",
  },
] as const;

export default function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  const [activeStrategy, setActiveStrategy] = useState<Strategy>("mobile");

  const handleStrategyChange = (strategy: Strategy) => {
    setActiveStrategy(strategy);
    trackEvent(AnalyticsEvents.FEATURE_TOGGLED, {
      feature: "performance_strategy_toggle",
      strategy,
    });
  };

  const handleShareClick = () => {
    trackEvent(AnalyticsEvents.CTA_CLICKED, {
      cta_location: "performance_metrics",
      cta_text: "Share Scores",
    });

    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: "Performance Metrics",
        text: `Check out these performance scores: Performance ${currentScores.performance}, Accessibility ${currentScores.accessibility}, Best Practices ${currentScores.bestPractices}, SEO ${currentScores.seo}`,
        url: window.location.href,
      }).catch((err) => {
        console.error("Error sharing:", err);
      });
    } else {
      // Fallback: Copy to clipboard
      const shareText = `Performance Metrics:\nPerformance: ${currentScores.performance}\nAccessibility: ${currentScores.accessibility}\nBest Practices: ${currentScores.bestPractices}\nSEO: ${currentScores.seo}`;
      navigator.clipboard.writeText(shareText);
      alert("Scores copied to clipboard!");
    }
  };

  const handleDownloadClick = () => {
    trackEvent(AnalyticsEvents.CTA_CLICKED, {
      cta_location: "performance_metrics",
      cta_text: "Download Badge",
    });

    // Simple download implementation - create a text file with the scores
    const scores = `Performance Metrics Badge
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Strategy: ${activeStrategy}
Performance: ${currentScores.performance}/100
Accessibility: ${currentScores.accessibility}/100
Best Practices: ${currentScores.bestPractices}/100
SEO: ${currentScores.seo}/100

Core Web Vitals:
LCP: ${currentVitals.lcp.displayValue} (${currentVitals.lcp.pass ? "Pass" : "Fail"})
FID: ${currentVitals.fid.displayValue} (${currentVitals.fid.pass ? "Pass" : "Fail"})
CLS: ${currentVitals.cls.displayValue} (${currentVitals.cls.pass ? "Pass" : "Fail"})

Generated: ${new Date(data.fetchedAt).toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const blob = new Blob([scores], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-badge-${activeStrategy}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentData = data[activeStrategy];
  const currentScores = currentData.scores;
  const currentVitals = currentData.vitals;

  // Build comparison data
  const comparisons: BenchmarkComparison[] = SCORE_CATEGORIES.map((category) => ({
    metric: category.label,
    icon: category.icon,
    baseline: BENCHMARK_DATA[category.key],
    current: currentScores[category.key],
    unit: "/100",
    lowerIsBetter: false, // Higher scores are better
  }));

  const fetchedDate = new Date(data.fetchedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-7xl space-y-12">
      {/* Strategy Toggle */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-3 rounded-full border border-border bg-card p-1 shadow-md">
          <button
            onClick={() => handleStrategyChange("mobile")}
            className={`flex items-center gap-2 rounded-full px-6 py-2 font-semibold transition-all ${
              activeStrategy === "mobile"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon icon="mdi:cellphone" className="h-5 w-5" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => handleStrategyChange("desktop")}
            className={`flex items-center gap-2 rounded-full px-6 py-2 font-semibold transition-all ${
              activeStrategy === "desktop"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon icon="mdi:monitor" className="h-5 w-5" />
            <span>Desktop</span>
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Last updated: {fetchedDate}
        </p>
      </m.div>

      {/* Lighthouse Scores */}
      <m.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
          Lighthouse Scores
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {SCORE_CATEGORIES.map((category, index) => (
            <m.div
              key={category.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="flex flex-col items-center"
            >
              <ScoreCircle
                score={currentScores[category.key]}
                label={category.label}
                animationDelay={0.1 * index}
              />
            </m.div>
          ))}
        </div>
      </m.section>

      {/* Core Web Vitals */}
      <m.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
          Core Web Vitals
        </h2>
        <CoreWebVitals vitals={currentVitals} strategy={activeStrategy} />
      </m.section>

      {/* Comparison Section */}
      <m.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          Benchmark Comparison
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          How this site compares to average Squarespace/WordPress portfolio sites
        </p>
        <div className="mx-auto max-w-4xl space-y-4">
          {comparisons.map((comparison, index) => (
            <ComparisonRow
              key={comparison.metric}
              comparison={comparison}
              index={index}
            />
          ))}
        </div>
      </m.section>

      {/* Action Buttons */}
      <m.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-lg">
          <h3 className="mb-4 text-center text-xl font-bold">
            Share These Metrics
          </h3>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={handleShareClick}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              <Icon icon="mdi:share-variant" className="h-5 w-5" />
              <span>Share Scores</span>
            </button>
            <button
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary/10"
            >
              <Icon icon="mdi:download" className="h-5 w-5" />
              <span>Download Badge</span>
            </button>
          </div>
        </div>
      </m.section>

      {/* Info Footer */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mx-auto max-w-4xl rounded-lg border border-border bg-muted/30 p-6"
      >
        <div className="flex items-start gap-4">
          <Icon
            icon="mdi:information"
            className="mt-1 h-6 w-6 flex-shrink-0 text-primary"
          />
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              About These Metrics
            </p>
            <p>
              These scores are fetched from Google&apos;s PageSpeed Insights API and
              represent real-world performance measurements. Lighthouse scores
              range from 0-100, with higher being better. Core Web Vitals are
              user-centric metrics that measure loading performance, interactivity,
              and visual stability.
            </p>
            <p>
              Benchmark data represents average scores from typical Squarespace
              and WordPress portfolio sites. Custom-built sites with modern
              frameworks like Next.js can achieve significantly better performance.
            </p>
          </div>
        </div>
      </m.div>
    </div>
  );
}
