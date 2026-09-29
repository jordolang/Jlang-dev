/**
 * JSON-LD structured data utilities for SEO.
 *
 * Generates type-safe Schema.org markup for rich search results. Each generator returns
 * an object that can be serialized and embedded in a <script type="application/ld+json"> tag.
 *
 * Optimized for Google Rich Results Test validation and eligibility.
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 * @see https://search.google.com/test/rich-results
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jordanlang.dev";

/**
 * Default image dimensions for rich results.
 * Google requires images to be at least 1200px wide for best results.
 */
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

/**
 * Base context for all JSON-LD schemas.
 */
interface WithContext {
  "@context": "https://schema.org";
  "@type": string;
}

/**
 * ImageObject for rich results.
 * Google recommends images be at least 1200px wide.
 */
export interface ImageObject {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

// ---------------------------------------------------------------------------
// Person Schema
// ---------------------------------------------------------------------------

export interface PersonSchemaProps {
  name: string;
  jobTitle?: string;
  url?: string;
  email?: string;
  telephone?: string;
  image?: string | { url: string; width?: number; height?: number };
  sameAs?: string[]; // Social media profiles
  worksFor?: {
    name: string;
    url?: string;
  };
  address?: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
}

export interface PersonSchema extends WithContext {
  "@type": "Person";
  name: string;
  jobTitle?: string;
  url?: string;
  email?: string;
  telephone?: string;
  image?: string | ImageObject;
  sameAs?: string[];
  worksFor?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  address?: {
    "@type": "PostalAddress";
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
}

export function generatePersonSchema(props: PersonSchemaProps): PersonSchema {
  const schema: PersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: props.name,
  };

  if (props.jobTitle) schema.jobTitle = props.jobTitle;
  if (props.url) schema.url = props.url;
  if (props.email) schema.email = props.email;
  if (props.telephone) schema.telephone = props.telephone;

  if (props.image) {
    if (typeof props.image === "string") {
      schema.image = props.image;
    } else {
      schema.image = {
        "@type": "ImageObject",
        url: props.image.url,
        ...(props.image.width && { width: props.image.width }),
        ...(props.image.height && { height: props.image.height }),
      };
    }
  }

  if (props.sameAs && props.sameAs.length > 0) schema.sameAs = props.sameAs;

  if (props.worksFor) {
    schema.worksFor = {
      "@type": "Organization",
      name: props.worksFor.name,
    };
    if (props.worksFor.url) schema.worksFor.url = props.worksFor.url;
  }

