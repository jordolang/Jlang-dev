import { PostHogProvider } from "@/components/PostHogProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MotionProvider } from "@/components/MotionProvider";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { getSiteSettings } from "@/lib/cms";
import "./globals.css";

const DEFAULT_TITLE = "Jordan Lang | Web Developer & IT Specialist Portfolio";
const DEFAULT_DESCRIPTION =
  "Portfolio of Jordan Lang, a passionate web developer and IT specialist focused on contract web design and IT projects, creating modern digital solutions.";
const DEFAULT_KEYWORDS = "Jordan Lang, Web Developer, IT Specialist, Contract Web Design, Portfolio, Frontend Development";
const DEFAULT_OG_TITLE = "Jordan Lang - Web Developer & IT Specialist";
const DEFAULT_OG_DESCRIPTION =
  "Portfolio of Jordan Lang, specializing in contract web design and IT projects with modern technologies.";

/** SEO comes from Sanity when it's there; the values above are the fallback. */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.seoTitle || DEFAULT_TITLE;
  const description = settings?.seoDescription || DEFAULT_DESCRIPTION;
  const ogTitle = settings?.ogTitle || DEFAULT_OG_TITLE;
  const ogDescription = settings?.ogDescription || DEFAULT_OG_DESCRIPTION;
  const ogImage = settings?.ogImage || "/jlangdev.png";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev"),
    title,
    description,
    keywords: settings?.seoKeywords?.length ? settings.seoKeywords.join(", ") : DEFAULT_KEYWORDS,
    authors: [{ name: settings?.name || "Jordan Lang" }],
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: "/favicon.png",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: ogTitle,
      }],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Resolve the theme synchronously, before first paint, so the correct
            theme class is present at SSR-paint time. This prevents a
            light↔dark flash AND — critically — stops the hero logo from being
            swapped (and re-downloaded) after hydration, which was wrecking LCP. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":!window.matchMedia("(prefers-color-scheme: light)").matches;if(dark)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className="font-sans">
        <PostHogProvider>
          <ThemeProvider>
            <MotionProvider>
              {children}
            </MotionProvider>
          </ThemeProvider>
        </PostHogProvider>
        {/* Only mounted in draft mode, so the overlay bundle never reaches real visitors. */}
        {isDraft && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
        {/* Google Analytics (gtag.js) is loaded lazily on first interaction from
            PostHogProvider, alongside PostHog, to keep it out of the Total
            Blocking Time window. */}
      </body>
    </html>
  );
}
