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
  async rewrites() {
    return {
      // /resume is a page for browsers, but `curl jlang.dev/resume | bash` must still get the
      // terminal script. Browsers ask for text/html; curl, wget and friends don't.
      beforeFiles: [
        {
          source: "/resume",
          missing: [{ type: "header", key: "accept", value: "(.*)text/html(.*)" }],
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
