"use client"

import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { initializeVisitorTracking } from "../lib/analytics"
import { logger } from "../lib/logger"
import "../lib/registerIcons"

const GA_MEASUREMENT_ID = "G-GEV08XTBLL"

// Both analytics tools run a lot of main-thread work at startup (PostHog init +
// session recording; gtag.js is ~164 kB). Loading them during hydration was the
// dominant contributor to Total Blocking Time. Instead we arm them once and load
// on the first real user interaction, with a short timeout fallback — so their
// cost lands AFTER the page is interactive (outside the TBT window) while still
// capturing anyone who engages with the page.
const IDLE_FALLBACK_MS = 3500

function loadGoogleAnalytics() {
  if (typeof document === "undefined" || document.getElementById("ga-gtag")) return
  const script = document.createElement("script")
  script.id = "ga-gtag"
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.async = true
  document.head.appendChild(script)

  const w = window as typeof window & { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  // gtag pushes its own `arguments` object onto the dataLayer.
  function gtag(...args: unknown[]) {
    w.dataLayer!.push(args)
  }
  gtag("js", new Date())
  gtag("config", GA_MEASUREMENT_ID)
}

function initPostHog() {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!posthogKey) {
    if (process.env.NODE_ENV === "development") {
      logger.warn("PostHog key not found. Analytics will be disabled.")
    }
    return
  }
  if (posthog.__loaded) return

  posthog.init(posthogKey, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // We capture pageviews manually
    capture_pageleave: true, // Enable pageleave capture
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
    debug: process.env.NODE_ENV === "development",
  })

  // Initialize visitor tracking after PostHog is ready
  initializeVisitorTracking()

  // Capture the pageview for the entry page, which the route-change tracker
  // below intentionally skips while PostHog is still loading.
  posthog.capture("$pageview", { $current_url: window.location.href })
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let fired = false
    const events = ["pointerdown", "keydown", "touchstart", "scroll", "mousemove"] as const

    const cleanup = () => {
      window.clearTimeout(timer)
      for (const event of events) window.removeEventListener(event, fire)
    }

    const fire = () => {
      if (fired) return
      fired = true
      cleanup()
      initPostHog()
      loadGoogleAnalytics()
    }

    const timer = window.setTimeout(fire, IDLE_FALLBACK_MS)
    for (const event of events) {
      window.addEventListener(event, fire, { once: true, passive: true })
    }

    return cleanup
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    // Skip until PostHog is actually loaded — the entry pageview is captured by
    // initPostHog(); this effect handles subsequent client-side navigations.
    if (!pathname || !posthog?.__loaded) return
    let url = window.origin + pathname
    const search = searchParams.toString()
    if (search) {
      url += "?" + search
    }
    posthog.capture("$pageview", { "$current_url": url })
  }, [pathname, searchParams, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
