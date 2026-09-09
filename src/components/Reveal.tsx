"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
}

// Thin client island that fades its children in on scroll. Lets an otherwise
// static server component keep a subtle entrance animation without making the
// whole section a client component.
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </m.div>
  );
}
