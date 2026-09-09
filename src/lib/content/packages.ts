import type { CmsServicePackage } from "@/lib/cms";

/** The shape the /services and /promo order forms consume. */
export interface OrderFormPackage {
  name: string;
  price: string;
  basePrice: number | null;
  gradient: string;
  features: string[];
  originalPrice?: string;
  originalBasePrice?: number | null;
}

/**
 * Key the CMS packages by slug for the order forms.
 *
 * In "promo" mode the promo price becomes the headline price and the standard price moves to
 * `originalPrice`, which is what the /promo page strikes through. Returns undefined when the CMS
 * has no packages, so the caller falls back to its bundled copy.
 */
export function toPackageRecord(
  packages: CmsServicePackage[] | null,
  mode: "standard" | "promo",
): Record<string, OrderFormPackage> | undefined {
  if (!packages?.length) return undefined;

  const entries = packages.map((pkg) => {
    const base: OrderFormPackage = {
      name: pkg.name,
      price: pkg.price,
      basePrice: pkg.basePrice ?? null,
      gradient: pkg.gradient,
      features: pkg.features,
    };

    if (mode === "promo") {
      return [
        pkg.slug,
        {
          ...base,
          price: pkg.promoPrice || pkg.price,
          basePrice: pkg.promoBasePrice ?? pkg.basePrice ?? null,
          originalPrice: pkg.price,
          originalBasePrice: pkg.basePrice ?? null,
        },
      ] as const;
    }

    return [pkg.slug, base] as const;
  });

  return Object.fromEntries(entries);
}
