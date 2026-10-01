import type { Metadata } from "next";
import PerformanceMetrics from "@/components/performance/PerformanceMetrics";
import { fetchLighthouseScores } from "@/lib/performance";
import { JsonLd } from "@/components/JsonLd";
import Navigation from "@/components/portfolio/Navigation";
import { SITE_URL } from "@/lib/schema";

export const revalidate = 604800; // Cache for 1 week (same as API)

export const metadata: Metadata = {
  title: "Performance Metrics | Jordan Lang",
  description: "Real-time Lighthouse scores and Core Web Vitals for this site. See how Next.js delivers near-perfect performance compared to WordPress and Squarespace.",
  alternates: { canonical: "/performance" },
  openGraph: {
    title: "Performance Metrics | Jordan Lang",
    description: "Real-time Lighthouse scores and Core Web Vitals for this site. See how Next.js delivers near-perfect performance compared to WordPress and Squarespace.",
    type: "website",
  },
};

// Mock data for fallback when API is unavailable
const FALLBACK_METRICS = {
  mobile: {
    scores: {
      performance: 98,
      accessibility: 100,
      bestPractices: 100,
      seo: 100,
    },
    vitals: {
      lcp: { value: 1200, displayValue: "1.2 s", pass: true },
      fid: { value: 8, displayValue: "8 ms", pass: true },
      cls: { value: 0.02, displayValue: "0.02", pass: true },
    },
  },
  desktop: {
    scores: {
      performance: 100,
      accessibility: 100,
      bestPractices: 100,
      seo: 100,
    },
    vitals: {
      lcp: { value: 800, displayValue: "0.8 s", pass: true },
      fid: { value: 5, displayValue: "5 ms", pass: true },
      cls: { value: 0.01, displayValue: "0.01", pass: true },
    },
  },
  fetchedAt: new Date().toISOString(),
};

export default async function PerformancePage() {
  // Fetch live performance metrics or use fallback (disclosed as sample data in the UI)
  const metrics = await fetchLighthouseScores(SITE_URL);
  const data = metrics ?? FALLBACK_METRICS;
  const isSample = metrics === null;

  // Generate WebPage schema with performance context
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Performance Metrics",
    description:
      "Real-time Lighthouse scores and Core Web Vitals demonstrating Next.js performance advantages over WordPress and Squarespace.",
    url: `${SITE_URL}/performance`,
    mainEntity: {
      "@type": "WebPageElement",
      name: "Performance Dashboard",
      description:
        "Live performance metrics including Lighthouse scores and Core Web Vitals, with benchmark comparisons against typical WordPress and Squarespace sites.",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Jordan Lang",
      url: SITE_URL,
    },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pb-12 pt-32 md:pb-16 lg:pb-20">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Performance Metrics
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Real-time Lighthouse scores and Core Web Vitals. See how modern Next.js
            development delivers measurably better performance than WordPress and
            Squarespace.
          </p>
        </div>
        <PerformanceMetrics data={data} isSample={isSample} />
      </main>
    </>
  );
}
