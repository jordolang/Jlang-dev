import { afterEach, vi } from 'vitest'
import type { Mock } from 'vitest'

/**
 * General test helper utilities.
 *
 * Provides utilities for mocking fetch, Next.js functions, common test data,
 * and helpers for async testing and component testing.
 */

// ============================================================================
// Fetch Mocking Utilities
// ============================================================================

export interface MockResponse {
  ok: boolean
  status: number
  statusText: string
  headers: Headers
  json: () => Promise<unknown>
  text: () => Promise<string>
  blob: () => Promise<Blob>
  arrayBuffer: () => Promise<ArrayBuffer>
  clone: () => Response
}

/**
 * Creates a mock fetch response with configurable status and data.
 *
 * @example
 * ```ts
 * global.fetch = vi.fn(() => Promise.resolve(createMockResponse({
 *   data: { posts: [] },
 *   status: 200
 * })))
 * ```
 */
export function createMockResponse(options: {
  data?: unknown
  status?: number
  statusText?: string
  headers?: Record<string, string>
} = {}): Response {
  const {
    data = {},
    status = 200,
    statusText = 'OK',
    headers = { 'Content-Type': 'application/json' },
  } = options

  const responseHeaders = new Headers(headers)

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: responseHeaders,
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
    blob: async () => new Blob([JSON.stringify(data)]),
    arrayBuffer: async () => new TextEncoder().encode(JSON.stringify(data)).buffer,
    clone: function () {
      return this
    },
  } as Response
}

/**
 * Creates a mock fetch function that returns different responses based on URL patterns.
 *
 * @example
 * ```ts
 * global.fetch = createMockFetch({
 *   '/api/blog': { data: { posts: [] } },
 *   '/api/testimonials': { data: { testimonials: [] } },
 * })
 * ```
 */
export function createMockFetch(
  responses: Record<string, { data?: unknown; status?: number; statusText?: string }>,
): Mock {
  return vi.fn(async (url: string | URL) => {
    const urlString = typeof url === 'string' ? url : url.toString()

    // Find matching pattern
    for (const [pattern, responseConfig] of Object.entries(responses)) {
      if (urlString.includes(pattern)) {
        return createMockResponse(responseConfig)
      }
    }

    // Default 404 response
    return createMockResponse({
      data: { error: 'Not Found' },
      status: 404,
      statusText: 'Not Found',
    })
  })
}

/**
 * Mocks the global fetch function with custom responses.
 * Returns the mock function for further assertions.
 *
 * @example
 * ```ts
 * const fetchMock = mockFetch({
 *   '/api/blog': { data: { posts: [] } }
 * })
 *
 * // Later in test
 * expect(fetchMock).toHaveBeenCalledWith('/api/blog')
 * ```
 */
export function mockFetch(
  responses: Record<string, { data?: unknown; status?: number; statusText?: string }>,
): Mock {
  const mockFn = createMockFetch(responses)
  global.fetch = mockFn as unknown as typeof fetch
  return mockFn
}

// ============================================================================
// Next.js Cache Mocking
// ============================================================================

/**
 * Creates mock implementations for Next.js cache functions.
 * Use this when you need to test cache revalidation behavior.
 *
 * @example
 * ```ts
 * const cacheMocks = mockNextCache()
 *
 * // In your test
 * await someFunction() // calls revalidatePath internally
 *
 * expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/blog')
 * ```
 */
export function mockNextCache() {
  const revalidatePath = vi.fn()
  const revalidateTag = vi.fn()
  const unstable_cache = vi.fn((fn) => fn)

  vi.doMock('next/cache', () => ({
    revalidatePath,
    revalidateTag,
    unstable_cache,
  }))

  return {
    revalidatePath,
    revalidateTag,
    unstable_cache,
  }
}

// ============================================================================
// Next.js Headers and Cookies Mocking
// ============================================================================

/**
 * Creates a mock headers object for Next.js server components.
 *
 * @example
 * ```ts
 * const headersMock = createMockHeaders({
 *   'user-agent': 'Mozilla/5.0...',
 *   'x-forwarded-for': '192.168.1.1'
 * })
 * ```
 */
export function createMockHeaders(headers: Record<string, string> = {}) {
  return {
    get: vi.fn((key: string) => headers[key.toLowerCase()] ?? null),
    has: vi.fn((key: string) => key.toLowerCase() in headers),
    forEach: vi.fn((callback: (value: string, key: string) => void) => {
      Object.entries(headers).forEach(([key, value]) => callback(value, key))
    }),
    entries: vi.fn(() => Object.entries(headers)[Symbol.iterator]()),
    keys: vi.fn(() => Object.keys(headers)[Symbol.iterator]()),
    values: vi.fn(() => Object.values(headers)[Symbol.iterator]()),
  }
}

