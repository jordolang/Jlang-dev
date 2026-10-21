import { describe, it, expect } from 'vitest'
import { unlistedBundledProjects } from '@/lib/fallbackProjects'

describe('unlistedBundledProjects', () => {
  it('adds a flagged bundled project the Studio has no entry for', () => {
    const slugs = unlistedBundledProjects([{ slug: 'the-leather-outlet-desktop' }]).map((p) => p.slug)
    expect(slugs).toContain('green-mountain-leather')
    expect(slugs).not.toContain('the-leather-outlet')
  })

  it('lets a Studio entry for the same site replace it', () => {
    expect(
      unlistedBundledProjects([
        { slug: 'green-mountain-leather-desktop', live: 'https://green-mountain-leather.vercel.app/' },
      ]),
    ).toEqual([])
    expect(unlistedBundledProjects([{ slug: 'green-mountain-leather' }])).toEqual([])
  })
})
