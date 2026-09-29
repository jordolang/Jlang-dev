import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { BlogPost } from '@/lib/blog'

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://test.example.com')

describe('Feed Library', () => {
  const mockPosts: BlogPost[] = [
    {
      slug: 'test-post-1',
      title: 'First Test Post',
      date: '2024-01-15',
      excerpt: 'This is the first test post excerpt',
      image: '/images/test1.jpg',
      tags: ['test', 'demo'],
      author: 'Test Author',
      readTime: '5 min read',
      content: 'Test content',
    },
    {
      slug: 'test-post-2',
      title: 'Second Test Post',
      date: '2024-01-10',
      excerpt: 'This is the second test post excerpt',
      image: '/images/test2.jpg',
      tags: ['tutorial', 'guide'],
      author: 'Another Author',
      readTime: '3 min read',
      content: 'Another test content',
    },
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('generateRssFeed', () => {
    it('should generate valid RSS 2.0 feed with posts', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed(mockPosts)

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<rss version="2.0"')
      expect(result).toContain('xmlns:atom="http://www.w3.org/2005/Atom"')
    })

    it('should include site metadata in RSS feed', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed(mockPosts)

      expect(result).toContain('<title>Jordan Lang - Full-Stack Developer &amp; Tech Lead</title>')
      expect(result).toContain('<link>https://test.example.com/blog</link>')
      expect(result).toContain('<description>Articles on software engineering, leadership, and technology by Jordan Lang</description>')
      expect(result).toContain('<language>en-us</language>')
    })

    it('should include atom:link self-reference', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed(mockPosts)

      expect(result).toContain('<atom:link href="https://test.example.com/blog/rss.xml" rel="self" type="application/rss+xml"/>')
    })

    it('should include all post items with correct structure', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed(mockPosts)

      expect(result).toContain('<item>')
      expect(result).toContain('<title>First Test Post</title>')
      expect(result).toContain('<link>https://test.example.com/blog/test-post-1</link>')
      expect(result).toContain('<guid isPermaLink="true">https://test.example.com/blog/test-post-1</guid>')
      expect(result).toContain('<description>This is the first test post excerpt</description>')
      expect(result).toContain('<dc:creator>Test Author</dc:creator>')
      expect(result).not.toContain('<author>')
    })

    it('should include post tags as categories', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed(mockPosts)

      expect(result).toContain('<category>test</category>')
      expect(result).toContain('<category>demo</category>')
      expect(result).toContain('<category>tutorial</category>')
      expect(result).toContain('<category>guide</category>')
    })

    it('should format pubDate as RFC 822', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed(mockPosts)

      // RFC 822 format example: "Mon, 15 Jan 2024 00:00:00 GMT"
      expect(result).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/)
    })

    it('should set lastBuildDate to latest post date', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed(mockPosts)

      // Should use the first post's date (2024-01-15)
      expect(result).toMatch(/<lastBuildDate>[A-Z][a-z]{2}, 15 Jan 2024/)
    })

    it('should handle empty posts array', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed([])

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<rss version="2.0"')
      expect(result).not.toContain('<item>')
      // Should use current date for lastBuildDate
      expect(result).toMatch(/<lastBuildDate>[A-Z][a-z]{2}, \d{2}/)
    })

    it('should escape XML special characters in post data', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const postsWithSpecialChars: BlogPost[] = [
        {
          slug: 'special-chars',
          title: 'Title with <tags> & "quotes"',
          date: '2024-01-15',
          excerpt: "Excerpt with 'apostrophes' and > symbols",
          image: '/test.jpg',
          tags: ['tag<1>', 'tag&2'],
          author: 'Author & Co.',
          readTime: '5 min',
          content: 'content',
        },
      ]

      const result = generateRssFeed(postsWithSpecialChars)

      expect(result).toContain('&lt;tags&gt;')
      expect(result).toContain('&amp;')
      expect(result).toContain('&quot;')
      expect(result).toContain('&apos;')
      expect(result).toContain('&gt;')
      expect(result).not.toContain('Title with <tags>')
    })

    it('should use custom siteUrl when provided', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const customUrl = 'https://custom.example.com'
      const result = generateRssFeed(mockPosts, customUrl)

      expect(result).toContain(`<link>${customUrl}/blog</link>`)
      expect(result).toContain(`<link>${customUrl}/blog/test-post-1</link>`)
      expect(result).toContain(`<atom:link href="${customUrl}/blog/rss.xml"`)
    })

    it('should handle posts with no tags', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const postsNoTags: BlogPost[] = [
        {
          ...mockPosts[0],
          tags: [],
        },
      ]

      const result = generateRssFeed(postsNoTags)

      expect(result).toContain('<item>')
      expect(result).toContain('<title>First Test Post</title>')
      // Should not have any category tags
      expect(result).not.toMatch(/<category>.*<\/category>/)
    })

    it('should include all posts in correct order', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const result = generateRssFeed(mockPosts)

      const firstPostIndex = result.indexOf('First Test Post')
      const secondPostIndex = result.indexOf('Second Test Post')

      expect(firstPostIndex).toBeGreaterThan(0)
      expect(secondPostIndex).toBeGreaterThan(firstPostIndex)
    })
  })

  describe('generateAtomFeed', () => {
    it('should generate valid Atom feed with posts', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    })

    it('should include site metadata in Atom feed', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      expect(result).toContain('<title>Jordan Lang - Full-Stack Developer &amp; Tech Lead</title>')
      expect(result).toContain('<link href="https://test.example.com/blog" rel="alternate"/>')
      expect(result).toContain('<id>https://test.example.com/blog</id>')
      expect(result).toContain('<subtitle>Articles on software engineering, leadership, and technology by Jordan Lang</subtitle>')
    })

    it('should include feed self-reference', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      expect(result).toContain('<link href="https://test.example.com/blog/feed.xml" rel="self" type="application/atom+xml"/>')
    })

    it('should include feed author', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      expect(result).toContain('<author>')
      expect(result).toContain('<name>Jordan Lang</name>')
      expect(result).toContain('</author>')
    })

    it('should include all post entries with correct structure', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      expect(result).toContain('<entry>')
      expect(result).toContain('<title>First Test Post</title>')
      expect(result).toContain('<link href="https://test.example.com/blog/test-post-1" rel="alternate"/>')
      expect(result).toContain('<id>https://test.example.com/blog/test-post-1</id>')
      expect(result).toContain('<summary>This is the first test post excerpt</summary>')
    })

    it('should include entry author for each post', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      expect(result).toContain('<name>Test Author</name>')
      expect(result).toContain('<name>Another Author</name>')
    })

    it('should include post tags as categories with term attribute', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      expect(result).toContain('<category term="test"/>')
      expect(result).toContain('<category term="demo"/>')
      expect(result).toContain('<category term="tutorial"/>')
      expect(result).toContain('<category term="guide"/>')
    })

    it('should format dates as ISO 8601', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      // ISO 8601 format: "2024-01-15T00:00:00.000Z"
      expect(result).toMatch(/<published>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z<\/published>/)
      expect(result).toMatch(/<updated>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z<\/updated>/)
    })

    it('should set feed updated to latest post date', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      // Should use the first post's date (2024-01-15)
      expect(result).toMatch(/<updated>2024-01-15T00:00:00\.000Z<\/updated>/)
    })

    it('should handle empty posts array', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed([])

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
      expect(result).not.toContain('<entry>')
      // Should use current date for updated
      expect(result).toMatch(/<updated>\d{4}-\d{2}-\d{2}T/)
    })

    it('should escape XML special characters in post data', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const postsWithSpecialChars: BlogPost[] = [
        {
          slug: 'special-chars',
          title: 'Title with <tags> & "quotes"',
          date: '2024-01-15',
          excerpt: "Excerpt with 'apostrophes' and > symbols",
          image: '/test.jpg',
          tags: ['tag<1>', 'tag&2'],
          author: 'Author & Co.',
          readTime: '5 min',
          content: 'content',
        },
      ]

      const result = generateAtomFeed(postsWithSpecialChars)

      expect(result).toContain('&lt;tags&gt;')
      expect(result).toContain('&amp;')
      expect(result).toContain('&quot;')
      expect(result).toContain('&apos;')
      expect(result).toContain('&gt;')
      expect(result).not.toContain('Title with <tags>')
    })

    it('should use custom siteUrl when provided', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const customUrl = 'https://custom.example.com'
      const result = generateAtomFeed(mockPosts, customUrl)

      expect(result).toContain(`<link href="${customUrl}/blog" rel="alternate"/>`)
      expect(result).toContain(`<link href="${customUrl}/blog/test-post-1" rel="alternate"/>`)
      expect(result).toContain(`<link href="${customUrl}/blog/feed.xml" rel="self"`)
      expect(result).toContain(`<id>${customUrl}/blog</id>`)
    })

    it('should handle posts with no tags', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const postsNoTags: BlogPost[] = [
        {
          ...mockPosts[0],
          tags: [],
        },
      ]

      const result = generateAtomFeed(postsNoTags)

      expect(result).toContain('<entry>')
      expect(result).toContain('<title>First Test Post</title>')
      // Should not have any category tags
      expect(result).not.toMatch(/<category term=".*"\/>/)
    })

    it('should include all posts in correct order', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      const firstPostIndex = result.indexOf('First Test Post')
      const secondPostIndex = result.indexOf('Second Test Post')

      expect(firstPostIndex).toBeGreaterThan(0)
      expect(secondPostIndex).toBeGreaterThan(firstPostIndex)
    })

    it('should have published and updated dates for each entry', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const result = generateAtomFeed(mockPosts)

      // Count published and updated tags
      const publishedCount = (result.match(/<published>/g) || []).length
      const updatedCount = (result.match(/<updated>/g) || []).length

      // Should have one published and one updated per post, plus one updated for feed
      expect(publishedCount).toBe(mockPosts.length)
      expect(updatedCount).toBe(mockPosts.length + 1)
    })
  })

  describe('Date Formatting', () => {
    it('should format RFC 822 dates correctly for various dates', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const testPost: BlogPost[] = [
        {
          ...mockPosts[0],
          date: '2024-12-31',
        },
      ]

      const result = generateRssFeed(testPost)
      expect(result).toContain('31 Dec 2024')
    })

    it('should format ISO 8601 dates correctly for various dates', async () => {
      const { generateAtomFeed } = await import('@/lib/feed')
      const testPost: BlogPost[] = [
        {
          ...mockPosts[0],
          date: '2024-12-31',
        },
      ]

      const result = generateAtomFeed(testPost)
      expect(result).toContain('2024-12-31T00:00:00.000Z')
    })
  })

  describe('XML Escaping', () => {
    it('should escape all five XML special characters', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const post: BlogPost[] = [
        {
          slug: 'test',
          title: '& < > " \'',
          date: '2024-01-01',
          excerpt: 'Test & Test',
          image: '/test.jpg',
          tags: [],
          author: 'Test',
          readTime: '1 min',
          content: '',
        },
      ]

      const result = generateRssFeed(post)
      expect(result).toContain('&amp; &lt; &gt; &quot; &apos;')
    })

    it('should not double-escape already escaped content', async () => {
      const { generateRssFeed } = await import('@/lib/feed')
      const post: BlogPost[] = [
        {
          slug: 'test',
          title: 'Test',
          date: '2024-01-01',
          excerpt: '&amp;',
          image: '/test.jpg',
          tags: [],
          author: 'Test',
          readTime: '1 min',
          content: '',
        },
      ]

      const result = generateRssFeed(post)
      expect(result).toContain('&amp;amp;')
    })
  })
  describe('feed timestamps and URLs', () => {
    it('should use the newest post date regardless of input order', async () => {
      const { generateRssFeed, generateAtomFeed } = await import('@/lib/feed')
      const unordered = [...mockPosts].reverse()

      expect(generateRssFeed(unordered)).toMatch(/<lastBuildDate>[A-Z][a-z]{2}, 15 Jan 2024/)
      expect(generateAtomFeed(unordered)).toMatch(/<feed[\s\S]*?<updated>2024-01-15T00:00:00\.000Z<\/updated>/)
    })

    it('should escape special characters in post URLs', async () => {
      const { generateRssFeed, generateAtomFeed } = await import('@/lib/feed')
      const post: BlogPost[] = [{ ...mockPosts[0], slug: 'c-&-cpp' }]

      expect(generateRssFeed(post)).toContain('/blog/c-&amp;-cpp</link>')
      expect(generateAtomFeed(post)).toContain('/blog/c-&amp;-cpp" rel="alternate"/>')
      expect(generateRssFeed(post)).not.toContain('c-&-cpp')
    })
  })

  describe('feedCacheControl', () => {
    it('should allow shared caching with a stale-while-revalidate window for published feeds', async () => {
      const { feedCacheControl } = await import('@/lib/feed')
      expect(feedCacheControl(false)).toBe('public, s-maxage=3600, stale-while-revalidate=86400')
    })

    it('should never allow shared caching in draft mode', async () => {
      const { feedCacheControl } = await import('@/lib/feed')
      expect(feedCacheControl(true)).toBe('private, no-store')
    })
  })
})
