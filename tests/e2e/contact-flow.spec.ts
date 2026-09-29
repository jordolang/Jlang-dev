import { test, expect } from '@playwright/test'

test.describe('Contact/Review Form Flow', () => {
  test('should display unavailable message for invalid token', async ({ page }) => {
    await page.goto('/review/invalid-token-123')
    await page.waitForLoadState('networkidle')

    // Check for unavailable message
    const heading = page.locator('h1', { hasText: 'This review link is unavailable' })
    await expect(heading).toBeVisible()

    // Check for explanation text
    const explanation = page.locator('text=/already been used|expired/')
    await expect(explanation).toBeVisible()

    // Check for back link
    const backLink = page.locator('a', { hasText: 'JLang Development' })
    await expect(backLink).toBeVisible()
  })

  test('should render review form with client details', async ({ page }) => {
    // Mock the review request data
    await page.route('**/api/reviews/**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            _id: 'test-review-request',
            token: 'valid-token-123',
            clientName: 'John Doe',
            company: 'Test Company',
            role: 'CTO',
            status: 'pending'
          })
        })
      }
    })

    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Check for main heading
    const heading = page.locator('h1', { hasText: 'Share your experience' })
    await expect(heading).toBeVisible()

    // Check for client details sections
    const nameSection = page.locator('text=John Doe')
    await expect(nameSection).toBeVisible()

    const companySection = page.locator('text=Test Company')
    await expect(companySection).toBeVisible()

    const roleSection = page.locator('text=CTO')
    await expect(roleSection).toBeVisible()

    // Check for review textarea
    const reviewTextarea = page.locator('textarea#review')
    await expect(reviewTextarea).toBeVisible()
    await expect(reviewTextarea).toHaveAttribute('placeholder', /Tell others what it was like/)

    // Check for star rating section
    const ratingLegend = page.locator('legend', { hasText: 'Your rating' })
    await expect(ratingLegend).toBeVisible()

    // Check for all 5 star buttons
    const starButtons = page.locator('button[aria-label*="star"]')
    await expect(starButtons).toHaveCount(5)

    // Check for submit button
    const submitButton = page.locator('button[type="submit"]', { hasText: 'Submit review' })
    await expect(submitButton).toBeVisible()
  })

  test('should show validation error for empty review', async ({ page }) => {
    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Try to submit without filling anything
    const submitButton = page.locator('button[type="submit"]', { hasText: 'Submit review' })
    await submitButton.click()

    // Wait for error message
    await page.waitForTimeout(300)

    // Check for error message
    const errorMessage = page.locator('text=/Please write a little about your experience/')
    await expect(errorMessage).toBeVisible()
  })

  test('should show validation error for short review', async ({ page }) => {
    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Fill in a very short review
    const reviewTextarea = page.locator('textarea#review')
    await reviewTextarea.fill('Too short')

    // Try to submit
    const submitButton = page.locator('button[type="submit"]', { hasText: 'Submit review' })
    await submitButton.click()

    // Wait for error message
    await page.waitForTimeout(300)

    // Check for error message
    const errorMessage = page.locator('text=/Please write a little about your experience/')
    await expect(errorMessage).toBeVisible()
  })

  test('should show validation error when rating is missing', async ({ page }) => {
    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Fill in a valid review but no rating
    const reviewTextarea = page.locator('textarea#review')
    await reviewTextarea.fill('This is a detailed review with more than ten characters.')

    // Try to submit
    const submitButton = page.locator('button[type="submit"]', { hasText: 'Submit review' })
    await submitButton.click()

    // Wait for error message
    await page.waitForTimeout(300)

    // Check for error message
    const errorMessage = page.locator('text=/select a star rating/')
    await expect(errorMessage).toBeVisible()
  })

  test('should allow selecting star rating', async ({ page }) => {
    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Click on 4-star rating
    const fourStarButton = page.locator('button[aria-label="4 stars"]')
    await fourStarButton.click()

    // Check that the button is pressed
    await expect(fourStarButton).toHaveAttribute('aria-pressed', 'true')

    // Stars 1-4 should be filled (yellow)
    for (let i = 1; i <= 4; i++) {
      const starButton = page.locator(`button[aria-label="${i} star${i === 1 ? '' : 's'}"]`)
      await expect(starButton).toHaveClass(/text-yellow-400/)
    }

    // Star 5 should not be filled
    const fiveStarButton = page.locator('button[aria-label="5 stars"]')
    await expect(fiveStarButton).toHaveClass(/text-gray/)
  })

  test('should show hover effect on star rating', async ({ page }) => {
    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Hover over 3-star rating
    const threeStarButton = page.locator('button[aria-label="3 stars"]')
    await threeStarButton.hover()

    // Wait for hover effect
    await page.waitForTimeout(200)

    // Stars 1-3 should be highlighted
    for (let i = 1; i <= 3; i++) {
      const starButton = page.locator(`button[aria-label="${i} star${i === 1 ? '' : 's'}"]`)
      await expect(starButton).toHaveClass(/text-yellow-400/)
    }
  })

  test('should successfully submit a valid review', async ({ page }) => {
    // Mock the API submission
    await page.route('**/api/reviews/submit', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON()

        // Validate the submission
        if (postData.content && postData.content.length >= 10 && postData.rating > 0) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              ok: true,
              googleReviewUrl: 'https://g.page/r/example/review'
            })
          })
        } else {
          await route.fulfill({
            status: 400,
            body: JSON.stringify({
              error: 'Please provide a review and select a rating.'
            })
          })
        }
      }
    })

    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Fill in the review
    const reviewTextarea = page.locator('textarea#review')
    await reviewTextarea.fill('Jordan was amazing to work with! The project was delivered on time and exceeded expectations.')

    // Select 5-star rating
    const fiveStarButton = page.locator('button[aria-label="5 stars"]')
    await fiveStarButton.click()

    // Submit the form
    const submitButton = page.locator('button[type="submit"]', { hasText: 'Submit review' })
    await submitButton.click()

    // Wait for success message
    await page.waitForTimeout(500)

    // Check for success heading
    const successHeading = page.locator('h1', { hasText: 'Thank you' })
    await expect(successHeading).toBeVisible()

    // Check for confirmation message
    const confirmationMessage = page.locator('text=/testimonial score/')
    await expect(confirmationMessage).toBeVisible()

    // Check for Google review link
    const googleReviewLink = page.locator('a', { hasText: 'Also share your review on Google' })
    await expect(googleReviewLink).toBeVisible()
    await expect(googleReviewLink).toHaveAttribute('href', 'https://g.page/r/example/review')
    await expect(googleReviewLink).toHaveAttribute('target', '_blank')
  })

  test('should show success without Google review URL', async ({ page }) => {
    // Mock the API submission without Google URL
    await page.route('**/api/reviews/submit', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            ok: true,
            googleReviewUrl: ''
          })
        })
      }
    })

    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Fill in the review
    const reviewTextarea = page.locator('textarea#review')
    await reviewTextarea.fill('Great experience working with Jordan!')

    // Select 4-star rating
    const fourStarButton = page.locator('button[aria-label="4 stars"]')
    await fourStarButton.click()

    // Submit the form
    const submitButton = page.locator('button[type="submit"]', { hasText: 'Submit review' })
    await submitButton.click()

    // Wait for success message
    await page.waitForTimeout(500)

    // Check for success heading
    const successHeading = page.locator('h1', { hasText: 'Thank you' })
    await expect(successHeading).toBeVisible()

    // Google review link should not be visible
    const googleReviewLink = page.locator('a', { hasText: 'Also share your review on Google' })
    await expect(googleReviewLink).not.toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock the API to return an error
    await page.route('**/api/reviews/submit', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          body: JSON.stringify({
            error: 'This review link is invalid or has already been used.'
          })
        })
      }
    })

    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Fill in the review
    const reviewTextarea = page.locator('textarea#review')
    await reviewTextarea.fill('This is a valid review with enough characters.')

    // Select 5-star rating
    const fiveStarButton = page.locator('button[aria-label="5 stars"]')
    await fiveStarButton.click()

    // Submit the form
    const submitButton = page.locator('button[type="submit"]', { hasText: 'Submit review' })
    await submitButton.click()

    // Wait for error message
    await page.waitForTimeout(500)

    // Check for error message
    const errorMessage = page.locator('text=/invalid or has already been used/')
    await expect(errorMessage).toBeVisible()

    // Form should still be visible (not replaced by success message)
    await expect(reviewTextarea).toBeVisible()
  })

  test('should disable submit button while submitting', async ({ page }) => {
    // Mock a slow API response
    await page.route('**/api/reviews/submit', async (route) => {
      // Delay the response
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ ok: true, googleReviewUrl: '' })
      })
    })

    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Fill in the review
    const reviewTextarea = page.locator('textarea#review')
    await reviewTextarea.fill('A comprehensive review of the excellent service provided.')

    // Select rating
    const fiveStarButton = page.locator('button[aria-label="5 stars"]')
    await fiveStarButton.click()

    // Submit the form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Button should show "Submitting…" and be disabled
    await expect(submitButton).toHaveText('Submitting…')
    await expect(submitButton).toBeDisabled()

    // Wait for submission to complete
    await page.waitForTimeout(1500)

    // Success message should be visible
    const successHeading = page.locator('h1', { hasText: 'Thank you' })
    await expect(successHeading).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Form should render properly on mobile
    const heading = page.locator('h1', { hasText: 'Share your experience' })
    await expect(heading).toBeVisible()

    // Review textarea should be visible
    const reviewTextarea = page.locator('textarea#review')
    await expect(reviewTextarea).toBeVisible()

    // Star rating should be visible
    const starButtons = page.locator('button[aria-label*="star"]')
    await expect(starButtons.first()).toBeVisible()

    // Submit button should be visible
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('should have no console errors on review page', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('favicon') && !error.includes('404')
    )

    expect(criticalErrors).toHaveLength(0)
  })

  test('should have no JavaScript errors on review page', async ({ page }) => {
    let jsErrors: Error[] = []

    page.on('pageerror', (error) => {
      jsErrors.push(error)
    })

    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    expect(jsErrors).toHaveLength(0)
  })

  test('should respect textarea maxLength', async ({ page }) => {
    await page.goto('/review/valid-token-123')
    await page.waitForLoadState('networkidle')

    const reviewTextarea = page.locator('textarea#review')

    // Check maxLength attribute
    await expect(reviewTextarea).toHaveAttribute('maxlength', '3000')

    // Try to type more than maxLength (browser should prevent this)
    const longText = 'A'.repeat(3500)
    await reviewTextarea.fill(longText)

    // Value should be truncated to maxLength
    const actualValue = await reviewTextarea.inputValue()
    expect(actualValue.length).toBeLessThanOrEqual(3000)
  })

  test('should navigate back to homepage from review page', async ({ page }) => {
    await page.goto('/review/invalid-token-123')
    await page.waitForLoadState('networkidle')

    // Click the back link
    const backLink = page.locator('a', { hasText: 'JLang Development' })
    await backLink.click()
    await page.waitForLoadState('networkidle')

    // Should navigate to homepage
    await expect(page).toHaveURL('/')
  })
})
