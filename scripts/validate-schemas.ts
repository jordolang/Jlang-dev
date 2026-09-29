/**
 * Schema Validation Script
 *
 * Validates JSON-LD structured data syntax from all pages.
 * This catches syntax errors before manual testing with Google Rich Results Test.
 *
 * Usage:
 *   npx tsx scripts/validate-schemas.ts
 */

import {
  generatePersonSchema,
  generateLocalBusinessSchema,
  generateReviewSchema,
  generateBlogPostingSchema,
  generateServiceSchema,
  generateFAQPageSchema,
} from '../src/lib/schema';

interface ValidationResult {
  schemaType: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const results: ValidationResult[] = [];

function validateSchema(schemaType: string, schemaData: unknown): ValidationResult {
  const result: ValidationResult = {
    schemaType,
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Check if data is an object
    if (typeof schemaData !== 'object' || schemaData === null) {
      result.valid = false;
      result.errors.push('Schema is not a valid object');
      return result;
    }

    const schema = schemaData as Record<string, unknown>;

    // Validate @context
    if (schema['@context'] !== 'https://schema.org') {
      result.valid = false;
      result.errors.push('Missing or invalid @context');
    }

    // Validate @type
    if (!schema['@type'] || typeof schema['@type'] !== 'string') {
      result.valid = false;
      result.errors.push('Missing or invalid @type');
    }

    // Validate JSON serialization
    try {
      const jsonStr = JSON.stringify(schemaData);
      JSON.parse(jsonStr); // Ensure it can be parsed back
    } catch (e) {
      result.valid = false;
      result.errors.push(`JSON serialization failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Schema-specific validations
    switch (schema['@type']) {
      case 'Person':
        if (!schema.name) result.errors.push('Person schema missing required "name" field');
        break;

      case 'LocalBusiness':
        if (!schema.name) result.errors.push('LocalBusiness schema missing required "name" field');
        break;

      case 'Review':
        if (!schema.itemReviewed) result.errors.push('Review schema missing required "itemReviewed" field');
        if (!schema.author) result.errors.push('Review schema missing required "author" field');
        if (!schema.reviewRating) result.errors.push('Review schema missing required "reviewRating" field');
        if (!schema.reviewBody) result.errors.push('Review schema missing required "reviewBody" field');
        break;

      case 'BlogPosting':
        if (!schema.headline) result.errors.push('BlogPosting schema missing required "headline" field');
        if (!schema.author) result.errors.push('BlogPosting schema missing required "author" field');
        if (!schema.datePublished) result.errors.push('BlogPosting schema missing required "datePublished" field');
        break;

      case 'Service':
        if (!schema.name) result.errors.push('Service schema missing required "name" field');
        if (!schema.provider) result.errors.push('Service schema missing required "provider" field');
        break;

      case 'FAQPage':
        if (!schema.mainEntity) result.errors.push('FAQPage schema missing required "mainEntity" field');
        if (Array.isArray(schema.mainEntity) && schema.mainEntity.length === 0) {
          result.warnings.push('FAQPage has empty mainEntity array');
        }
        break;
    }

    // Update valid status based on errors
    if (result.errors.length > 0) {
      result.valid = false;
    }

  } catch (error) {
    result.valid = false;
    result.errors.push(`Validation exception: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

console.log('\n=== Schema Validation Script ===\n');

// Test Person Schema
console.log('1. Testing Person Schema...');
const personSchema = generatePersonSchema({
  name: 'Jordan Lang',
  jobTitle: 'Web Developer & IT Specialist',
  url: 'https://jordanlang.dev',
  email: 'contact@jordanlang.dev',
  image: '/og-jlang.jpg',
  sameAs: ['https://github.com/jordanlang', 'https://linkedin.com/in/jordanlang'],
});
results.push(validateSchema('Person', personSchema));

// Test LocalBusiness Schema
console.log('2. Testing LocalBusiness Schema...');
const localBusinessSchema = generateLocalBusinessSchema({
  name: 'Jordan Lang',
  description: 'Web Developer & IT Specialist',
  url: 'https://jordanlang.dev',
  email: 'contact@jordanlang.dev',
  image: '/og-jlang.jpg',
  sameAs: ['https://github.com/jordanlang'],
  areaServed: 'Global',
});
results.push(validateSchema('LocalBusiness', localBusinessSchema));

// Test Review Schema
console.log('3. Testing Review Schema...');
const reviewSchema = generateReviewSchema({
  itemReviewed: {
    "@type": 'LocalBusiness',
    name: 'Jordan Lang',
  },
  author: {
    name: 'Test Reviewer',
  },
  reviewRating: {
    ratingValue: 5,
    bestRating: 5,
    worstRating: 1,
  },
  reviewBody: 'Excellent service and professional work.',
});
results.push(validateSchema('Review', reviewSchema));

// Test BlogPosting Schema
console.log('4. Testing BlogPosting Schema...');
const blogPostingSchema = generateBlogPostingSchema({
  headline: 'Test Blog Post',
  description: 'A test blog post for validation',
  slug: 'test-post',
  datePublished: '2026-09-29',
  author: {
    name: 'Jordan Lang',
    url: 'https://jordanlang.dev',
  },
  image: '/blog/test-post.jpg',
  tags: ['web development', 'testing'],
  publisher: {
    name: 'Jordan Lang',
    logo: 'https://jordanlang.dev/logo.png',
  },
});
results.push(validateSchema('BlogPosting', blogPostingSchema));

// Test Service Schema
console.log('5. Testing Service Schema...');
const serviceSchema = generateServiceSchema({
  name: 'Web Design and Development Services',
  description: 'Professional web services',
  provider: {
    name: 'Jordan Lang',
    url: 'https://jordanlang.dev',
  },
  offers: [
    {
      name: 'Starter Package',
      description: 'Basic website package',
      price: 1500,
      priceCurrency: 'USD',
    },
    {
      name: 'Professional Package',
      description: 'Advanced website package',
      price: 3000,
      priceCurrency: 'USD',
    },
  ],
  areaServed: 'United States',
  serviceType: 'Web Development',
});
results.push(validateSchema('Service', serviceSchema));

// Test FAQPage Schema
console.log('6. Testing FAQPage Schema...');
const faqSchema = generateFAQPageSchema({
  questions: [
    {
      question: 'What services do you offer?',
      answer: 'We offer web design, development, and consulting services.',
    },
    {
      question: 'How long does a project take?',
      answer: 'Project timelines vary based on scope, typically 2-8 weeks.',
    },
  ],
});
results.push(validateSchema('FAQPage', faqSchema));

// Print Results
console.log('\n=== Validation Results ===\n');

let allValid = true;
results.forEach((result, index) => {
  const status = result.valid ? '✅ PASS' : '❌ FAIL';
  console.log(`${index + 1}. ${result.schemaType}: ${status}`);

  if (result.errors.length > 0) {
    allValid = false;
    console.log('   Errors:');
    result.errors.forEach(error => console.log(`   - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('   Warnings:');
    result.warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  console.log('');
});

console.log('=== Summary ===');
console.log(`Total Schemas Tested: ${results.length}`);
console.log(`Passed: ${results.filter(r => r.valid).length}`);
console.log(`Failed: ${results.filter(r => !r.valid).length}`);
console.log(`\nOverall: ${allValid ? '✅ ALL SCHEMAS VALID' : '❌ SOME SCHEMAS INVALID'}\n`);

if (!allValid) {
  console.log('⚠️  Fix validation errors before proceeding to Google Rich Results Test\n');
  process.exit(1);
}

console.log('✅ All schemas have valid JSON-LD syntax.');
console.log('📝 Proceed to manual testing with Google Rich Results Test.\n');
console.log('See: .auto-claude/specs/006-schema-markup-structured-data/MANUAL_VALIDATION_GUIDE.md\n');

process.exit(0);
