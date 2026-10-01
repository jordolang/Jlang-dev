import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockTestimonial, createMockReviewRequest } from '@/tests/utils/sanity-mocks'

// Mock Sanity client; sanityIsConfigured is a getter so tests can toggle it
const sanityState = vi.hoisted(() => ({ configured: true }))

vi.mock('@/sanity/lib/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
  get sanityIsConfigured() {
    return sanityState.configured
  },
}))

describe('Reviews Library', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sanityState.configured = true
  })

  describe('getApprovedTestimonials', () => {
    it('should return empty array when Sanity is not configured', async () => {
      sanityState.configured = false

      const reviews = await import('@/lib/reviews')
      const result = await reviews.getApprovedTestimonials()

      expect(result).toEqual([])
    })

    it('should fetch approved testimonials successfully', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      const mockTestimonials = [
        createMockTestimonial(),
        createMockTestimonial({ _id: 'testimonial-2', author: 'Jane Doe' }),
      ]
      vi.mocked(sanityClient.fetch).mockResolvedValue(mockTestimonials as never)

      const { getApprovedTestimonials } = await import('@/lib/reviews')
      const result = await getApprovedTestimonials()

      expect(result).toHaveLength(2)
      expect(result).toEqual(mockTestimonials)
      expect(sanityClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('_type == "testimonial"'),
        expect.objectContaining({}),
        expect.objectContaining({ next: { revalidate: 60, tags: ['testimonials'] } })
      )
    })

    it('should return empty array when no testimonials exist', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      vi.mocked(sanityClient.fetch).mockResolvedValue([] as never)

      const { getApprovedTestimonials } = await import('@/lib/reviews')
      const result = await getApprovedTestimonials()

      expect(result).toEqual([])
    })

    it('should query for approved testimonials only', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      vi.mocked(sanityClient.fetch).mockResolvedValue([createMockTestimonial()] as never)

      const { getApprovedTestimonials } = await import('@/lib/reviews')
      await getApprovedTestimonials()

      const query = vi.mocked(sanityClient.fetch).mock.calls[0][0]
      expect(query).toContain('approved == true')
      expect(query).toContain('order(featured desc, submittedAt desc)')
    })

    it('should include all required fields in query', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      vi.mocked(sanityClient.fetch).mockResolvedValue([createMockTestimonial()] as never)

      const { getApprovedTestimonials } = await import('@/lib/reviews')
      await getApprovedTestimonials()

      const query = vi.mocked(sanityClient.fetch).mock.calls[0][0]
      expect(query).toContain('_id')
      expect(query).toContain('content')
      expect(query).toContain('author')
      expect(query).toContain('role')
      expect(query).toContain('company')
      expect(query).toContain('rating')
      expect(query).toContain('featured')
    })

    it('should handle featured testimonials', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      const mockTestimonials = [
        createMockTestimonial({ featured: true, author: 'Featured Author' }),
        createMockTestimonial({ featured: false, author: 'Regular Author' }),
      ]
      vi.mocked(sanityClient.fetch).mockResolvedValue(mockTestimonials as never)

      const { getApprovedTestimonials } = await import('@/lib/reviews')
      const result = await getApprovedTestimonials()

      expect(result[0].featured).toBe(true)
      expect(result[1].featured).toBe(false)
    })
  })

  describe('getReviewRequest', () => {
    it('should return null when Sanity is not configured', async () => {
      sanityState.configured = false

      const reviews = await import('@/lib/reviews')
      const result = await reviews.getReviewRequest('test-token')

      expect(result).toBeNull()
    })

    it('should return null when no token is provided', async () => {
      const { getReviewRequest } = await import('@/lib/reviews')
      const result = await getReviewRequest('')

      expect(result).toBeNull()
    })

    it('should fetch review request successfully with valid token', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      const mockReviewRequest = createMockReviewRequest()
      vi.mocked(sanityClient.fetch).mockResolvedValue(mockReviewRequest as never)

      const { getReviewRequest } = await import('@/lib/reviews')
      const result = await getReviewRequest('valid-token-123')

      expect(result).toEqual(mockReviewRequest)
      expect(sanityClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('_type == "reviewRequest"'),
        expect.objectContaining({ token: 'valid-token-123' })
      )
    })

    it('should return null when no review request matches the token', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      vi.mocked(sanityClient.fetch).mockResolvedValue(null as never)

      const { getReviewRequest } = await import('@/lib/reviews')
      const result = await getReviewRequest('invalid-token')

      expect(result).toBeNull()
    })

    it('should query for review request with exact token match', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      vi.mocked(sanityClient.fetch).mockResolvedValue(createMockReviewRequest() as never)

      const { getReviewRequest } = await import('@/lib/reviews')
      await getReviewRequest('test-token')

      const query = vi.mocked(sanityClient.fetch).mock.calls[0][0]
      expect(query).toContain('token == $token')
      expect(query).toContain('[0]')
    })

    it('should include all required fields in query', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      vi.mocked(sanityClient.fetch).mockResolvedValue(createMockReviewRequest() as never)

      const { getReviewRequest } = await import('@/lib/reviews')
      await getReviewRequest('test-token')

      const query = vi.mocked(sanityClient.fetch).mock.calls[0][0]
      expect(query).toContain('_id')
      expect(query).toContain('clientName')
      expect(query).toContain('company')
      expect(query).toContain('role')
      expect(query).toContain('status')
      expect(query).toContain('viewedAt')
      expect(query).toContain('submittedAt')
      expect(query).toContain('publishedAt')
      expect(query).toContain('interactions')
    })

    it('should handle different review request statuses', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      const statuses = ['sent', 'viewed', 'submitted', 'published']

      for (const status of statuses) {
        vi.clearAllMocks()
        const mockReviewRequest = createMockReviewRequest({ status })
        vi.mocked(sanityClient.fetch).mockResolvedValue(mockReviewRequest as never)

        const { getReviewRequest } = await import('@/lib/reviews')
        const result = await getReviewRequest('test-token')

        expect(result?.status).toBe(status)
      }
    })

    it('should include timestamp fields when present', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      const mockReviewRequest = createMockReviewRequest({
        viewedAt: '2026-09-30T12:00:00Z',
        submittedAt: '2026-09-30T12:30:00Z',
        publishedAt: '2026-09-30T13:00:00Z',
      })
      vi.mocked(sanityClient.fetch).mockResolvedValue(mockReviewRequest as never)

      const { getReviewRequest } = await import('@/lib/reviews')
      const result = await getReviewRequest('test-token')

      expect(result?.viewedAt).toBe('2026-09-30T12:00:00Z')
      expect(result?.submittedAt).toBe('2026-09-30T12:30:00Z')
      expect(result?.publishedAt).toBe('2026-09-30T13:00:00Z')
    })

    it('should include interactions array when present', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      const mockInteractions = [
        {
          type: 'response',
          timestamp: '2026-09-30T12:00:00Z',
          metadata: {
            author: 'jordan',
            message: 'Thank you!',
            action: 'publish',
          },
        },
      ]
      const mockReviewRequest = createMockReviewRequest({
        interactions: mockInteractions,
      })
      vi.mocked(sanityClient.fetch).mockResolvedValue(mockReviewRequest as never)

      const { getReviewRequest } = await import('@/lib/reviews')
      const result = await getReviewRequest('test-token')

      expect(result?.interactions).toEqual(mockInteractions)
      expect(result?.interactions?.[0].type).toBe('response')
      expect(result?.interactions?.[0].metadata?.author).toBe('jordan')
    })
  })

  describe('Type Safety', () => {
    it('should return SiteTestimonial type from getApprovedTestimonials', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      const mockTestimonial = createMockTestimonial()
      vi.mocked(sanityClient.fetch).mockResolvedValue([mockTestimonial] as never)

      const { getApprovedTestimonials } = await import('@/lib/reviews')
      const result = await getApprovedTestimonials()

      expect(result[0]).toMatchObject({
        _id: expect.any(String),
        content: expect.any(String),
        author: expect.any(String),
        role: expect.any(String),
        company: expect.any(String),
        rating: expect.any(Number),
      })
    })

    it('should return ReviewRequest type from getReviewRequest', async () => {
      const { sanityClient } = await import('@/sanity/lib/client')
      const mockReviewRequest = createMockReviewRequest()
      vi.mocked(sanityClient.fetch).mockResolvedValue(mockReviewRequest as never)

      const { getReviewRequest } = await import('@/lib/reviews')
      const result = await getReviewRequest('test-token')

      expect(result).toMatchObject({
        _id: expect.any(String),
        clientName: expect.any(String),
        company: expect.any(String),
        role: expect.any(String),
        status: expect.any(String),
      })
    })
  })
})
