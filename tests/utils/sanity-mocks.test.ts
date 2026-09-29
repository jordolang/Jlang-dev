import { describe, it, expect } from 'vitest'
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
  createMockProjects,
  createMockExperiences,
  createMockTechStack,
  createMockSectionHeadings,
} from './sanity-mocks'

describe('Sanity Mock Utilities', () => {
  describe('createMockProject', () => {
    it('creates a valid project with default values', () => {
      const project = createMockProject()

      expect(project.title).toBe('Test Project')
      expect(project.status).toBe('Live')
      expect(project.features).toHaveLength(2)
      expect(project.tech).toContain('React')
    })

    it('allows overriding default values', () => {
      const project = createMockProject({
        title: 'Custom Project',
        status: 'In Development',
      })

      expect(project.title).toBe('Custom Project')
      expect(project.status).toBe('In Development')
    })
  })

  describe('createMockExperience', () => {
    it('creates a valid experience with default values', () => {
      const experience = createMockExperience()

      expect(experience.role).toBe('Senior Developer')
      expect(experience.company).toBe('Test Company')
      expect(experience.achievements).toHaveLength(2)
    })
  })

  describe('createMockTechItem', () => {
    it('creates a valid tech item with default values', () => {
      const tech = createMockTechItem()

      expect(tech.name).toBe('React')
      expect(tech.level).toBe('Expert')
      expect(tech.category).toBe('Frontend')
    })
  })

  describe('createMockServicePackage', () => {
    it('creates a valid service package with default values', () => {
      const pkg = createMockServicePackage()

      expect(pkg.name).toBe('Standard Package')
      expect(pkg.slug).toBe('standard')
      expect(pkg.highlights).toHaveLength(2)
      expect(pkg.features.length).toBeGreaterThan(0)
    })
  })

  describe('createMockAddonFeature', () => {
    it('creates a valid addon feature', () => {
      const addon = createMockAddonFeature()

      expect(addon.name).toBe('E-commerce Integration')
      expect(addon.price).toBe(1000)
    })
  })

  describe('createMockFaq', () => {
    it('creates a valid FAQ', () => {
      const faq = createMockFaq()

      expect(faq.question).toBeDefined()
      expect(faq.answer).toBeDefined()
    })
  })

  describe('createMockSectionHeading', () => {
    it('creates a valid section heading', () => {
      const heading = createMockSectionHeading()

      expect(heading.sectionId).toBe('projects')
      expect(heading.heading).toBe('Featured Projects')
    })
  })

  describe('createMockSiteSettings', () => {
    it('creates valid site settings', () => {
      const settings = createMockSiteSettings()

      expect(settings.name).toBe('Test Portfolio')
      expect(settings.typewriterRoles).toHaveLength(3)
      expect(settings.socials).toHaveLength(2)
    })
  })

  describe('createMockAboutContent', () => {
    it('creates valid about content', () => {
      const about = createMockAboutContent()

      expect(about.greeting).toBeDefined()
      expect(about.role).toBe('Full-Stack Developer')
      expect(about.bio).toHaveLength(2)
    })
  })

  describe('createMockPromoContent', () => {
    it('creates valid promo content', () => {
      const promo = createMockPromoContent()

      expect(promo.headline).toBeDefined()
      expect(promo.active).toBe(true)
    })
  })

  describe('createMockSanityImage', () => {
    it('creates a valid Sanity image reference', () => {
      const image = createMockSanityImage()

      expect(image.asset).toBeDefined()
      expect(image.asset?.url).toBeDefined()
      expect(image.asset?.metadata?.dimensions).toBeDefined()
    })
  })

  describe('Batch generators', () => {
    it('createMockProjects generates multiple projects', () => {
      const projects = createMockProjects(3)

      expect(projects).toHaveLength(3)
      expect(projects[0].title).toBe('Project 1')
      expect(projects[0].featured).toBe(true)
    })

    it('createMockExperiences generates multiple experiences', () => {
      const experiences = createMockExperiences(3)

      expect(experiences).toHaveLength(3)
      expect(experiences[0].role).toBe('Role 1')
    })

    it('createMockTechStack generates grouped tech items', () => {
      const techStack = createMockTechStack()

      expect(techStack.Frontend).toHaveLength(2)
      expect(techStack.Backend).toHaveLength(2)
      expect(techStack.Database).toHaveLength(2)
    })

    it('createMockSectionHeadings generates all sections', () => {
      const headings = createMockSectionHeadings()

      expect(headings.hero).toBeDefined()
      expect(headings.projects).toBeDefined()
      expect(headings.about).toBeDefined()
    })
  })
})
