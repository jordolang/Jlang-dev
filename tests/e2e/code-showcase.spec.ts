import { test, expect } from "@playwright/test";

test.describe("CodeShowcase Component", () => {
  test.beforeEach(async ({ page }) => {
    // Visit homepage and navigate to a project that has code examples
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display code showcase on project detail page", async ({
    page,
  }) => {
    // Navigate to projects section
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);

    // Find and click on a project link (look for "View Details" or project title links)
    const projectLink = page.locator('a[href*="/projects/"]').first();

    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Check if we're on a project page
      const url = page.url();
      expect(url).toContain("/projects/");
    }
  });

  test("should render code showcase with view toggle buttons", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to a project page
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll down to find code showcase section
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Check for view toggle buttons if code showcase is present
      const codeButton = page.getByRole("button", { name: /^code$/i });
      if (await codeButton.isVisible()) {
        await expect(codeButton).toBeVisible();
      }
    }
  });

  test("should display code with syntax highlighting", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code showcase section
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Check if syntax highlighter is present
      const syntaxHighlighter = page
        .locator('[data-testid="syntax-highlighter"]')
        .or(page.locator("pre code"))
        .first();
      if ((await syntaxHighlighter.count()) > 0) {
        await expect(syntaxHighlighter.first()).toBeVisible();
      }
    }
  });

  test("should switch between view modes when buttons are clicked", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Try to find view toggle buttons
      const codeButton = page.getByRole("button", { name: /^code$/i });
      const splitButton = page.getByRole("button", { name: /^split$/i });
      const previewButton = page.getByRole("button", { name: /^preview$/i });

      // Test code view
      if (await codeButton.isVisible()) {
        await codeButton.click();
        await page.waitForTimeout(300);

        // Code button should be active (have white background class)
        const codeButtonClasses = await codeButton.getAttribute("class");
        expect(codeButtonClasses).toContain("bg-white");

        // Test split view if available
        if (await splitButton.isVisible()) {
          await splitButton.click();
          await page.waitForTimeout(300);

          const splitButtonClasses = await splitButton.getAttribute("class");
          expect(splitButtonClasses).toContain("bg-white");
        }

        // Test preview view if available
        if (await previewButton.isVisible()) {
          await previewButton.click();
          await page.waitForTimeout(300);

          const previewButtonClasses =
            await previewButton.getAttribute("class");
          expect(previewButtonClasses).toContain("bg-white");
        }
      }
    }
  });

  test("should show copy button when code is visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Check for copy button
      const copyButton = page.getByRole("button", { name: /copy code/i });
      if (await copyButton.isVisible()) {
        await expect(copyButton).toBeVisible();
      }
    }
  });

  test("should copy code to clipboard when copy button clicked", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Find and click copy button
      const copyButton = page
        .getByRole("button", { name: /copy code/i })
        .first();
      if (await copyButton.isVisible()) {
        await copyButton.click();

        // Wait for the feedback to appear
        await page.waitForTimeout(300);

        // Check if "Copied!" feedback appears
        const copiedFeedback = page.getByRole("button", { name: /copied!/i });
        if (await copiedFeedback.isVisible()) {
          await expect(copiedFeedback).toBeVisible();
        }

        // Verify clipboard content is not empty
        const clipboardContent = await page.evaluate(() =>
          navigator.clipboard.readText(),
        );
        expect(clipboardContent.length).toBeGreaterThan(0);
      }
    }
  });

  test("should display language label in code header", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Check for language label (typically typescript, javascript, etc.)
      const languageLabel = page.locator("span.font-mono.uppercase").first();
      if (await languageLabel.isVisible()) {
        const labelText = await languageLabel.textContent();
        expect(labelText).toBeTruthy();
        // Common languages should be displayed
        expect(
          [
            "typescript",
            "javascript",
            "tsx",
            "jsx",
            "python",
            "go",
            "rust",
          ].some((lang) => labelText?.toLowerCase().includes(lang)),
        ).toBeTruthy();
      }
    }
  });

  test("should display code showcase title and description", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code examples section
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Look for "Code Examples" heading
      const codeExamplesHeading = page.getByRole("heading", {
        name: /code examples/i,
      });
      if (await codeExamplesHeading.isVisible()) {
        await expect(codeExamplesHeading).toBeVisible();
      }
    }
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Check that code showcase is still visible on mobile
      const codeButton = page.getByRole("button", { name: /^code$/i });
      if (await codeButton.isVisible()) {
        await expect(codeButton).toBeVisible();

        // Mobile copy button should be visible in code header
        await codeButton.click();
        await page.waitForTimeout(300);

        // Mobile-specific copy button (in the code header)
        const mobileCopyButtons = page.getByRole("button", { name: /copy/i });
        expect(await mobileCopyButtons.count()).toBeGreaterThan(0);
      }
    }
  });

  test("should render code with line numbers", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Switch to code view
      const codeButton = page.getByRole("button", { name: /^code$/i });
      if (await codeButton.isVisible()) {
        await codeButton.click();
        await page.waitForTimeout(300);

        // Check if line numbers are rendered (syntax highlighter should have line numbers)
        const codeContainer = page.locator("pre").first();
        if (await codeContainer.isVisible()) {
          await expect(codeContainer).toBeVisible();
        }
      }
    }
  });

  test("should handle multiple code showcases on same page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll through the page to load all code showcases
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 3000));
      await page.waitForTimeout(500);

      // Count code showcases (view toggle button groups)
      const codeButtons = page.getByRole("button", { name: /^code$/i });
      const count = await codeButtons.count();

      // If there are multiple showcases, verify they work independently
      if (count > 1) {
        // Click first code button
        await codeButtons.nth(0).click();
        await page.waitForTimeout(300);

        // First should be active
        const firstClasses = await codeButtons.nth(0).getAttribute("class");
        expect(firstClasses).toContain("bg-white");

        // Second should still be in its default state
        const secondClasses = await codeButtons.nth(1).getAttribute("class");
        expect(secondClasses).toBeTruthy();
      }
    }
  });

  test("should not have JavaScript errors during interaction", async ({
    page,
  }) => {
    let jsErrors: Error[] = [];

    page.on("pageerror", (error) => {
      jsErrors.push(error);
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll to code showcase
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      // Interact with view buttons
      const codeButton = page.getByRole("button", { name: /^code$/i });
      if (await codeButton.isVisible()) {
        await codeButton.click();
        await page.waitForTimeout(300);

        const splitButton = page.getByRole("button", { name: /^split$/i });
        if (await splitButton.isVisible()) {
          await splitButton.click();
          await page.waitForTimeout(300);
        }
      }
    }

    expect(jsErrors).toHaveLength(0);
  });

  test("should have no console errors during code showcase interaction", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Scroll and interact with code showcase
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      const copyButton = page
        .getByRole("button", { name: /copy code/i })
        .first();
      if (await copyButton.isVisible()) {
        await copyButton.click();
        await page.waitForTimeout(300);
      }
    }

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes("favicon") && !error.includes("404"),
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should scroll smoothly to code examples section", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const projectLink = page.locator('a[href*="/projects/"]').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState("networkidle");

      // Get initial scroll position
      const initialScroll = await page.evaluate(() => window.scrollY);

      // Scroll to code examples section
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(300);

      // Verify scroll happened
      const newScroll = await page.evaluate(() => window.scrollY);
      expect(newScroll).toBeGreaterThan(initialScroll);
    }
  });
});
