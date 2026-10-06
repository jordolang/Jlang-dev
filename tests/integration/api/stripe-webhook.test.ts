import { describe, it, expect, vi, beforeEach } from 'vitest'

const constructEvent = vi.fn()
vi.mock('@/lib/stripe', () => ({ getStripe: () => ({ webhooks: { constructEvent } }) }))

const sendDownloadEmail = vi.fn()
vi.mock('@/lib/orders', () => ({ sendDownloadEmail: (...args: unknown[]) => sendDownloadEmail(...args) }))

const captureServerEvent = vi.fn()
vi.mock('@/lib/server-analytics', () => ({ captureServerEvent: (...args: unknown[]) => captureServerEvent(...args) }))

const alertOwner = vi.fn()
vi.mock('@/lib/alerts', () => ({ alertOwner: (...args: unknown[]) => alertOwner(...args) }))

const getDocument = vi.fn()
const createIfNotExists = vi.fn()
const commit = vi.fn()
const set = vi.fn(() => ({ commit }))
vi.mock('@/sanity/lib/client', () => ({
  sanityIsConfigured: true,
  sanityClient: {
    getDocument: (...args: unknown[]) => getDocument(...args),
    createIfNotExists: (...args: unknown[]) => createIfNotExists(...args),
    patch: () => ({ set }),
  },
}))

const paidEvent = (livemode = true) => ({
  type: 'checkout.session.completed',
  livemode,
  data: {
    object: {
      id: 'cs_test_123',
      payment_status: 'paid',
      amount_total: 4900,
      currency: 'usd',
      created: 1_760_000_000,
      customer_details: { email: 'Ada@Example.com', name: 'Ada' },
      metadata: { productId: 'prod-1', productName: 'Starter Kit', analyticsId: 'visitor-9' },
    },
  },
})

const post = async () => {
  const { POST } = await import('@/app/api/webhooks/stripe/route')
  return POST(new Request('http://localhost/api/webhooks/stripe', { method: 'POST', body: '{}', headers: { 'stripe-signature': 'sig' } }))
}

describe('POST /api/webhooks/stripe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
    process.env.SANITY_API_WRITE_TOKEN = 'sk_test'
    constructEvent.mockReturnValue(paidEvent())
    getDocument.mockResolvedValue(null)
    createIfNotExists.mockResolvedValue({})
    commit.mockResolvedValue({})
    sendDownloadEmail.mockResolvedValue(undefined)
  })

  it('records the order, emails the download and tracks the purchase once', async () => {
    const response = await post()

    expect(response.status).toBe(200)
    expect(createIfNotExists).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'order-cs_test_123',
      _type: 'order',
      email: 'ada@example.com',
      amountTotal: 49,
      livemode: true,
      product: { _type: 'reference', _ref: 'prod-1', _weak: true },
    }))
    expect(sendDownloadEmail).toHaveBeenCalledWith('Ada@Example.com', [{ productId: 'prod-1', productName: 'Starter Kit' }], { orderId: 'cs_test_123' })
    expect(captureServerEvent).toHaveBeenCalledWith('visitor-9', 'purchase_completed', expect.objectContaining({ revenue: 49, is_test: false }))
    expect(set).toHaveBeenCalledWith({ purchaseTracked: true })
  })

  it('flags test-mode purchases for analytics', async () => {
    constructEvent.mockReturnValue(paidEvent(false))
    await post()

    expect(captureServerEvent).toHaveBeenCalledWith('visitor-9', 'purchase_completed', expect.objectContaining({ is_test: true }))
  })

  it('does not track a purchase twice when Stripe retries', async () => {
    getDocument.mockResolvedValue({ _id: 'order-cs_test_123', purchaseTracked: true })
    await post()

    expect(sendDownloadEmail).toHaveBeenCalled()
    expect(captureServerEvent).not.toHaveBeenCalled()
  })

  it('fails so Stripe retries, and alerts, when the download email fails', async () => {
    sendDownloadEmail.mockRejectedValue(new Error('resend down'))
    const response = await post()

    expect(response.status).toBe(500)
    expect(alertOwner).toHaveBeenCalledWith('A buyer paid but their download email failed', expect.anything())
    expect(captureServerEvent).not.toHaveBeenCalled()
  })

  it('still emails the buyer when the order cannot be saved', async () => {
    createIfNotExists.mockRejectedValue(new Error('sanity down'))
    const response = await post()

    expect(response.status).toBe(200)
    expect(sendDownloadEmail).toHaveBeenCalled()
    expect(alertOwner).toHaveBeenCalledWith('Could not record a paid order in Sanity', expect.anything())
  })
})
