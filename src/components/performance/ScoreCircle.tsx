"use client";

import { m } from "framer-motion";

export interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showScore?: boolean;
  className?: string;
  animationDelay?: number;
}

export default function ScoreCircle({
  score,
  maxScore = 100,
  size = 120,
  strokeWidth = 8,
  label,
  showScore = true,
  className = "",
  animationDelay = 0,
}: ScoreCircleProps) {
  // Calculate percentage
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

  // Determine color based on score
  const getScoreColor = (scoreValue: number) => {
    const percentValue = (scoreValue / maxScore) * 100;
    if (percentValue >= 90) return "#22c55e"; // green-500
    if (percentValue >= 70) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  const color = getScoreColor(score);

  // SVG circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transform"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />

          {/* Animated progress circle */}
          <m.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1,
              delay: animationDelay,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Center content */}
        {showScore && (
          <m.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: animationDelay + 0.3,
            }}
          >
            <div className="text-center">
              <div
                className="font-bold leading-none"
                style={{
                  fontSize: size * 0.25,
                  color,
                }}
              >
                {Math.round(score)}
              </div>
              {maxScore !== 100 && (
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: size * 0.12 }}
                >
                  /{maxScore}
                </div>
              )}
            </div>
          </m.div>
        )}
      </div>

      {/* Label */}
      {label && (
        <m.div
          className="text-center text-sm font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            delay: animationDelay + 0.5,
          }}
        >
          {label}
        </m.div>
      )}
    </div>
  );
}
