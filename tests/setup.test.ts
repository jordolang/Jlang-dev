import { describe, it, expect } from 'vitest'

/**
 * Test that verifies the global test setup is working correctly
 */
describe('Test Setup', () => {
  it('should have @testing-library/jest-dom matchers available', () => {
    const element = document.createElement('div')
    element.textContent = 'test'
    document.body.appendChild(element)
    expect(element).toBeInTheDocument()
    element.remove()
  })

  it('should have environment variables configured', () => {
    expect(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID).toBe('test-project-id')
    expect(process.env.NEXT_PUBLIC_SANITY_DATASET).toBe('test')
    expect(process.env.NODE_ENV).toBe('test')
  })

  it('should have localStorage mock', () => {
    localStorage.setItem('test-key', 'test-value')
    expect(localStorage.getItem('test-key')).toBe('test-value')
    localStorage.removeItem('test-key')
    expect(localStorage.getItem('test-key')).toBeNull()
  })

  it('should have sessionStorage mock', () => {
    sessionStorage.setItem('test-key', 'test-value')
    expect(sessionStorage.getItem('test-key')).toBe('test-value')
    sessionStorage.removeItem('test-key')
    expect(sessionStorage.getItem('test-key')).toBeNull()
  })

  it('should have window.matchMedia mock', () => {
    const result = window.matchMedia('(min-width: 768px)')
    expect(result).toBeDefined()
    expect(result.matches).toBe(false)
    expect(result.media).toBe('(min-width: 768px)')
  })

  it('should have IntersectionObserver mock', () => {
    const observer = new IntersectionObserver(() => {})
    expect(observer).toBeDefined()
    expect(typeof observer.observe).toBe('function')
    expect(typeof observer.disconnect).toBe('function')
  })

  it('should have ResizeObserver mock', () => {
    const observer = new ResizeObserver(() => {})
    expect(observer).toBeDefined()
    expect(typeof observer.observe).toBe('function')
    expect(typeof observer.disconnect).toBe('function')
  })

  it('should clear localStorage after each test', () => {
    // This test verifies the afterEach cleanup
    expect(localStorage.length).toBe(0)
  })
})
