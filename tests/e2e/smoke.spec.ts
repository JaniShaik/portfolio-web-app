import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home page loads", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(/Jani Shaik/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("primary navigation reaches a section page", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await page
        .getByRole("navigation", { name: "Mobile" })
        .getByRole("link", { name: "About" })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "About" })
        .click();
    }

    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeVisible();
  });

  test("Experience and the Philosophy anchor are reachable from the header", async ({
    page,
    isMobile,
  }) => {
    const openNav = async () => {
      if (isMobile) {
        await page.getByRole("button", { name: "Open navigation menu" }).click();
        return page.getByRole("navigation", { name: "Mobile" });
      }
      return page.getByRole("navigation", { name: "Main" });
    };

    await page.goto("/about");
    await (await openNav()).getByRole("link", { name: "Experience" }).click();
    await expect(page).toHaveURL(/\/experience$/);
    await expect(page.getByRole("heading", { level: 1, name: "Experience" })).toBeVisible();

    await (await openNav()).getByRole("link", { name: "Philosophy" }).click();
    await expect(page).toHaveURL(/\/#philosophy$/);
    await expect(page.locator("#philosophy")).toBeInViewport();
  });

  test("header content fits its container without overflow", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => {
      const row = document.querySelector("header > div");
      return {
        row: row ? row.scrollWidth - row.clientWidth : -1,
        page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(overflow).toEqual({ row: 0, page: 0 });
  });

  test("footer links reach Philosophy and shows the current year", async ({ page }) => {
    await page.goto("/contact");
    const footer = page.getByRole("contentinfo");

    await expect(footer).toContainText(`© ${new Date().getFullYear()} Jani Shaik.`);
    await footer.getByRole("link", { name: "Engineering Philosophy" }).click();
    await expect(page).toHaveURL(/\/#philosophy$/);
    await expect(page.locator("#philosophy")).toBeInViewport();
  });

  test("resume links download the uploaded PDF", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page
      .locator('a[download][href$=".pdf"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

    expect(hrefs.length).toBeGreaterThanOrEqual(2);
    expect(new Set(hrefs)).toEqual(new Set(["/documents/jani-shaik-resume.pdf"]));

    const response = await request.get("/documents/jani-shaik-resume.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });

  test("unknown routes render the not-found page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });

  test("not-found page keeps the site header, navigation, skip link and footer", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/this-page-does-not-exist");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content",
    );

    if (isMobile) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await page
        .getByRole("navigation", { name: "Mobile" })
        .getByRole("link", { name: "Projects" })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Projects" })
        .click();
    }
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("not-found page links back to the home page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await page.getByRole("link", { name: "Back to home" }).click();

    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("contact API guards", () => {
  test("rejects cross-origin submissions", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: { Origin: "https://evil.example" },
      data: { name: "Bot", email: "bot@example.com", message: "Spam spam spam spam" },
    });

    expect(response.status()).toBe(403);
  });

  test("rejects oversized bodies", async ({ request }) => {
    // robots.txt exposes the configured site URL, which is the allowed Origin.
    const robots = await (await request.get("/robots.txt")).text();
    const sitemapUrl = /^Sitemap: (\S+)$/m.exec(robots)?.[1];
    expect(sitemapUrl).toBeDefined();
    expect(robots).toMatch(new RegExp(`^Host: ${new URL(sitemapUrl ?? "").host}$`, "m"));

    const siteOrigin = new URL(sitemapUrl ?? "").origin;
    const response = await request.post("/api/contact", {
      headers: { Origin: siteOrigin, "Content-Type": "application/json" },
      data: JSON.stringify({ message: "x".repeat(64 * 1024) }),
    });

    expect(response.status()).toBe(413);
  });
});
