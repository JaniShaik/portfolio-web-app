import { expect, type Page, test } from "@playwright/test";

/** Resolves once every finite CSS transition/animation on the page (e.g. the drawer exit) has finished. */
async function waitForAnimations(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      // Ignore looping decorations such as the hero's pulsing status dot.
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
      .every((animation) => animation.playState !== "running"),
  );
}

// Headless Chromium hides scrollbars by default, which hides scroll-lock restore bugs that only
// occur with classic (inset) scrollbars, e.g. on Windows. Render them like a real browser.
test.use({ launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] } });

/** Distance between the Philosophy section's top edge and the bottom of the sticky header. */
function sectionOffsetBelowHeader(page: Page) {
  return page.evaluate(() => {
    const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    const section = document.getElementById("philosophy")?.getBoundingClientRect().top ?? Infinity;
    return Math.abs(section - header);
  });
}

test.describe("mobile Philosophy anchor", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("same-page: scrolls to Philosophy after the drawer closes and stays there", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: "Philosophy" }).click();

    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(/\/#philosophy$/);
    await expect(page.locator("#philosophy")).toBeInViewport();

    // Once the drawer exit and the (smooth) scroll have settled, the section rests just below the
    // sticky header: the scroll lock release must not restore the pre-drawer scroll position.
    await waitForAnimations(page);
    await expect
      .poll(() => sectionOffsetBelowHeader(page), { timeout: 5_000 })
      .toBeLessThanOrEqual(2);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test("cross-page: navigates to the homepage anchor and closes the drawer", async ({ page }) => {
    await page.goto("/experience");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const drawer = page.getByRole("dialog");

    await drawer.getByRole("link", { name: "Philosophy" }).click();

    await expect(page).toHaveURL(/\/#philosophy$/);
    await expect(drawer).toBeHidden();
    await expect
      .poll(() => sectionOffsetBelowHeader(page), { timeout: 5_000 })
      .toBeLessThanOrEqual(2);
  });

  test("other links still navigate normally and close the drawer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Projects" }).click();

    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
