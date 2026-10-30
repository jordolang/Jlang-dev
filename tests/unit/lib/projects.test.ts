import { describe, it, expect, vi } from 'vitest'
import { createMockProject, createMockSanityImage } from '@/tests/utils/sanity-mocks'

vi.mock('server-only', () => ({}))
vi.mock('next/headers', () => ({ draftMode: vi.fn(async () => ({ isEnabled: false })) }))
vi.mock('@/sanity/lib/client', () => ({ getSanityClient: vi.fn(), sanityIsConfigured: true }))
vi.mock('@/sanity/lib/image', () => ({
  urlForImage: vi.fn(() => 'https://cdn.sanity.io/old-400x300.png'),
  dimensionsForImage: vi.fn(() => ({ width: 400, height: 300 })),
}))

describe('getProject', () => {
  it('gives the SalsaDocs detail page the bundled screenshot, live URL and scores', async () => {
    const { getSanityClient } = await import('@/sanity/lib/client')
    vi.mocked(getSanityClient).mockReturnValue({
      fetch: vi.fn().mockResolvedValue([
        { ...createMockProject(), slug: 'salsadocs-desktop', live: '', pagespeed: null, image: createMockSanityImage() },
      ]),
    } as never)

    const { getProject } = await import('@/lib/projects')
    const project = await getProject('salsadocs-desktop')

    expect(project).toMatchObject({
      image: '/images/projects/salsadocs.jpg',
      imageWidth: 1440,
      imageHeight: 4584,
      fullPagePreview: true,
      live: 'https://salsadocs.vercel.app',
      pagespeed: { mobile: { accessibility: 93 }, desktop: { accessibility: 93 } },
    })
  })
})
