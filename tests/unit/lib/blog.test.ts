import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PortableTextBlock } from '@portabletext/react'

// Mock fs module
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

// Mock gray-matter
vi.mock('gray-matter', () => ({
  default: vi.fn(),
}))

// Mock next-mdx-remote/rsc
vi.mock('next-mdx-remote/rsc', () => ({
  compileMDX: vi.fn(),
}))

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

// Mock Sanity image utilities
vi.mock('@/sanity/lib/image', () => ({
  urlForImage: vi.fn(),
}))

// Mock CMS utilities
vi.mock('@/lib/cms', () => ({
  isDraftMode: vi.fn(),
}))

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

describe('Blog Library', () => {
  beforeEach(() => {
    // Reset implementations too, not just calls, so per-test mocks don't leak
    vi.resetAllMocks()
    sanityState.configured = true
  })

  describe('getMdxBlogPosts', () => {
    it('should return empty array when blog directory does not exist', async () => {
      const fs = await import('fs')
      vi.mocked(fs.default.existsSync).mockReturnValue(false)

      const { getMdxBlogPosts } = await import('@/lib/blog')
      const result = getMdxBlogPosts()

      expect(result).toEqual([])
    })

    it('should read and parse MDX blog posts', async () => {
      const fs = await import('fs')
      const matter = await import('gray-matter')

      vi.mocked(fs.default.existsSync).mockReturnValue(true)
      vi.mocked(fs.default.readdirSync).mockReturnValue([
        'post1.mdx',
        'post2.md',
        'not-a-post.txt',
      ] as never)
      vi.mocked(fs.default.readFileSync).mockReturnValue('---\ntitle: Test\n---\nContent')
      vi.mocked(matter.default).mockReturnValue({
        data: {
          title: 'Test Post',
          date: '2024-01-15',
          excerpt: 'Test excerpt',
          image: '/test.jpg',
          tags: ['test', 'demo'],
          author: 'Test Author',
          readTime: '10 min read',
        },
        content: 'Test content',
      } as never)

      const { getMdxBlogPosts } = await import('@/lib/blog')
      const result = getMdxBlogPosts()

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        slug: expect.any(String),
        title: 'Test Post',
        date: '2024-01-15',
        excerpt: 'Test excerpt',
        content: 'Test content',
      })
    })

    it('should use default values for missing frontmatter fields', async () => {
      const fs = await import('fs')
      const matter = await import('gray-matter')

      vi.mocked(fs.default.existsSync).mockReturnValue(true)
      vi.mocked(fs.default.readdirSync).mockReturnValue(['post.mdx'] as never)
      vi.mocked(fs.default.readFileSync).mockReturnValue('content')
      vi.mocked(matter.default).mockReturnValue({
        data: {
          title: 'Test',
          date: '2024-01-15',
          excerpt: 'Excerpt',
        },
        content: 'Content',
      } as never)

      const { getMdxBlogPosts } = await import('@/lib/blog')
      const result = getMdxBlogPosts()

      expect(result[0]).toMatchObject({
        image: '/images/blog/default.svg',
        tags: [],
        author: 'Jordan Lang',
        readTime: '5 min read',
      })
    })

    it('should sort posts by date in descending order', async () => {
      const fs = await import('fs')
      const matter = await import('gray-matter')

      vi.mocked(fs.default.existsSync).mockReturnValue(true)
      vi.mocked(fs.default.readdirSync).mockReturnValue([
        'old-post.mdx',
        'new-post.mdx',
        'middle-post.mdx',
      ] as never)

      let callCount = 0
      vi.mocked(matter.default).mockImplementation(() => {
        const posts = [
          { date: '2024-01-01', title: 'Old Post' },
          { date: '2024-03-01', title: 'New Post' },
          { date: '2024-02-01', title: 'Middle Post' },
        ]
        return {
          data: {
            ...posts[callCount++],
            excerpt: 'Test',
          },
          content: 'Content',
        } as never
      })

      const { getMdxBlogPosts } = await import('@/lib/blog')
      const result = getMdxBlogPosts()

      expect(result[0].title).toBe('New Post')
      expect(result[1].title).toBe('Middle Post')
      expect(result[2].title).toBe('Old Post')
    })

    it('should return empty array and log error on file system error', async () => {
      const fs = await import('fs')
      const { logger } = await import('@/lib/logger')

      vi.mocked(fs.default.existsSync).mockReturnValue(true)
      vi.mocked(fs.default.readdirSync).mockImplementation(() => {
        throw new Error('File system error')
      })

      const { getMdxBlogPosts } = await import('@/lib/blog')
      const result = getMdxBlogPosts()

      expect(result).toEqual([])
      expect(logger.error).toHaveBeenCalledWith(
        'Error reading blog posts:',
        expect.any(Error)
      )
    })
  })

  describe('getAllBlogPosts', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should return Sanity posts when available', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { urlForImage } = await import('@/sanity/lib/image')
      const { isDraftMode } = await import('@/lib/cms')

      vi.mocked(isDraftMode).mockResolvedValue(false)
      vi.mocked(urlForImage).mockReturnValue('https://cdn.sanity.io/test.jpg')

      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          {
            slug: 'sanity-post',
            title: 'Sanity Post',
            date: '2024-01-15',
            excerpt: 'From Sanity',
            tags: ['sanity'],
            author: 'Jordan Lang',
            readTime: '5 min read',
            body: [],
            image: {
              asset: {
                _id: 'test-id',
                url: 'https://cdn.sanity.io/test.jpg',
              },
            },
          },
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAllBlogPosts } = await import('@/lib/blog')
      const result = await getAllBlogPosts()

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        slug: 'sanity-post',
        title: 'Sanity Post',
        body: [],
      })
    })

    it('should fall back to MDX posts when Sanity has no posts', async () => {
      const fs = await import('fs')
      const matter = await import('gray-matter')
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { isDraftMode } = await import('@/lib/cms')

      vi.mocked(isDraftMode).mockResolvedValue(false)

      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      vi.mocked(fs.default.existsSync).mockReturnValue(true)
      vi.mocked(fs.default.readdirSync).mockReturnValue(['post.mdx'] as never)
      vi.mocked(fs.default.readFileSync).mockReturnValue('content')
      vi.mocked(matter.default).mockReturnValue({
        data: {
          title: 'MDX Post',
          date: '2024-01-15',
          excerpt: 'From MDX',
        },
        content: 'MDX content',
      } as never)

      const { getAllBlogPosts } = await import('@/lib/blog')
      const result = await getAllBlogPosts()

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('MDX Post')
      expect(result[0].content).toBe('MDX content')
    })

    it('should use draft filter in draft mode', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { isDraftMode } = await import('@/lib/cms')

      vi.mocked(isDraftMode).mockResolvedValue(true)

      const mockFetch = vi.fn().mockResolvedValue([])
      const mockClient = {
        fetch: mockFetch,
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAllBlogPosts } = await import('@/lib/blog')
      await getAllBlogPosts()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "blogPost" && defined(slug.current)]'),
        {},
        { cache: 'no-store' }
      )
    })

    it('should use published filter in production mode', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { isDraftMode } = await import('@/lib/cms')

      vi.mocked(isDraftMode).mockResolvedValue(false)

      const mockFetch = vi.fn().mockResolvedValue([])
      const mockClient = {
        fetch: mockFetch,
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAllBlogPosts } = await import('@/lib/blog')
      await getAllBlogPosts()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('published == true'),
        {},
        { next: { revalidate: 60, tags: ['blogPosts'] } }
      )
    })

    it('should return empty array when Sanity is not configured', async () => {
      const fs = await import('fs')

      sanityState.configured = false

      vi.mocked(fs.default.existsSync).mockReturnValue(false)

      const blog = await import('@/lib/blog')
      const result = await blog.getAllBlogPosts()

      expect(result).toEqual([])
    })

    it('should handle Sanity fetch errors gracefully', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { isDraftMode } = await import('@/lib/cms')
      const { logger } = await import('@/lib/logger')
      const fs = await import('fs')

      vi.mocked(isDraftMode).mockResolvedValue(false)

      const mockClient = {
        fetch: vi.fn().mockRejectedValue(new Error('Network error')),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)
      vi.mocked(fs.default.existsSync).mockReturnValue(false)

      const { getAllBlogPosts } = await import('@/lib/blog')
      const result = await getAllBlogPosts()

      expect(result).toEqual([])
      expect(logger.error).toHaveBeenCalledWith(
        'Error fetching blog posts from Sanity:',
        expect.any(Error)
      )
    })
  })

  describe('getBlogPost', () => {
    it('should return post matching slug', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { isDraftMode } = await import('@/lib/cms')
      const { urlForImage } = await import('@/sanity/lib/image')

      vi.mocked(isDraftMode).mockResolvedValue(false)
      vi.mocked(urlForImage).mockReturnValue('https://cdn.sanity.io/test.jpg')

      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          {
            slug: 'first-post',
            title: 'First Post',
            date: '2024-01-15',
            excerpt: 'First',
            tags: [],
            author: 'Jordan Lang',
            readTime: '5 min read',
            body: [],
            image: null,
          },
          {
            slug: 'second-post',
            title: 'Second Post',
            date: '2024-01-16',
            excerpt: 'Second',
            tags: [],
            author: 'Jordan Lang',
            readTime: '5 min read',
            body: [],
            image: null,
          },
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getBlogPost } = await import('@/lib/blog')
      const result = await getBlogPost('second-post')

      expect(result).not.toBeNull()
      expect(result?.title).toBe('Second Post')
    })

    it('should return null for non-existent slug', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { isDraftMode } = await import('@/lib/cms')

      vi.mocked(isDraftMode).mockResolvedValue(false)

      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getBlogPost } = await import('@/lib/blog')
      const result = await getBlogPost('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('compileMdxPost', () => {
    it('should return null for CMS posts without content', async () => {
      const { compileMdxPost } = await import('@/lib/blog')

      const cmsPost = {
        slug: 'cms-post',
        title: 'CMS Post',
        date: '2024-01-15',
        excerpt: 'Excerpt',
        image: '/test.jpg',
        tags: [],
        author: 'Jordan Lang',
        readTime: '5 min read',
        content: '',
        body: [] as PortableTextBlock[],
      }

      const result = await compileMdxPost(cmsPost)

      expect(result).toBeNull()
    })

    it('should compile MDX content successfully', async () => {
      const { compileMDX } = await import('next-mdx-remote/rsc')

      const mockContent = { type: 'div', props: {} }
      vi.mocked(compileMDX).mockResolvedValue({
        content: mockContent,
        frontmatter: {},
      } as never)

      const { compileMdxPost } = await import('@/lib/blog')

      const mdxPost = {
        slug: 'mdx-post',
        title: 'MDX Post',
        date: '2024-01-15',
        excerpt: 'Excerpt',
        image: '/test.jpg',
        tags: [],
        author: 'Jordan Lang',
        readTime: '5 min read',
        content: '# Test\n\nSome content',
      }

      const result = await compileMdxPost(mdxPost)

      expect(result).toEqual(mockContent)
      expect(compileMDX).toHaveBeenCalledWith({
        source: '# Test\n\nSome content',
        options: expect.objectContaining({
          parseFrontmatter: false,
        }),
      })
    })

    it('should return null and log error on compilation failure', async () => {
      const { compileMDX } = await import('next-mdx-remote/rsc')
      const { logger } = await import('@/lib/logger')

      vi.mocked(compileMDX).mockRejectedValue(new Error('Compilation error'))

      const { compileMdxPost } = await import('@/lib/blog')

      const mdxPost = {
        slug: 'mdx-post',
        title: 'MDX Post',
        date: '2024-01-15',
        excerpt: 'Excerpt',
        image: '/test.jpg',
        tags: [],
        author: 'Jordan Lang',
        readTime: '5 min read',
        content: 'Invalid MDX',
      }

      const result = await compileMdxPost(mdxPost)

      expect(result).toBeNull()
      expect(logger.error).toHaveBeenCalledWith(
        'Error compiling MDX post:',
        expect.any(Error)
      )
    })
  })

  describe('getLatestBlogPosts', () => {
    beforeEach(async () => {
      const { isDraftMode } = await import('@/lib/cms')
      vi.mocked(isDraftMode).mockResolvedValue(false)
    })

    it('should return 3 posts by default', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { urlForImage } = await import('@/sanity/lib/image')

      vi.mocked(urlForImage).mockReturnValue('https://cdn.sanity.io/test.jpg')

      const mockPosts = Array.from({ length: 10 }, (_, i) => ({
        slug: `post-${i}`,
        title: `Post ${i}`,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        excerpt: `Excerpt ${i}`,
        tags: [],
        author: 'Jordan Lang',
        readTime: '5 min read',
        body: [],
        image: null,
      }))

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(mockPosts),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getLatestBlogPosts } = await import('@/lib/blog')
      const result = await getLatestBlogPosts()

      expect(result).toHaveLength(3)
    })

    it('should respect custom limit parameter', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { urlForImage } = await import('@/sanity/lib/image')

      vi.mocked(urlForImage).mockReturnValue('https://cdn.sanity.io/test.jpg')

      const mockPosts = Array.from({ length: 10 }, (_, i) => ({
        slug: `post-${i}`,
        title: `Post ${i}`,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        excerpt: `Excerpt ${i}`,
        tags: [],
        author: 'Jordan Lang',
        readTime: '5 min read',
        body: [],
        image: null,
      }))

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(mockPosts),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getLatestBlogPosts } = await import('@/lib/blog')
      const result = await getLatestBlogPosts(5)

      expect(result).toHaveLength(5)
    })

    it('should return all posts if fewer than limit', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { urlForImage } = await import('@/sanity/lib/image')

      vi.mocked(urlForImage).mockReturnValue('https://cdn.sanity.io/test.jpg')

      const mockPosts = Array.from({ length: 2 }, (_, i) => ({
        slug: `post-${i}`,
        title: `Post ${i}`,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        excerpt: `Excerpt ${i}`,
        tags: [],
        author: 'Jordan Lang',
        readTime: '5 min read',
        body: [],
        image: null,
      }))

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(mockPosts),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getLatestBlogPosts } = await import('@/lib/blog')
      const result = await getLatestBlogPosts(5)

      expect(result).toHaveLength(2)
    })
  })

  describe('getAdjacentPosts', () => {
    beforeEach(async () => {
      const { isDraftMode } = await import('@/lib/cms')
      vi.mocked(isDraftMode).mockResolvedValue(false)
    })

    it('should return previous and next posts', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { urlForImage } = await import('@/sanity/lib/image')

      vi.mocked(urlForImage).mockReturnValue('https://cdn.sanity.io/test.jpg')

      const mockPosts = [
        {
          slug: 'first',
          title: 'First',
          date: '2024-01-01',
          excerpt: 'First',
          tags: [],
          author: 'Jordan Lang',
          readTime: '5 min read',
          body: [],
          image: null,
        },
        {
          slug: 'second',
          title: 'Second',
          date: '2024-01-02',
          excerpt: 'Second',
          tags: [],
          author: 'Jordan Lang',
          readTime: '5 min read',
          body: [],
          image: null,
        },
        {
          slug: 'third',
          title: 'Third',
          date: '2024-01-03',
          excerpt: 'Third',
          tags: [],
          author: 'Jordan Lang',
          readTime: '5 min read',
          body: [],
          image: null,
        },
      ]

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(mockPosts),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAdjacentPosts } = await import('@/lib/blog')
      const result = await getAdjacentPosts('second')

      expect(result.previous?.slug).toBe('first')
      expect(result.next?.slug).toBe('third')
    })

    it('should return null for previous when at first post', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { urlForImage } = await import('@/sanity/lib/image')

      vi.mocked(urlForImage).mockReturnValue('https://cdn.sanity.io/test.jpg')

      const mockPosts = [
        {
          slug: 'first',
          title: 'First',
          date: '2024-01-01',
          excerpt: 'First',
          tags: [],
          author: 'Jordan Lang',
          readTime: '5 min read',
          body: [],
          image: null,
        },
        {
          slug: 'second',
          title: 'Second',
          date: '2024-01-02',
          excerpt: 'Second',
          tags: [],
          author: 'Jordan Lang',
          readTime: '5 min read',
          body: [],
          image: null,
        },
      ]

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(mockPosts),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAdjacentPosts } = await import('@/lib/blog')
      const result = await getAdjacentPosts('first')

      expect(result.previous).toBeNull()
      expect(result.next?.slug).toBe('second')
    })

    it('should return null for next when at last post', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const { urlForImage } = await import('@/sanity/lib/image')

      vi.mocked(urlForImage).mockReturnValue('https://cdn.sanity.io/test.jpg')

      const mockPosts = [
        {
          slug: 'first',
          title: 'First',
          date: '2024-01-01',
          excerpt: 'First',
          tags: [],
          author: 'Jordan Lang',
          readTime: '5 min read',
          body: [],
          image: null,
        },
        {
          slug: 'second',
          title: 'Second',
          date: '2024-01-02',
          excerpt: 'Second',
          tags: [],
          author: 'Jordan Lang',
          readTime: '5 min read',
          body: [],
          image: null,
        },
      ]

      const mockClient = {
        fetch: vi.fn().mockResolvedValue(mockPosts),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAdjacentPosts } = await import('@/lib/blog')
      const result = await getAdjacentPosts('second')

      expect(result.previous?.slug).toBe('first')
      expect(result.next).toBeNull()
    })

    it('should return both null when post not found', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')

      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAdjacentPosts } = await import('@/lib/blog')
      const result = await getAdjacentPosts('non-existent')

      expect(result.previous).toBeNull()
      expect(result.next).toBeNull()
    })
  })

  describe('formatDate', () => {
    it('should format date string correctly', async () => {
      const { formatDate } = await import('@/lib/blog')

      const result = formatDate('2024-01-15')

      expect(result).toBe('January 15, 2024')
    })

    it('should handle different date formats', async () => {
      const { formatDate } = await import('@/lib/blog')

      const result = formatDate('2024-12-31')

      expect(result).toBe('December 31, 2024')
    })
  })
})
