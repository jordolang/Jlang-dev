"use client";

import { useEffect } from "react";

export default function ViewTracker({ token }: { token: string }) {
  useEffect(() => {
    // Track view when component mounts
    const trackView = async () => {
      try {
        await fetch(`/api/reviews/${token}/view`, {
          method: "POST",
        });
      } catch (error) {
        // Silently handle errors to avoid console noise
        // View tracking is non-critical functionality
      }
    };

    trackView();
  }, [token]);

  // This component renders nothing
  return null;
}
