import type { Metadata } from "next";
import PromoOrderView from "@/components/services/PromoOrderView";
import { getAddonFeatures, getPromoContent, getServicePackages } from "@/lib/cms";
import { toPackageRecord } from "@/lib/content/packages";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Exclusive Offer | Jordan Lang",
  description: "A limited-time discount on web design and development packages.",
  alternates: { canonical: "/promo" },
  robots: { index: false, follow: true },
};

export default async function PromoPage() {
  const [packages, addons, promo] = await Promise.all([
    getServicePackages(),
    getAddonFeatures(),
    getPromoContent(),
  ]);

  return (
    <PromoOrderView
      packages={toPackageRecord(packages, "promo")}
      addons={addons ?? undefined}
      promo={promo?.active ? promo : undefined}
    />
  );
}
