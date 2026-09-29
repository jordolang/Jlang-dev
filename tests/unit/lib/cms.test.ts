import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createMockProject,
  createMockExperience,
  createMockTechItem,
  createMockServicePackage,
  createMockAddonFeature,
  createMockFaq,
  createMockSectionHeading,
  createMockSiteSettings,
  createMockAboutContent,
  createMockPromoContent,
  createMockSanityImage,
} from '@/tests/utils/sanity-mocks'

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
  dimensionsForImage: vi.fn(),
}))

describe('CMS Library', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sanityState.configured = true
  })

  describe('isDraftMode', () => {
    it('should return true when draft mode is enabled', async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: true } as never)

      const { isDraftMode } = await import('@/lib/cms')
      const result = await isDraftMode()

      expect(result).toBe(true)
    })

    it('should return false when draft mode is disabled', async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)

      const { isDraftMode } = await import('@/lib/cms')
      const result = await isDraftMode()

      expect(result).toBe(false)
    })

    it('should return false when draftMode throws (outside request scope)', async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockRejectedValue(new Error('Not in request scope'))

      const { isDraftMode } = await import('@/lib/cms')
      const result = await isDraftMode()

      expect(result).toBe(false)
    })
  })

  describe('getProjects', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      const { urlForImage, dimensionsForImage } = await import('@/sanity/lib/image')

      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
      vi.mocked(urlForImage).mockImplementation((image) => {
        if (!image?.asset) return null
        return (image.asset as { url?: string }).url ?? 'https://cdn.sanity.io/images/test/default.jpg'
      })
      vi.mocked(dimensionsForImage).mockImplementation((image) => {
        const dims = image?.asset?.metadata?.dimensions
        return dims?.width && dims?.height ? { width: dims.width, height: dims.height } : null
      })
    })

    it('should fetch and transform projects', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          {
            ...createMockProject(),
            image: createMockSanityImage(),
          },
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getProjects } = await import('@/lib/cms')
      const result = await getProjects()

      expect(result).toHaveLength(1)
      expect(result?.[0]).toMatchObject({
        title: expect.any(String),
        image: expect.any(String),
        features: expect.any(Array),
        imageWidth: expect.any(Number),
        imageHeight: expect.any(Number),
      })
    })

    it('should return null when no projects exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getProjects } = await import('@/lib/cms')
      const result = await getProjects()

      expect(result).toBeNull()
    })

    it('should hoist featured project to first position', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          {
            ...createMockProject({ title: 'Project 1', featured: false }),
            image: createMockSanityImage(),
          },
          {
            ...createMockProject({ title: 'Project 2', featured: false }),
            image: createMockSanityImage(),
          },
          {
            ...createMockProject({ title: 'Featured Project', featured: true }),
            image: createMockSanityImage(),
          },
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getProjects } = await import('@/lib/cms')
      const result = await getProjects()

      expect(result?.[0].title).toBe('Featured Project')
    })

    it('should not hoist featured mobile or desktop app projects', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          {
            ...createMockProject({ title: 'Project 1', featured: false, group: 'desktop' }),
            image: createMockSanityImage(),
          },
          {
            ...createMockProject({ title: 'Featured Mobile', featured: true, group: 'mobile' }),
            image: createMockSanityImage(),
          },
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getProjects } = await import('@/lib/cms')
      const result = await getProjects()

      expect(result?.[0].title).toBe('Project 1')
    })

    it('should handle missing optional fields', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          {
            title: 'Test Project',
            subtitle: 'Test',
            description: 'Test description',
            gradient: 'from-blue-500 to-purple-600',
            status: 'Live',
            category: 'Web',
            highlight: 'Test',
            timeline: '3 months',
            clientType: 'B2B',
            image: createMockSanityImage(),
            // Missing: features, deliverables, tech, github, live
          },
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getProjects } = await import('@/lib/cms')
      const result = await getProjects()

      expect(result?.[0]).toMatchObject({
        features: [],
        deliverables: [],
        tech: [],
        github: '',
        live: '',
      })
    })
  })

  describe('getExperience', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch experience items', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([createMockExperience()]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getExperience } = await import('@/lib/cms')
      const result = await getExperience()

      expect(result).toHaveLength(1)
      expect(result?.[0]).toMatchObject({
        role: expect.any(String),
        company: expect.any(String),
        achievements: expect.any(Array),
        technologies: expect.any(Array),
      })
    })

    it('should return null when no experience items exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getExperience } = await import('@/lib/cms')
      const result = await getExperience()

      expect(result).toBeNull()
    })
  })

  describe('getTechStack', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch and group tech items by category', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          createMockTechItem({ name: 'React', category: 'Frontend' }),
          createMockTechItem({ name: 'Vue', category: 'Frontend' }),
          createMockTechItem({ name: 'Node.js', category: 'Backend' }),
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getTechStack } = await import('@/lib/cms')
      const result = await getTechStack()

      expect(result).toHaveProperty('Frontend')
      expect(result).toHaveProperty('Backend')
      expect(result?.Frontend).toHaveLength(2)
      expect(result?.Backend).toHaveLength(1)
    })

    it('should return null when no tech items exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getTechStack } = await import('@/lib/cms')
      const result = await getTechStack()

      expect(result).toBeNull()
    })
  })

  describe('getServicePackages', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch and transform service packages', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          {
            name: 'Standard Package',
            slug: { current: 'standard' },
            description: 'A comprehensive package',
            price: '$5,000',
            basePrice: 5000,
            promoPrice: null,
            promoBasePrice: null,
            gradient: 'from-blue-500 to-purple-600',
            highlights: ['Feature 1', 'Feature 2'],
            featureGroups: [
              { category: '🎨 Design', items: ['Responsive layout', 'Cross-browser support'] },
              { category: '⚡ Performance', items: ['Fast loading', 'Optimized images'] },
            ],
            addons: [
              { label: 'E-commerce', price: 1000, feature: null },
              { label: 'Custom animations', price: undefined, feature: { name: 'Animations' } },
            ],
            addonsNote: 'Additional features available',
            popular: false,
          },
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getServicePackages } = await import('@/lib/cms')
      const result = await getServicePackages()

      expect(result).toHaveLength(1)
      expect(result?.[0]).toMatchObject({
        slug: 'standard',
        features: expect.arrayContaining([
          '🎨 Design',
          'Responsive layout',
          'Cross-browser support',
          '',
          '⚡ Performance',
          'Fast loading',
          'Optimized images',
        ]),
        addons: [
          { label: 'E-commerce', price: 1000, feature: undefined },
          { label: 'Custom animations', price: undefined, feature: 'Animations' },
        ],
      })
    })

    it('should handle packages with no feature groups', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          {
            ...createMockServicePackage(),
            slug: { current: 'basic' },
            featureGroups: null,
            addons: null,
          },
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getServicePackages } = await import('@/lib/cms')
      const result = await getServicePackages()

      expect(result?.[0].features).toEqual([])
      expect(result?.[0].addons).toEqual([])
    })

    it('should return null when no packages exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getServicePackages } = await import('@/lib/cms')
      const result = await getServicePackages()

      expect(result).toBeNull()
    })
  })

  describe('getAddonFeatures', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch addon features', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([createMockAddonFeature()]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAddonFeatures } = await import('@/lib/cms')
      const result = await getAddonFeatures()

      expect(result).toHaveLength(1)
      expect(result?.[0]).toMatchObject({
        name: expect.any(String),
        desc: expect.any(String),
        price: expect.any(Number),
        icon: expect.any(String),
      })
    })

    it('should return null when no addon features exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAddonFeatures } = await import('@/lib/cms')
      const result = await getAddonFeatures()

      expect(result).toBeNull()
    })
  })

  describe('getFaqs', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch FAQs', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([createMockFaq()]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getFaqs } = await import('@/lib/cms')
      const result = await getFaqs()

      expect(result).toHaveLength(1)
      expect(result?.[0]).toMatchObject({
        question: expect.any(String),
        answer: expect.any(String),
      })
    })

    it('should return null when no FAQs exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getFaqs } = await import('@/lib/cms')
      const result = await getFaqs()

      expect(result).toBeNull()
    })
  })

  describe('getSectionHeadings', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch and transform section headings to record', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([
          createMockSectionHeading({ sectionId: 'projects' }),
          createMockSectionHeading({ sectionId: 'about' }),
        ]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getSectionHeadings } = await import('@/lib/cms')
      const result = await getSectionHeadings()

      expect(result).toHaveProperty('projects')
      expect(result).toHaveProperty('about')
      expect(result?.projects).toMatchObject({
        sectionId: 'projects',
        heading: expect.any(String),
      })
    })

    it('should return null when no section headings exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue([]),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getSectionHeadings } = await import('@/lib/cms')
      const result = await getSectionHeadings()

      expect(result).toBeNull()
    })
  })

  describe('getSiteSettings', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      const { urlForImage } = await import('@/sanity/lib/image')

      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
      vi.mocked(urlForImage).mockImplementation((image) => {
        if (!image?.asset) return null
        return (image.asset as { url?: string }).url ?? 'https://cdn.sanity.io/images/test/default.jpg'
      })
    })

    it('should fetch and transform site settings', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue({
          ...createMockSiteSettings(),
          logoLight: createMockSanityImage(),
          logoDark: createMockSanityImage(),
          ogImage: createMockSanityImage(),
        }),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getSiteSettings } = await import('@/lib/cms')
      const result = await getSiteSettings()

      expect(result).toMatchObject({
        name: expect.any(String),
        logoLight: expect.any(String),
        logoDark: expect.any(String),
        ogImage: expect.any(String),
        typewriterRoles: expect.any(Array),
        socials: expect.any(Array),
      })
    })

    it('should return null when site settings do not exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(null),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getSiteSettings } = await import('@/lib/cms')
      const result = await getSiteSettings()

      expect(result).toBeNull()
    })
  })

  describe('getAboutContent', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch about content', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(createMockAboutContent()),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAboutContent } = await import('@/lib/cms')
      const result = await getAboutContent()

      expect(result).toMatchObject({
        greeting: expect.any(String),
        role: expect.any(String),
        bio: expect.any(Array),
        coreCompetencies: expect.any(Array),
        achievements: expect.any(Array),
      })
    })

    it('should return null when about content does not exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(null),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getAboutContent } = await import('@/lib/cms')
      const result = await getAboutContent()

      expect(result).toBeNull()
    })
  })

  describe('getPromoContent', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should fetch promo content', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(createMockPromoContent()),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getPromoContent } = await import('@/lib/cms')
      const result = await getPromoContent()

      expect(result).toMatchObject({
        eyebrow: expect.any(String),
        headline: expect.any(String),
        active: expect.any(Boolean),
      })
    })

    it('should return null when promo content does not exist', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockResolvedValue(null),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getPromoContent } = await import('@/lib/cms')
      const result = await getPromoContent()

      expect(result).toBeNull()
    })
  })

  describe('Error Handling', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should return null when Sanity is not configured', async () => {
      sanityState.configured = false

      const cms = await import('@/lib/cms')
      const result = await cms.getProjects()

      expect(result).toBeNull()
    })

    it('should return null when query fails', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockClient = {
        fetch: vi.fn().mockRejectedValue(new Error('Network error')),
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      // Spy on console.error to suppress error output in tests
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { getProjects } = await import('@/lib/cms')
      const result = await getProjects()

      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Cache Strategy', () => {
    beforeEach(async () => {
      const { draftMode } = await import('next/headers')
      vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never)
    })

    it('should use cache with revalidation in production mode', async () => {
      const { getSanityClient } = await import('@/sanity/lib/client')
      const mockFetch = vi.fn().mockResolvedValue([createMockProject()])
      const mockClient = {
        fetch: mockFetch,
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getProjects } = await import('@/lib/cms')
      await getProjects()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        {},
        { next: { revalidate: 60, tags: ['projects'] } }
      )
    })

    it('should disable cache in draft mode', async () => {
      const { draftMode } = await import('next/headers')
      const { getSanityClient } = await import('@/sanity/lib/client')

      vi.mocked(draftMode).mockResolvedValue({ isEnabled: true } as never)

      const mockFetch = vi.fn().mockResolvedValue([createMockProject()])
      const mockClient = {
        fetch: mockFetch,
      }
      vi.mocked(getSanityClient).mockReturnValue(mockClient as never)

      const { getProjects } = await import('@/lib/cms')
      await getProjects()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        {},
        { cache: 'no-store' }
      )
    })
  })
})
