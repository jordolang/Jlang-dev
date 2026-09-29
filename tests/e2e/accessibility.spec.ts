import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Audit', () => {
  test('should not have accessibility violations on homepage (desktop)', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Log violations for documentation purposes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== Accessibility Violations (Desktop) ===')
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Help: ${violation.help}`)
        console.log(`Help URL: ${violation.helpUrl}`)
        console.log(`Affected nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. ${node.html}`)
          console.log(`     Target: ${node.target.join(' ')}`)
        })
      })
      console.log('\n======================================\n')
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have accessibility violations on homepage (mobile)', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Log violations for documentation purposes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== Accessibility Violations (Mobile) ===')
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Help: ${violation.help}`)
        console.log(`Help URL: ${violation.helpUrl}`)
        console.log(`Affected nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. ${node.html}`)
          console.log(`     Target: ${node.target.join(' ')}`)
        })
      })
      console.log('\n======================================\n')
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have accessibility violations on homepage (tablet)', async ({
    page,
  }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Log violations for documentation purposes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== Accessibility Violations (Tablet) ===')
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Help: ${violation.help}`)
        console.log(`Help URL: ${violation.helpUrl}`)
        console.log(`Affected nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. ${node.html}`)
          console.log(`     Target: ${node.target.join(' ')}`)
        })
      })
      console.log('\n======================================\n')
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have accessibility violations after scrolling', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll down to load more content
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForTimeout(500)

    // Scroll to bottom to ensure all content is loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Run accessibility scan on fully loaded page
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Log violations for documentation purposes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== Accessibility Violations (After Scroll) ===')
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Help: ${violation.help}`)
        console.log(`Help URL: ${violation.helpUrl}`)
        console.log(`Affected nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. ${node.html}`)
          console.log(`     Target: ${node.target.join(' ')}`)
        })
      })
      console.log('\n======================================\n')
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have valid landmark structure', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for main landmark
    const main = page.locator('main, [role="main"]')
    await expect(main).toBeVisible()

    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]')
    await expect(nav.first()).toBeVisible()

    // Check for footer landmark
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    const footer = page.locator('footer, [role="contentinfo"]')
    await expect(footer).toBeVisible()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that page has an h1
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()

    // Run accessibility scan specifically for heading-order
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['heading-order'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Run accessibility scan specifically for color-contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()

    // Log violations for documentation purposes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== Color Contrast Violations ===')
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Affected nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. ${node.html}`)
          console.log(`     Target: ${node.target.join(' ')}`)
          if (node.any.length > 0) {
            console.log(`     Message: ${node.any[0].message}`)
          }
        })
      })
      console.log('\n======================================\n')
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have accessible images', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll to load all images
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Run accessibility scan specifically for image-alt
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze()

    // Log violations for documentation purposes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== Image Accessibility Violations ===')
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Affected nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. ${node.html}`)
          console.log(`     Target: ${node.target.join(' ')}`)
        })
      })
      console.log('\n======================================\n')
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have accessible forms', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll to load all content including forms
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Run accessibility scan specifically for form-related rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['label', 'form-field-multiple-labels'])
      .analyze()

    // Log violations for documentation purposes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== Form Accessibility Violations ===')
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Affected nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. ${node.html}`)
          console.log(`     Target: ${node.target.join(' ')}`)
        })
      })
      console.log('\n======================================\n')
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have keyboard navigable interactive elements', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Run accessibility scan for keyboard navigation
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['focusable-content', 'focus-order-semantics'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Run accessibility scan for ARIA-related rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules([
        'aria-allowed-attr',
        'aria-required-attr',
        'aria-valid-attr',
        'aria-valid-attr-value',
      ])
      .analyze()

    // Log violations for documentation purposes
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== ARIA Violations ===')
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nRule: ${violation.id}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Affected nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node, index) => {
          console.log(`  ${index + 1}. ${node.html}`)
          console.log(`     Target: ${node.target.join(' ')}`)
        })
      })
      console.log('\n======================================\n')
    }

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
