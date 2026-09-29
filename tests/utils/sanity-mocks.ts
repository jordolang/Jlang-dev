import { vi } from 'vitest'
import type {
  CmsProject,
  CmsExperience,
  CmsTechItem,
  CmsServicePackage,
  CmsAddonFeature,
  CmsFaq,
  CmsSectionHeading,
  CmsSectionHeadings,
  CmsSiteSettings,
  CmsAboutContent,
  CmsPromoContent,
} from '@/lib/cms'
import type { SanityImageRef } from '@/sanity/lib/image'
import type { SiteTestimonial, ReviewRequest } from '@/lib/reviews'

/**
 * Sanity CMS mock utilities for testing.
 *
 * Provides mock data factories and client mocks for all CMS types.
 * Use these to test components and functions that depend on Sanity data
 * without making real API calls.
 */

// ============================================================================
// Mock Data Factories
// ============================================================================

/**
 * Creates a mock Sanity image reference with optional custom properties.
 */
export function createMockSanityImage(overrides: Partial<SanityImageRef> = {}): SanityImageRef {
  return {
    asset: {
      _ref: 'image-test-1234',
      url: 'https://cdn.sanity.io/images/test/test.jpg',
      metadata: {
        dimensions: {
          width: 1200,
          height: 800,
        },
      },
      ...overrides.asset,
    },
  }
}

/**
 * Creates a mock CMS project with optional custom properties.
 */
export function createMockProject(overrides: Partial<CmsProject> = {}): CmsProject {
  return {
    title: 'Test Project',
    subtitle: 'A test project subtitle',
    description: 'This is a test project description',
    image: 'https://cdn.sanity.io/images/test/project.jpg',
    features: ['Feature 1', 'Feature 2'],
    deliverables: ['Deliverable 1', 'Deliverable 2'],
    tech: ['React', 'TypeScript', 'Next.js'],
    github: 'https://github.com/test/project',
    live: 'https://test-project.com',
    gradient: 'from-blue-500 to-purple-600',
    status: 'Live',
    category: 'Web Application',
    highlight: 'Key achievement',
    timeline: '3 months',
    clientType: 'B2B',
    group: 'desktop',
    fullPagePreview: false,
    imageWidth: 1200,
    imageHeight: 800,
    featured: false,
    ...overrides,
  }
}

/**
 * Creates a mock CMS experience entry with optional custom properties.
 */
export function createMockExperience(overrides: Partial<CmsExperience> = {}): CmsExperience {
  return {
    role: 'Senior Developer',
    company: 'Test Company',
    period: '2020 - 2023',
    type: 'Full-time',
    companyColor: '#3B82F6',
    companyIcon: 'Building',
    description: 'Led development of key features',
    achievements: ['Achievement 1', 'Achievement 2'],
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    ...overrides,
  }
}

/**
 * Creates a mock CMS tech item with optional custom properties.
 */
export function createMockTechItem(overrides: Partial<CmsTechItem> = {}): CmsTechItem {
  return {
    name: 'React',
    icon: 'react',
    level: 'Expert',
    category: 'Frontend',
    description: 'A JavaScript library for building user interfaces',
    yearsUsed: 5,
    ...overrides,
  }
}

/**
 * Creates a mock CMS service package with optional custom properties.
 */
export function createMockServicePackage(overrides: Partial<CmsServicePackage> = {}): CmsServicePackage {
  return {
    name: 'Standard Package',
    slug: 'standard',
    description: 'A comprehensive standard package',
    price: 'Starting at $5,000',
    basePrice: 5000,
    promoPrice: null,
    promoBasePrice: null,
    gradient: 'from-blue-500 to-purple-600',
    highlights: ['Feature 1', 'Feature 2'],
    features: ['🎨 Design', 'Responsive layout', 'Cross-browser support', '', '⚡ Performance', 'Fast loading'],
    addons: [
      { label: 'E-commerce integration', price: 1000 },
      { label: 'Custom animations', feature: 'Advanced Animations' },
    ],
    addonsNote: 'Additional features available upon request',
    popular: false,
    ...overrides,
  }
}

/**
 * Creates a mock CMS addon feature with optional custom properties.
 */
export function createMockAddonFeature(overrides: Partial<CmsAddonFeature> = {}): CmsAddonFeature {
  return {
    name: 'E-commerce Integration',
    desc: 'Full shopping cart and checkout functionality',
    price: 1000,
    icon: 'ShoppingCart',
    ...overrides,
  }
}

