import { describe, it, expect } from 'vitest'
import {
  createMockResponse,
  createMockFetch,
  createMockHeaders,
  createMockCookies,
  createMockDate,
  createMockUUID,
  createMockEmail,
  createMockPagination,
  wait,
  isDefined,
  assertDefined,
  createMock,
} from './test-helpers'

describe('Test Helpers', () => {
  describe('Fetch Mocking', () => {
    it('should create a mock response with default values', () => {
      const response = createMockResponse()
      expect(response.ok).toBe(true)
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
    })

    it('should create a mock response with custom data', async () => {
      const response = createMockResponse({
        data: { message: 'test' },
        status: 201,
        statusText: 'Created',
      })

      expect(response.status).toBe(201)
      expect(response.statusText).toBe('Created')
      const data = await response.json()
      expect(data).toEqual({ message: 'test' })
    })

    it('should create a mock fetch with URL-based responses', async () => {
      const mockFetch = createMockFetch({
        '/api/blog': { data: { posts: [] } },
        '/api/testimonials': { data: { testimonials: [] } },
      })

      const blogResponse = await mockFetch('/api/blog')
      const blogData = await blogResponse.json()
      expect(blogData).toEqual({ posts: [] })

      const testimonialsResponse = await mockFetch('/api/testimonials')
      const testimonialsData = await testimonialsResponse.json()
      expect(testimonialsData).toEqual({ testimonials: [] })
    })

    it('should return 404 for unmatched URLs', async () => {
      const mockFetch = createMockFetch({
        '/api/blog': { data: { posts: [] } },
      })

      const response = await mockFetch('/api/unknown')
      expect(response.status).toBe(404)
    })
  })

  describe('Next.js Mocking', () => {
    it('should create mock headers', () => {
      const headers = createMockHeaders({
        'user-agent': 'test-agent',
        'x-custom': 'value',
      })

      expect(headers.get('user-agent')).toBe('test-agent')
      expect(headers.get('x-custom')).toBe('value')
      expect(headers.has('user-agent')).toBe(true)
      expect(headers.has('missing')).toBe(false)
    })

    it('should create mock cookies', () => {
      const cookies = createMockCookies({
        sessionId: 'abc123',
        theme: 'dark',
      })

      expect(cookies.get('sessionId')).toEqual({ name: 'sessionId', value: 'abc123' })
      expect(cookies.has('theme')).toBe(true)
      expect(cookies.has('missing')).toBe(false)

      cookies.set('newCookie', 'newValue')
      expect(cookies.get('newCookie')).toEqual({ name: 'newCookie', value: 'newValue' })

      cookies.delete('sessionId')
      expect(cookies.get('sessionId')).toBeUndefined()
    })
  })

  describe('Common Test Data', () => {
    it('should create a mock date', () => {
      const date = createMockDate()
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })

    it('should create a mock date with custom value', () => {
      const date = createMockDate('2025-01-01')
      expect(date).toContain('2025-01-01')
    })

    it('should create a mock UUID', () => {
      const uuid = createMockUUID()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should create a mock email', () => {
      const email = createMockEmail('testuser')
      expect(email).toBe('testuser@example.com')
    })

    it('should create a mock email with random username', () => {
      const email = createMockEmail()
      expect(email).toMatch(/^test-[a-z0-9]+@example\.com$/)
    })

    it('should create mock pagination', () => {
      const pagination = createMockPagination({
        page: 2,
        perPage: 20,
        total: 100,
      })

      expect(pagination).toEqual({
        page: 2,
        perPage: 20,
        total: 100,
        totalPages: 5,
      })
    })
  })

  describe('Async Utilities', () => {
    it('should wait for specified milliseconds', async () => {
      const start = Date.now()
      await wait(50)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(45) // Allow some tolerance
    })
  })

  describe('Type Utilities', () => {
    it('should filter defined values', () => {
      const values = [1, null, 2, undefined, 3, 0]
      const defined = values.filter(isDefined)
      expect(defined).toEqual([1, 2, 3, 0])
    })

    it('should assert defined values', () => {
      const value = 'test'
      expect(() => assertDefined(value)).not.toThrow()
    })

    it('should throw for null values', () => {
      expect(() => assertDefined(null)).toThrow('Expected value to be defined')
    })

    it('should throw for undefined values', () => {
      expect(() => assertDefined(undefined)).toThrow('Expected value to be defined')
    })

    it('should create a type-safe mock', () => {
      const originalFn = (id: string) => ({ id, name: 'test' })
      const mock = createMock(originalFn)

      const result = mock('123')
      expect(result).toEqual({ id: '123', name: 'test' })
      expect(mock).toHaveBeenCalledWith('123')
    })
  })
})
