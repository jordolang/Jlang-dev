import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Logger', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Spy on console methods
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Clear module cache to ensure fresh imports with new env
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()

    // Restore console methods
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  describe('logger.error', () => {
    it('should log to console.error in development mode', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { logger } = await import('@/lib/logger')

      logger.error('Test error message')

      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error message')
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })

    it('should log to console.error with context in development mode', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { logger } = await import('@/lib/logger')

      const context = { userId: '123', action: 'submit' }
      logger.error('Test error message', context)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error message', context)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })

    it('should log to console.error with multiple context arguments in development mode', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { logger } = await import('@/lib/logger')

      logger.error('Test error', 'context1', 'context2', { data: 'value' })

      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error', 'context1', 'context2', { data: 'value' })
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })

    it('should not log to console.error in production mode', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      const { logger } = await import('@/lib/logger')

      logger.error('Test error message')

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should not log to console.error with context in production mode', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      const { logger } = await import('@/lib/logger')

      const context = { userId: '123', action: 'submit' }
      logger.error('Test error message', context)

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should log in test environment (not production)', async () => {
      vi.stubEnv('NODE_ENV', 'test')
      const { logger } = await import('@/lib/logger')

      logger.error('Test error message')

      expect(consoleErrorSpy).toHaveBeenCalledWith('Test error message')
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('logger.warn', () => {
    it('should log to console.warn in development mode', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { logger } = await import('@/lib/logger')

      logger.warn('Test warning message')

      expect(consoleWarnSpy).toHaveBeenCalledWith('Test warning message')
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    it('should log to console.warn with context in development mode', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { logger } = await import('@/lib/logger')

      const context = { feature: 'analytics', deprecation: true }
      logger.warn('Test warning message', context)

      expect(consoleWarnSpy).toHaveBeenCalledWith('Test warning message', context)
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    it('should log to console.warn with multiple context arguments in development mode', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { logger } = await import('@/lib/logger')

      logger.warn('Test warning', 'context1', 'context2', { data: 'value' })

      expect(consoleWarnSpy).toHaveBeenCalledWith('Test warning', 'context1', 'context2', { data: 'value' })
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    it('should not log to console.warn in production mode', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      const { logger } = await import('@/lib/logger')

      logger.warn('Test warning message')

      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it('should not log to console.warn with context in production mode', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      const { logger } = await import('@/lib/logger')

      const context = { feature: 'analytics', deprecation: true }
      logger.warn('Test warning message', context)

      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it('should log in test environment (not production)', async () => {
      vi.stubEnv('NODE_ENV', 'test')
      const { logger } = await import('@/lib/logger')

      logger.warn('Test warning message')

      expect(consoleWarnSpy).toHaveBeenCalledWith('Test warning message')
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Production silence', () => {
    it('should remain completely silent in production regardless of multiple calls', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      const { logger } = await import('@/lib/logger')

      logger.error('Error 1')
      logger.error('Error 2', { context: 'data' })
      logger.warn('Warning 1')
      logger.warn('Warning 2', { context: 'data' })

      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })
  })
})