/**
 * Creates a mock CMS FAQ with optional custom properties.
 */
export function createMockFaq(overrides: Partial<CmsFaq> = {}): CmsFaq {
  return {
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee.',
    ...overrides,
  }
}

/**
 * Creates a mock CMS section heading with optional custom properties.
 */
export function createMockSectionHeading(overrides: Partial<CmsSectionHeading> = {}): CmsSectionHeading {
  return {
    sectionId: 'projects',
    tagText: 'Portfolio',
    tagIcon: 'Briefcase',
    heading: 'Featured Projects',
    description: 'Explore my recent work',
    ctaText: 'View All Projects',
    ...overrides,
  }
}

/**
 * Creates a mock CMS site settings object with optional custom properties.
 */
export function createMockSiteSettings(overrides: Partial<CmsSiteSettings> = {}): CmsSiteSettings {
  return {
    name: 'Test Portfolio',
    logoLight: 'https://cdn.sanity.io/images/test/logo-light.png',
    logoDark: 'https://cdn.sanity.io/images/test/logo-dark.png',
    tagline: 'Building digital experiences',
    typewriterRoles: ['Full-Stack Developer', 'UI/UX Designer', 'Problem Solver'],
    availabilityBanner: 'Available for freelance work',
    skillsPreview: [
      { label: 'React', icon: 'react' },
      { label: 'TypeScript', icon: 'typescript' },
    ],
    resumeCommand: 'npx jlangdev',
    resumeCopyCommand: 'npx jlangdev --copy',
    email: 'test@example.com',
    publicEmail: 'hello@example.com',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    socials: [
      { label: 'GitHub', href: 'https://github.com/test', icon: 'Github', color: '#333' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/test', icon: 'Linkedin', color: '#0077B5' },
    ],
    navItems: [
      { label: 'Home', href: '#hero' },
      { label: 'Projects', href: '#projects' },
      { label: 'About', href: '#about' },
    ],
    footerText: '© 2026 Test Portfolio. All rights reserved.',
    seoTitle: 'Test Portfolio - Full-Stack Developer',
    seoDescription: 'Full-stack developer specializing in modern web applications',
    seoKeywords: ['developer', 'portfolio', 'web development'],
    ogTitle: 'Test Portfolio',
    ogDescription: 'Full-stack developer portfolio',
    ogImage: 'https://cdn.sanity.io/images/test/og-image.jpg',
    ...overrides,
  }
}

/**
 * Creates a mock CMS about content object with optional custom properties.
 */
export function createMockAboutContent(overrides: Partial<CmsAboutContent> = {}): CmsAboutContent {
  return {
    greeting: 'Hi, I\'m Test Developer',
    role: 'Full-Stack Developer',
    age: '28',
    yearsExperience: '5+',
    bio: [
      'First paragraph of bio',
      'Second paragraph of bio',
    ],
    coreCompetencies: ['Web Development', 'UI/UX Design', 'Database Architecture'],
    coreCompetenciesLabel: 'Core Competencies',
    emergingSectors: ['AI/ML', 'Web3', 'Edge Computing'],
    emergingSectorsLabel: 'Emerging Tech',
    achievements: [
      { text: '50+ projects delivered', icon: 'Briefcase', color: '#3B82F6' },
      { text: '100% client satisfaction', icon: 'Star', color: '#F59E0B' },
    ],
    availability: ['Freelance projects', 'Contract work', 'Consulting'],
    currentRole: {
      title: 'Senior Developer',
      subtitle: 'Tech Company',
      period: '2023 - Present',
      description: 'Leading development of key features',
      badge: 'Current',
    },
    stats: {
      yearsExperience: '5+',
      websitesCreated: '50+',
      clientSatisfaction: '100%',
    },
    ...overrides,
  }
}

/**
 * Creates a mock CMS promo content object with optional custom properties.
 */
export function createMockPromoContent(overrides: Partial<CmsPromoContent> = {}): CmsPromoContent {
  return {
    eyebrow: 'Limited Time Offer',
    headline: 'Get 20% Off Your First Project',
    subhead: 'Book a consultation this month',
    attributionOffer: 'Mention this offer when booking',
    attributionCheckboxLabel: 'I want to claim this offer',
    active: true,
    ...overrides,
  }
}

/**
 * Creates a mock testimonial with optional custom properties.
 */
export function createMockTestimonial(overrides: Partial<SiteTestimonial> = {}): SiteTestimonial {
  return {
    _id: 'testimonial-test-1234',
    content: 'This is a test testimonial. The work was excellent and exceeded expectations.',
    author: 'John Doe',
    role: 'CEO',
    company: 'Test Company',
    rating: 5,
    featured: false,
    ...overrides,
  }
}

/**
 * Creates a mock review request with optional custom properties.
 */
export function createMockReviewRequest(overrides: Partial<ReviewRequest> = {}): ReviewRequest {
  return {
    _id: 'review-request-test-1234',
    clientName: 'Jane Smith',
    company: 'Test Corporation',
    role: 'CTO',
    status: 'pending',
    ...overrides,
  }
}

// ============================================================================
// Mock Client Utilities
// ============================================================================

/**
 * Creates a mock Sanity client with configurable responses.
 */
export function createMockSanityClient(mockResponses: Record<string, unknown> = {}) {
  return {
    fetch: vi.fn(async (query: string) => {
      // Return pre-configured responses based on query type detection
      if (query.includes('_type == "project"')) {
        return mockResponses.projects ?? [createMockProject()]
      }
      if (query.includes('_type == "experience"')) {
        return mockResponses.experience ?? [createMockExperience()]
      }
      if (query.includes('_type == "techItem"')) {
        return mockResponses.techStack ?? [createMockTechItem()]
      }
      if (query.includes('_type == "servicePackage"')) {
        return mockResponses.servicePackages ?? [createMockServicePackage()]
      }
      if (query.includes('_type == "addonFeature"')) {
        return mockResponses.addonFeatures ?? [createMockAddonFeature()]
      }
      if (query.includes('_type == "faq"')) {
        return mockResponses.faqs ?? [createMockFaq()]
      }
      if (query.includes('_type == "sectionContent"')) {
        return mockResponses.sectionHeadings ?? [createMockSectionHeading()]
      }
      if (query.includes('_type == "siteSettings"')) {
        return mockResponses.siteSettings ?? createMockSiteSettings()
      }
      if (query.includes('_type == "aboutContent"')) {
        return mockResponses.aboutContent ?? createMockAboutContent()
      }
      if (query.includes('_type == "promoContent"')) {
        return mockResponses.promoContent ?? createMockPromoContent()
      }
      if (query.includes('_type == "testimonial"')) {
        return mockResponses.testimonials ?? [createMockTestimonial()]
      }
      if (query.includes('_type == "reviewRequest"')) {
        return mockResponses.reviewRequest ?? createMockReviewRequest()
      }
      return null
    }),
    withConfig: vi.fn(function (this: unknown) {
      return this
    }),
  }
}

/**
 * Mocks the Sanity client module with custom responses.
 * Use this in tests to mock Sanity CMS data without real API calls.
 *
 * @example
 * ```ts
 * import { mockSanityClient } from '@/tests/utils/sanity-mocks'
 *
 * // In your test
 * mockSanityClient({
 *   projects: [createMockProject({ title: 'Custom Project' })],
 *   siteSettings: createMockSiteSettings({ name: 'Custom Site' })
 * })
 * ```
 */
export function mockSanityClient(mockResponses: Record<string, unknown> = {}) {
  const client = createMockSanityClient(mockResponses)

  vi.doMock('@/sanity/lib/client', () => ({
    sanityClient: client,
    previewClient: client,
    getSanityClient: vi.fn(() => client),
    sanityIsConfigured: true,
  }))

  return client
}

/**
 * Mocks the CMS module functions with custom return values.
 * Use this when you want to mock specific CMS functions rather than the entire client.
 *
 * @example
 * ```ts
 * import { mockCmsFunctions } from '@/tests/utils/sanity-mocks'
 *
 * // In your test
 * mockCmsFunctions({
 *   getProjects: vi.fn(async () => [createMockProject()]),
 *   getSiteSettings: vi.fn(async () => createMockSiteSettings())
 * })
 * ```
 */
export function mockCmsFunctions(mocks: Partial<{
  isDraftMode: ReturnType<typeof vi.fn>
  getProjects: ReturnType<typeof vi.fn>
  getExperience: ReturnType<typeof vi.fn>
  getTechStack: ReturnType<typeof vi.fn>
  getServicePackages: ReturnType<typeof vi.fn>
  getAddonFeatures: ReturnType<typeof vi.fn>
  getFaqs: ReturnType<typeof vi.fn>
  getSectionHeadings: ReturnType<typeof vi.fn>
  getSiteSettings: ReturnType<typeof vi.fn>
  getAboutContent: ReturnType<typeof vi.fn>
  getPromoContent: ReturnType<typeof vi.fn>
}> = {}) {
  vi.doMock('@/lib/cms', () => ({
    isDraftMode: mocks.isDraftMode ?? vi.fn(async () => false),
    getProjects: mocks.getProjects ?? vi.fn(async () => [createMockProject()]),
    getExperience: mocks.getExperience ?? vi.fn(async () => [createMockExperience()]),
    getTechStack: mocks.getTechStack ?? vi.fn(async () => ({ Frontend: [createMockTechItem()] })),
    getServicePackages: mocks.getServicePackages ?? vi.fn(async () => [createMockServicePackage()]),
    getAddonFeatures: mocks.getAddonFeatures ?? vi.fn(async () => [createMockAddonFeature()]),
    getFaqs: mocks.getFaqs ?? vi.fn(async () => [createMockFaq()]),
    getSectionHeadings: mocks.getSectionHeadings ?? vi.fn(async () => ({ projects: createMockSectionHeading() })),
    getSiteSettings: mocks.getSiteSettings ?? vi.fn(async () => createMockSiteSettings()),
    getAboutContent: mocks.getAboutContent ?? vi.fn(async () => createMockAboutContent()),
    getPromoContent: mocks.getPromoContent ?? vi.fn(async () => createMockPromoContent()),
  }))
}

/**
 * Mocks the Sanity image utilities.
 * Use this when testing components that use urlForImage or dimensionsForImage.
 */
export function mockSanityImageUtils() {
  vi.doMock('@/sanity/lib/image', () => ({
    urlForImage: vi.fn((image: SanityImageRef | null | undefined) => {
      if (!image?.asset) return null
      return image.asset.url ?? 'https://cdn.sanity.io/images/test/default.jpg'
    }),
    dimensionsForImage: vi.fn((image: SanityImageRef | null | undefined) => {
      const dims = image?.asset?.metadata?.dimensions
      return dims?.width && dims?.height ? { width: dims.width, height: dims.height } : null
    }),
  }))
}

// ============================================================================
// Batch Mock Data Generators
// ============================================================================

/**
 * Creates an array of mock projects with incrementing IDs and varying properties.
 */
export function createMockProjects(count: number): CmsProject[] {
  return Array.from({ length: count }, (_, i) => createMockProject({
    title: `Project ${i + 1}`,
    subtitle: `Subtitle for project ${i + 1}`,
    featured: i === 0, // First project is featured
    status: i % 2 === 0 ? 'Live' : 'In Development',
  }))
}

/**
 * Creates an array of mock experience entries with incrementing data.
 */
export function createMockExperiences(count: number): CmsExperience[] {
  return Array.from({ length: count }, (_, i) => createMockExperience({
    role: `Role ${i + 1}`,
    company: `Company ${i + 1}`,
    period: `202${i} - 202${i + 1}`,
  }))
}

/**
 * Creates a grouped tech stack object with multiple categories.
 */
export function createMockTechStack(): Record<string, CmsTechItem[]> {
  return {
    Frontend: [
      createMockTechItem({ name: 'React', category: 'Frontend' }),
      createMockTechItem({ name: 'Vue', category: 'Frontend', level: 'Intermediate' }),
    ],
    Backend: [
      createMockTechItem({ name: 'Node.js', category: 'Backend' }),
      createMockTechItem({ name: 'Python', category: 'Backend', level: 'Intermediate' }),
    ],
    Database: [
      createMockTechItem({ name: 'PostgreSQL', category: 'Database' }),
      createMockTechItem({ name: 'MongoDB', category: 'Database', level: 'Intermediate' }),
    ],
  }
}

/**
 * Creates a complete mock section headings object for all sections.
 */
export function createMockSectionHeadings(): CmsSectionHeadings {
  return {
    hero: createMockSectionHeading({ sectionId: 'hero', heading: 'Welcome' }),
    projects: createMockSectionHeading({ sectionId: 'projects', heading: 'Projects' }),
    about: createMockSectionHeading({ sectionId: 'about', heading: 'About Me' }),
    experience: createMockSectionHeading({ sectionId: 'experience', heading: 'Experience' }),
    tech: createMockSectionHeading({ sectionId: 'tech', heading: 'Tech Stack' }),
    services: createMockSectionHeading({ sectionId: 'services', heading: 'Services' }),
    contact: createMockSectionHeading({ sectionId: 'contact', heading: 'Get in Touch' }),
  }
}
