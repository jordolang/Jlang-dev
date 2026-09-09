"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import SectionHeader from "./SectionHeader";

interface Addon {
  label: string;
  price?: number;
  /** Exact additionalFeatures name — when set on Launchpad, the order form pre-selects it. */
  feature?: string;
}

interface PricingPackage {
  name: string;
  price: string;
  description: string;
  gradient: string;
  /** Short, scannable bullets shown on the card. */
  highlights: string[];
  /** Full categorized breakdown shown only inside the details dialog. */
  features: string[];
  addons?: Addon[];
  addonsNote?: string;
  popular: boolean;
}

export const pricingPackages: PricingPackage[] = [
  {
    name: "Launchpad",
    price: "$499",
    description: "Perfect for launching a basic online presence",
    gradient: "from-blue-600 to-cyan-600",
    highlights: [
      "Single-page responsive website",
      "Mobile-first, high-impact design",
      "24-hour turnaround",
      "Free lifetime hosting + 1-yr domain",
      "1 month of post-launch support",
    ],
    features: [
      "🖥️ Design & Development",
      "Single-page responsive website with high-impact design",
      "Mobile-first design optimized for smartphones & tablets",
      "Next-day turnaround: Fully published within 24 hours",
      "",
      "⚙️ Integrations & Performance",
      "Secure contact form integration",
      "Full social media integration",
      "Basic SEO: Essential on-page optimization",
      "Basic analytics platform setup (Google Analytics)",
      "",
      "🌐 Hosting & Support",
      "Simple 1-year domain registration included",
      "Free lifetime web hosting on optimized servers",
      "1 month of post-launch support & bug fixes",
    ],
    addons: [
      { label: "E-commerce", price: 299, feature: "E-commerce Integration" },
      { label: "Blog / CMS", price: 99, feature: "Blog/CMS System" },
      { label: "Booking system", price: 199, feature: "Booking System" },
      { label: "Live chat", price: 99, feature: "Live Chat Widget" },
    ],
    addonsNote: "Popular add-ons — tap to include one",
    popular: false,
  },
  {
    name: "Professional",
    price: "Starting at $1,499+",
    description: "Ideal for growing businesses with advanced features",
    gradient: "from-purple-600 to-pink-600",
    highlights: [
      "Custom 5–25 page website",
      "Advanced SEO, analytics & email marketing",
      "Optional e-commerce + Stripe payments",
      "AI chatbot & business integrations",
      "6 months of support & maintenance",
    ],
    features: [
      "💻 Development & Design",
      "Custom-built website: 5-25 pages, responsive design",
      "Custom design & branding aligned with your identity",
      "Blog/CMS integration (+$1,000 for custom admin panel)",
      "Comprehensive performance optimization",
      "",
      "📈 Marketing & SEO",
      "Advanced SEO optimization for organic traffic",
      "Google My Business & Facebook Business Page setup",
      "Small business social media campaigns",
      "Advanced analytics & tracking for deep insights",
      "Email marketing platform integration",
      "Local premium ad campaigns available (add-on)",
      "",
      "🔒 Integrations & Functionality",
      "Optional basic e-commerce & Stripe payment integration",
      "FB Messenger or AI chatbot widget for support",
      "Lead management & financial systems integration",
      "Custom business forms & PDFs tailored to your needs",
      "Third-party application support available",
      "Basic AI integration (API/service fees not included)",
      "",
      "⭐ Support & Flexibility",
      "6 months of post-launch support & maintenance",
      "Extra features available upon request",
    ],
    addons: [
      { label: "Custom admin panel", price: 1000 },
      { label: "Premium ad campaigns" },
      { label: "Advanced AI integrations" },
    ],
    addonsNote: "Optional upgrades",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    description: "Ultimate solution for high-growth businesses",
    gradient: "from-indigo-600 to-violet-600",
    highlights: [
      "Unlimited custom pages, features & APIs",
      "Dedicated cloud hosting & 24/7 monitoring",
      "Advanced e-commerce & secure payments",
      "Full launch & marketing campaign",
      "Dedicated manager + 1-year priority support",
    ],
    features: [
      "💻 Platform & Development",
      "Full custom solution: Unlimited pages, custom design, bespoke development",
      "Maximum scalability: Cloud hosting on dedicated servers for peak traffic",
      "Custom features & APIs: Bespoke functionality, integrations, custom endpoints",
      "Core infrastructure: Automated backups (50GB offsite), DNS/subdomain management, .com domain guarantee",
      "",
      "🛒 E-Commerce & Functionality",
      "Advanced e-commerce: Unlimited products, custom product pages, automated ordering",
      "Third-party integration: Seamless connection to Shopify, Magento, custom cart/order processing",
      "Secure payment processing: Stripe, Square POS, PayPal POS, and other leading payment APIs",
      "Enhanced security: SSO/OAuth support, SSL certificates, encryption for data safety",
      "",
      "🛡️ Security & Performance",
      "Priority hosting: 24/7 uptime monitoring & management on dedicated servers",
      "Security assurance: Regular audits, optimizations, 24/7 threat protection",
      "",
      "📈 Brand Launch & Marketing",
      "Full-spectrum launch campaign: Custom branding, 3-month pre-launch campaign (social, newspaper, TV, radio)",
      "Branded promotional materials: Vehicle wraps, banners, mugs, business forms, promotional videos",
      "Digital presence: Reputation management, Google My Business personalization",
      "Integrated AI solutions for business efficiency",
      "",
      "⭐ Support & Training",
      "Dedicated account manager",
      "1-year priority support included",
      "Comprehensive training & documentation for admins, users, developers",
      "Enterprise email: Up to 100+ custom email accounts unique to your domain",
      "Multi-language support for global reach",
    ],
    addonsNote: "Everything included — fully bespoke",
    popular: false,
  },
];

