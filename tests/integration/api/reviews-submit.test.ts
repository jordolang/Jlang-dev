import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Mock the reviews library
vi.mock('@/lib/reviews', () => ({
  getReviewRequest: vi.fn(),
}))

// Mock the Sanity client
vi.mock('@/sanity/lib/client', () => ({
  sanityClient: {
    transaction: vi.fn(() => ({
      createIfNotExists: vi.fn(function(this: any) { return this }),
      patch: vi.fn(function(this: any) { return this }),
      commit: vi.fn(() => Promise.resolve({})),
    })),
  },
  sanityIsConfigured: true,
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

describe('POST /api/reviews/submit', () => {
  const mockReviewRequest = {
    _id: 'review-request-123',
    clientName: 'John Doe',
    company: 'Test Company',
    role: 'CEO',
    status: 'pending',
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    // Reset environment variables
    process.env.SANITY_API_WRITE_TOKEN = 'test-write-token'
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL = 'https://google.com/review'

    // Ensure sanityIsConfigured is true
    const sanityModule = await import('@/sanity/lib/client')
    Object.defineProperty(sanityModule, 'sanityIsConfigured', {
      value: true,
      writable: true,
      configurable: true,
    })
  })

  it('should submit review successfully', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    const { revalidateTag, revalidatePath } = await import('next/cache')

    vi.mocked(getReviewRequest).mockResolvedValue(mockReviewRequest)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'This is a great service! Very professional and helpful.',
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({
      ok: true,
      googleReviewUrl: 'https://google.com/review',
    })
    expect(getReviewRequest).toHaveBeenCalledWith('valid-token-123')
    expect(revalidateTag).toHaveBeenCalledWith('testimonials')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('should reject when Sanity is not configured', async () => {
    // Temporarily set sanityIsConfigured to false
    const { sanityIsConfigured } = await import('@/sanity/lib/client')
    const originalValue = (sanityIsConfigured as any)

    // Use Object.defineProperty to override the exported value
    const sanityModule = await import('@/sanity/lib/client')
    Object.defineProperty(sanityModule, 'sanityIsConfigured', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'This is a great service!',
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(503)
    const data = await response.json()

    expect(data).toEqual({
      error: 'Review service is not configured.',
    })

    // Restore original value
    Object.defineProperty(sanityModule, 'sanityIsConfigured', {
      value: originalValue,
      writable: true,
      configurable: true,
    })
  })

  it('should reject when SANITY_API_WRITE_TOKEN is missing', async () => {
    const originalToken = process.env.SANITY_API_WRITE_TOKEN
    delete process.env.SANITY_API_WRITE_TOKEN

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'This is a great service!',
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(503)
    const data = await response.json()

    expect(data).toEqual({
      error: 'Review service is not configured.',
    })

    // Restore original value
    process.env.SANITY_API_WRITE_TOKEN = originalToken
  })

  it('should reject invalid token', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(null)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'invalid-token',
        content: 'This is a great service!',
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(400)
    const data = await response.json()

    expect(data).toEqual({
      error: 'This review link is invalid or has already been used.',
    })
  })

  it('should reject already completed review', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue({
      ...mockReviewRequest,
      status: 'submitted',
    })

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'This is a great service!',
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(400)
    const data = await response.json()

    expect(data).toEqual({
      error: 'This review link is invalid or has already been used.',
    })
  })

  it('should reject content that is too short', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(mockReviewRequest)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'Too short',
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(400)
    const data = await response.json()

    expect(data).toEqual({
      error: 'Please provide a review and select a rating.',
    })
  })

  it('should reject content that is too long', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(mockReviewRequest)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'x'.repeat(3001),
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(400)
    const data = await response.json()

    expect(data).toEqual({
      error: 'Please provide a review and select a rating.',
    })
  })

  it('should reject invalid rating (too low)', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(mockReviewRequest)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'This is a great service!',
        rating: 0,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(400)
    const data = await response.json()

    expect(data).toEqual({
      error: 'Please provide a review and select a rating.',
    })
  })

  it('should reject invalid rating (too high)', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(mockReviewRequest)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'This is a great service!',
        rating: 6,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(400)
    const data = await response.json()

    expect(data).toEqual({
      error: 'Please provide a review and select a rating.',
    })
  })

  it('should reject non-integer rating', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(mockReviewRequest)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'This is a great service!',
        rating: 4.5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(400)
    const data = await response.json()

    expect(data).toEqual({
      error: 'Please provide a review and select a rating.',
    })
  })

  it('should handle missing request body fields gracefully', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(null)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(400)
    const data = await response.json()

    expect(data).toEqual({
      error: 'This review link is invalid or has already been used.',
    })
    expect(getReviewRequest).toHaveBeenCalledWith('')
  })

  it('should trim whitespace from content', async () => {
    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(mockReviewRequest)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: '   This is a great service with extra spaces   ',
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data.ok).toBe(true)
    expect(getReviewRequest).toHaveBeenCalledWith('valid-token-123')
  })

  it('should return empty google review URL when not configured', async () => {
    const originalUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL
    delete process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL

    const { getReviewRequest } = await import('@/lib/reviews')
    vi.mocked(getReviewRequest).mockResolvedValue(mockReviewRequest)

    const { POST } = await import('@/app/api/reviews/submit/route')

    const mockRequest = new Request('http://localhost:3000/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'valid-token-123',
        content: 'This is a great service!',
        rating: 5,
      }),
    })

    const response = await POST(mockRequest)

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({
      ok: true,
      googleReviewUrl: '',
    })

    // Restore original value
    if (originalUrl) {
      process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL = originalUrl
    }
  })
})
