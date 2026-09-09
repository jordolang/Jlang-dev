"use client";

import { m } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const DEFAULT_ROLES = ["Web Designer", "UI/UX Designer", "WordPress Developer", "Digital Creative"];

export default function TypewriterRole({ roles: cmsRoles }: { roles?: string[] }) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = useMemo(() => (cmsRoles?.length ? cmsRoles : DEFAULT_ROLES), [cmsRoles]);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 120);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRoleIndex, roles]);

  return (
    <m.div
      className="relative text-xl md:text-2xl mb-6 h-16 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {/* Role pill — static gradient (no per-frame animation) */}
      <m.div
        className="relative overflow-hidden rounded-2xl px-6 py-3 min-w-[280px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      >
        {/* Role Text */}
        <div className="relative z-10 text-center">
          <span className="text-white font-semibold text-left inline-block min-w-[200px]">
            {displayText}
            {/* Blinking cursor — cheap CSS animation, no JS/compositor cost */}
            <span className="inline-block w-0.5 h-6 bg-white/80 ml-1 align-middle animate-pulse" />
          </span>
        </div>
      </m.div>
    </m.div>
  );
}