export const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on complexity. A Launchpad package typically takes less than 24 hours, Professional packages take 1-4 weeks, and Enterprise solutions can typically take up to 90 days depending on custom requirements.",
  },
  {
    question: "What's included in post-launch support?",
    answer:
      "Post-launch support includes bug fixes, minor content updates, technical assistance, and guidance on using your website. The duration varies by package: 1 month for Launchpad, 3 months for Professional, and 6 months for Enterprise.",
  },
  {
    question: "Do you provide hosting and domain services?",
    answer:
      "I can help you set up hosting and domain registration, or work with your existing providers. I recommend Vercel for hosting (which offers excellent performance and free tier options) and can guide you through the entire setup process.",
  },
  {
    question: "What are your payment terms?",
    answer:
      "Projects typically follow a 50% deposit to begin work, 25% at the midpoint milestone, and 25% upon completion. For Enterprise packages, we can arrange custom payment schedules to fit your budget.",
  },
  {
    question: "Can I request revisions during development?",
    answer:
      "Absolutely! Each package includes revision rounds at key milestones. Launchpad includes 2 revision rounds, Professional includes 3 rounds, and Enterprise includes unlimited revisions during the development phase.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "I primarily use modern, industry-standard technologies including Next.js, React, TypeScript, and Tailwind CSS. The specific tech stack is chosen based on your project requirements to ensure optimal performance, scalability, and maintainability.",
  },
];

/** Detect a category header (line starting with an emoji) inside a feature list. */
function isCategoryHeader(feature: string): boolean {
  return /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(feature);
}

function orderHref(pkg: PricingPackage): string {
  return `/services?package=${pkg.name.toLowerCase()}`;
}

