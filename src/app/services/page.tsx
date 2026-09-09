import type { Metadata } from "next";
import ServicesOrderView from "@/components/services/ServicesOrderView";
import { getAddonFeatures, getServicePackages } from "@/lib/cms";
import { toPackageRecord } from "@/lib/content/packages";

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

  return <ServicesOrderView packages={toPackageRecord(packages, "standard")} addons={addons ?? undefined} />;
}
