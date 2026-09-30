import "server-only";

/**
 * Server-side performance metrics layer.
 *
 * Fetches Lighthouse scores and Core Web Vitals from PageSpeed Insights API.
 * Returns `null` when the API is unconfigured, unreachable, or rate-limited.
 * Callers fall back to cached or placeholder data when null.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface CoreWebVitals {
  lcp: {
    value: number;
    displayValue: string;
    pass: boolean;
  };
  fid: {
    value: number;
    displayValue: string;
    pass: boolean;
  };
  cls: {
    value: number;
    displayValue: string;
    pass: boolean;
  };
}

export interface PerformanceMetrics {
  mobile: {
    scores: LighthouseScore;
    vitals: CoreWebVitals;
  };
  desktop: {
    scores: LighthouseScore;
    vitals: CoreWebVitals;
  };
  fetchedAt: string;
}

interface PageSpeedResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      "best-practices": { score: number };
      seo: { score: number };
    };
    audits: {
      "largest-contentful-paint": {
        displayValue: string;
        numericValue: number;
      };
      "first-input-delay": {
        displayValue: string;
        numericValue: number;
      };
      "cumulative-layout-shift": {
        displayValue: string;
        numericValue: number;
      };
    };
  };
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PAGESPEED_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

function getApiKey(): string | null {
  return process.env.GOOGLE_PAGESPEED_API_KEY || null;
}

// ---------------------------------------------------------------------------
// Core Web Vitals Thresholds
// https://web.dev/vitals/
// ---------------------------------------------------------------------------

const THRESHOLDS = {
  lcp: 2500, // ms - good < 2.5s
  fid: 100,  // ms - good < 100ms
  cls: 0.1,  // score - good < 0.1
};

// ---------------------------------------------------------------------------
// API Fetching
// ---------------------------------------------------------------------------

async function fetchPageSpeedData(
  url: string,
  strategy: "mobile" | "desktop",
): Promise<PageSpeedResponse | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[performance] GOOGLE_PAGESPEED_API_KEY not configured");
    return null;
  }

  const params = new URLSearchParams({
    url,
    key: apiKey,
    strategy,
    category: ["performance", "accessibility", "best-practices", "seo"].join(","),
  });

  try {
    const response = await fetch(`${PAGESPEED_API_URL}?${params}`, {
      next: { revalidate: 604800 }, // Cache for 1 week (604800 seconds)
    });

    if (!response.ok) {
      console.error(`[performance] PageSpeed API failed (${strategy}): ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`[performance] Failed to fetch PageSpeed data (${strategy}):`, error);
    return null;
  }
}

function parseScores(data: PageSpeedResponse): LighthouseScore {
  const categories = data.lighthouseResult.categories;
  return {
    performance: Math.round((categories.performance.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility.score ?? 0) * 100),
    bestPractices: Math.round((categories["best-practices"].score ?? 0) * 100),
    seo: Math.round((categories.seo.score ?? 0) * 100),
  };
}

function parseVitals(data: PageSpeedResponse): CoreWebVitals {
  const audits = data.lighthouseResult.audits;

  const lcp = audits["largest-contentful-paint"];
  const fid = audits["first-input-delay"] || { displayValue: "N/A", numericValue: 0 };
  const cls = audits["cumulative-layout-shift"];

  return {
    lcp: {
      value: lcp.numericValue,
      displayValue: lcp.displayValue,
      pass: lcp.numericValue < THRESHOLDS.lcp,
    },
    fid: {
      value: fid.numericValue,
      displayValue: fid.displayValue,
      pass: fid.numericValue < THRESHOLDS.fid,
    },
    cls: {
      value: cls.numericValue,
      displayValue: cls.displayValue,
      pass: cls.numericValue < THRESHOLDS.cls,
    },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch Lighthouse scores and Core Web Vitals for both mobile and desktop.
 *
 * @param url - The URL to analyze (typically the production site URL)
 * @returns Performance metrics or null if unavailable
 */
export async function fetchLighthouseScores(url: string): Promise<PerformanceMetrics | null> {
  if (!url) {
    console.warn("[performance] No URL provided");
    return null;
  }

  try {
    const [mobileData, desktopData] = await Promise.all([
      fetchPageSpeedData(url, "mobile"),
      fetchPageSpeedData(url, "desktop"),
    ]);

    if (!mobileData || !desktopData) {
      console.warn("[performance] Failed to fetch data for one or both strategies");
      return null;
    }

    return {
      mobile: {
        scores: parseScores(mobileData),
        vitals: parseVitals(mobileData),
      },
      desktop: {
        scores: parseScores(desktopData),
        vitals: parseVitals(desktopData),
      },
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[performance] fetchLighthouseScores failed:", error);
    return null;
  }
}
