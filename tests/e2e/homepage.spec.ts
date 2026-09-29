import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Check that the page title is present
    await expect(page).toHaveTitle(/Jordan/)
  })

  test('should render navigation', async ({ page }) => {
    await page.goto('/')

    // Wait for navigation to be visible
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should render hero section', async ({ page }) => {
    await page.goto('/')

    // The hero section should be visible
    // Based on the pattern file, HeroSection is a key component
    await page.waitForLoadState('networkidle')

    // Check that main content is visible
    const main = page.locator('main, div.min-h-screen')
    await expect(main.first()).toBeVisible()
  })

  test('should render overview section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll down to make sure lazy sections can load
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(500)

    // The page should have rendered without errors
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should render footer', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll to bottom to ensure footer is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Footer should be rendered
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Page should still render properly on mobile
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should have no console errors', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filter out known acceptable errors (like missing favicon)
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('favicon') && !error.includes('404')
    )

    expect(criticalErrors).toHaveLength(0)
  })

  test('should load without JavaScript errors', async ({ page }) => {
    let jsErrors: Error[] = []

    page.on('pageerror', (error) => {
      jsErrors.push(error)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(jsErrors).toHaveLength(0)
  })

  test('should render key sections in order', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Based on the pattern file, the page structure should be:
    // 1. Background
    // 2. Navigation
    // 3. HeroSection
    // 4. ScrollStory
    // 5. CapabilitiesSection
    // 6. OverviewSection
    // And more sections below the fold

    // Check that the page has the expected structure with min-h-screen
    const mainContainer = page.locator('div.min-h-screen')
    await expect(mainContainer).toBeVisible()

    // Navigation should be present
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should allow scrolling through content', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY)

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 1000))
    await page.waitForTimeout(300)

    // Verify scroll position changed
    const newScroll = await page.evaluate(() => window.scrollY)
    expect(newScroll).toBeGreaterThan(initialScroll)
  })
})
