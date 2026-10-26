import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      // The business guides link to the short slug; the project lives at the -desktop slug.
      {
        source: "/projects/neff-paving",
        destination: "/projects/neff-paving-desktop",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      // /resume is a page for browsers, but `curl jlang.dev/resume | bash` must still get the
      // terminal script. Browsers ask for text/html; curl, wget and friends don't. Client-side
      // <Link> navigation and prefetch send `RSC: 1` instead, so those must reach the page too.
      beforeFiles: [
        {
          source: "/resume",
          missing: [
            { type: "header", key: "accept", value: "(.*)text/html(.*)" },
            { type: "header", key: "rsc" },
          ],
          destination: "/api/resume",
        },
      ],
      afterFiles: [
        {
          source: "/ingest/static/:path*",
          destination: "https://us-assets.i.posthog.com/static/:path*",
        },
        {
          source: "/ingest/:path*",
          destination: "https://us.i.posthog.com/:path*",
        },
        {
          source: "/ingest/decide",
          destination: "https://us.i.posthog.com/decide",
        },
        {
          source: "/resume/launch.sh",
          destination: "/api/resume",
        },
        {
          source: "/api/resume/launch.sh",
          destination: "/api/resume",
        },
        {
          source: "/resume/portfolio.py",
          destination: "/api/resume/portfolio.py",
        },
      ],
    };
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
