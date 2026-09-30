import type { Metadata } from "next";
import ServicesOrderView from "@/components/services/ServicesOrderView";
import { getAddonFeatures, getServicePackages } from "@/lib/cms";
import { toPackageRecord } from "@/lib/content/packages";
import { JsonLd } from "@/components/JsonLd";
import { generateServiceSchema, SITE_URL } from "@/lib/schema";

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
  const [packages, addons] = await Promise.all([getServicePackages(), getAddonFeatures()]);

  // Generate Service schema with offers from packages
  const serviceSchema = generateServiceSchema({
    name: "Web Design and Development Services",
    description:
      "Professional web design and development packages for businesses. Custom websites, e-commerce solutions, and web applications built with modern technologies.",
    provider: {
      name: "Jordan Lang",
      url: SITE_URL,
    },
    offers:
      packages?.filter((pkg) => pkg.basePrice != null).map((pkg) => ({
        name: pkg.name,
        description: pkg.description,
        price: pkg.basePrice!,
        priceCurrency: "USD",
      })) ?? [],
    areaServed: "United States",
    serviceType: "Web Development",
  });

  return (
    <>
      <JsonLd data={serviceSchema} />
      <ServicesOrderView packages={toPackageRecord(packages, "standard")} addons={addons ?? undefined} />
    </>
  );
}
