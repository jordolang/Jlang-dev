import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Mock the blog library
vi.mock('@/lib/blog', () => ({
  getAllBlogPosts: vi.fn(),
}))

// Mock draft mode detection (no request context in tests)
vi.mock('@/lib/cms', () => ({
  isDraftMode: vi.fn().mockResolvedValue(false),
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

describe('GET /api/blog/rss.xml', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return RSS feed successfully', async () => {
    const mockPosts = [
      {
        slug: 'test-post-1',
        title: 'Test Post 1',
        date: '2024-01-01',
        excerpt: 'This is a test post',
        image: '/images/blog/test.jpg',
        tags: ['test', 'blog'],
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
        tags: ['test'],
        author: 'Test Author',
        readTime: '3 min read',
        content: 'Test content 2',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/rss.xml/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const text = await response.text()

    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(text).toContain('<rss version="2.0"')
    expect(text).toContain('<title>Test Post 1</title>')
    expect(text).toContain('<title>Test Post 2</title>')
    expect(text).toContain('<category>test</category>')
    expect(text).toContain('<category>blog</category>')
    expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
  })

  it('should return empty RSS feed when no posts exist', async () => {
    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue([])

    const { GET } = await import('@/app/blog/rss.xml/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const text = await response.text()

    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(text).toContain('<rss version="2.0"')
    expect(text).toContain('<channel>')
    expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
  })

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Database connection failed')
    const { getAllBlogPosts } = await import('@/lib/blog')
    const { logger } = await import('@/lib/logger')

    vi.mocked(getAllBlogPosts).mockRejectedValue(mockError)

    const { GET } = await import('@/app/blog/rss.xml/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data).toEqual({ error: 'Failed to generate RSS feed' })

    expect(logger.error).toHaveBeenCalledWith('Error generating RSS feed:', mockError)
  })

  it('should return correct content-type header for RSS', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        excerpt: 'Test excerpt',
        image: '/images/blog/test.jpg',
        tags: ['test'],
        author: 'Test Author',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/rss.xml/route')
    const response = await GET()

    expect(response.headers.get('content-type')).toContain('application/rss+xml')
  })

  it('should include cache-control header', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        excerpt: 'Test excerpt',
        image: '/images/blog/test.jpg',
        tags: ['test'],
        author: 'Test Author',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/rss.xml/route')
    const response = await GET()

    expect(response.headers.get('cache-control')).toContain('public')
    expect(response.headers.get('cache-control')).toContain('s-maxage=3600')
  })

  it('should not allow shared caching in draft mode', async () => {
    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue([])
    const { isDraftMode } = await import('@/lib/cms')
    vi.mocked(isDraftMode).mockResolvedValueOnce(true)

    const { GET } = await import('@/app/blog/rss.xml/route')
    const response = await GET()

    expect(response.headers.get('cache-control')).toBe('private, no-store')
  })

  it('should escape XML special characters in RSS', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test & Special <Characters>',
        date: '2024-01-01',
        excerpt: 'Description with "quotes" & <tags>',
        image: '/images/blog/test.jpg',
        tags: ['test & tag'],
        author: 'Test "Author"',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/rss.xml/route')
    const response = await GET()

    const text = await response.text()

    expect(text).toContain('&amp;')
    expect(text).toContain('&lt;')
    expect(text).toContain('&gt;')
    expect(text).toContain('&quot;')
    expect(text).not.toContain('Test & Special <Characters>')
  })
})

describe('GET /api/blog/feed.xml', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return Atom feed successfully', async () => {
    const mockPosts = [
      {
        slug: 'test-post-1',
        title: 'Test Post 1',
        date: '2024-01-01',
        excerpt: 'This is a test post',
        image: '/images/blog/test.jpg',
        tags: ['test', 'blog'],
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
        tags: ['test'],
        author: 'Test Author',
        readTime: '3 min read',
        content: 'Test content 2',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const text = await response.text()

    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(text).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    expect(text).toContain('<title>Test Post 1</title>')
    expect(text).toContain('<title>Test Post 2</title>')
    expect(text).toContain('<entry>')
    expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
  })

  it('should return empty Atom feed when no posts exist', async () => {
    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue([])

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    const text = await response.text()

    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(text).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
  })

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Database connection failed')
    const { getAllBlogPosts } = await import('@/lib/blog')
    const { logger } = await import('@/lib/logger')

    vi.mocked(getAllBlogPosts).mockRejectedValue(mockError)

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(500)

    const data = await response.json()
    expect(data).toEqual({ error: 'Failed to generate Atom feed' })

    expect(logger.error).toHaveBeenCalledWith('Error generating Atom feed:', mockError)
  })

  it('should return correct content-type header for Atom', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        excerpt: 'Test excerpt',
        image: '/images/blog/test.jpg',
        tags: ['test'],
        author: 'Test Author',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    expect(response.headers.get('content-type')).toContain('application/atom+xml')
  })

  it('should include cache-control header', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        excerpt: 'Test excerpt',
        image: '/images/blog/test.jpg',
        tags: ['test'],
        author: 'Test Author',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    expect(response.headers.get('cache-control')).toContain('public')
    expect(response.headers.get('cache-control')).toContain('s-maxage=3600')
  })

  it('should not allow shared caching in draft mode', async () => {
    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue([])
    const { isDraftMode } = await import('@/lib/cms')
    vi.mocked(isDraftMode).mockResolvedValueOnce(true)

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    expect(response.headers.get('cache-control')).toBe('private, no-store')
  })

  it('should escape XML special characters in Atom', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test & Special <Characters>',
        date: '2024-01-01',
        excerpt: 'Description with "quotes" & <tags>',
        image: '/images/blog/test.jpg',
        tags: ['test & tag'],
        author: 'Test "Author"',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    const text = await response.text()

    expect(text).toContain('&amp;')
    expect(text).toContain('&lt;')
    expect(text).toContain('&gt;')
    expect(text).toContain('&quot;')
    expect(text).not.toContain('Test & Special <Characters>')
  })

  it('should include author information in Atom entries', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        excerpt: 'Test excerpt',
        image: '/images/blog/test.jpg',
        tags: ['test'],
        author: 'John Doe',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    const text = await response.text()

    expect(text).toContain('<author>')
    expect(text).toContain('<name>John Doe</name>')
    expect(text).toContain('</author>')
  })

  it('should include category tags in Atom entries', async () => {
    const mockPosts = [
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        excerpt: 'Test excerpt',
        image: '/images/blog/test.jpg',
        tags: ['javascript', 'typescript', 'react'],
        author: 'Test Author',
        readTime: '5 min read',
        content: 'Test content',
      },
    ]

    const { getAllBlogPosts } = await import('@/lib/blog')
    vi.mocked(getAllBlogPosts).mockResolvedValue(mockPosts)

    const { GET } = await import('@/app/blog/feed.xml/route')
    const response = await GET()

    const text = await response.text()

    expect(text).toContain('<category term="javascript"')
    expect(text).toContain('<category term="typescript"')
    expect(text).toContain('<category term="react"')
  })
})
