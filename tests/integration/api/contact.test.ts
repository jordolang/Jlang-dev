import { describe, it, expect, vi, beforeEach } from 'vitest'

const send = vi.fn()
vi.mock('@/lib/resend', () => ({
  getResend: () => ({ emails: { send } }),
}))

const alertOwner = vi.fn()
vi.mock('@/lib/alerts', () => ({ alertOwner: (...args: unknown[]) => alertOwner(...args) }))

const fetchMock = vi.fn()
const create = vi.fn()
const commit = vi.fn()
const set = vi.fn(() => ({ commit }))
vi.mock('@/sanity/lib/client', () => ({
  sanityIsConfigured: true,
  sanityClient: {
    fetch: (...args: unknown[]) => fetchMock(...args),
    create: (...args: unknown[]) => create(...args),
    patch: () => ({ set }),
  },
}))

const post = async (body: unknown, headers: Record<string, string> = {}) => {
  const { POST } = await import('@/app/api/contact/route')
  return POST(new Request('http://localhost/api/contact', { method: 'POST', body: JSON.stringify(body), headers }))
}

const ownerEmail = () => send.mock.calls.find(([options]) => options.to === 'jordan@jlang.dev')?.[0]
const acknowledgement = () => send.mock.calls.find(([options]) => options.to !== 'jordan@jlang.dev')?.[0]

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 're_test'
    delete process.env.SANITY_API_WRITE_TOKEN
    delete process.env.CONTACT_EMAIL
    delete process.env.NEXT_PUBLIC_BOOKING_URL
    delete process.env.TURNSTILE_SECRET_KEY
    send.mockResolvedValue({ data: { id: 'email-1' }, error: null })
    fetchMock.mockResolvedValue(null)
    create.mockResolvedValue({ _id: 'lead-1' })
    commit.mockResolvedValue({})
  })

  it('emails the site owner with the sender as reply-to', async () => {
    const response = await post({ name: 'Ada', email: 'ada@example.com', subject: 'Hello', message: 'Hi there' })

    expect(response.status).toBe(200)
    expect(ownerEmail()).toEqual(expect.objectContaining({
      replyTo: 'ada@example.com',
      subject: 'Hello',
      text: expect.stringContaining('Hi there'),
    }))
  })

  it('ignores any recipient supplied by the caller', async () => {
    await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi', to: 'victim@example.com' })

    expect(send.mock.calls[0][0].to).toBe('jordan@jlang.dev')
  })

  it('sends the sender a confirmation that never echoes their message', async () => {
    process.env.NEXT_PUBLIC_BOOKING_URL = 'https://cal.com/jordan'
    await post({ name: 'Ada Lovelace', email: 'ada@example.com', message: 'Buy cheap pills at spam.example' })

    const ack = acknowledgement()
    expect(ack.to).toBe('ada@example.com')
    expect(ack.text).toContain('Hi Ada,')
    expect(ack.text).toContain('https://cal.com/jordan')
    expect(ack.text).not.toContain('spam.example')
  })

  it('includes the qualifying details in the owner email', async () => {
    await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi', projectType: 'New website', budget: '$5,000 – $15,000', timeline: 'Flexible' })

    expect(ownerEmail().text).toContain('Project type: New website')
    expect(ownerEmail().text).toContain('Budget: $5,000 – $15,000')
    expect(ownerEmail().text).toContain('Timeline: Flexible')
  })

  it('rejects an invalid email', async () => {
    const response = await post({ name: 'Ada', email: 'not-an-email', message: 'Hi' })

    expect(response.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it('returns 503 when neither Sanity nor Resend can take the message', async () => {
    delete process.env.RESEND_API_KEY
    const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi' })

    expect(response.status).toBe(503)
  })

  it('returns 502 when Resend reports an error and nothing was saved', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'domain not verified' } })
    const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi' })

    expect(response.status).toBe(502)
  })

  describe('with Sanity writes enabled', () => {
    beforeEach(() => {
      process.env.SANITY_API_WRITE_TOKEN = 'sk_test'
      fetchMock.mockImplementation(async (query: string) => (query.startsWith('count(') ? 0 : null))
    })

    it('saves the inquiry before emailing and marks it delivered', async () => {
      const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi', source: 'services', company: 'Analytical Engines', budget: '$15,000+' })

      expect(response.status).toBe(200)
      expect(create).toHaveBeenCalledWith(expect.objectContaining({
        _type: 'lead',
        status: 'new',
        email: 'ada@example.com',
        source: 'services',
        company: 'Analytical Engines',
        budget: '$15,000+',
        emailDelivered: false,
      }))
      expect(set).toHaveBeenCalledWith({ emailDelivered: true })
    })

    it('still succeeds, and alerts, when the email fails but the inquiry was saved', async () => {
      send.mockResolvedValue({ data: null, error: { message: 'domain not verified' } })
      const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi' })

      expect(response.status).toBe(200)
      expect(set).not.toHaveBeenCalled()
      expect(alertOwner).toHaveBeenCalledWith('Inquiry saved but the notification email failed', expect.anything())
    })

    it('rate limits a sender who has sent too many inquiries', async () => {
      fetchMock.mockImplementation(async (query: string) => (query.startsWith('count(') ? 5 : null))
      const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi' }, { 'x-forwarded-for': '203.0.113.9' })

      expect(response.status).toBe(429)
      expect(create).not.toHaveBeenCalled()
    })
  })

  describe('spam checks', () => {
    it('pretends to accept a filled honeypot but does nothing', async () => {
      const response = await post({ name: 'Bot', email: 'bot@example.com', message: 'Hi', website: 'http://spam.example' })

      expect(response.status).toBe(200)
      expect(send).not.toHaveBeenCalled()
      expect(create).not.toHaveBeenCalled()
    })

    it('pretends to accept a form filled in impossibly fast', async () => {
      const response = await post({ name: 'Bot', email: 'bot@example.com', message: 'Hi', startedAt: Date.now() - 200 })

      expect(response.status).toBe(200)
      expect(send).not.toHaveBeenCalled()
    })

    it('accepts a form filled in at human speed', async () => {
      const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi', startedAt: Date.now() - 30_000 })

      expect(response.status).toBe(200)
      expect(ownerEmail()).toBeDefined()
    })

    it('requires a Turnstile token when Turnstile is configured', async () => {
      process.env.TURNSTILE_SECRET_KEY = 'secret'
      const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi' })

      expect(response.status).toBe(400)
      expect(send).not.toHaveBeenCalled()
    })
  })
})
