"use client";

import { LazyMotion, domAnimation } from "framer-motion";

// Loads only the DOM animation feature set (enter/exit, whileInView, whileHover,
// whileTap, AnimatePresence) and shares it via context, so the lightweight `m`
// components throughout the app stay tiny instead of each pulling in the full
// framer-motion runtime. ~34kB -> ~6kB for the motion core.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
