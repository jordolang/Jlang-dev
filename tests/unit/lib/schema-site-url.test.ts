import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('schema canonical URLs', () => {
  it.each([undefined, 'https://example.com'])(
    'uses the canonical fallback or configured host (%s)',
    async (configuredUrl) => {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', configuredUrl)
      vi.resetModules()
      const { SITE_URL, generateBlogPostingSchema } = await import('@/lib/schema')
      const expectedUrl = configuredUrl || 'https://jlang.dev'
      expect(SITE_URL).toBe(expectedUrl)
      const schema = generateBlogPostingSchema({
        headline: 'Test', description: 'Test article', slug: 'test',
        datePublished: '2026-09-30', author: { name: 'Jordan Lang' },
        image: `${expectedUrl}/image.jpg`,
      })
      expect(schema.url).toBe(`${expectedUrl}/blog/test`)
      expect(schema.mainEntityOfPage['@id']).toBe(schema.url)
    },
  )
})