/**
 * Creates a mock cookies object for Next.js server components.
 *
 * @example
 * ```ts
 * const cookiesMock = createMockCookies({
 *   sessionId: 'abc123',
 *   theme: 'dark'
 * })
 * ```
 */
export function createMockCookies(cookies: Record<string, string> = {}) {
  return {
    get: vi.fn((key: string) => (cookies[key] ? { name: key, value: cookies[key] } : undefined)),
    getAll: vi.fn(() =>
      Object.entries(cookies).map(([name, value]) => ({ name, value })),
    ),
    has: vi.fn((key: string) => key in cookies),
    set: vi.fn((key: string, value: string) => {
      cookies[key] = value
    }),
    delete: vi.fn((key: string) => {
      delete cookies[key]
    }),
  }
}

/**
 * Mocks next/headers module with custom headers and cookies.
 *
 * @example
 * ```ts
 * const { headers, cookies, draftMode } = mockNextHeaders({
 *   headers: { 'user-agent': 'test' },
 *   cookies: { sessionId: 'test-session' },
 *   draftMode: { isEnabled: true }
 * })
 * ```
 */
export function mockNextHeaders(options: {
  headers?: Record<string, string>
  cookies?: Record<string, string>
  draftMode?: { isEnabled: boolean }
} = {}) {
  const headersMock = createMockHeaders(options.headers)
  const cookiesMock = createMockCookies(options.cookies)
  const draftModeMock = vi.fn(() => Promise.resolve(options.draftMode ?? { isEnabled: false }))

  vi.doMock('next/headers', () => ({
    headers: vi.fn(() => headersMock),
    cookies: vi.fn(() => cookiesMock),
    draftMode: draftModeMock,
  }))

  return {
    headers: headersMock,
    cookies: cookiesMock,
    draftMode: draftModeMock,
  }
}

// ============================================================================
// Next.js Router Mocking
// ============================================================================

/**
 * Creates a mock Next.js router with configurable behavior.
 *
 * @example
 * ```ts
 * const router = createMockRouter({
 *   pathname: '/blog',
 *   query: { id: '123' }
 * })
 *
 * expect(router.push).toHaveBeenCalledWith('/blog/new-post')
 * ```
 */
export function createMockRouter(options: {
  pathname?: string
  query?: Record<string, string | string[]>
  asPath?: string
} = {}) {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: options.pathname ?? '/',
    query: options.query ?? {},
    asPath: options.asPath ?? '/',
  }
}

/**
 * Mocks next/navigation module with custom router state.
 *
 * @example
 * ```ts
 * const { router, pathname, searchParams } = mockNextNavigation({
 *   pathname: '/blog',
 *   searchParams: new URLSearchParams({ id: '123' })
 * })
 * ```
 */
export function mockNextNavigation(options: {
  pathname?: string
  searchParams?: URLSearchParams
  params?: Record<string, string>
} = {}) {
  const routerMock = createMockRouter({ pathname: options.pathname })
  const pathnameMock = vi.fn(() => options.pathname ?? '/')
  const searchParamsMock = vi.fn(() => options.searchParams ?? new URLSearchParams())
  const paramsMock = vi.fn(() => options.params ?? {})
  const redirectMock = vi.fn()
  const notFoundMock = vi.fn()

  vi.doMock('next/navigation', () => ({
    useRouter: vi.fn(() => routerMock),
    usePathname: pathnameMock,
    useSearchParams: searchParamsMock,
    useParams: paramsMock,
    redirect: redirectMock,
    notFound: notFoundMock,
  }))

  return {
    router: routerMock,
    pathname: pathnameMock,
    searchParams: searchParamsMock,
    params: paramsMock,
    redirect: redirectMock,
    notFound: notFoundMock,
  }
}

// ============================================================================
// Common Test Data
// ============================================================================

/**
 * Generates a mock date string in ISO format.
 *
 * @example
 * ```ts
 * const dateStr = createMockDate() // "2026-09-29T00:00:00.000Z"
 * const customDate = createMockDate('2025-01-01') // "2025-01-01T00:00:00.000Z"
 * ```
 */
export function createMockDate(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date('2026-09-29')
  return date.toISOString()
}

