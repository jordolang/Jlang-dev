import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Mock the blog library
vi.mock('@/lib/blog', () => ({
  getAllBlogPosts: vi.fn(),
}))

// Mock the logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('GET /api/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return blog posts successfully', async () => {
    const mockPosts = [
      {
        slug: 'test-post-1',
        title: 'Test Post 1',
        date: '2024-01-01',
        excerpt: 'This is a test post',
        image: '/images/blog/test.jpg',
        tags: [
          { slug: 'test', name: 'Test' },
          { slug: 'blog', name: 'Blog' }
        ],
        author: 'Test Author',
        readTime: '5 min read',
        content: 'Test content',
      },
      {
        slug: 'test-post-2',
        title: 'Test Post 2',
        date: '2024-01-02',
        excerpt: 'This is another test post',
        image: '/images/blog/test2.jpg',
        tags: [
          { slug: 'test', name: 'Test' }
        ],
        author: 'Test Author',
        readTime: '3 min read',
        content: 'Test content 2',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/api/blog/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual(mockPosts)
    expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
  })

  it('should return empty array when no posts exist', async () => {
    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue([])

    const { GET } = await import('@/app/api/blog/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const data = await response.json()

    expect(data).toEqual([])
    expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
  })

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Database connection failed')
    const { getAllBlogPosts } = await import('@/lib/blog')
    const { logger } = await import('@/lib/logger')

    vi.mocked(getAllBlogPosts).mockRejectedValue(mockError)

    const { GET } = await import('@/app/api/blog/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data).toEqual({ error: 'Failed to fetch blog posts' })

    expect(logger.error).toHaveBeenCalledWith('Error fetching blog posts:', mockError)
  })

  it('should handle network errors', async () => {
    const networkError = new Error('Network timeout')
    const { getAllBlogPosts } = await import('@/lib/blog')
    const { logger } = await import('@/lib/logger')

    vi.mocked(getAllBlogPosts).mockRejectedValue(networkError)

    const { GET } = await import('@/app/api/blog/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data).toEqual({ error: 'Failed to fetch blog posts' })

    expect(logger.error).toHaveBeenCalledWith('Error fetching blog posts:', networkError)
  })

  it('should return correct content-type header', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        excerpt: 'Test excerpt',
        image: '/images/blog/test.jpg',
        tags: [
          { slug: 'test', name: 'Test' }
        ],
        author: 'Test Author',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/api/blog/route')
    const response = await GET()

    expect(response.headers.get('content-type')).toContain('application/json')
  })
})
