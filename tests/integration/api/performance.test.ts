import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Mock the performance library
vi.mock('@/lib/performance', () => ({
  fetchLighthouseScores: vi.fn(),
}))

describe('GET /api/performance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return performance metrics successfully', async () => {
    const mockMetrics = {
      mobile: {
        scores: {
          performance: 95,
          accessibility: 100,
          bestPractices: 92,
          seo: 100,
        },
        vitals: {
          lcp: {
            value: 1200,
            displayValue: '1.2 s',
            pass: true,
          },
          fid: {
            value: 50,
            displayValue: '50 ms',
            pass: true,
          },
          cls: {
            value: 0.05,
            displayValue: '0.05',
            pass: true,
          },
        },
      },
      desktop: {
        scores: {
          performance: 98,
          accessibility: 100,
          bestPractices: 95,
          seo: 100,
        },
        vitals: {
          lcp: {
            value: 800,
            displayValue: '0.8 s',
            pass: true,
          },
          fid: {
            value: 30,
            displayValue: '30 ms',
            pass: true,
          },
          cls: {
            value: 0.02,
            displayValue: '0.02',
            pass: true,
          },
        },
      },
      fetchedAt: '2024-01-01T12:00:00.000Z',
    }

    const { fetchLighthouseScores } = await import('@/lib/performance')
    vi.mocked(fetchLighthouseScores).mockResolvedValue(mockMetrics)

    const { GET } = await import('@/app/api/performance/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({ metrics: mockMetrics })
    expect(fetchLighthouseScores).toHaveBeenCalledTimes(1)
  })

  it('should return null when no metrics exist', async () => {
    const { fetchLighthouseScores } = await import('@/lib/performance')
    vi.mocked(fetchLighthouseScores).mockResolvedValue(null)

    const { GET } = await import('@/app/api/performance/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({ metrics: null })
    expect(fetchLighthouseScores).toHaveBeenCalledTimes(1)
  })

  it('should handle errors gracefully', async () => {
    const mockError = new Error('PageSpeed API failed')
    const { fetchLighthouseScores } = await import('@/lib/performance')

    vi.mocked(fetchLighthouseScores).mockRejectedValue(mockError)

    const { GET } = await import('@/app/api/performance/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({ metrics: null })
  })

  it('should handle network errors', async () => {
    const networkError = new Error('Network timeout')
    const { fetchLighthouseScores } = await import('@/lib/performance')

    vi.mocked(fetchLighthouseScores).mockRejectedValue(networkError)

    const { GET } = await import('@/app/api/performance/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual({ metrics: null })
  })

  it('should return correct content-type header', async () => {
    const mockMetrics = {
      mobile: {
        scores: {
          performance: 95,
          accessibility: 100,
          bestPractices: 92,
          seo: 100,
        },
        vitals: {
          lcp: {
            value: 1200,
            displayValue: '1.2 s',
            pass: true,
          },
          fid: {
            value: 50,
            displayValue: '50 ms',
            pass: true,
          },
          cls: {
            value: 0.05,
            displayValue: '0.05',
            pass: true,
          },
        },
      },
      desktop: {
        scores: {
          performance: 98,
          accessibility: 100,
          bestPractices: 95,
          seo: 100,
        },
        vitals: {
          lcp: {
            value: 800,
            displayValue: '0.8 s',
            pass: true,
          },
          fid: {
            value: 30,
            displayValue: '30 ms',
            pass: true,
          },
          cls: {
            value: 0.02,
            displayValue: '0.02',
            pass: true,
          },
        },
      },
      fetchedAt: '2024-01-01T12:00:00.000Z',
    }

    const { fetchLighthouseScores } = await import('@/lib/performance')
    vi.mocked(fetchLighthouseScores).mockResolvedValue(mockMetrics)

    const { GET } = await import('@/app/api/performance/route')
    const response = await GET()

    expect(response.headers.get('content-type')).toContain('application/json')
  })
})
