import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import posthog from 'posthog-js'

// Mock the logger
vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
  },
}))

// posthog-js default export is a getter so tests can simulate an uninitialized client
const posthogState = vi.hoisted(() => ({ initialized: true }))

vi.mock('posthog-js', () => {
  const client = {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn(),
    get_distinct_id: vi.fn(() => 'test-distinct-id'),
    get_session_id: vi.fn(() => 'test-session-id'),
    isFeatureEnabled: vi.fn(() => false),
  }
  return {
    get default() {
      return posthogState.initialized ? client : null
    },
  }
})

describe('Analytics Library', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    posthogState.initialized = true
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('generateVisitorId', () => {
    it('should generate a new visitor ID if none exists', async () => {
      const { generateVisitorId } = await import('@/lib/analytics')
      const visitorId = generateVisitorId()

      expect(visitorId).toMatch(/^visitor_\d+_[a-z0-9]+$/)
      expect(localStorage.getItem('portfolio_visitor_id')).toBe(visitorId)
    })

    it('should return existing visitor ID from localStorage', async () => {
      const existingId = 'visitor_1234567890_abc123'
      localStorage.setItem('portfolio_visitor_id', existingId)

      const { generateVisitorId } = await import('@/lib/analytics')
      const visitorId = generateVisitorId()

      expect(visitorId).toBe(existingId)
    })

    it('should return empty string in non-browser environment', async () => {
      // Save original window
      const originalWindow = global.window

      // Remove window to simulate server-side
      // @ts-expect-error - Testing server-side behavior
      delete global.window

      const { generateVisitorId } = await import('@/lib/analytics')
      const visitorId = generateVisitorId()

      expect(visitorId).toBe('')

      // Restore window
      global.window = originalWindow
    })
  })

  describe('initializeVisitorTracking', () => {
    it('should generate and set visitor ID in PostHog', async () => {
      vi.mocked(posthog.get_distinct_id).mockReturnValue(null as never)

      const { initializeVisitorTracking } = await import('@/lib/analytics')
      initializeVisitorTracking()

      expect(localStorage.getItem('portfolio_visitor_id')).toMatch(/^visitor_\d+_[a-z0-9]+$/)
      expect(posthog.identify).toHaveBeenCalledWith(
        expect.stringMatching(/^visitor_\d+_[a-z0-9]+$/)
      )
    })

    it('should not identify if PostHog already has a distinct ID', async () => {
      vi.mocked(posthog.get_distinct_id).mockReturnValue('existing-id')

      const { initializeVisitorTracking } = await import('@/lib/analytics')
      initializeVisitorTracking()

      expect(posthog.identify).not.toHaveBeenCalled()
    })

    it('should do nothing in non-browser environment', async () => {
      // Save original window
      const originalWindow = global.window

      // Remove window to simulate server-side
      // @ts-expect-error - Testing server-side behavior
      delete global.window

      const { initializeVisitorTracking } = await import('@/lib/analytics')
      initializeVisitorTracking()

      expect(posthog.identify).not.toHaveBeenCalled()

      // Restore window
      global.window = originalWindow
    })
  })

  describe('identifyUser', () => {
    it('should identify user with email and name', async () => {
      const visitorId = 'visitor_1234567890_abc123'
      localStorage.setItem('portfolio_visitor_id', visitorId)

      const { identifyUser } = await import('@/lib/analytics')
      identifyUser('test@example.com', 'Test User')

      expect(posthog.identify).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
          first_contact_date: expect.any(String),
          visitor_id: visitorId,
        })
      )

      expect(posthog.capture).toHaveBeenCalledWith(
        'contact_form_submitted',
        expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
          submission_date: expect.any(String),
        })
      )
    })

    it('should include additional properties when provided', async () => {
      const { identifyUser } = await import('@/lib/analytics')
      identifyUser('test@example.com', 'Test User', {
        company: 'ACME Corp',
        role: 'Developer',
      })

      expect(posthog.identify).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
          company: 'ACME Corp',
          role: 'Developer',
        })
      )
    })

    it('should warn and return early if PostHog is not initialized', async () => {
      posthogState.initialized = false

      const { logger } = await import('@/lib/logger')
      const { identifyUser } = await import('@/lib/analytics')

      identifyUser('test@example.com', 'Test User')

      expect(logger.warn).toHaveBeenCalledWith('PostHog not initialized')
    })
  })

  describe('trackEvent', () => {
    it('should track event with properties', async () => {
      const { trackEvent } = await import('@/lib/analytics')
      trackEvent('button_clicked', {
        button_name: 'Sign Up',
        page: 'home',
      })

      expect(posthog.capture).toHaveBeenCalledWith(
        'button_clicked',
        expect.objectContaining({
          button_name: 'Sign Up',
          page: 'home',
          timestamp: expect.any(String),
        })
      )
    })

    it('should track event without properties', async () => {
      const { trackEvent } = await import('@/lib/analytics')
      trackEvent('page_viewed')

      expect(posthog.capture).toHaveBeenCalledWith(
        'page_viewed',
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      )
    })

    it('should include ISO 8601 timestamp', async () => {
      const { trackEvent } = await import('@/lib/analytics')
      trackEvent('test_event')

      const captureCall = vi.mocked(posthog.capture).mock.calls[0]
      const properties = captureCall[1]

      expect(properties?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })

    it('should warn and return early if PostHog is not initialized', async () => {
      posthogState.initialized = false

      const { logger } = await import('@/lib/logger')
      const { trackEvent } = await import('@/lib/analytics')

      trackEvent('test_event')

      expect(logger.warn).toHaveBeenCalledWith('PostHog not initialized')
    })
  })

  describe('resetIdentification', () => {
    it('should reset PostHog and reinitialize tracking', async () => {
      const existingId = 'visitor_1234567890_abc123'
      localStorage.setItem('portfolio_visitor_id', existingId)

      vi.mocked(posthog.get_distinct_id).mockReturnValue(null as never)

      const { resetIdentification } = await import('@/lib/analytics')
      resetIdentification()

      expect(posthog.reset).toHaveBeenCalled()
      expect(localStorage.getItem('portfolio_visitor_id')).not.toBe(existingId)
      expect(localStorage.getItem('portfolio_visitor_id')).toMatch(/^visitor_\d+_[a-z0-9]+$/)
    })

    it('should warn and return early if PostHog is not initialized', async () => {
      posthogState.initialized = false

      const { logger } = await import('@/lib/logger')
      const { resetIdentification } = await import('@/lib/analytics')

      resetIdentification()

      expect(logger.warn).toHaveBeenCalledWith('PostHog not initialized')
    })
  })

  describe('getCurrentUserProperties', () => {
    it('should return user properties when PostHog is initialized', async () => {
      const visitorId = 'visitor_1234567890_abc123'
      localStorage.setItem('portfolio_visitor_id', visitorId)

      vi.mocked(posthog.get_distinct_id).mockReturnValue('user@example.com')
      vi.mocked(posthog.get_session_id).mockReturnValue('session-123')

      const { getCurrentUserProperties } = await import('@/lib/analytics')
      const properties = getCurrentUserProperties()

      expect(properties).toEqual({
        distinct_id: 'user@example.com',
        visitor_id: visitorId,
        session_id: 'session-123',
      })
    })

    it('should return null if PostHog is not initialized', async () => {
      posthogState.initialized = false

      const { getCurrentUserProperties } = await import('@/lib/analytics')
      const properties = getCurrentUserProperties()

      expect(properties).toBeNull()
    })

    it('should generate visitor ID if not present', async () => {
      vi.mocked(posthog.get_distinct_id).mockReturnValue('test-id')
      vi.mocked(posthog.get_session_id).mockReturnValue('session-456')

      const { getCurrentUserProperties } = await import('@/lib/analytics')
      const properties = getCurrentUserProperties()

      expect(properties?.visitor_id).toMatch(/^visitor_\d+_[a-z0-9]+$/)
      expect(localStorage.getItem('portfolio_visitor_id')).toBe(properties?.visitor_id)
    })
  })

  describe('AnalyticsEvents', () => {
    it('should export all expected event constants', async () => {
      const { AnalyticsEvents } = await import('@/lib/analytics')

      expect(AnalyticsEvents.NAVIGATION_CLICKED).toBe('navigation_clicked')
      expect(AnalyticsEvents.SECTION_VIEWED).toBe('section_viewed')
      expect(AnalyticsEvents.PROJECT_CLICKED).toBe('project_clicked')
      expect(AnalyticsEvents.PROJECT_VIEWED).toBe('project_viewed')
      expect(AnalyticsEvents.PROJECT_LINK_CLICKED).toBe('project_link_clicked')
      expect(AnalyticsEvents.CONTACT_FORM_OPENED).toBe('contact_form_opened')
      expect(AnalyticsEvents.CONTACT_FORM_SUBMITTED).toBe('contact_form_submitted')
      expect(AnalyticsEvents.SOCIAL_LINK_CLICKED).toBe('social_link_clicked')
      expect(AnalyticsEvents.SECTION_TIME_SPENT).toBe('section_time_spent')
      expect(AnalyticsEvents.SCROLL_DEPTH).toBe('scroll_depth')
      expect(AnalyticsEvents.PRICING_CTA_CLICKED).toBe('pricing_cta_clicked')
      expect(AnalyticsEvents.FAQ_TOGGLED).toBe('faq_toggled')
      expect(AnalyticsEvents.PACKAGE_SELECTED).toBe('package_selected')
      expect(AnalyticsEvents.SERVICE_ORDER_SUBMITTED).toBe('service_order_submitted')
      expect(AnalyticsEvents.FEATURE_CLICKED).toBe('feature_clicked')
      expect(AnalyticsEvents.FEATURE_ADDED).toBe('feature_added')
      expect(AnalyticsEvents.FEATURE_REMOVED).toBe('feature_removed')
      expect(AnalyticsEvents.FEATURE_TOGGLED).toBe('feature_toggled')
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete user journey', async () => {
      vi.mocked(posthog.get_distinct_id).mockReturnValue(null as never)

      const {
        initializeVisitorTracking,
        trackEvent,
        identifyUser,
        getCurrentUserProperties,
        resetIdentification,
      } = await import('@/lib/analytics')

      // Step 1: Initialize anonymous tracking
      initializeVisitorTracking()
      expect(posthog.identify).toHaveBeenCalledWith(
        expect.stringMatching(/^visitor_\d+_[a-z0-9]+$/)
      )

      // Step 2: Track anonymous events
      trackEvent('page_viewed', { page: 'home' })
      expect(posthog.capture).toHaveBeenCalledWith(
        'page_viewed',
        expect.objectContaining({ page: 'home' })
      )

      // Step 3: User submits contact form
      identifyUser('user@example.com', 'John Doe')
      expect(posthog.identify).toHaveBeenCalledWith(
        'user@example.com',
        expect.objectContaining({
          email: 'user@example.com',
          name: 'John Doe',
        })
      )

      // Step 4: Get user properties
      vi.mocked(posthog.get_distinct_id).mockReturnValue('user@example.com')
      vi.mocked(posthog.get_session_id).mockReturnValue('session-123')
      const properties = getCurrentUserProperties()
      expect(properties?.distinct_id).toBe('user@example.com')

      // Step 5: Reset identification
      vi.mocked(posthog.get_distinct_id).mockReturnValue(null as never)
      resetIdentification()
      expect(posthog.reset).toHaveBeenCalled()
    })

    it('should persist visitor ID across multiple sessions', async () => {
      const { generateVisitorId, initializeVisitorTracking } = await import('@/lib/analytics')

      // First session
      const visitorId1 = generateVisitorId()
      expect(localStorage.getItem('portfolio_visitor_id')).toBe(visitorId1)

      // Clear mocks but not localStorage
      vi.clearAllMocks()

      // Second session (same browser)
      const visitorId2 = generateVisitorId()
      expect(visitorId2).toBe(visitorId1)

      // Initialize tracking should use same ID
      vi.mocked(posthog.get_distinct_id).mockReturnValue(null as never)
      initializeVisitorTracking()
      expect(posthog.identify).toHaveBeenCalledWith(visitorId1)
    })
  })
})
