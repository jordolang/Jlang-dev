"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

// Loads only the DOM animation feature set (enter/exit, whileInView, whileHover,
// whileTap, AnimatePresence) and shares it via context, so the lightweight `m`
// components throughout the app stay tiny instead of each pulling in the full
// framer-motion runtime. ~34kB -> ~6kB for the motion core.
//
// MotionConfig with reducedMotion="user" automatically respects the user's
// prefers-reduced-motion setting, disabling animations when requested.
// WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions)
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
