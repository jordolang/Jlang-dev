import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createMockComparisonPage,
  createMockCompetitor,
  createMockComparisonCategory,
  createMockCta,
  createMockPainPoint,
} from '@/tests/utils/sanity-mocks'

// Mock Next.js headers
vi.mock('next/headers', () => ({
  draftMode: vi.fn(),
}))

// Mock Sanity client; sanityIsConfigured is a getter so tests can toggle it
const sanityState = vi.hoisted(() => ({ configured: true }))

vi.mock('@/sanity/lib/client', () => ({
  getSanityClient: vi.fn(),
  get sanityIsConfigured() {
    return sanityState.configured
  },
}))

describe('CMS Library - Comparison Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sanityState.configured = true
  })

  describe('getComparisonPage', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch and return comparison page data', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(createMockComparisonPage()),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        competitors: expect.any(Array),
      })
      expect(result?.competitors).toHaveLength(3)
    })

    it('should return null when Sanity is not configured', async () => {
      sanityState.configured = false

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result).toBeNull()
    })

    it('should return null when query fails', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockRejectedValue(new Error('Network error')),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result).toBeNull()
    })

    it('should return null when no comparison page exists', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(null),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result).toBeNull()
    })

    it('should include all competitor fields', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockCompetitor = createMockCompetitor({
        name: 'Test Platform',
        logo: 'test-logo',
        tagline: 'A test platform',
        monthlyCost: '$50/mo',
        performanceScore: 80,
        seoCapabilities: 'Excellent',
        customization: 'Highly customizable',
        ownership: 'Full ownership',
        support: '24/7 support',
        painPoints: [
          createMockPainPoint({ issue: 'Learning curve', source: 'User feedback' }),
        ],
        isCustom: true,
      })

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            competitors: [mockCompetitor],
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.competitors[0]).toMatchObject({
        name: 'Test Platform',
        logo: 'test-logo',
        tagline: 'A test platform',
        monthlyCost: '$50/mo',
        performanceScore: 80,
        seoCapabilities: 'Excellent',
        customization: 'Highly customizable',
        ownership: 'Full ownership',
        support: '24/7 support',
        isCustom: true,
      })
      expect(result?.competitors[0].painPoints).toHaveLength(1)
      expect(result?.competitors[0].painPoints?.[0]).toMatchObject({
        issue: 'Learning curve',
        source: 'User feedback',
      })
    })

    it('should handle missing optional competitor fields', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const minimalCompetitor: Partial<typeof createMockCompetitor> = {
        name: 'Minimal Platform',
        // All other fields are optional
      }

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            competitors: [minimalCompetitor as ReturnType<typeof createMockCompetitor>],
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.competitors[0].name).toBe('Minimal Platform')
      expect(result).toBeTruthy()
    })

    it('should include comparison categories when provided', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockCategories = [
        createMockComparisonCategory({ category: 'Performance', icon: 'Zap' }),
        createMockComparisonCategory({ category: 'SEO', icon: 'Search' }),
        createMockComparisonCategory({ category: 'Cost', icon: 'DollarSign' }),
      ]

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            comparisonCategories: mockCategories,
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.comparisonCategories).toHaveLength(3)
      expect(result?.comparisonCategories?.[0]).toMatchObject({
        category: 'Performance',
        icon: 'Zap',
      })
    })

    it('should handle empty competitors array', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            competitors: [],
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.competitors).toEqual([])
    })

    it('should handle empty comparison categories array', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            comparisonCategories: [],
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.comparisonCategories).toEqual([])
    })

    it('should include CTA data when provided', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            ctaHeading: 'Ready to get started?',
            ctaDescription: 'Let\'s build something great',
            ctaPrimary: createMockCta({ text: 'Contact Us', url: '/contact' }),
            ctaSecondary: createMockCta({ text: 'Learn More', url: '/about' }),
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.ctaHeading).toBe('Ready to get started?')
      expect(result?.ctaDescription).toBe('Let\'s build something great')
      expect(result?.ctaPrimary).toMatchObject({
        text: 'Contact Us',
        url: '/contact',
      })
      expect(result?.ctaSecondary).toMatchObject({
        text: 'Learn More',
        url: '/about',
      })
    })

    it('should handle missing CTA fields', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            ctaHeading: undefined,
            ctaDescription: undefined,
            ctaPrimary: undefined,
            ctaSecondary: undefined,
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.ctaHeading).toBeUndefined()
      expect(result?.ctaDescription).toBeUndefined()
      expect(result?.ctaPrimary).toBeUndefined()
      expect(result?.ctaSecondary).toBeUndefined()
    })

    it('should use draft mode when enabled', async () => {
      const { draftMode } = await import('next/headers')
      const { getSanityClient } = await import('@/sanity/lib/client')

      vi.mocked(draftMode).mockResolvedValue({ isEnabled: true } as never)

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(createMockComparisonPage()),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      await getComparisonPage()

      // Verify the client was called with draft mode enabled
      expect(getSanityClient).toHaveBeenCalledWith(true)
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        { cache: 'no-store' }
      )
    })

    it('should use ISR caching when draft mode is disabled', async () => {
      const { draftMode } = await import('next/headers')
      const { getSanityClient } = await import('@/sanity/lib/client')

      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(createMockComparisonPage()),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      await getComparisonPage()

      // Verify the client was called with ISR caching
      expect(getSanityClient).toHaveBeenCalledWith(false)
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        { next: { revalidate: 60, tags: ['comparisonPage'] } }
      )
    })

    it('should handle pain points with missing source field', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const competitorWithPainPoints = createMockCompetitor({
        painPoints: [
          createMockPainPoint({ issue: 'High cost' }),
          createMockPainPoint({ issue: 'Poor support', source: 'Reviews' }),
        ],
      })

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            competitors: [competitorWithPainPoints],
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.competitors[0].painPoints).toHaveLength(2)
      expect(result?.competitors[0].painPoints?.[0].issue).toBe('High cost')
      expect(result?.competitors[0].painPoints?.[1].source).toBe('Reviews')
    })

    it('should handle multiple competitors with varied data', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const competitors = [
        createMockCompetitor({
          name: 'Platform A',
          performanceScore: 90,
          isCustom: true,
        }),
        createMockCompetitor({
          name: 'Platform B',
          performanceScore: 70,
          isCustom: false,
        }),
        createMockCompetitor({
          name: 'Platform C',
          performanceScore: 50,
          isCustom: false,
        }),
      ]

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(
          createMockComparisonPage({
            competitors,
          })
        ),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getComparisonPage } = await import('@/lib/cms')
      const result = await getComparisonPage()

      expect(result?.competitors).toHaveLength(3)
      expect(result?.competitors.map(c => c.name)).toEqual(['Platform A', 'Platform B', 'Platform C'])
      expect(result?.competitors[0].isCustom).toBe(true)
      expect(result?.competitors[1].isCustom).toBe(false)
    })
  })
})
