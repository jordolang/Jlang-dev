import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock server-only to prevent errors in test environment
vi.mock('server-only', () => ({}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Performance Library', () => {
  // Store original env
  const originalEnv = process.env.GOOGLE_PAGESPEED_API_KEY

  beforeEach(() => {
    vi.clearAllMocks()
    // Set up API key by default
    process.env.GOOGLE_PAGESPEED_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    // Restore original env
    if (originalEnv !== undefined) {
      process.env.GOOGLE_PAGESPEED_API_KEY = originalEnv
    } else {
      delete process.env.GOOGLE_PAGESPEED_API_KEY
    }
  })

  describe('fetchLighthouseScores', () => {
    const mockPageSpeedResponse = {
      loadingExperience: { metrics: { FIRST_INPUT_DELAY_MS: { percentile: 50 } } },
      lighthouseResult: {
        fetchTime: '2026-01-15T12:00:00.000Z',
        categories: {
          performance: { score: 0.95 },
          accessibility: { score: 0.98 },
          'best-practices': { score: 0.92 },
          seo: { score: 1.0 },
        },
        audits: {
          'largest-contentful-paint': {
            displayValue: '1.8 s',
            numericValue: 1800,
          },
          'cumulative-layout-shift': {
            displayValue: '0.05',
            numericValue: 0.05,
          },
        },
      },
    }

    it('should fetch and parse mobile and desktop scores successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockPageSpeedResponse,
      })

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result).toBeTruthy()
      expect(result?.mobile.scores).toEqual({
        performance: 95,
        accessibility: 98,
        bestPractices: 92,
        seo: 100,
      })
      expect(result?.desktop.scores).toEqual({
        performance: 95,
        accessibility: 98,
        bestPractices: 92,
        seo: 100,
      })
      expect(result?.fetchedAt).toBe('2026-01-15T12:00:00.000Z')

      // Verify both mobile and desktop calls were made
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should parse Core Web Vitals with correct pass/fail status', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockPageSpeedResponse,
      })

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result?.mobile.vitals.lcp).toEqual({
        value: 1800,
        displayValue: '1.8 s',
        pass: true, // < 2500ms
      })
      expect(result?.mobile.vitals.fid).toEqual({
        value: 50,
        displayValue: '50 ms',
        pass: true, // < 100ms
      })
      expect(result?.mobile.vitals.cls).toEqual({
        value: 0.05,
        displayValue: '0.05',
        pass: true, // < 0.1
      })
    })

    it('should handle failing Core Web Vitals thresholds', async () => {
      const badVitalsResponse = {
        loadingExperience: { metrics: { FIRST_INPUT_DELAY_MS: { percentile: 150 } } }, // > 100ms (fail)
        lighthouseResult: {
          fetchTime: '2026-01-15T12:00:00.000Z',
          categories: {
            performance: { score: 0.5 },
            accessibility: { score: 0.8 },
            'best-practices': { score: 0.7 },
            seo: { score: 0.9 },
          },
          audits: {
            'largest-contentful-paint': {
              displayValue: '4.5 s',
              numericValue: 4500, // > 2500ms (fail)
            },
            'cumulative-layout-shift': {
              displayValue: '0.25',
              numericValue: 0.25, // > 0.1 (fail)
            },
          },
        },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => badVitalsResponse,
      })

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result?.mobile.vitals.lcp.pass).toBe(false)
      expect(result?.mobile.vitals.fid.pass).toBe(false)
      expect(result?.mobile.vitals.cls.pass).toBe(false)
    })

    it('should handle missing first-input-delay audit gracefully', async () => {
      const noFidResponse = {
        lighthouseResult: {
          fetchTime: '2026-01-15T12:00:00.000Z',
          categories: {
            performance: { score: 0.95 },
            accessibility: { score: 0.98 },
            'best-practices': { score: 0.92 },
            seo: { score: 1.0 },
          },
          audits: {
            'largest-contentful-paint': {
              displayValue: '1.8 s',
              numericValue: 1800,
            },
            // FID is missing
            'cumulative-layout-shift': {
              displayValue: '0.05',
              numericValue: 0.05,
            },
          },
        },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => noFidResponse,
      })

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result?.mobile.vitals.fid).toEqual({
        value: 0,
        displayValue: 'N/A',
        pass: null, // no field data
      })
    })

    it('should return null when API key is not configured', async () => {
      delete process.env.GOOGLE_PAGESPEED_API_KEY

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        '[performance] GOOGLE_PAGESPEED_API_KEY not configured'
      )

      consoleSpy.mockRestore()
    })

    it('should return null when URL is empty', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('[performance] No URL provided')

      consoleSpy.mockRestore()
    })

    it('should return null when PageSpeed API fails with non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429, // Rate limited
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[performance] PageSpeed API failed')
      )

      consoleSpy.mockRestore()
    })

    it('should return null when fetch throws network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result).toBeNull()
      // console.error is called with (message, error), so check the first argument
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[performance] Failed to fetch PageSpeed data'),
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should return null when mobile data fetch fails', async () => {
      let callCount = 0
      mockFetch.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // First call (mobile) fails
          return Promise.resolve({ ok: false, status: 500 })
        }
        // Second call (desktop) succeeds
        return Promise.resolve({
          ok: true,
          json: async () => mockPageSpeedResponse,
        })
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        '[performance] Failed to fetch data for one or both strategies'
      )

      consoleSpy.mockRestore()
    })

    it('should return null when desktop data fetch fails', async () => {
      let callCount = 0
      mockFetch.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // First call (mobile) succeeds
          return Promise.resolve({
            ok: true,
            json: async () => mockPageSpeedResponse,
          })
        }
        // Second call (desktop) fails
        return Promise.resolve({ ok: false, status: 500 })
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        '[performance] Failed to fetch data for one or both strategies'
      )

      consoleSpy.mockRestore()
    })

    it('should include correct URL parameters in API call', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockPageSpeedResponse,
      })

      const { fetchLighthouseScores } = await import('@/lib/performance')
      await fetchLighthouseScores('https://example.com')

      // Check first call (mobile)
      const firstCall = mockFetch.mock.calls[0][0] as string
      expect(firstCall).toContain('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
      expect(firstCall).toContain('url=https%3A%2F%2Fexample.com')
      expect(firstCall).toContain('key=test-api-key')
      expect(firstCall).toContain('strategy=mobile')
      expect(firstCall).toContain('category=performance&category=accessibility&category=best-practices&category=seo')

      // Check second call (desktop)
      const secondCall = mockFetch.mock.calls[1][0] as string
      expect(secondCall).toContain('strategy=desktop')
    })

    it('should apply cache revalidation of 1 week', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockPageSpeedResponse,
      })

      const { fetchLighthouseScores } = await import('@/lib/performance')
      await fetchLighthouseScores('https://example.com')

      // Check fetch options include cache revalidation
      const fetchOptions = mockFetch.mock.calls[0][1]
      expect(fetchOptions).toEqual({
        next: { revalidate: 604800 }, // 1 week in seconds
      })
    })

    it('should round scores to nearest integer', async () => {
      const decimalScoresResponse = {
        lighthouseResult: {
          categories: {
            performance: { score: 0.954 }, // Should round to 95
            accessibility: { score: 0.987 }, // Should round to 99
            'best-practices': { score: 0.923 }, // Should round to 92
            seo: { score: 0.996 }, // Should round to 100
          },
          audits: {
            'largest-contentful-paint': {
              displayValue: '1.8 s',
              numericValue: 1800,
            },
            'first-input-delay': {
              displayValue: '50 ms',
              numericValue: 50,
            },
            'cumulative-layout-shift': {
              displayValue: '0.05',
              numericValue: 0.05,
            },
          },
        },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => decimalScoresResponse,
      })

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result?.mobile.scores.performance).toBe(95)
      expect(result?.mobile.scores.accessibility).toBe(99)
      expect(result?.mobile.scores.bestPractices).toBe(92)
      expect(result?.mobile.scores.seo).toBe(100)
    })

    it('should handle null scores gracefully', async () => {
      const nullScoresResponse = {
        lighthouseResult: {
          categories: {
            performance: { score: null },
            accessibility: { score: null },
            'best-practices': { score: null },
            seo: { score: null },
          },
          audits: {
            'largest-contentful-paint': {
              displayValue: '1.8 s',
              numericValue: 1800,
            },
            'first-input-delay': {
              displayValue: '50 ms',
              numericValue: 50,
            },
            'cumulative-layout-shift': {
              displayValue: '0.05',
              numericValue: 0.05,
            },
          },
        },
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => nullScoresResponse,
      })

      const { fetchLighthouseScores } = await import('@/lib/performance')
      const result = await fetchLighthouseScores('https://example.com')

      expect(result?.mobile.scores).toEqual({
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
      })
    })
  })
})
