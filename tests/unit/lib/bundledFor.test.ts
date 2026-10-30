import { describe, it, expect } from 'vitest'
import { bundledFor, pagespeedFor } from '@/lib/fallbackProjects'

describe('bundledFor', () => {
  it('matches a Studio website slug with a "-desktop" suffix and no live URL', () => {
    expect(bundledFor({ slug: 'salsadocs-desktop', live: '' })?.slug).toBe('salsadocs')
  })

  it('does not match a mobile or desktop app entry to the website of the same name', () => {
    expect(bundledFor({ slug: 'jose-madrid-salsa-mobile' })?.slug).not.toBe('jose-madrid-salsa')
  })
})

describe('pagespeedFor', () => {
  it('gives the SalsaDocs Studio entry its bundled scores', () => {
    expect(pagespeedFor({ slug: 'salsadocs-desktop', live: '' })).toMatchObject({
      mobile: { performance: 100, accessibility: 93, bestPractices: 100, seo: 100 },
      desktop: { performance: 100, accessibility: 93, bestPractices: 100, seo: 100 },
    })
  })
})
