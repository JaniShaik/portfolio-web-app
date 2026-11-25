import { expect, test } from "@playwright/test";

test.describe("homepage motion", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("server-rendered sections mark their reveal items", async ({ page }) => {
    await page.goto("/");
    // Guards against REVEAL_ITEM resolving to a client reference in Server Components.
    expect(await page.locator("[data-reveal]").count()).toBeGreaterThan(20);
  });

  test("hides below-the-fold items until scrolled into view, then reveals them", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.locator('[aria-labelledby="case-studies-title"] [data-reveal]').nth(1);
    await expect(card).toHaveCSS("opacity", "0");

    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveCSS("opacity", "1");
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("never hides content and skips the hero entrance", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("h1")).toHaveCSS("animation-name", "none");
      const hidden = await page
        .locator("[data-reveal]")
        .evaluateAll(
          (items) => items.filter((item) => getComputedStyle(item).opacity !== "1").length,
        );
      expect(hidden).toBe(0);
    });
  });
});