  if (props.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...(props.address.addressLocality && { addressLocality: props.address.addressLocality }),
      ...(props.address.addressRegion && { addressRegion: props.address.addressRegion }),
      ...(props.address.addressCountry && { addressCountry: props.address.addressCountry }),
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// LocalBusiness Schema
// ---------------------------------------------------------------------------

export interface LocalBusinessSchemaProps {
  name: string;
  description?: string;
  url?: string;
  telephone?: string;
  email?: string;
  image?: string | { url: string; width?: number; height?: number };
  priceRange?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  sameAs?: string[];
  areaServed?: string | string[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
}

export interface LocalBusinessSchema extends WithContext {
  "@type": "LocalBusiness";
  name: string;
  description?: string;
  url: string;
  telephone?: string;
  email?: string;
  image?: string | ImageObject;
  priceRange?: string;
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: Array<{
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  sameAs?: string[];
  areaServed?: string | string[];
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
}

export function generateLocalBusinessSchema(props: LocalBusinessSchemaProps): LocalBusinessSchema {
  const schema: LocalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: props.name,
    url: props.url || SITE_URL,
  };

  if (props.description) schema.description = props.description;
  if (props.telephone) schema.telephone = props.telephone;
  if (props.email) schema.email = props.email;

  if (props.image) {
    if (typeof props.image === "string") {
      schema.image = props.image;
    } else {
      schema.image = {
        "@type": "ImageObject",
        url: props.image.url,
        width: props.image.width || DEFAULT_IMAGE_WIDTH,
        height: props.image.height || DEFAULT_IMAGE_HEIGHT,
      };
    }
  }

  if (props.priceRange) schema.priceRange = props.priceRange;
  if (props.sameAs && props.sameAs.length > 0) schema.sameAs = props.sameAs;
  if (props.areaServed) schema.areaServed = props.areaServed;

  if (props.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...(props.address.streetAddress && { streetAddress: props.address.streetAddress }),
      ...(props.address.addressLocality && { addressLocality: props.address.addressLocality }),
      ...(props.address.addressRegion && { addressRegion: props.address.addressRegion }),
      ...(props.address.postalCode && { postalCode: props.address.postalCode }),
      ...(props.address.addressCountry && { addressCountry: props.address.addressCountry }),
    };
  }

  if (props.geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: props.geo.latitude,
      longitude: props.geo.longitude,
    };
  }

  if (props.openingHours && props.openingHours.length > 0) {
    schema.openingHoursSpecification = props.openingHours.map((hours) => {
      const [days, times] = hours.split(" ");
      const [opens, closes] = times.split("-");
      const dayOfWeek = days.split(",");
      return {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek,
        opens,
        closes,
      };
    });
  }

  if (props.aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: props.aggregateRating.ratingValue,
      reviewCount: props.aggregateRating.reviewCount,
      bestRating: props.aggregateRating.bestRating ?? 5,
      worstRating: props.aggregateRating.worstRating ?? 1,
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// BlogPosting Schema
// ---------------------------------------------------------------------------

export interface BlogPostingSchemaProps {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  image: string | { url: string; width?: number; height?: number }; // Required for rich results
  publisher?: {
    name: string;
    logo?: string | { url: string; width?: number; height?: number };
  };
  tags?: string[];
  wordCount?: number;
}

export interface BlogPostingSchema extends WithContext {
  "@type": "BlogPosting";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": "Person";
    name: string;
    url?: string;
  };
  image: ImageObject | ImageObject[];
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: ImageObject;
  };
  keywords?: string[];
  wordCount?: number;
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
}

export function generateBlogPostingSchema(props: BlogPostingSchemaProps): BlogPostingSchema {
  const postUrl = `${SITE_URL}/blog/${props.slug}`;

  // Convert image to ImageObject
  const imageObj: ImageObject = typeof props.image === "string"
    ? {
        "@type": "ImageObject",
        url: props.image,
        width: DEFAULT_IMAGE_WIDTH,
        height: DEFAULT_IMAGE_HEIGHT,
      }
    : {
        "@type": "ImageObject",
        url: props.image.url,
        width: props.image.width || DEFAULT_IMAGE_WIDTH,
        height: props.image.height || DEFAULT_IMAGE_HEIGHT,
      };

  const schema: BlogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: props.headline,
    description: props.description,
    url: postUrl,
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    author: {
      "@type": "Person",
      name: props.author.name,
      ...(props.author.url && { url: props.author.url }),
    },
    image: imageObj,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  if (props.tags && props.tags.length > 0) schema.keywords = props.tags;
  if (props.wordCount) schema.wordCount = props.wordCount;

  if (props.publisher) {
    const publisherLogo = props.publisher.logo
      ? typeof props.publisher.logo === "string"
        ? {
            "@type": "ImageObject" as const,
            url: props.publisher.logo,
            width: 600,
            height: 60,
          }
        : {
            "@type": "ImageObject" as const,
            url: props.publisher.logo.url,
            width: props.publisher.logo.width || 600,
            height: props.publisher.logo.height || 60,
          }
      : undefined;

    schema.publisher = {
      "@type": "Organization",
      name: props.publisher.name,
      ...(publisherLogo && { logo: publisherLogo }),
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// Service Schema
// ---------------------------------------------------------------------------

export interface ServiceSchemaProps {
  name: string;
  description: string;
  provider: {
    name: string;
    url?: string;
  };
  offers?: Array<{
    name?: string;
    description?: string;
    price: number | string;
    priceCurrency?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
    url?: string;
  }>;
  areaServed?: string | string[];
  serviceType?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
}

export interface ServiceSchema extends WithContext {
  "@type": "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization" | "Person";
    name: string;
    url?: string;
  };
  offers?: Array<{
    "@type": "Offer";
    name?: string;
    description?: string;
    price: number | string;
    priceCurrency: string;
    availability?: string;
    url?: string;
  }>;
  areaServed?: string | string[];
  serviceType?: string;
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
}

export function generateServiceSchema(props: ServiceSchemaProps): ServiceSchema {
  const schema: ServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: props.name,
    description: props.description,
    provider: {
      "@type": "Organization",
      name: props.provider.name,
      ...(props.provider.url && { url: props.provider.url }),
    },
  };

  if (props.offers && props.offers.length > 0) {
    schema.offers = props.offers.map((offer) => ({
      "@type": "Offer",
      ...(offer.name && { name: offer.name }),
      ...(offer.description && { description: offer.description }),
      price: offer.price,
      priceCurrency: offer.priceCurrency || "USD",
      ...(offer.availability && { availability: `https://schema.org/${offer.availability}` }),
      ...(offer.url && { url: offer.url }),
    }));
  }

  if (props.areaServed) schema.areaServed = props.areaServed;
  if (props.serviceType) schema.serviceType = props.serviceType;

  if (props.aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: props.aggregateRating.ratingValue,
      reviewCount: props.aggregateRating.reviewCount,
      bestRating: props.aggregateRating.bestRating ?? 5,
      worstRating: props.aggregateRating.worstRating ?? 1,
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// FAQPage Schema
// ---------------------------------------------------------------------------

export interface FAQPageSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export interface FAQPageSchema extends WithContext {
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export function generateFAQPageSchema(props: FAQPageSchemaProps): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: props.questions.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Review Schema
// ---------------------------------------------------------------------------

export interface ReviewSchemaProps {
  itemReviewed:
    | LocalBusinessSchema
    | ServiceSchema
    | { "@type": "Organization" | "Product" | "LocalBusiness" | "Service"; name: string; url?: string };
  author: {
    name: string;
    url?: string;
  };
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  reviewBody: string;
  datePublished?: string;
}

export interface ReviewSchema extends WithContext {
  "@type": "Review";
  itemReviewed:
    | LocalBusinessSchema
    | ServiceSchema
    | { "@type": "Organization" | "Product" | "LocalBusiness" | "Service"; name: string; url?: string };
  author: {
    "@type": "Person";
    name: string;
    url?: string;
  };
  reviewRating: {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  reviewBody: string;
  datePublished?: string;
}

export function generateReviewSchema(props: ReviewSchemaProps): ReviewSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: props.itemReviewed,
    author: {
      "@type": "Person",
      name: props.author.name,
      ...(props.author.url && { url: props.author.url }),
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: props.reviewRating.ratingValue,
      bestRating: props.reviewRating.bestRating ?? 5,
      worstRating: props.reviewRating.worstRating ?? 1,
    },
    reviewBody: props.reviewBody,
    ...(props.datePublished && { datePublished: props.datePublished }),
  };
}

// ---------------------------------------------------------------------------
// Product Schema (for e-commerce/rich results with ratings)
// ---------------------------------------------------------------------------

export interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string | { url: string; width?: number; height?: number };
  brand?: {
    name: string;
  };
  offers?: {
    price: number | string;
    priceCurrency?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
    url?: string;
    priceValidUntil?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  sku?: string;
  gtin?: string;
  mpn?: string;
}

export interface ProductSchema extends WithContext {
  "@type": "Product";
  name: string;
  description: string;
  image?: string | ImageObject;
  brand?: {
    "@type": "Brand";
    name: string;
  };
  offers?: {
    "@type": "Offer";
    price: number | string;
    priceCurrency: string;
    availability?: string;
    url?: string;
    priceValidUntil?: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
  sku?: string;
  gtin?: string;
  mpn?: string;
}

export function generateProductSchema(props: ProductSchemaProps): ProductSchema {
  const schema: ProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: props.name,
    description: props.description,
  };

  if (props.image) {
    if (typeof props.image === "string") {
      schema.image = props.image;
    } else {
      schema.image = {
        "@type": "ImageObject",
        url: props.image.url,
        width: props.image.width || DEFAULT_IMAGE_WIDTH,
        height: props.image.height || DEFAULT_IMAGE_HEIGHT,
      };
    }
  }

  if (props.brand) {
    schema.brand = {
      "@type": "Brand",
      name: props.brand.name,
    };
  }

  if (props.offers) {
    schema.offers = {
      "@type": "Offer",
      price: props.offers.price,
      priceCurrency: props.offers.priceCurrency || "USD",
      ...(props.offers.availability && { availability: `https://schema.org/${props.offers.availability}` }),
      ...(props.offers.url && { url: props.offers.url }),
      ...(props.offers.priceValidUntil && { priceValidUntil: props.offers.priceValidUntil }),
    };
  }

  if (props.aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: props.aggregateRating.ratingValue,
      reviewCount: props.aggregateRating.reviewCount,
      bestRating: props.aggregateRating.bestRating ?? 5,
      worstRating: props.aggregateRating.worstRating ?? 1,
    };
  }

  if (props.sku) schema.sku = props.sku;
  if (props.gtin) schema.gtin = props.gtin;
  if (props.mpn) schema.mpn = props.mpn;

  return schema;
}

// ---------------------------------------------------------------------------
// BreadcrumbList Schema (important for navigation rich results)
// ---------------------------------------------------------------------------

export interface BreadcrumbListSchemaProps {
  items: Array<{
    name: string;
    item: string; // URL
  }>;
}

export interface BreadcrumbListSchema extends WithContext {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export function generateBreadcrumbListSchema(props: BreadcrumbListSchemaProps): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: props.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

// ---------------------------------------------------------------------------
// WebSite Schema (for sitelinks search box)
// ---------------------------------------------------------------------------

export interface WebSiteSchemaProps {
  name: string;
  url?: string;
  description?: string;
  potentialAction?: {
    queryInput: string; // e.g., "required name=search_term_string"
    target: string; // e.g., "https://example.com/search?q={search_term_string}"
  };
}

export interface WebSiteSchema extends WithContext {
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export function generateWebSiteSchema(props: WebSiteSchemaProps): WebSiteSchema {
  const schema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: props.name,
    url: props.url || SITE_URL,
  };

  if (props.description) schema.description = props.description;

  if (props.potentialAction) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: props.potentialAction.target,
      },
      "query-input": props.potentialAction.queryInput,
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/**
 * Safely stringify JSON-LD object for embedding in HTML.
 * Escapes </script> tags to prevent XSS.
 */
export function stringifyJsonLd(data: unknown): string {
  return JSON.stringify(data, null, 2).replace(/<\/script>/g, "<\\/script>");
}

/**
 * Calculate reading time estimate from content.
 * @param content - Text content or word count
 * @param wordsPerMinute - Average reading speed (default: 200)
 */
export function calculateReadingTime(content: string | number, wordsPerMinute: number = 200): number {
  const wordCount = typeof content === "number" ? content : content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
