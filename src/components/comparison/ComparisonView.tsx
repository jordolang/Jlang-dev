"use client";

import { Background, Footer, Navigation } from "@/components/portfolio";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { CmsComparisonPage } from "@/lib/cms";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { logger } from "@/lib/logger";

interface ComparisonViewProps {
  data: CmsComparisonPage;
}

export default function ComparisonView({ data }: ComparisonViewProps) {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const toggleFeature = (index: number) => {
    setExpandedFeature(prev => prev === index ? null : index);
    if (expandedFeature !== index) {
      trackEvent(AnalyticsEvents.FEATURE_ADDED, {
        feature_name: data.features[index]?.feature || `feature-${index}`
      });
    }
  };

  const handleCtaClick = () => {
    trackEvent(AnalyticsEvents.CTA_CLICKED, {
      cta_location: 'comparison_page',
      cta_text: data.ctaText || 'Get Started'
    });
  };

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
            {data.subtitle && (
              <p className="mx-auto mb-4 max-w-3xl text-xl text-muted-foreground md:text-2xl">
                {data.subtitle}
              </p>
            )}
            {data.description && (
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {data.description}
              </p>
            )}

            {/* Hero Image */}
            {data.heroImage && (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-12 max-w-4xl"
              >
                <img
                  src={data.heroImage}
                  alt={data.title}
                  width={data.heroImageWidth}
                  height={data.heroImageHeight}
                  className="rounded-lg shadow-2xl"
                />
              </m.div>
            )}
          </m.section>

          {/* Comparison Section */}
          <m.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <div className="mx-auto max-w-6xl">
              {/* Desktop: Table View */}
              <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-lg lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="p-4 text-left font-semibold">Feature</th>
                      <th className="p-4 text-center font-semibold text-primary">
                        Custom Development
                      </th>
                      <th className="p-4 text-center font-semibold">
                        Website Builders
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.features.map((feature, index) => (
                      <tr
                        key={index}
                        className="border-b border-border/50 transition-colors hover:bg-muted/30"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {feature.icon && (
                              <Icon
                                icon={feature.icon}
                                className="h-6 w-6 text-primary"
                              />
                            )}
                            <span className="font-medium">{feature.feature}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                            <Icon icon="mdi:check-circle" className="h-5 w-5" />
                            <span>{feature.us}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-destructive">
                            <Icon icon="mdi:alert-circle" className="h-5 w-5" />
                            <span>{feature.competitors}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: Card View */}
              <div className="space-y-4 lg:hidden">
                {data.features.map((feature, index) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="rounded-lg border border-border bg-card shadow-md"
                  >
                    <button
                      onClick={() => toggleFeature(index)}
                      className="w-full p-4 text-left transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {feature.icon && (
                            <Icon
                              icon={feature.icon}
                              className="h-6 w-6 text-primary"
                            />
                          )}
                          <span className="font-semibold">{feature.feature}</span>
                        </div>
                        <Icon
                          icon={expandedFeature === index ? "mdi:chevron-up" : "mdi:chevron-down"}
                          className="h-6 w-6 text-muted-foreground"
                        />
                      </div>
                    </button>

                    {expandedFeature === index && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-border px-4 pb-4"
                      >
                        <div className="mt-4 space-y-3">
                          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                            <div className="flex items-start gap-2">
                              <Icon
                                icon="mdi:check-circle"
                                className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                              />
                              <div>
                                <p className="font-medium text-green-900 dark:text-green-100">
                                  Custom Development
                                </p>
                                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                                  {feature.us}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                            <div className="flex items-start gap-2">
                              <Icon
                                icon="mdi:alert-circle"
                                className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
                              />
                              <div>
                                <p className="font-medium text-red-900 dark:text-red-100">
                                  Website Builders
                                </p>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                  {feature.competitors}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </m.div>
                    )}
                  </m.div>
                ))}
              </div>
            </div>
          </m.section>

          {/* CTA Section */}
          {(data.ctaText || data.ctaLink) && (
            <m.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-lg md:p-12">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  {data.ctaText || "Ready to Get Started?"}
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Choose custom development for a website that grows with your business.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href={data.ctaLink || "/services"}
                    onClick={handleCtaClick}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                  >
                    <span>View Services</span>
                    <Icon icon="mdi:arrow-right" className="h-5 w-5" />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-4 font-semibold text-primary transition-all hover:bg-primary/10"
                  >
                    <span>Contact Me</span>
                    <Icon icon="mdi:message" className="h-5 w-5" />
                  </Link>
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
