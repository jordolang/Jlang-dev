import { getSanityClient, sanityIsConfigured } from '@/sanity/lib/client';
import { isDraftMode } from './cms';
import { urlForImage, type SanityImageRef } from '@/sanity/lib/image';
import { logger } from './logger';

export interface DigitalProduct {
  slug: string;
  name: string;
  description: string;
  price: string;
  basePrice: number;
  previewImage: {
    url: string;
    alt?: string;
  };
  category: string;
  features?: string[];
  downloadUrl?: string;
}

const PRODUCT_PROJECTION = `{
  "slug": slug.current,
  name,
  description,
  price,
  basePrice,
  previewImage { asset->{ _id, url }, alt },
  category,
  features,
  // Only free products expose their file; paid downloads go through signed tokens.
  "downloadUrl": select(basePrice == 0 => downloadUrl)
}`;

interface RawSanityProduct extends Omit<DigitalProduct, 'previewImage'> {
  previewImage: SanityImageRef | null;
}

function normalizeSanityProduct(product: RawSanityProduct): DigitalProduct {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    basePrice: product.basePrice,
    previewImage: {
      url: urlForImage(product.previewImage) ?? '/images/products/default.svg',
      alt: product.name,
    },
    category: product.category,
    features: product.features,
    downloadUrl: product.downloadUrl ?? undefined,
  };
}

async function getSanityProducts(): Promise<DigitalProduct[]> {
  if (!sanityIsConfigured) return [];
  const draft = await isDraftMode();
  // In Presentation, an unpublished product is exactly the thing the editor wants to look at, so the
  // `published` gate only applies to the live site.
  const filter = draft
    ? `*[_type == "digitalProduct" && defined(slug.current)]`
    : `*[_type == "digitalProduct" && published == true && defined(slug.current)]`;
  try {
    const products = await getSanityClient(draft).fetch<RawSanityProduct[]>(
      `${filter} | order(order asc) ${PRODUCT_PROJECTION}`,
      {},
      draft ? { cache: 'no-store' } : { next: { revalidate: 60, tags: ['digitalProducts'] } },
    );
    return (products ?? []).map(normalizeSanityProduct);
  } catch (error) {
    logger.error('Error fetching products from Sanity:', error);
    return [];
  }
}

/** Get all digital products. */
export async function getAllProducts(): Promise<DigitalProduct[]> {
  return getSanityProducts();
}

/** Get a single product by slug. */
export async function getProduct(slug: string): Promise<DigitalProduct | null> {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

/** Get all unique categories from products. */
export async function getAllProductCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const categorySet = new Set<string>();
  products.forEach((product) => {
    if (product.category) {
      categorySet.add(product.category);
    }
  });
  return Array.from(categorySet).sort();
}

/** Get all products in a specific category. */
export async function getProductsByCategory(category: string): Promise<DigitalProduct[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.category === category);
}
