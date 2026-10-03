import { describe, it, expect, vi, beforeEach } from 'vitest'

const send = vi.fn()
vi.mock('@/lib/resend', () => ({
  getResend: () => ({ emails: { send } }),
}))

const post = async (body: unknown) => {
  const { POST } = await import('@/app/api/contact/route')
  return POST(new Request('http://localhost/api/contact', { method: 'POST', body: JSON.stringify(body) }))
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 're_test'
    delete process.env.CONTACT_EMAIL
    send.mockResolvedValue({ data: { id: 'email-1' }, error: null })
  })

  it('emails the site owner with the sender as reply-to', async () => {
    const response = await post({ name: 'Ada', email: 'ada@example.com', subject: 'Hello', message: 'Hi there' })

    expect(response.status).toBe(200)
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      to: 'jordan@jlang.dev',
      replyTo: 'ada@example.com',
      subject: 'Hello',
      text: expect.stringContaining('Hi there'),
    }))
  })

  it('ignores any recipient supplied by the caller', async () => {
    await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi', to: 'victim@example.com' })

    expect(send.mock.calls[0][0].to).toBe('jordan@jlang.dev')
  })

  it('rejects an invalid email', async () => {
    const response = await post({ name: 'Ada', email: 'not-an-email', message: 'Hi' })

    expect(response.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it('returns 503 when Resend is not configured', async () => {
    delete process.env.RESEND_API_KEY
    const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi' })

    expect(response.status).toBe(503)
  })

  it('returns 502 when Resend reports an error', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'domain not verified' } })
    const response = await post({ name: 'Ada', email: 'ada@example.com', message: 'Hi' })

    expect(response.status).toBe(502)
  })
})
