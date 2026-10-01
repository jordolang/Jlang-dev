import { describe, it, expect, vi, beforeEach } from 'vitest'

const jar = vi.hoisted(() => new Map<string, string>())

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { value: jar.get(name) } : undefined),
    set: (name: string, value: string) => jar.set(name, value),
  }),
}))

const sanity = vi.hoisted(() => {
  const client = { _id: 'client-1', name: 'Test', email: 'a@b.co' }
  return {
    client,
    clients: [client] as unknown[],
    commit: async () => ({}),
  }
})

vi.mock('@/sanity/lib/client', () => ({
  sanityClient: {
    // email lookups return a list (so duplicates are detectable); id lookups and tokens return one doc
    fetch: vi.fn(async (query: string) =>
      query.includes('magicLinkToken')
        ? { _id: 't1', _rev: 'r1', email: 'a@b.co', expiresAt: new Date(Date.now() + 60_000).toISOString(), used: false }
        : query.includes('email == $email')
          ? sanity.clients
          : sanity.client
    ),
    patch: () => {
      const chain = { ifRevisionId: () => chain, set: () => chain, commit: () => sanity.commit() }
      return chain
    },
  },
  sanityIsConfigured: true,
}))

import { createSession, decodeSession, getSession, verifyToken } from '@/lib/auth'

describe('portal session cookie', () => {
  beforeEach(() => {
    jar.clear()
    sanity.clients = [sanity.client]
    sanity.commit = async () => ({})
    process.env.PORTAL_SESSION_SECRET = 'test-secret'
  })

  it('round-trips a session created at login', async () => {
    await createSession('a@b.co')
    expect(decodeSession(jar.get('client_session')!)?.clientId).toBe('client-1')
    expect(await getSession()).toMatchObject({ _id: 'client-1' })
  })

  it('rejects a forged plain-JSON cookie', async () => {
    jar.set('client_session', JSON.stringify({ clientId: 'client-1', email: 'a@b.co' }))
    expect(await getSession()).toBeNull()
  })

  it('rejects a tampered payload', async () => {
    await createSession('a@b.co')
    const [, sig] = jar.get('client_session')!.split('.')
    const forged = Buffer.from(JSON.stringify({ clientId: 'someone-else' })).toString('base64url')
    expect(decodeSession(`${forged}.${sig}`)).toBeNull()
  })

  it('rejects an expired session even with a valid signature', async () => {
    vi.useFakeTimers()
    await createSession('a@b.co')
    vi.advanceTimersByTime(31 * 24 * 60 * 60 * 1000)
    expect(await getSession()).toBeNull()
    vi.useRealTimers()
  })

  it('refuses to log in when several clients share an email', async () => {
    sanity.clients = [sanity.client, { ...sanity.client, _id: 'client-2' }]
    expect(await createSession('a@b.co')).toBeNull()
    expect(jar.size).toBe(0)
  })

  it('fails verification when the token was consumed concurrently', async () => {
    expect(await verifyToken('abc')).toMatchObject({ valid: true })
    sanity.commit = async () => { throw new Error('revision mismatch') }
    expect(await verifyToken('abc')).toMatchObject({ valid: false, error: 'Token already used' })
  })
})
