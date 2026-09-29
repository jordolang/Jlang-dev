"use strict";
/**
 * JSON-LD structured data utilities for SEO.
 *
 * Generates type-safe Schema.org markup for rich search results. Each generator returns
 * an object that can be serialized and embedded in a <script type="application/ld+json"> tag.
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePersonSchema = generatePersonSchema;
exports.generateLocalBusinessSchema = generateLocalBusinessSchema;
exports.generateBlogPostingSchema = generateBlogPostingSchema;
exports.generateServiceSchema = generateServiceSchema;
exports.generateFAQPageSchema = generateFAQPageSchema;
exports.generateReviewSchema = generateReviewSchema;
exports.generateAggregateRatingSchema = generateAggregateRatingSchema;
exports.stringifyJsonLd = stringifyJsonLd;
exports.calculateReadingTime = calculateReadingTime;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jordanlang.dev";
function generatePersonSchema(props) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: props.name,
    };
    if (props.jobTitle)
        schema.jobTitle = props.jobTitle;
    if (props.url)
        schema.url = props.url;
    if (props.email)
        schema.email = props.email;
    if (props.telephone)
        schema.telephone = props.telephone;
    if (props.image)
        schema.image = props.image;
    if (props.sameAs && props.sameAs.length > 0)
        schema.sameAs = props.sameAs;
    if (props.worksFor) {
        schema.worksFor = {
            "@type": "Organization",
            name: props.worksFor.name,
        };
        if (props.worksFor.url)
            schema.worksFor.url = props.worksFor.url;
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
function generateLocalBusinessSchema(props) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: props.name,
        url: props.url || SITE_URL,
    };
    if (props.description)
        schema.description = props.description;
    if (props.telephone)
        schema.telephone = props.telephone;
    if (props.email)
        schema.email = props.email;
    if (props.image)
        schema.image = props.image;
    if (props.priceRange)
        schema.priceRange = props.priceRange;
    if (props.sameAs && props.sameAs.length > 0)
        schema.sameAs = props.sameAs;
    if (props.areaServed)
        schema.areaServed = props.areaServed;
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
                "@type": "OpeningHoursSpecification",
                dayOfWeek,
                opens,
                closes,
            };
        });
    }
    return schema;
}
function generateBlogPostingSchema(props) {
    const postUrl = `${SITE_URL}/blog/${props.slug}`;
    const schema = {
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
    if (props.image)
        schema.image = props.image;
    if (props.tags && props.tags.length > 0)
        schema.keywords = props.tags;
    if (props.wordCount)
        schema.wordCount = props.wordCount;
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
function generateServiceSchema(props) {
    const schema = {
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
    if (props.areaServed)
        schema.areaServed = props.areaServed;
    if (props.serviceType)
        schema.serviceType = props.serviceType;
    return schema;
}
function generateFAQPageSchema(props) {
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
function generateReviewSchema(props) {
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
function generateAggregateRatingSchema(props) {
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
function stringifyJsonLd(data) {
    return JSON.stringify(data, null, 2).replace(/<\/script>/g, "<\\/script>");
}
/**
 * Calculate reading time estimate from content.
 * @param content - Text content or word count
 * @param wordsPerMinute - Average reading speed (default: 200)
 */
function calculateReadingTime(content, wordsPerMinute = 200) {
    const wordCount = typeof content === "number" ? content : content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}
