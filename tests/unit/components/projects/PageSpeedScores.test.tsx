import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { PageSpeedScores } from '@/components/projects/PageSpeedScores'
import { pagespeedFor } from '@/lib/fallbackProjects'

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}))

const pagespeed = {
  mobile: { performance: 42, accessibility: 78, bestPractices: 100, seo: 100 },
  desktop: { performance: 95, accessibility: 78, bestPractices: 100, seo: 100 },
}

describe('PageSpeedScores', () => {
  it('renders nothing without scores', () => {
    const { container } = render(<PageSpeedScores />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows mobile scores first and switches to desktop', () => {
    render(<PageSpeedScores pagespeed={pagespeed} />)
    expect(screen.getByRole('img', { name: 'Performance: 42 out of 100' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /desktop/i }))
    expect(screen.getByRole('img', { name: 'Performance: 95 out of 100' })).toBeInTheDocument()
  })

  it('colors the ring by Lighthouse band', () => {
    const { container } = render(<PageSpeedScores pagespeed={pagespeed} />)
    const strokes = Array.from(container.querySelectorAll('circle[stroke-dasharray]')).map((c) => c.getAttribute('stroke'))
    expect(strokes).toEqual(['#ff4e42', '#ffa400', '#0cce6b', '#0cce6b'])
  })

  it('hides the toggle when only one device was tested', () => {
    render(<PageSpeedScores pagespeed={{ desktop: pagespeed.desktop }} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Performance: 95 out of 100' })).toBeInTheDocument()
  })
})

describe('pagespeedFor', () => {
  it('prefers scores entered in the Studio', () => {
    expect(pagespeedFor({ slug: 'black-label-barbecue', pagespeed })).toBe(pagespeed)
  })

  it('falls back to bundled scores for the same slug', () => {
    expect(pagespeedFor({ slug: 'black-label-barbecue', pagespeed: null })?.mobile?.performance).toBe(96)
    expect(pagespeedFor({ slug: 'no-such-project' })).toBeUndefined()
  })
})
