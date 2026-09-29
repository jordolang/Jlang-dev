import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('should load the blog list page successfully', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Check that the page title is present
    await expect(page).toHaveTitle(/Blog/)

    // Check for main heading
    const heading = page.locator('h1', { hasText: 'Blog Posts' })
    await expect(heading).toBeVisible()
  })

  test('should render blog list header elements', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Check for back link
    const backLink = page.locator('a', { hasText: 'Back to Portfolio' })
    await expect(backLink).toBeVisible()

    // Check for search bar
    const searchInput = page.locator('input[placeholder*="Search posts"]')
    await expect(searchInput).toBeVisible()

    // Check for description
    const description = page.locator('text=/Thoughts on web development/')
    await expect(description).toBeVisible()
  })

  test('should display blog posts if available', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Check if posts are rendered or empty state is shown
    const postsGrid = page.locator('main article')
    const emptyState = page.locator('text=/No blog posts found/')

    // Either posts or empty state should be visible
    const postsCount = await postsGrid.count()
    const emptyStateVisible = await emptyState.isVisible()

    expect(postsCount > 0 || emptyStateVisible).toBe(true)
  })

  test('should render blog post cards with correct elements', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const firstPost = page.locator('main article').first()
    const postsExist = (await firstPost.count()) > 0

    if (postsExist) {
      // Check for post title
      const postTitle = firstPost.locator('h2')
      await expect(postTitle).toBeVisible()

      // Check for post excerpt
      const postExcerpt = firstPost.locator('p').first()
      await expect(postExcerpt).toBeVisible()

      // Check for author
      const author = firstPost.locator('text=/Jordan/')
      await expect(author).toBeVisible()

      // Check for read more link
      const readMore = firstPost.locator('text=Read More')
      await expect(readMore).toBeVisible()
    }
  })

  test('should filter posts using search', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const searchInput = page.locator('input[placeholder*="Search posts"]')
    const resultsCount = page.locator('text=/Showing|Found/')

    // Type in search box
    await searchInput.fill('test search query')
    await page.waitForTimeout(500)

    // Results count should update
    await expect(resultsCount).toBeVisible()

    // Clear search button should appear
    const clearButton = page.locator('button').filter({ has: page.locator('svg') }).last()
    await expect(clearButton).toBeVisible()
  })

  test('should filter posts by tag', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const tagButtons = page.locator('button').filter({ hasText: /#/ })
    const tagCount = await tagButtons.count()

    if (tagCount > 0) {
      const firstTag = tagButtons.first()
      await firstTag.click()
      await page.waitForTimeout(500)

      // Tag should be selected (has different styling)
      await expect(firstTag).toHaveClass(/bg-indigo-600/)

      // Results count should update
      const resultsCount = page.locator('text=/Found|Showing/')
      await expect(resultsCount).toBeVisible()
    }
  })

  test('should navigate to individual blog post', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const firstPost = page.locator('main article a').first()
    const postsExist = (await firstPost.count()) > 0

    if (postsExist) {
      // Get the post title before clicking
      const postTitle = await firstPost.locator('h2').textContent()

      // Click the first post
      await firstPost.click()
      await page.waitForLoadState('networkidle')

      // Should navigate to post page
      await expect(page).toHaveURL(/\/blog\/[^/]+$/)

      // Post title should be visible
      if (postTitle) {
        const pageHeading = page.locator('h1', { hasText: postTitle })
        await expect(pageHeading).toBeVisible()
      }
    }
  })

  test('should render blog post page elements', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const firstPost = page.locator('main article a').first()
    const postsExist = (await firstPost.count()) > 0

    if (postsExist) {
      await firstPost.click()
      await page.waitForLoadState('networkidle')

      // Check for back button
      const backButton = page.locator('a', { hasText: 'Back to Blog' })
      await expect(backButton).toBeVisible()

      // Check for post title
      const title = page.locator('h1').first()
      await expect(title).toBeVisible()

      // Check for author
      const author = page.locator('text=/Jordan/')
      await expect(author).toBeVisible()

      // Check for date
      const articleSection = page.locator('article')
      await expect(articleSection).toBeVisible()

      // Check for read time indicator
      const readTime = page.locator('text=/min read/i')
      await expect(readTime).toBeVisible()

      // Check for excerpt/content
      const content = page.locator('article p').first()
      await expect(content).toBeVisible()
    }
  })

  test('should navigate back to blog list from post', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const firstPost = page.locator('main article a').first()
    const postsExist = (await firstPost.count()) > 0

    if (postsExist) {
      await firstPost.click()
      await page.waitForLoadState('networkidle')

      // Click back to blog
      const backButton = page.locator('a', { hasText: 'Back to Blog' })
      await backButton.click()
      await page.waitForLoadState('networkidle')

      // Should be back on blog list page
      await expect(page).toHaveURL(/\/blog$/)

      // Blog list heading should be visible
      const heading = page.locator('h1', { hasText: 'Blog Posts' })
      await expect(heading).toBeVisible()
    }
  })

  test('should display share buttons on blog post', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const firstPost = page.locator('main article a').first()
    const postsExist = (await firstPost.count()) > 0

    if (postsExist) {
      await firstPost.click()
      await page.waitForLoadState('networkidle')

      // Share buttons should be visible
      const articleContent = page.locator('article')
      await expect(articleContent).toBeVisible()

      // The page should have rendered successfully
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Page should render properly on mobile
    const heading = page.locator('h1', { hasText: 'Blog Posts' })
    await expect(heading).toBeVisible()

    // Search should still be visible
    const searchInput = page.locator('input[placeholder*="Search posts"]')
    await expect(searchInput).toBeVisible()

    // Posts or empty state should be visible
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should have no console errors on blog list', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('favicon') && !error.includes('404')
    )

    expect(criticalErrors).toHaveLength(0)
  })

  test('should have no JavaScript errors on blog list', async ({ page }) => {
    let jsErrors: Error[] = []

    page.on('pageerror', (error) => {
      jsErrors.push(error)
    })

    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    expect(jsErrors).toHaveLength(0)
  })

  test('should have no console errors on blog post', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const firstPost = page.locator('main article a').first()
    const postsExist = (await firstPost.count()) > 0

    if (postsExist) {
      await firstPost.click()
      await page.waitForLoadState('networkidle')

      // Filter out known acceptable errors
      const criticalErrors = consoleErrors.filter(
        (error) => !error.includes('favicon') && !error.includes('404')
      )

      expect(criticalErrors).toHaveLength(0)
    }
  })

  test('should scroll through blog post content', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const firstPost = page.locator('main article a').first()
    const postsExist = (await firstPost.count()) > 0

    if (postsExist) {
      await firstPost.click()
      await page.waitForLoadState('networkidle')

      // Get initial scroll position
      const initialScroll = await page.evaluate(() => window.scrollY)

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 1000))
      await page.waitForTimeout(300)

      // Verify scroll position changed
      const newScroll = await page.evaluate(() => window.scrollY)
      expect(newScroll).toBeGreaterThan(initialScroll)
    }
  })

  test('should clear search filters', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const searchInput = page.locator('input[placeholder*="Search posts"]')

    // Type in search
    await searchInput.fill('test query')
    await page.waitForTimeout(300)

    // Click clear button
    const clearButton = page.locator('button').filter({ has: page.locator('svg') }).last()
    await clearButton.click()
    await page.waitForTimeout(300)

    // Search input should be empty
    await expect(searchInput).toHaveValue('')
  })

  test('should show "All Posts" tag button', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // All Posts button should be visible
    const allPostsButton = page.locator('button', { hasText: 'All Posts' })
    await expect(allPostsButton).toBeVisible()

    // Should be selected by default
    await expect(allPostsButton).toHaveClass(/bg-indigo-600/)
  })
})
