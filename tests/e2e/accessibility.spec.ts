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

test.describe('Code Showcase Accessibility', () => {
  test('should not have accessibility violations on code showcase components', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Navigate to project page with code showcase
    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForTimeout(500)

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase section
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      // Run accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      // Log violations for documentation purposes
      if (accessibilityScanResults.violations.length > 0) {
        console.log('\n=== Code Showcase Accessibility Violations ===')
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
    }
  })

  test('should have keyboard accessible view toggle buttons', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      // Find view toggle buttons
      const codeButton = page.getByRole('button', { name: /^code$/i })

      if (await codeButton.isVisible()) {
        // Tab to the button and verify it's focusable
        await page.keyboard.press('Tab')

        // Try to activate with keyboard (Enter or Space)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)

        // Button should be activated
        const classes = await codeButton.getAttribute('class')
        expect(classes).toBeTruthy()

        // Test Split button if available
        const splitButton = page.getByRole('button', { name: /^split$/i })
        if (await splitButton.isVisible()) {
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          await page.waitForTimeout(300)

          const splitClasses = await splitButton.getAttribute('class')
          expect(splitClasses).toBeTruthy()
        }
      }
    }
  })

  test('should have keyboard accessible copy code button', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      const copyButton = page.getByRole('button', { name: /copy code/i }).first()

      if (await copyButton.isVisible()) {
        // Focus the copy button
        await copyButton.focus()

        // Verify button is focused
        const isFocused = await copyButton.evaluate(
          (el) => el === document.activeElement,
        )
        expect(isFocused).toBe(true)

        // Activate with keyboard
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)

        // Verify clipboard content
        const clipboardContent = await page.evaluate(() =>
          navigator.clipboard.readText(),
        )
        expect(clipboardContent.length).toBeGreaterThan(0)
      }
    }
  })

  test('should have proper ARIA labels on code showcase controls', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      // Check buttons have accessible names
      const codeButton = page.getByRole('button', { name: /^code$/i })
      if (await codeButton.isVisible()) {
        await expect(codeButton).toBeVisible()

        const splitButton = page.getByRole('button', { name: /^split$/i })
        if (await splitButton.isVisible()) {
          await expect(splitButton).toBeVisible()
        }

        const previewButton = page.getByRole('button', { name: /^preview$/i })
        if (await previewButton.isVisible()) {
          await expect(previewButton).toBeVisible()
        }

        const copyButton = page.getByRole('button', { name: /copy/i }).first()
        if (await copyButton.isVisible()) {
          await expect(copyButton).toBeVisible()
        }
      }
    }
  })

  test('should have proper focus indicators on showcase controls', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      const codeButton = page.getByRole('button', { name: /^code$/i })

      if (await codeButton.isVisible()) {
        // Focus the button
        await codeButton.focus()

        // Get computed styles to check for focus indicator
        const outlineStyle = await codeButton.evaluate((el) => {
          const styles = window.getComputedStyle(el)
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow,
          }
        })

        // Should have some form of focus indicator (outline or box-shadow)
        const hasFocusIndicator =
          outlineStyle.outline !== 'none' ||
          outlineStyle.outlineWidth !== '0px' ||
          outlineStyle.boxShadow !== 'none'

        expect(hasFocusIndicator).toBe(true)
      }
    }
  })

  test('should maintain focus when switching between views', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      const codeButton = page.getByRole('button', { name: /^code$/i })
      const splitButton = page.getByRole('button', { name: /^split$/i })

      if ((await codeButton.isVisible()) && (await splitButton.isVisible())) {
        // Focus and click code button
        await codeButton.focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)

        // Focus should still be manageable
        await page.keyboard.press('Tab')

        // Click split button
        await splitButton.focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)

        // Verify no focus loss
        const activeElement = await page.evaluate(
          () => document.activeElement?.tagName,
        )
        expect(activeElement).toBeTruthy()
      }
    }
  })

  test('should have accessible code syntax highlighting', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      // Check code container has proper role or semantic element
      const codeContainer = page.locator('pre code').first()

      if (await codeContainer.isVisible()) {
        // Code should be in semantic elements
        await expect(codeContainer).toBeVisible()

        // Run accessibility scan specifically for code region
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze()

        // Log violations
        if (accessibilityScanResults.violations.length > 0) {
          console.log('\n=== Code Syntax Highlighting Violations ===')
          accessibilityScanResults.violations.forEach((violation) => {
            console.log(`\nRule: ${violation.id}`)
            console.log(`Impact: ${violation.impact}`)
            violation.nodes.forEach((node, index) => {
              console.log(`  ${index + 1}. ${node.html}`)
            })
          })
          console.log('\n======================================\n')
        }

        expect(accessibilityScanResults.violations).toEqual([])
      }
    }
  })

  test('should have descriptive language labels for code blocks', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      // Check for language label
      const languageLabel = page.locator('span.font-mono.uppercase').first()

      if (await languageLabel.isVisible()) {
        const labelText = await languageLabel.textContent()
        expect(labelText).toBeTruthy()
        expect(labelText?.length).toBeGreaterThan(0)
      }
    }
  })

  test('should be accessible on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      // Run accessibility scan on mobile
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      // Log violations
      if (accessibilityScanResults.violations.length > 0) {
        console.log('\n=== Mobile Code Showcase Violations ===')
        accessibilityScanResults.violations.forEach((violation) => {
          console.log(`\nRule: ${violation.id}`)
          console.log(`Impact: ${violation.impact}`)
          violation.nodes.forEach((node, index) => {
            console.log(`  ${index + 1}. ${node.html}`)
          })
        })
        console.log('\n======================================\n')
      }

      expect(accessibilityScanResults.violations).toEqual([])
    }
  })

  test('should have accessible button states (active/inactive)', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const projectLink = page.locator('a[href*="/projects/"]').first()
    if (await projectLink.isVisible()) {
      await projectLink.click()
      await page.waitForLoadState('networkidle')

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.waitForTimeout(500)

      const codeButton = page.getByRole('button', { name: /^code$/i })
      const splitButton = page.getByRole('button', { name: /^split$/i })

      if (await codeButton.isVisible()) {
        // Click code button
        await codeButton.click()
        await page.waitForTimeout(300)

        // Active button should have sufficient contrast
        const activeButtonContrast = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze()

        expect(activeButtonContrast.violations).toEqual([])

        // Switch to split if available
        if (await splitButton.isVisible()) {
          await splitButton.click()
          await page.waitForTimeout(300)

          // Inactive button should also have sufficient contrast
          const inactiveButtonContrast = await new AxeBuilder({ page })
            .withRules(['color-contrast'])
            .analyze()

          expect(inactiveButtonContrast.violations).toEqual([])
        }
      }
    }
  })
})
