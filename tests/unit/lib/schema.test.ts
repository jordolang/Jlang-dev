import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generatePersonSchema,
  generateLocalBusinessSchema,
  generateBlogPostingSchema,
  generateServiceSchema,
  generateFAQPageSchema,
  generateReviewSchema,
  generateProductSchema,
  generateBreadcrumbListSchema,
  generateWebSiteSchema,
  stringifyJsonLd,
  calculateReadingTime,
} from '@/lib/schema'

describe('Schema Generators', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generatePersonSchema', () => {
    it('should generate basic person schema with required fields', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'John Doe',
      })
    })

    it('should include optional fields when provided', () => {
      const result = generatePersonSchema({
        name: 'Jane Smith',
        jobTitle: 'Senior Developer',
        url: 'https://example.com',
        email: 'jane@example.com',
        telephone: '+1-555-1234',
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Jane Smith',
        jobTitle: 'Senior Developer',
        url: 'https://example.com',
        email: 'jane@example.com',
        telephone: '+1-555-1234',
      })
    })

    it('should handle image as string', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        image: 'https://example.com/photo.jpg',
      })

      expect(result.image).toBe('https://example.com/photo.jpg')
    })

    it('should handle image as object with dimensions', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        image: {
          url: 'https://example.com/photo.jpg',
          width: 800,
          height: 600,
        },
      })

      expect(result.image).toMatchObject({
        '@type': 'ImageObject',
        url: 'https://example.com/photo.jpg',
        width: 800,
        height: 600,
      })
    })

    it('should handle image object without dimensions', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        image: {
          url: 'https://example.com/photo.jpg',
        },
      })

      expect(result.image).toMatchObject({
        '@type': 'ImageObject',
        url: 'https://example.com/photo.jpg',
      })
      expect(result.image).not.toHaveProperty('width')
      expect(result.image).not.toHaveProperty('height')
    })

    it('should include social media profiles in sameAs', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        sameAs: [
          'https://twitter.com/johndoe',
          'https://linkedin.com/in/johndoe',
          'https://github.com/johndoe',
        ],
      })

      expect(result.sameAs).toHaveLength(3)
      expect(result.sameAs).toContain('https://twitter.com/johndoe')
    })

    it('should not include sameAs when empty array', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        sameAs: [],
      })

      expect(result).not.toHaveProperty('sameAs')
    })

    it('should include worksFor organization', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        worksFor: {
          name: 'Acme Corp',
          url: 'https://acme.com',
        },
      })

      expect(result.worksFor).toMatchObject({
        '@type': 'Organization',
        name: 'Acme Corp',
        url: 'https://acme.com',
      })
    })

    it('should include address when provided', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        address: {
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          addressCountry: 'US',
        },
      })

      expect(result.address).toMatchObject({
        '@type': 'PostalAddress',
        addressLocality: 'San Francisco',
        addressRegion: 'CA',
        addressCountry: 'US',
      })
    })
  })

  describe('generateLocalBusinessSchema', () => {
    it('should generate basic business schema', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Best Coffee Shop',
        url: expect.any(String),
      })
    })

    it('should use custom URL when provided', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        url: 'https://bestcoffee.com',
      })

      expect(result.url).toBe('https://bestcoffee.com')
    })

    it('should include business details', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        description: 'Artisan coffee and pastries',
        telephone: '+1-555-COFFEE',
        email: 'info@bestcoffee.com',
        priceRange: '$$',
      })

      expect(result).toMatchObject({
        description: 'Artisan coffee and pastries',
        telephone: '+1-555-COFFEE',
        email: 'info@bestcoffee.com',
        priceRange: '$$',
      })
    })

    it('should handle image with default dimensions', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        image: {
          url: 'https://example.com/coffee.jpg',
        },
      })

      expect(result.image).toMatchObject({
        '@type': 'ImageObject',
        url: 'https://example.com/coffee.jpg',
        width: 1200,
        height: 630,
      })
    })

    it('should include complete address', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        address: {
          streetAddress: '123 Main St',
          addressLocality: 'Seattle',
          addressRegion: 'WA',
          postalCode: '98101',
          addressCountry: 'US',
        },
      })

      expect(result.address).toMatchObject({
        '@type': 'PostalAddress',
        streetAddress: '123 Main St',
        addressLocality: 'Seattle',
        addressRegion: 'WA',
        postalCode: '98101',
        addressCountry: 'US',
      })
    })

    it('should include geo coordinates', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        geo: {
          latitude: 47.6062,
          longitude: -122.3321,
        },
      })

      expect(result.geo).toMatchObject({
        '@type': 'GeoCoordinates',
        latitude: 47.6062,
        longitude: -122.3321,
      })
    })

    it('should parse opening hours correctly', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        openingHours: [
          'Monday,Tuesday,Wednesday,Thursday,Friday 08:00-17:00',
          'Saturday,Sunday 09:00-15:00',
        ],
      })

      expect(result.openingHoursSpecification).toHaveLength(2)
      expect(result.openingHoursSpecification?.[0]).toMatchObject({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      })
    })

    it('should include aggregate rating with defaults', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        aggregateRating: {
          ratingValue: 4.5,
          reviewCount: 100,
        },
      })

      expect(result.aggregateRating).toMatchObject({
        '@type': 'AggregateRating',
        ratingValue: 4.5,
        reviewCount: 100,
        bestRating: 5,
        worstRating: 1,
      })
    })

    it('should include areaServed as string', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        areaServed: 'Seattle',
      })

      expect(result.areaServed).toBe('Seattle')
    })

    it('should include areaServed as array', () => {
      const result = generateLocalBusinessSchema({
        name: 'Best Coffee Shop',
        areaServed: ['Seattle', 'Tacoma', 'Bellevue'],
      })

      expect(result.areaServed).toEqual(['Seattle', 'Tacoma', 'Bellevue'])
    })
  })

  describe('generateBlogPostingSchema', () => {
    it('should generate basic blog posting schema', () => {
      const result = generateBlogPostingSchema({
        headline: 'How to Make Great Coffee',
        description: 'A comprehensive guide to brewing the perfect cup',
        slug: 'how-to-make-coffee',
        datePublished: '2024-01-15',
        author: {
          name: 'Jane Barista',
        },
        image: 'https://example.com/coffee-guide.jpg',
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'How to Make Great Coffee',
        description: 'A comprehensive guide to brewing the perfect cup',
        datePublished: '2024-01-15',
        dateModified: '2024-01-15',
      })
      expect(result.url).toContain('/blog/how-to-make-coffee')
    })

    it('should use dateModified when provided', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test Post',
        description: 'Test',
        slug: 'test',
        datePublished: '2024-01-15',
        dateModified: '2024-01-20',
        author: { name: 'Test' },
        image: 'https://example.com/test.jpg',
      })

      expect(result.dateModified).toBe('2024-01-20')
    })

    it('should convert string image to ImageObject with defaults', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test',
        description: 'Test',
        slug: 'test',
        datePublished: '2024-01-15',
        author: { name: 'Test' },
        image: 'https://example.com/test.jpg',
      })

      expect(result.image).toMatchObject({
        '@type': 'ImageObject',
        url: 'https://example.com/test.jpg',
        width: 1200,
        height: 630,
      })
    })

    it('should handle image object with custom dimensions', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test',
        description: 'Test',
        slug: 'test',
        datePublished: '2024-01-15',
        author: { name: 'Test' },
        image: {
          url: 'https://example.com/test.jpg',
          width: 1600,
          height: 900,
        },
      })

      expect(result.image).toMatchObject({
        '@type': 'ImageObject',
        url: 'https://example.com/test.jpg',
        width: 1600,
        height: 900,
      })
    })

    it('should include author with URL', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test',
        description: 'Test',
        slug: 'test',
        datePublished: '2024-01-15',
        author: {
          name: 'Jane Doe',
          url: 'https://example.com/authors/jane',
        },
        image: 'https://example.com/test.jpg',
      })

      expect(result.author).toMatchObject({
        '@type': 'Person',
        name: 'Jane Doe',
        url: 'https://example.com/authors/jane',
      })
    })

    it('should include tags as keywords', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test',
        description: 'Test',
        slug: 'test',
        datePublished: '2024-01-15',
        author: { name: 'Test' },
        image: 'https://example.com/test.jpg',
        tags: ['javascript', 'web development', 'tutorial'],
      })

      expect(result.keywords).toEqual(['javascript', 'web development', 'tutorial'])
    })

    it('should include word count', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test',
        description: 'Test',
        slug: 'test',
        datePublished: '2024-01-15',
        author: { name: 'Test' },
        image: 'https://example.com/test.jpg',
        wordCount: 1500,
      })

      expect(result.wordCount).toBe(1500)
    })

    it('should include publisher with logo', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test',
        description: 'Test',
        slug: 'test',
        datePublished: '2024-01-15',
        author: { name: 'Test' },
        image: 'https://example.com/test.jpg',
        publisher: {
          name: 'Tech Blog',
          logo: {
            url: 'https://example.com/logo.png',
            width: 600,
            height: 60,
          },
        },
      })

      expect(result.publisher).toMatchObject({
        '@type': 'Organization',
        name: 'Tech Blog',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.png',
          width: 600,
          height: 60,
        },
      })
    })

    it('should handle publisher logo as string', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test',
        description: 'Test',
        slug: 'test',
        datePublished: '2024-01-15',
        author: { name: 'Test' },
        image: 'https://example.com/test.jpg',
        publisher: {
          name: 'Tech Blog',
          logo: 'https://example.com/logo.png',
        },
      })

      expect(result.publisher?.logo).toMatchObject({
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png',
        width: 600,
        height: 60,
      })
    })

    it('should include mainEntityOfPage', () => {
      const result = generateBlogPostingSchema({
        headline: 'Test',
        description: 'Test',
        slug: 'test-post',
        datePublished: '2024-01-15',
        author: { name: 'Test' },
        image: 'https://example.com/test.jpg',
      })

      expect(result.mainEntityOfPage).toMatchObject({
        '@type': 'WebPage',
        '@id': expect.stringContaining('/blog/test-post'),
      })
    })
  })

  describe('generateServiceSchema', () => {
    it('should generate basic service schema', () => {
      const result = generateServiceSchema({
        name: 'Web Development',
        description: 'Professional web development services',
        provider: {
          name: 'Tech Solutions Inc',
        },
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Web Development',
        description: 'Professional web development services',
        provider: {
          '@type': 'Organization',
          name: 'Tech Solutions Inc',
        },
      })
    })

    it('should include provider URL', () => {
      const result = generateServiceSchema({
        name: 'Web Development',
        description: 'Professional services',
        provider: {
          name: 'Tech Solutions Inc',
          url: 'https://techsolutions.com',
        },
      })

      expect(result.provider.url).toBe('https://techsolutions.com')
    })

    it('should include service offers with defaults', () => {
      const result = generateServiceSchema({
        name: 'Web Development',
        description: 'Professional services',
        provider: { name: 'Tech Solutions Inc' },
        offers: [
          {
            name: 'Basic Package',
            description: 'Simple landing page',
            price: 999,
          },
          {
            name: 'Premium Package',
            description: 'Full web application',
            price: 4999,
            priceCurrency: 'EUR',
          },
        ],
      })

      expect(result.offers).toHaveLength(2)
      expect(result.offers?.[0]).toMatchObject({
        '@type': 'Offer',
        name: 'Basic Package',
        description: 'Simple landing page',
        price: 999,
        priceCurrency: 'USD',
      })
      expect(result.offers?.[1].priceCurrency).toBe('EUR')
    })

    it('should include offer availability', () => {
      const result = generateServiceSchema({
        name: 'Web Development',
        description: 'Professional services',
        provider: { name: 'Tech Solutions Inc' },
        offers: [
          {
            price: 999,
            availability: 'InStock',
            url: 'https://example.com/book',
          },
        ],
      })

      expect(result.offers?.[0]).toMatchObject({
        availability: 'https://schema.org/InStock',
        url: 'https://example.com/book',
      })
    })

    it('should include areaServed and serviceType', () => {
      const result = generateServiceSchema({
        name: 'Web Development',
        description: 'Professional services',
        provider: { name: 'Tech Solutions Inc' },
        areaServed: ['United States', 'Canada'],
        serviceType: 'Software Development',
      })

      expect(result.areaServed).toEqual(['United States', 'Canada'])
      expect(result.serviceType).toBe('Software Development')
    })

    it('should include aggregate rating', () => {
      const result = generateServiceSchema({
        name: 'Web Development',
        description: 'Professional services',
        provider: { name: 'Tech Solutions Inc' },
        aggregateRating: {
          ratingValue: 4.8,
          reviewCount: 50,
        },
      })

      expect(result.aggregateRating).toMatchObject({
        '@type': 'AggregateRating',
        ratingValue: 4.8,
        reviewCount: 50,
        bestRating: 5,
        worstRating: 1,
      })
    })
  })

  describe('generateFAQPageSchema', () => {
    it('should generate FAQ page schema', () => {
      const result = generateFAQPageSchema({
        questions: [
          {
            question: 'What is your return policy?',
            answer: 'We accept returns within 30 days of purchase.',
          },
          {
            question: 'Do you ship internationally?',
            answer: 'Yes, we ship to over 50 countries worldwide.',
          },
        ],
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
      })
      expect(result.mainEntity).toHaveLength(2)
    })

    it('should structure questions correctly', () => {
      const result = generateFAQPageSchema({
        questions: [
          {
            question: 'What is your return policy?',
            answer: 'We accept returns within 30 days of purchase.',
          },
        ],
      })

      expect(result.mainEntity[0]).toMatchObject({
        '@type': 'Question',
        name: 'What is your return policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept returns within 30 days of purchase.',
        },
      })
    })

    it('should handle empty questions array', () => {
      const result = generateFAQPageSchema({
        questions: [],
      })

      expect(result.mainEntity).toHaveLength(0)
    })

    it('should handle multiple questions', () => {
      const questions = Array.from({ length: 10 }, (_, i) => ({
        question: `Question ${i + 1}?`,
        answer: `Answer ${i + 1}`,
      }))

      const result = generateFAQPageSchema({ questions })

      expect(result.mainEntity).toHaveLength(10)
      expect(result.mainEntity[5].name).toBe('Question 6?')
    })
  })

  describe('generateReviewSchema', () => {
    it('should generate basic review schema', () => {
      const result = generateReviewSchema({
        itemReviewed: {
          '@type': 'Organization',
          name: 'Acme Corp',
        },
        author: {
          name: 'John Doe',
        },
        reviewRating: {
          ratingValue: 4,
        },
        reviewBody: 'Great service and friendly staff!',
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Review',
        reviewBody: 'Great service and friendly staff!',
      })
    })

    it('should include rating with defaults', () => {
      const result = generateReviewSchema({
        itemReviewed: { '@type': 'Product', name: 'Test Product' },
        author: { name: 'John Doe' },
        reviewRating: {
          ratingValue: 4.5,
        },
        reviewBody: 'Excellent product!',
      })

      expect(result.reviewRating).toMatchObject({
        '@type': 'Rating',
        ratingValue: 4.5,
        bestRating: 5,
        worstRating: 1,
      })
    })

    it('should include custom rating range', () => {
      const result = generateReviewSchema({
        itemReviewed: { '@type': 'Product', name: 'Test Product' },
        author: { name: 'John Doe' },
        reviewRating: {
          ratingValue: 8,
          bestRating: 10,
          worstRating: 0,
        },
        reviewBody: 'Great!',
      })

      expect(result.reviewRating).toMatchObject({
        ratingValue: 8,
        bestRating: 10,
        worstRating: 0,
      })
    })

    it('should include author URL', () => {
      const result = generateReviewSchema({
        itemReviewed: { '@type': 'Product', name: 'Test Product' },
        author: {
          name: 'John Doe',
          url: 'https://example.com/users/johndoe',
        },
        reviewRating: { ratingValue: 5 },
        reviewBody: 'Perfect!',
      })

      expect(result.author).toMatchObject({
        '@type': 'Person',
        name: 'John Doe',
        url: 'https://example.com/users/johndoe',
      })
    })

    it('should include datePublished', () => {
      const result = generateReviewSchema({
        itemReviewed: { '@type': 'Product', name: 'Test Product' },
        author: { name: 'John Doe' },
        reviewRating: { ratingValue: 5 },
        reviewBody: 'Great!',
        datePublished: '2024-01-15',
      })

      expect(result.datePublished).toBe('2024-01-15')
    })
  })

  describe('generateProductSchema', () => {
    it('should generate basic product schema', () => {
      const result = generateProductSchema({
        name: 'Premium Coffee Beans',
        description: 'Organic, fair-trade coffee beans',
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Premium Coffee Beans',
        description: 'Organic, fair-trade coffee beans',
      })
    })

    it('should include brand', () => {
      const result = generateProductSchema({
        name: 'Premium Coffee Beans',
        description: 'Organic coffee',
        brand: {
          name: 'Mountain Roasters',
        },
      })

      expect(result.brand).toMatchObject({
        '@type': 'Brand',
        name: 'Mountain Roasters',
      })
    })

    it('should include offer with defaults', () => {
      const result = generateProductSchema({
        name: 'Premium Coffee Beans',
        description: 'Organic coffee',
        offers: {
          price: 19.99,
        },
      })

      expect(result.offers).toMatchObject({
        '@type': 'Offer',
        price: 19.99,
        priceCurrency: 'USD',
      })
    })

    it('should include offer availability and validity', () => {
      const result = generateProductSchema({
        name: 'Premium Coffee Beans',
        description: 'Organic coffee',
        offers: {
          price: 19.99,
          priceCurrency: 'EUR',
          availability: 'InStock',
          url: 'https://example.com/buy',
          priceValidUntil: '2024-12-31',
        },
      })

      expect(result.offers).toMatchObject({
        price: 19.99,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: 'https://example.com/buy',
        priceValidUntil: '2024-12-31',
      })
    })

    it('should include product identifiers', () => {
      const result = generateProductSchema({
        name: 'Premium Coffee Beans',
        description: 'Organic coffee',
        sku: 'PCB-001',
        gtin: '1234567890123',
        mpn: 'MPN-PCB-001',
      })

      expect(result).toMatchObject({
        sku: 'PCB-001',
        gtin: '1234567890123',
        mpn: 'MPN-PCB-001',
      })
    })

    it('should include aggregate rating', () => {
      const result = generateProductSchema({
        name: 'Premium Coffee Beans',
        description: 'Organic coffee',
        aggregateRating: {
          ratingValue: 4.7,
          reviewCount: 200,
          bestRating: 5,
          worstRating: 1,
        },
      })

      expect(result.aggregateRating).toMatchObject({
        '@type': 'AggregateRating',
        ratingValue: 4.7,
        reviewCount: 200,
        bestRating: 5,
        worstRating: 1,
      })
    })

    it('should handle image with default dimensions', () => {
      const result = generateProductSchema({
        name: 'Premium Coffee Beans',
        description: 'Organic coffee',
        image: {
          url: 'https://example.com/coffee.jpg',
        },
      })

      expect(result.image).toMatchObject({
        '@type': 'ImageObject',
        url: 'https://example.com/coffee.jpg',
        width: 1200,
        height: 630,
      })
    })
  })

  describe('generateBreadcrumbListSchema', () => {
    it('should generate breadcrumb list schema', () => {
      const result = generateBreadcrumbListSchema({
        items: [
          { name: 'Home', item: 'https://example.com' },
          { name: 'Products', item: 'https://example.com/products' },
          { name: 'Coffee', item: 'https://example.com/products/coffee' },
        ],
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
      })
      expect(result.itemListElement).toHaveLength(3)
    })

    it('should set correct positions', () => {
      const result = generateBreadcrumbListSchema({
        items: [
          { name: 'Home', item: 'https://example.com' },
          { name: 'About', item: 'https://example.com/about' },
        ],
      })

      expect(result.itemListElement[0]).toMatchObject({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com',
      })
      expect(result.itemListElement[1]).toMatchObject({
        position: 2,
        name: 'About',
      })
    })

    it('should handle empty items array', () => {
      const result = generateBreadcrumbListSchema({
        items: [],
      })

      expect(result.itemListElement).toHaveLength(0)
    })

    it('should handle single item', () => {
      const result = generateBreadcrumbListSchema({
        items: [{ name: 'Home', item: 'https://example.com' }],
      })

      expect(result.itemListElement).toHaveLength(1)
      expect(result.itemListElement[0].position).toBe(1)
    })
  })

  describe('generateWebSiteSchema', () => {
    it('should generate basic website schema', () => {
      const result = generateWebSiteSchema({
        name: 'My Awesome Site',
      })

      expect(result).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'My Awesome Site',
        url: expect.any(String),
      })
    })

    it('should use custom URL', () => {
      const result = generateWebSiteSchema({
        name: 'My Awesome Site',
        url: 'https://mysite.com',
      })

      expect(result.url).toBe('https://mysite.com')
    })

    it('should include description', () => {
      const result = generateWebSiteSchema({
        name: 'My Awesome Site',
        description: 'The best site on the internet',
      })

      expect(result.description).toBe('The best site on the internet')
    })

    it('should include search action', () => {
      const result = generateWebSiteSchema({
        name: 'My Awesome Site',
        potentialAction: {
          queryInput: 'required name=search_term_string',
          target: 'https://example.com/search?q={search_term_string}',
        },
      })

      expect(result.potentialAction).toMatchObject({
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://example.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      })
    })
  })

  describe('stringifyJsonLd', () => {
    it('should stringify JSON-LD object', () => {
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'John Doe',
      }

      const result = stringifyJsonLd(data)

      expect(result).toContain('"@context": "https://schema.org"')
      expect(result).toContain('"name": "John Doe"')
    })

    it.each(['</script>', '</SCRIPT>', '</script >', '</ScRiPt\t>', '<!--'])('safely embeds %s in HTML', (terminator) => {
      const data = { malicious: `${terminator}<script>alert("XSS")</script>` }
      const result = stringifyJsonLd(data)
      expect(result).not.toContain('<')
      expect(JSON.parse(result)).toEqual(data)
    })

    it('should format with indentation', () => {
      const data = { a: 1, b: 2 }
      const result = stringifyJsonLd(data)

      expect(result).toContain('\n')
      expect(result).toContain('  ')
    })

    it('should handle nested objects', () => {
      const data = {
        person: {
          name: 'John',
          address: {
            city: 'Seattle',
          },
        },
      }

      const result = stringifyJsonLd(data)

      expect(result).toContain('"city": "Seattle"')
    })

    it('should handle arrays', () => {
      const data = {
        items: [1, 2, 3],
      }

      const result = stringifyJsonLd(data)

      expect(result).toContain('[')
      expect(result).toContain(']')
    })
  })

  describe('calculateReadingTime', () => {
    it('should calculate reading time from text content', () => {
      const content = 'word '.repeat(200) // 200 words
      const result = calculateReadingTime(content)

      expect(result).toBe(1) // 200 words / 200 wpm = 1 minute
    })

    it('should round up partial minutes', () => {
      const content = 'word '.repeat(250) // 250 words
      const result = calculateReadingTime(content)

      expect(result).toBe(2) // 250 / 200 = 1.25, rounds to 2
    })

    it('should accept word count as number', () => {
      const result = calculateReadingTime(400)

      expect(result).toBe(2) // 400 / 200 = 2 minutes
    })

    it('should use custom words per minute', () => {
      const result = calculateReadingTime(300, 100)

      expect(result).toBe(3) // 300 / 100 = 3 minutes
    })

    it('should handle empty string', () => {
      const result = calculateReadingTime('')

      expect(result).toBe(1) // Empty string splits to [""], length 1
    })

    it('should handle single word', () => {
      const result = calculateReadingTime('word')

      expect(result).toBe(1) // Always at least 1 minute
    })

    it('should trim whitespace correctly', () => {
      const content = '   word1 word2   word3   '
      const result = calculateReadingTime(content)

      expect(result).toBe(1) // 3 words / 200 = 0.015, rounds to 1
    })

    it('should handle content with multiple spaces', () => {
      const content = 'word1    word2     word3'
      const result = calculateReadingTime(content)

      expect(result).toBe(1) // 3 words
    })

    it('should calculate for long content', () => {
      const result = calculateReadingTime(1500)

      expect(result).toBe(8) // 1500 / 200 = 7.5, rounds to 8
    })
  })
})