/** Full pricing breakdown in an accessible dialog — "exactly what you get for the cost". */
function PricingDialog({ pkg, onClose }: { pkg: PricingPackage; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <m.div
        role="dialog"
        aria-modal="true"
        aria-label={`${pkg.name} package details`}
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:rounded-3xl"
      >
        <div className={`relative bg-gradient-to-r ${pkg.gradient} p-6 text-white`}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1 text-white/90 transition-colors hover:bg-white/20 hover:text-white"
          >
            <Icon icon="solar:close-circle-bold" width={26} height={26} />
          </button>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">What you get</p>
          <h3 className="mt-1 text-2xl font-bold">{pkg.name}</h3>
          <p className="mt-1 text-3xl font-bold">{pkg.price}</p>
          <p className="mt-1 text-sm text-white/85">{pkg.description}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <ul className="space-y-2.5">
            {pkg.features.map((feature, idx) => {
              if (feature === "") return <li key={idx} className="h-1" aria-hidden="true" />;
              if (isCategoryHeader(feature)) {
                return (
                  <li key={idx} className="pt-3 text-sm font-bold text-gray-900 dark:text-white">
                    {feature}
                  </li>
                );
              }
              return (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <Icon
                    icon="solar:check-circle-bold"
                    className={`mt-0.5 flex-shrink-0 bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}
                    width={18}
                    height={18}
                  />
                  <span>{feature}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <Link href={orderHref(pkg)} onClick={() => trackEvent(AnalyticsEvents.PRICING_CTA_CLICKED, { package: pkg.name.toLowerCase(), location: "pricing_dialog" })}>
            <m.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${pkg.gradient} py-3 font-semibold text-white shadow-lg`}
            >
              Order Now
              <Icon icon="solar:arrow-right-bold" width={18} height={18} />
            </m.span>
          </Link>
        </div>
      </m.div>
    </m.div>
  );
}

interface ServicesSectionProps {
  /** Packages and FAQs from Sanity. Each falls back to the lists above when the CMS has none. */
  packages?: PricingPackage[];
  faqs?: { question: string; answer: string }[];
  heading?: { tagText?: string; tagIcon?: string; heading?: string; description?: string };
}

export default function ServicesSection({ packages, faqs: cmsFaqs, heading }: ServicesSectionProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [detailsPackage, setDetailsPackage] = useState<PricingPackage | null>(null);

  const packageList = packages?.length ? packages : pricingPackages;
  const faqList = cmsFaqs?.length ? cmsFaqs : faqs;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
    trackEvent(AnalyticsEvents.FAQ_TOGGLED, { question_index: index });
  };

  const openDetails = (pkg: PricingPackage) => {
    setDetailsPackage(pkg);
    trackEvent(AnalyticsEvents.PRICING_CTA_CLICKED, { package: pkg.name.toLowerCase(), location: "view_details" });
  };

  return (
    <m.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mb-16 md:mb-24"
    >
      <SectionHeader
        heading={heading?.heading ?? "Web Design & Development Services"}
        description={heading?.description ?? "Custom web solutions tailored to your business — pick a package and order in minutes."}
        tagIcon={heading?.tagIcon ?? "solar:code-square-bold"}
        tagText={heading?.tagText ?? "Services"}
        centered={true}
      />

      {/* Core System Integration — condensed banner with the heading + a single CTA */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-12 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-600/10 via-blue-600/10 to-cyan-600/10 p-6 dark:border-indigo-800 dark:from-indigo-600/20 dark:via-blue-600/20 dark:to-cyan-600/20 md:p-8"
      >
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 p-3">
              <Icon icon="solar:database-bold" className="text-white" width={32} height={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
                Core System Integration &amp; Data Strategy
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                A custom, high-performance data backbone that speaks your company&apos;s language and effortlessly handles all third-party data exchange.
              </p>
            </div>
          </div>

          <Link
            href="/services"
            onClick={() => trackEvent(AnalyticsEvents.PRICING_CTA_CLICKED, { package: "enterprise", location: "core_system_banner" })}
            className="w-full md:w-auto"
          >
            <m.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 md:w-auto"
            >
              Order Now
              <Icon icon="solar:arrow-right-bold" width={18} height={18} />
            </m.span>
          </Link>
        </div>
      </m.div>

      {/* Pricing Cards — short highlights + Choose / details, add-ons on cheaper tiers */}
      <div className="mb-14 grid items-stretch gap-8 md:grid-cols-3">
        {packageList.map((pkg, index) => (
          <m.div
            key={pkg.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                <div className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                  BEST VALUE
                </div>
              </div>
            )}

            <div
              className={`flex h-full flex-col rounded-2xl bg-white p-7 transition-all duration-300 dark:bg-gray-800 ${
                pkg.popular
                  ? "border-2 border-purple-500 shadow-xl shadow-purple-500/20 dark:border-purple-600"
                  : "border-2 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              }`}
            >
              <div className={`mb-5 inline-block self-start rounded-xl bg-gradient-to-r ${pkg.gradient} px-4 py-2`}>
                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
              </div>

              <div className="mb-5">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{pkg.price}</div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{pkg.description}</p>
              </div>

              <ul className="mb-5 space-y-2.5">
                {pkg.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      icon="solar:check-circle-bold"
                      className={`mt-0.5 flex-shrink-0 bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}
                      width={18}
                      height={18}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => openDetails(pkg)}
                className="mb-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <Icon icon="solar:list-check-bold" width={16} height={16} />
                View full details
              </button>

              <div className="mt-auto">
                <Link href={orderHref(pkg)}>
                  <m.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => trackEvent(AnalyticsEvents.PRICING_CTA_CLICKED, { package: pkg.name.toLowerCase(), location: "pricing_card" })}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all duration-300 ${
                      pkg.popular
                        ? `bg-gradient-to-r ${pkg.gradient} text-white shadow-lg shadow-purple-500/30`
                        : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Choose {pkg.name}
                  </m.span>
                </Link>

                {/* Optional add-ons — short list under the button on cheaper tiers */}
                {pkg.addonsNote && (
                  <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700/60">
                    <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {pkg.addonsNote}
                    </p>
                    {pkg.addons && pkg.addons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.addons.map((addon) => {
                          const label = addon.price ? `${addon.label} +$${addon.price}` : addon.label;
                          const feature = addon.feature;
                          const chip =
                            "rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300";

                          if (feature) {
                            return (
                              <Link
                                key={addon.label}
                                href={`/services?package=${pkg.name.toLowerCase()}&feature=${encodeURIComponent(feature)}`}
                                onClick={() => trackEvent(AnalyticsEvents.FEATURE_CLICKED, { feature_name: feature, feature_price: addon.price ?? 0 })}
                                className={`${chip} transition-colors hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400`}
                              >
                                {label}
                              </Link>
                            );
                          }

                          return (
                            <span key={addon.label} className={chip}>
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </m.div>
        ))}
      </div>

      {/* FAQ Section */}
      <m.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-8 text-center">
          <h3 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400 md:text-3xl">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqList.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <button
                onClick={() => toggleFaq(index)}
                aria-expanded={expandedFaq === index}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <span className="pr-4 font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                <m.div animate={{ rotate: expandedFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <Icon icon="solar:alt-arrow-down-bold" className="flex-shrink-0 text-gray-500 dark:text-gray-400" width={22} height={22} />
                </m.div>
              </button>

              <m.div
                initial={false}
                animate={{
                  height: expandedFaq === index ? "auto" : 0,
                  opacity: expandedFaq === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 pt-1 leading-relaxed text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              </m.div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">Still have questions? Let&apos;s chat!</p>
          <Link href="/services">
            <m.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
            >
              Start Your Project
            </m.span>
          </Link>
        </div>
      </m.div>

      <AnimatePresence>
        {detailsPackage && (
          <PricingDialog pkg={detailsPackage} onClose={() => setDetailsPackage(null)} />
        )}
      </AnimatePresence>
    </m.section>
  );
}
