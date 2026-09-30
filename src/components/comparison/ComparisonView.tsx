"use client";

import { Background, Footer, Navigation } from "@/components/portfolio";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import type { CmsComparisonPage } from "@/lib/cms";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import CompetitorCard from "./CompetitorCard";
import ComparisonTable from "./ComparisonTable";

interface ComparisonViewProps {
  data: CmsComparisonPage;
}

export default function ComparisonView({ data }: ComparisonViewProps) {
  const handleCtaClick = (ctaText: string) => {
    trackEvent(AnalyticsEvents.CTA_CLICKED, {
      cta_location: 'comparison_page',
      cta_text: ctaText
    });
  };

  // Find the custom development competitor to use as the baseline
  const customCompetitor = data.competitors.find(c => c.isCustom);

  // Build comparison features from comparison categories if available
  const comparisonFeatures = data.comparisonCategories?.map(category => {
    // Map category names to competitor properties
    const categoryKey = category.category.toLowerCase();
    let customText = "Fully optimized";

    if (customCompetitor) {
      if (categoryKey.includes('seo')) {
        customText = customCompetitor.seoCapabilities || customText;
      } else if (categoryKey.includes('custom')) {
        customText = customCompetitor.customization || customText;
      } else if (categoryKey.includes('ownership')) {
        customText = customCompetitor.ownership || customText;
      } else if (categoryKey.includes('support')) {
        customText = customCompetitor.support || customText;
      }
    }

    return {
      feature: category.category,
      icon: category.icon,
      us: customText,
      competitors: "Limited or requires premium tier"
    };
  }) || [];

  return (
    <>
      <Background />
      <Navigation />

      <main className="relative min-h-screen pb-20">
        <div className="container mx-auto px-4 pt-24 md:pt-32">

          {/* Hero Section */}
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {data.title}
            </h1>
            {data.description && (
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {data.description}
              </p>
            )}
          </m.section>

          {/* Competitor Cards */}
          {data.competitors && data.competitors.length > 0 && (
            <m.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="mx-auto max-w-7xl">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.competitors.map((competitor, index) => (
                    <CompetitorCard
                      key={index}
                      {...competitor}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </m.section>
          )}

          {/* Comparison Table (if comparison categories exist) */}
          {comparisonFeatures.length > 0 && (
            <m.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                Feature Comparison
              </h2>
              <ComparisonTable
                features={comparisonFeatures}
                customLabel={customCompetitor?.name || "Custom Development"}
                competitorsLabel="Website Builders"
              />
            </m.section>
          )}

          {/* CTA Section */}
          {(data.ctaHeading || data.ctaPrimary || data.ctaSecondary) && (
            <m.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-lg md:p-12">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  {data.ctaHeading || "Ready to Get Started?"}
                </h2>
                {data.ctaDescription && (
                  <p className="mb-8 text-lg text-muted-foreground">
                    {data.ctaDescription}
                  </p>
                )}

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {data.ctaPrimary?.text && data.ctaPrimary?.url && (
                    <Link
                      href={data.ctaPrimary.url}
                      onClick={() => handleCtaClick(data.ctaPrimary?.text || 'Primary CTA')}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                    >
                      <span>{data.ctaPrimary.text}</span>
                      <Icon icon="mdi:arrow-right" className="h-5 w-5" />
                    </Link>
                  )}

                  {data.ctaSecondary?.text && data.ctaSecondary?.url && (
                    <Link
                      href={data.ctaSecondary.url}
                      onClick={() => handleCtaClick(data.ctaSecondary?.text || 'Secondary CTA')}
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-4 font-semibold text-primary transition-all hover:bg-primary/10"
                    >
                      <span>{data.ctaSecondary.text}</span>
                      <Icon icon="mdi:message" className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            </m.section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
