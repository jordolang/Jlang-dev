import { describe, it, expect, vi, beforeEach } from 'vitest'

const createContact = vi.fn()
vi.mock('@/lib/resend', () => ({
  getResend: () => ({ contacts: { create: createContact } }),
}))
vi.mock('@/lib/alerts', () => ({ alertOwner: vi.fn() }))

const post = async (body: unknown) => {
  const { POST } = await import('@/app/api/newsletter/route')
  return POST(new Request('http://localhost/api/newsletter', { method: 'POST', body: JSON.stringify(body) }))
}

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 're_test'
    delete process.env.RESEND_NEWSLETTER_SEGMENT_ID
    delete process.env.TURNSTILE_SECRET_KEY
    createContact.mockResolvedValue({ data: { id: 'c1' }, error: null })
  })

  it('adds the subscriber as a Resend contact', async () => {
    const response = await post({ email: 'Ada@Example.com' })

    expect(response.status).toBe(200)
    expect(createContact).toHaveBeenCalledWith({ email: 'ada@example.com', unsubscribed: false })
  })

  it('adds the subscriber to the configured segment', async () => {
    process.env.RESEND_NEWSLETTER_SEGMENT_ID = 'seg_1'
    await post({ email: 'ada@example.com' })

    expect(createContact).toHaveBeenCalledWith(expect.objectContaining({ segments: [{ id: 'seg_1' }] }))
  })

  it('treats an existing subscriber as success', async () => {
    createContact.mockResolvedValue({ data: null, error: { message: 'Contact already exists' } })
    expect((await post({ email: 'ada@example.com' })).status).toBe(200)
  })

  it('reports a real failure instead of pretending it worked', async () => {
    createContact.mockResolvedValue({ data: null, error: { message: 'API key invalid' } })
    expect((await post({ email: 'ada@example.com' })).status).toBe(502)
  })

  it('rejects an invalid email', async () => {
    expect((await post({ email: 'nope' })).status).toBe(400)
    expect(createContact).not.toHaveBeenCalled()
  })

  it('ignores bots that fill the honeypot', async () => {
    expect((await post({ email: 'bot@example.com', website: 'x' })).status).toBe(200)
    expect(createContact).not.toHaveBeenCalled()
  })

  it('returns 503 when Resend is not configured', async () => {
    delete process.env.RESEND_API_KEY
    expect((await post({ email: 'ada@example.com' })).status).toBe(503)
  })
})
