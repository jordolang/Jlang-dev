"use client";

import { Icon } from "@/components/Icon";
import React, { useState } from "react";
import type { PageSpeedResult, PageSpeedScores as Scores } from "@/lib/fallbackProjects";

const CATEGORIES: Array<{ key: keyof Scores; label: string }> = [
  { key: "performance", label: "Performance" },
  { key: "accessibility", label: "Accessibility" },
  { key: "bestPractices", label: "Best Practices" },
  { key: "seo", label: "SEO" },
];

/** Lighthouse's own bands: 90–100 pass, 50–89 average, 0–49 fail. */
function band(score: number) {
  if (score >= 90) return { ring: "#0cce6b", fill: "rgba(12, 206, 107, 0.1)", text: "text-[#008800] dark:text-[#0cce6b]" };
  if (score >= 50) return { ring: "#ffa400", fill: "rgba(255, 164, 0, 0.1)", text: "text-[#c33300] dark:text-[#ffa400]" };
  return { ring: "#ff4e42", fill: "rgba(255, 78, 66, 0.1)", text: "text-[#cc0000] dark:text-[#ff4e42]" };
}

function ScoreRing({ score, label, size }: { score: number; label: string; size: number }) {
  const value = Math.max(0, Math.min(100, Math.round(score)));
  const { ring, fill, text } = band(value);
  const stroke = size / 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-1.5" role="img" aria-label={`${label}: ${value} out of 100`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Starts at 12 o'clock and runs clockwise, like the PageSpeed gauge. */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill={fill} stroke="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ring}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * circumference} ${circumference}`}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-mono font-medium ${text}`}
          style={{ fontSize: size * (value === 100 ? 0.3 : 0.34) }}
        >
          {value}
        </span>
      </div>
      <span className="text-center text-[10px] leading-tight tracking-tight sm:text-[11px] sm:tracking-normal text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

/** A Studio draft can hold a half-typed run; only a run with all four numbers is shown. */
function isComplete(scores?: Partial<Scores> | null): scores is Scores {
  return !!scores && CATEGORIES.every(({ key }) => Number.isFinite(scores[key]));
}

/**
 * Lighthouse score rings for a live website, with a Mobile/Desktop switch when both
 * runs were recorded. Renders nothing when the project has no scores. `static` drops the switch
 * and report link, for cards that are themselves one big link and can't nest controls.
 */
export function PageSpeedScores({
  pagespeed,
  size = 48,
  static: isStatic = false,
}: {
  pagespeed?: PageSpeedResult;
  size?: number;
  static?: boolean;
}) {
  const available = (["mobile", "desktop"] as const).filter((device) => isComplete(pagespeed?.[device]));
  const [device, setDevice] = useState<"mobile" | "desktop">(available[0] ?? "mobile");
  if (!pagespeed || !available.length) return null;

  const shown = available.includes(device) ? device : available[0];
  const scores = pagespeed[shown] as Scores;
  const tested = pagespeed.testedAt
    ? new Date(`${pagespeed.testedAt}T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  return (
    <div className="relative z-10 rounded-xl border border-gray-200 bg-white/60 p-3 dark:border-gray-700 dark:bg-gray-900/40">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          <Icon icon="solar:speedometer-bold" width={14} height={14} />
          PageSpeed
        </span>
        {available.length > 1 && !isStatic && (
          <div className="inline-flex rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800" role="group" aria-label="Device">
            {available.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDevice(option)}
                aria-pressed={shown === option}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize transition-colors ${
                  shown === option
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon icon={option === "mobile" ? "solar:smartphone-2-linear" : "solar:monitor-linear"} width={12} height={12} />
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-x-1.5">
        {CATEGORIES.map(({ key, label }) => (
          <ScoreRing key={key} score={scores[key]} label={label} size={size} />
        ))}
      </div>

      {/* With no toggle, this line is the only place that says which device was tested. */}
      {(available.length === 1 || isStatic || tested || pagespeed.reportUrl) && (
        <p className="mt-2.5 text-center text-[10px] text-gray-500 dark:text-gray-400">
          {(available.length === 1 || isStatic) && <span className="capitalize">{shown}</span>}
          {(available.length === 1 || isStatic) && (tested || (pagespeed.reportUrl && !isStatic)) && " · "}
          {tested && <>Tested {tested}</>}
          {tested && pagespeed.reportUrl && !isStatic && " · "}
          {pagespeed.reportUrl && !isStatic && (
            <a
              href={pagespeed.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
            >
              View report
            </a>
          )}
        </p>
      )}

      {pagespeed.note && (
        <p className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-[11px] leading-snug text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <Icon icon="solar:info-circle-linear" width={14} height={14} className="mt-px flex-shrink-0" />
          <span>{pagespeed.note}</span>
        </p>
      )}
    </div>
  );
}
