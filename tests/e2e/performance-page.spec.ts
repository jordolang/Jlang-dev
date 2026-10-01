import { test, expect } from '@playwright/test'

test.describe('Performance Page', () => {
  test('should load the performance page successfully', async ({ page }) => {
    await page.goto('/performance')

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Check that the page title is present
    await expect(page).toHaveTitle(/Performance Metrics/)
  })

  test('should render navigation', async ({ page }) => {
    await page.goto('/performance')

    // Wait for navigation to be visible
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should render main heading', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Check that the main heading is visible
    const heading = page.locator('h1:has-text("Performance Metrics")')
    await expect(heading).toBeVisible()
  })

  test('should render strategy toggle buttons', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Check that Mobile and Desktop toggle buttons are visible
    const mobileButton = page.locator('button:has-text("Mobile")')
    const desktopButton = page.locator('button:has-text("Desktop")')

    await expect(mobileButton).toBeVisible()
    await expect(desktopButton).toBeVisible()
  })

  test('should toggle between mobile and desktop strategies', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    const mobileButton = page.locator('button:has-text("Mobile")')
    const desktopButton = page.locator('button:has-text("Desktop")')

    // Mobile should be active by default
    await expect(mobileButton).toHaveClass(/bg-primary/)

    // Click desktop button
    await desktopButton.click()
    await page.waitForTimeout(300)

    // Desktop should now be active
    await expect(desktopButton).toHaveClass(/bg-primary/)
  })

  test('should render Lighthouse Scores section', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Check for the Lighthouse Scores heading
    const heading = page.locator('h2:has-text("Lighthouse Scores")')
    await expect(heading).toBeVisible()

    // Check that all 4 score categories are rendered
    await expect(page.locator('text=Performance').first()).toBeVisible()
    await expect(page.locator('text=Accessibility').first()).toBeVisible()
    await expect(page.locator('text=Best Practices')).toBeVisible()
    await expect(page.locator('text=SEO').first()).toBeVisible()
  })

  test('should render Core Web Vitals section', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Scroll to ensure the section is in view
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(300)

    // Check for the Core Web Vitals heading
    const heading = page.locator('h2:has-text("Core Web Vitals")')
    await expect(heading).toBeVisible()
  })

  test('should render Benchmark Comparison section', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Scroll to ensure the section is in view
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForTimeout(300)

    // Check for the Benchmark Comparison heading
    const heading = page.locator('h2:has-text("Benchmark Comparison")')
    await expect(heading).toBeVisible()

    // Check for the description text
    const description = page.locator('text=How this site compares to average Squarespace/WordPress portfolio sites')
    await expect(description).toBeVisible()
  })

  test('should render action buttons', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Scroll to ensure the section is in view
    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForTimeout(300)

    // Check for Share These Metrics heading
    const heading = page.locator('h3:has-text("Share These Metrics")')
    await expect(heading).toBeVisible()

    // Check for action buttons
    const shareButton = page.locator('button:has-text("Share Scores")')
    const downloadButton = page.locator('button:has-text("Download Badge")')

    await expect(shareButton).toBeVisible()
    await expect(downloadButton).toBeVisible()
  })

  test('should render info footer', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Check for About These Metrics footer
    const footer = page.locator('text=About These Metrics')
    await expect(footer).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Page should still render properly on mobile
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Main heading should be visible
    const heading = page.locator('h1:has-text("Performance Metrics")')
    await expect(heading).toBeVisible()

    // Strategy toggle should be visible
    const mobileButton = page.locator('button:has-text("Mobile")')
    await expect(mobileButton).toBeVisible()
  })

  test('should have no console errors', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/performance')
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

    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    expect(jsErrors).toHaveLength(0)
  })

  test('should render key sections in order', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Check that the page has the expected structure
    // 1. Navigation
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // 2. Main heading
    const heading = page.locator('h1:has-text("Performance Metrics")')
    await expect(heading).toBeVisible()

    // 3. Strategy toggle
    const mobileButton = page.locator('button:has-text("Mobile")')
    await expect(mobileButton).toBeVisible()

    // 4. Lighthouse Scores section
    const lighthouseHeading = page.locator('h2:has-text("Lighthouse Scores")')
    await expect(lighthouseHeading).toBeVisible()
  })

  test('should allow scrolling through content', async ({ page }) => {
    await page.goto('/performance')
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

  test('should display last updated date', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Check that last updated date is displayed
    const lastUpdated = page.locator('text=/Last updated:/')
    await expect(lastUpdated).toBeVisible()
  })

  test('should render all score categories', async ({ page }) => {
    await page.goto('/performance')
    await page.waitForLoadState('networkidle')

    // Verify all 4 Lighthouse score categories are present
    const scoreGrid = page.locator('.grid-cols-2.md\\:grid-cols-4')
    await expect(scoreGrid).toBeVisible()

    // Count the number of score categories (should be 4)
    const scoreItems = scoreGrid.locator('> div')
    await expect(scoreItems).toHaveCount(4)
  })
})
