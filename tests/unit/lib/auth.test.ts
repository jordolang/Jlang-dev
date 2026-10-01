import { describe, it, expect, vi, beforeEach } from 'vitest'

const jar = vi.hoisted(() => new Map<string, string>())

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { value: jar.get(name) } : undefined),
    set: (name: string, value: string) => jar.set(name, value),
  }),
}))

vi.mock('@/sanity/lib/client', () => ({
  sanityClient: {
    fetch: vi.fn(async () => ({ _id: 'client-1', name: 'Test', email: 'a@b.co' })),
    patch: () => ({ set: () => ({ commit: async () => ({}) }) }),
  },
  sanityIsConfigured: true,
}))

import { createSession, decodeSession, getSession } from '@/lib/auth'

describe('portal session cookie', () => {
  beforeEach(() => {
    jar.clear()
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
})
