/**
 * JSON-LD structured data utilities for SEO.
 *
 * Generates type-safe Schema.org markup for rich search results. Each generator returns
 * an object that can be serialized and embedded in a <script type="application/ld+json"> tag.
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jordanlang.dev";

/**
 * Base context for all JSON-LD schemas.
 */
interface WithContext {
  "@context": "https://schema.org";
  "@type": string;
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
  image?: string;
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
  image?: string;
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
  if (props.image) schema.image = props.image;
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
  image?: string;
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
}

export interface LocalBusinessSchema extends WithContext {
  "@type": "LocalBusiness";
  name: string;
  description?: string;
  url?: string;
  telephone?: string;
  email?: string;
  image?: string;
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
  if (props.image) schema.image = props.image;
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
  image?: string;
  publisher?: {
    name: string;
    logo?: string;
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
  dateModified?: string;
  author: {
    "@type": "Person";
    name: string;
    url?: string;
  };
  image?: string;
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  if (props.image) schema.image = props.image;
  if (props.tags && props.tags.length > 0) schema.keywords = props.tags;
  if (props.wordCount) schema.wordCount = props.wordCount;

  if (props.publisher) {
    schema.publisher = {
      "@type": "Organization",
      name: props.publisher.name,
    };
    if (props.publisher.logo) {
      schema.publisher.logo = {
        "@type": "ImageObject",
        url: props.publisher.logo,
      };
    }
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
    name: string;
    description: string;
    price: number | string;
    priceCurrency?: string;
  }>;
  areaServed?: string | string[];
  serviceType?: string;
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
    name: string;
    description: string;
    price: number | string;
    priceCurrency: string;
  }>;
  areaServed?: string | string[];
  serviceType?: string;
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
      name: offer.name,
      description: offer.description,
      price: offer.price,
      priceCurrency: offer.priceCurrency || "USD",
    }));
  }

  if (props.areaServed) schema.areaServed = props.areaServed;
  if (props.serviceType) schema.serviceType = props.serviceType;

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
  itemReviewed: {
    type: "LocalBusiness" | "Organization" | "Service" | "Product";
    name: string;
  };
  author: {
    name: string;
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
  itemReviewed: {
    "@type": "LocalBusiness" | "Organization" | "Service" | "Product";
    name: string;
  };
  author: {
    "@type": "Person";
    name: string;
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
    itemReviewed: {
      "@type": props.itemReviewed.type,
      name: props.itemReviewed.name,
    },
    author: {
      "@type": "Person",
      name: props.author.name,
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
// AggregateRating Schema
// ---------------------------------------------------------------------------

export interface AggregateRatingSchemaProps {
  itemReviewed: {
    type: "LocalBusiness" | "Organization" | "Service" | "Product";
    name: string;
  };
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export interface AggregateRatingSchema extends WithContext {
  "@type": "AggregateRating";
  itemReviewed: {
    "@type": "LocalBusiness" | "Organization" | "Service" | "Product";
    name: string;
  };
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

export function generateAggregateRatingSchema(props: AggregateRatingSchemaProps): AggregateRatingSchema {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": props.itemReviewed.type,
      name: props.itemReviewed.name,
    },
    ratingValue: props.ratingValue,
    reviewCount: props.reviewCount,
    bestRating: props.bestRating ?? 5,
    worstRating: props.worstRating ?? 1,
  };
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
