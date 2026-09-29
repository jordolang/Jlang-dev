import type { Metadata } from "next";
import ServicesOrderView from "@/components/services/ServicesOrderView";
import { getAddonFeatures, getServicePackages, getFaqs } from "@/lib/cms";
import { toPackageRecord } from "@/lib/content/packages";
import { JsonLd } from "@/components/JsonLd";
import { generateServiceSchema, generateFAQPageSchema } from "@/lib/schema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services & Pricing | Jordan Lang",
  description: "Web design and development packages — pick a package, add the features you need, and order in minutes.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Pricing | Jordan Lang",
    description: "Web design and development packages — pick a package, add the features you need, and order in minutes.",
    type: "website",
  },
};

export default async function ServicesPage() {
  const [packages, addons, faqs] = await Promise.all([getServicePackages(), getAddonFeatures(), getFaqs()]);

  // Generate Service schema with offers from packages
  const serviceSchema = generateServiceSchema({
    name: "Web Design and Development Services",
    description:
      "Professional web design and development packages for businesses. Custom websites, e-commerce solutions, and web applications built with modern technologies.",
    provider: {
      name: "Jordan Lang",
      url: "https://jordanlang.dev",
    },
    offers:
      packages?.map((pkg) => ({
        name: pkg.name,
        description: pkg.description,
        price: pkg.basePrice ?? 0,
        priceCurrency: "USD",
      })) ?? [],
    areaServed: "United States",
    serviceType: "Web Development",
  });

  // Generate FAQPage schema if FAQs are available
  const faqSchema = faqs
    ? generateFAQPageSchema({
        questions: faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        })),
      })
    : null;

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <ServicesOrderView packages={toPackageRecord(packages, "standard")} addons={addons ?? undefined} />
    </>
  );
}
