import { test, expect, type Page } from "@playwright/test";

// safety-screen is the bundled project that ships code examples.
const SHOWCASE_PATH = "/projects/safety-screen";

async function gotoShowcase(page: Page) {
  await page.goto(SHOWCASE_PATH);
  const heading = page.getByRole("heading", { name: /code examples/i });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  // The showcase mounts lazily (LazyOnScroll + dynamic import); wait for it.
  const codeButton = page.getByRole("button", { name: /^code$/i }).first();
  await codeButton.scrollIntoViewIfNeeded();
  await expect(codeButton).toBeVisible();
  return codeButton;
}

test.describe("CodeShowcase Component", () => {
  test("renders the code examples section with title", async ({ page }) => {
    await gotoShowcase(page);
    await expect(
      page.getByRole("heading", { name: /real-time search implementation/i }),
    ).toBeVisible();
  });

  test("marks the active view for assistive technology", async ({ page }) => {
    const codeButton = await gotoShowcase(page);
    await expect(codeButton).toHaveAttribute("aria-pressed", "true");
  });

  test("displays highlighted code with a language label", async ({ page }) => {
    await gotoShowcase(page);
    await expect(page.locator("pre code").first()).toBeVisible();
    await expect(page.locator("span.font-mono.uppercase").first()).toHaveText(
      /typescript/i,
    );
  });

  test("copies code to clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await gotoShowcase(page);

    await page.getByRole("button", { name: /copy code/i }).first().click();
    await expect(
      page.getByRole("button", { name: /copied!/i }).first(),
    ).toBeVisible();

    const clipboardContent = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardContent).toContain("MedicationSearch");
  });

  test("shows a copy button on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoShowcase(page);
    await expect(
      page.getByRole("button", { name: /^copy$/i }).first(),
    ).toBeVisible();
  });

  test("has no JavaScript errors during interaction", async ({ page }) => {
    const jsErrors: Error[] = [];
    page.on("pageerror", (error) => jsErrors.push(error));

    const codeButton = await gotoShowcase(page);
    await codeButton.click();

    expect(jsErrors).toHaveLength(0);
  });
});
