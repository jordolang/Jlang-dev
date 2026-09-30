import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import React from 'react'

beforeAll(() => vi.stubGlobal('React', React))
afterAll(() => vi.unstubAllGlobals())

vi.mock('@/lib/cms', () => ({
  getServicePackages: vi.fn().mockResolvedValue([
    { id: 'custom', name: 'Custom', basePrice: null },
    { id: 'paid', name: 'Paid', basePrice: 500 },
    { id: 'free', name: 'Free', basePrice: 0 },
  ]),
  getAddonFeatures: vi.fn().mockResolvedValue([]),
}))
vi.mock('@/components/services/ServicesOrderView', () => ({ default: () => null }))
vi.mock('@/lib/content/packages', () => ({ toPackageRecord: vi.fn().mockReturnValue({}) }))

import ServicesPage from '@/app/services/page'
import { SITE_URL } from '@/lib/schema'

describe('Service page structured data', () => {
  it('omits custom prices, preserves explicit zero prices, and uses the site URL', async () => {
    const page = await ServicesPage()
    const schema = page.props.children[0].props.data
    expect(schema.provider.url).toBe(SITE_URL)
    expect(schema.offers.map((offer: { name: string; price: number }) => [offer.name, offer.price]))
      .toEqual([['Paid', 500], ['Free', 0]])
  })
})
