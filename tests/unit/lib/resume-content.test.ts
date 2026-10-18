import { describe, it, expect } from 'vitest'
import { formatCredentialDate, pick, pickRecentProjects } from '@/lib/resumeContent'
import { projectBucket } from '@/lib/projectBuckets'

describe('formatCredentialDate', () => {
  it('formats ISO dates as month and year', () => {
    expect(formatCredentialDate('2024-03-15')).toBe('Mar 2024')
  })

  it('leaves other text and empty values alone', () => {
    expect(formatCredentialDate('Spring 2019')).toBe('Spring 2019')
    expect(formatCredentialDate(undefined)).toBeUndefined()
  })
})

describe('pick', () => {
  it('falls back on empty strings, empty arrays and missing values', () => {
    expect(pick('', 'fallback')).toBe('fallback')
    expect(pick('   ', 'fallback')).toBe('fallback')
    expect(pick([], ['a'])).toEqual(['a'])
    expect(pick(undefined, 1)).toBe(1)
    expect(pick(null, 1)).toBe(1)
  })

  it('keeps real values', () => {
    expect(pick('Studio', 'fallback')).toBe('Studio')
    expect(pick(['b'], ['a'])).toEqual(['b'])
  })
})

describe('pickRecentProjects', () => {
  const projects = [
    { slug: 'old', timeline: '3 months' },
    { slug: 'new', timeline: '2026' },
    { slug: 'ongoing', timeline: 'Ongoing' },
  ]

  it('keeps projects dated this year or ongoing, in order', () => {
    expect(pickRecentProjects(projects, 8, 2026).map((p) => p.slug)).toEqual(['new', 'ongoing'])
  })

  it('falls back to the first projects when none are recent', () => {
    const dated = projects.filter((p) => p.slug !== 'ongoing')
    expect(pickRecentProjects(dated, 1, 2030).map((p) => p.slug)).toEqual(['old'])
  })
})

describe('projectBucket', () => {
  it('sorts projects by group first, then category', () => {
    expect(projectBucket({ group: 'mobile', category: 'Mobile App' })).toBe('mobile')
    expect(projectBucket({ group: 'desktopApp', category: 'Kiosk App' })).toBe('desktop')
    expect(projectBucket({ group: 'desktop', category: 'Web App' })).toBe('webApps')
    expect(projectBucket({ group: 'desktop', category: 'Mobile & Web Apps' })).toBe('webApps')
    expect(projectBucket({ group: 'desktop', category: 'Web Design' })).toBe('websites')
    expect(projectBucket({ category: 'E-Commerce' })).toBe('websites')
  })
})
