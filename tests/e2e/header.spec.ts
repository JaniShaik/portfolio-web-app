import { expect, test } from "@playwright/test";

const widths = [320, 375, 390, 768, 1280, 1440] as const;

test.describe("responsive header", () => {
  for (const width of widths) {
    test(`fits a ${width}px viewport without overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");

      const header = page.getByRole("banner");
      await expect(header.getByRole("link", { name: "Jani Shaik" })).toBeVisible();
      await expect(header.getByRole("link", { name: /Resume/ })).toBeVisible();

      const layout = await page.evaluate(() => {
        const row = document.querySelector("header > div");
        const children = row ? [...row.children].map((child) => child.getBoundingClientRect()) : [];
        return {
          rowOverflow: row ? row.scrollWidth - row.clientWidth : -1,
          pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
          // Every visible header item stays inside the viewport.
          maxRight: Math.max(
            ...[...document.querySelectorAll("header a, header button")]
              .map((el) => el.getBoundingClientRect())
              .filter((rect) => rect.width > 0)
              .map((rect) => rect.right),
          ),
          // Brand group and action group do not overlap.
          groupsOverlap:
            children.length > 1 && (children[0]?.right ?? 0) > (children.at(-1)?.left ?? 0),
        };
      });

      expect(layout.rowOverflow).toBe(0);
      expect(layout.pageOverflow).toBeLessThanOrEqual(0);
      expect(layout.maxRight).toBeLessThanOrEqual(width);
      expect(layout.groupsOverlap).toBe(false);

      if (width < 1280) {
        await expect(header.getByRole("button", { name: "Open navigation menu" })).toBeInViewport({
          ratio: 1,
        });
      } else {
        await expect(header.getByRole("navigation", { name: "Main" })).toBeVisible();
      }
    });
  }
});
