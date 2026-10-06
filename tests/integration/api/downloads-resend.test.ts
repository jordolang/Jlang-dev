import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendDownloadEmail = vi.fn()
vi.mock('@/lib/orders', () => ({
  RESEND_COOLDOWN_MS: 5 * 60 * 1000,
  sendDownloadEmail: (...args: unknown[]) => sendDownloadEmail(...args),
}))
vi.mock('@/lib/alerts', () => ({ alertOwner: vi.fn() }))

const fetchMock = vi.fn()
const commit = vi.fn()
const patch = vi.fn()
vi.mock('@/sanity/lib/client', () => ({
  sanityIsConfigured: true,
  sanityClient: {
    fetch: (...args: unknown[]) => fetchMock(...args),
    transaction: () => ({ patch, commit }),
  },
}))

const post = async (body: unknown) => {
  const { POST } = await import('@/app/api/downloads/resend/route')
  return POST(new Request('http://localhost/api/downloads/resend', { method: 'POST', body: JSON.stringify(body) }))
}

const order = (id: string, productId: string, lastLinkSentAt?: string) => ({ _id: id, productId, productName: `Product ${productId}`, lastLinkSentAt })

describe('POST /api/downloads/resend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 're_test'
    process.env.SANITY_API_WRITE_TOKEN = 'sk_test'
    delete process.env.TURNSTILE_SECRET_KEY
    sendDownloadEmail.mockResolvedValue(undefined)
    commit.mockResolvedValue({})
  })

  it('emails one link per product purchased with that address', async () => {
    fetchMock.mockResolvedValue([order('o1', 'p1'), order('o2', 'p2'), order('o3', 'p1')])
    const response = await post({ email: 'Ada@Example.com' })

    expect(response.status).toBe(200)
    expect(fetchMock.mock.calls[0][1]).toEqual({ email: 'ada@example.com' })
    expect(sendDownloadEmail).toHaveBeenCalledWith('ada@example.com', [expect.objectContaining({ productId: 'p1' }), expect.objectContaining({ productId: 'p2' })], { resend: true })
    expect(patch).toHaveBeenCalledTimes(3)
  })

  it('gives the same answer when the address has no purchases', async () => {
    fetchMock.mockResolvedValue([])
    const response = await post({ email: 'nobody@example.com' })

    expect(response.status).toBe(200)
    expect(sendDownloadEmail).not.toHaveBeenCalled()
  })

  it('does not resend within the cooldown', async () => {
    fetchMock.mockResolvedValue([order('o1', 'p1', new Date().toISOString())])
    const response = await post({ email: 'ada@example.com' })

    expect(response.status).toBe(200)
    expect(sendDownloadEmail).not.toHaveBeenCalled()
  })

  it('reports an email failure', async () => {
    fetchMock.mockResolvedValue([order('o1', 'p1')])
    sendDownloadEmail.mockRejectedValue(new Error('down'))

    expect((await post({ email: 'ada@example.com' })).status).toBe(502)
  })

  it('rejects an invalid email', async () => {
    expect((await post({ email: 'nope' })).status).toBe(400)
  })
})
