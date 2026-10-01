"use client";

import { useEffect } from "react";

// Drop the Checkout Session ID from the address bar on mount, before PostHog/GA load
// (they wait for first interaction), so the bearer-like ID never reaches analytics.
export default function StripSessionId() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("session_id")) return;
    url.searchParams.delete("session_id");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, []);

  return null;
}