/**
 * Generates a mock UUID (v4 format).
 *
 * @example
 * ```ts
 * const id = createMockUUID() // "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function createMockUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generates a mock email address.
 *
 * @example
 * ```ts
 * const email = createMockEmail() // "test-{random}@example.com"
 * const customEmail = createMockEmail('john') // "john@example.com"
 * ```
 */
export function createMockEmail(username?: string): string {
  const name = username ?? `test-${Math.random().toString(36).substr(2, 9)}`
  return `${name}@example.com`
}

/**
 * Generates mock pagination metadata.
 *
 * @example
 * ```ts
 * const pagination = createMockPagination({ total: 100, page: 2 })
 * // { page: 2, perPage: 10, total: 100, totalPages: 10 }
 * ```
 */
export function createMockPagination(options: {
  page?: number
  perPage?: number
  total?: number
} = {}) {
  const { page = 1, perPage = 10, total = 0 } = options
  return {
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

// ============================================================================
// Async Testing Utilities
// ============================================================================

/**
 * Waits for a specified number of milliseconds.
 * Useful for testing time-based behavior.
 *
 * @example
 * ```ts
 * await wait(100) // Wait 100ms
 * ```
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Waits for a condition to become true, with timeout.
 *
 * @example
 * ```ts
 * await waitFor(() => element.textContent === 'Loaded', { timeout: 1000 })
 * ```
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {},
): Promise<void> {
  const { timeout = 5000, interval = 50 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return
    }
    await wait(interval)
  }

  throw new Error(`Condition not met within ${timeout}ms`)
}

/**
 * Flushes all pending promises and timers.
 * Useful when testing async operations.
 *
 * @example
 * ```ts
 * fetchData() // async operation
 * await flushPromises()
 * expect(result).toBe(expectedValue)
 * ```
 */
export async function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

// ============================================================================
// Test Environment Utilities
// ============================================================================

/**
 * Sets environment variables for the duration of a test.
 * Automatically restores original values after the test.
 *
 * @example
 * ```ts
 * setTestEnv({
 *   NODE_ENV: 'production',
 *   API_KEY: 'test-key'
 * })
 * ```
 */
export function setTestEnv(vars: Record<string, string | undefined>): void {
  const original: Record<string, string | undefined> = {}

  // Store original values
  for (const key of Object.keys(vars)) {
    original[key] = process.env[key]
  }

  // Set new values
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }

  // Restore on cleanup (works with Vitest afterEach)
  if (typeof afterEach !== 'undefined') {
    afterEach(() => {
      for (const [key, value] of Object.entries(original)) {
        if (value === undefined) {
          delete process.env[key]
        } else {
          process.env[key] = value
        }
      }
    })
  }
}

/**
 * Captures console output during test execution.
 *
 * @example
 * ```ts
 * const { logs, errors } = captureConsole()
 * console.log('test message')
 * console.error('test error')
 * expect(logs).toEqual(['test message'])
 * expect(errors).toEqual(['test error'])
 * ```
 */
export function captureConsole() {
  const logs: string[] = []
  const errors: string[] = []
  const warns: string[] = []

  const originalLog = console.log
  const originalError = console.error
  const originalWarn = console.warn

  console.log = vi.fn((...args) => {
    logs.push(args.join(' '))
  })

  console.error = vi.fn((...args) => {
    errors.push(args.join(' '))
  })

  console.warn = vi.fn((...args) => {
    warns.push(args.join(' '))
  })

  // Restore on cleanup
  if (typeof afterEach !== 'undefined') {
    afterEach(() => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    })
  }

  return { logs, errors, warns }
}

// ============================================================================
// Type-safe Test Utilities
// ============================================================================

/**
 * Type guard to check if a value is defined (not null or undefined).
 * Useful for filtering and type narrowing in tests.
 *
 * @example
 * ```ts
 * const items = [1, null, 2, undefined, 3]
 * const defined = items.filter(isDefined) // [1, 2, 3] with type number[]
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Asserts that a value is defined, throwing an error if not.
 * Useful for type narrowing in tests.
 *
 * @example
 * ```ts
 * const user = await getUser()
 * assertDefined(user) // throws if user is null/undefined
 * expect(user.name).toBe('John') // TypeScript knows user is defined
 * ```
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Expected value to be defined',
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message)
  }
}

/**
 * Type-safe mock implementation creator.
 * Ensures mock matches the original function signature.
 *
 * @example
 * ```ts
 * const mockGetUser = createMock<typeof getUser>((id: string) => ({
 *   id,
 *   name: 'Test User'
 * }))
 * ```
 */
export function createMock<T extends (...args: never[]) => unknown>(
  implementation: T,
): Mock<T> {
  return vi.fn(implementation)
}
