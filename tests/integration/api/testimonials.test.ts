import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Mock the reviews library
vi.mock('@/lib/reviews', () => ({
  getApprovedTestimonials: vi.fn(),
}))

describe('GET /api/testimonials', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return testimonials successfully', async () => {
    const mockTestimonials = [
      {
        _id: 'test-1',
        content: 'Great service!',
        author: 'John Doe',
        role: 'CEO',
        company: 'Test Company',
        rating: 5,
        featured: true,
      },
      {
        _id: 'test-2',
        content: 'Excellent work!',
        author: 'Jane Smith',
        role: 'CTO',
        company: 'Another Company',
        rating: 5,
        featured: false,
      },
    ]

    const { getApprovedTestimonials } = await import('@/lib/reviews')
    vi.mocked(getApprovedTestimonials).mockResolvedValue(mockTestimonials)

    const { GET } = await import('@/app/api/testimonials/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({ testimonials: mockTestimonials })
    expect(getApprovedTestimonials).toHaveBeenCalledTimes(1)
  })

  it('should return empty array when no testimonials exist', async () => {
    const { getApprovedTestimonials } = await import('@/lib/reviews')
    vi.mocked(getApprovedTestimonials).mockResolvedValue([])

    const { GET } = await import('@/app/api/testimonials/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({ testimonials: [] })
    expect(getApprovedTestimonials).toHaveBeenCalledTimes(1)
  })

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Database connection failed')
    const { getApprovedTestimonials } = await import('@/lib/reviews')

    vi.mocked(getApprovedTestimonials).mockRejectedValue(mockError)

    const { GET } = await import('@/app/api/testimonials/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({ testimonials: [] })
  })

  it('should handle network errors', async () => {
    const networkError = new Error('Network timeout')
    const { getApprovedTestimonials } = await import('@/lib/reviews')

    vi.mocked(getApprovedTestimonials).mockRejectedValue(networkError)

    const { GET } = await import('@/app/api/testimonials/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({ testimonials: [] })
  })

  it('should return correct content-type header', async () => {
    const mockTestimonials = [
      {
        _id: 'test-1',
        content: 'Great service!',
        author: 'John Doe',
        role: 'CEO',
        company: 'Test Company',
        rating: 5,
      },
    ]

    const { getApprovedTestimonials } = await import('@/lib/reviews')
    vi.mocked(getApprovedTestimonials).mockResolvedValue(mockTestimonials)

    const { GET } = await import('@/app/api/testimonials/route')
    const response = await GET()

    expect(response.headers.get('content-type')).toContain('application/json')
  })
})
