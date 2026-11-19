// @vitest-environment node
import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  footerNavigation,
  mainNavigation,
  pages,
  philosophyLink,
  PHILOSOPHY_SECTION_ID,
  publicRoutes,
} from "@/data/navigation";
import { siteConfig } from "@/lib/constants";
import { joinUrl } from "@/lib/utils";

const marketingDir = path.resolve(import.meta.dirname, "../../../src/app/(marketing)");

/** Routes implied by every `page.tsx` in the marketing route group. */
function marketingPageRoutes(): string[] {
  return readdirSync(marketingDir, { recursive: true, encoding: "utf8" })
    .filter((file) => path.basename(file) === "page.tsx")
    .map((file) => {
      const dir = path.dirname(file).split(path.sep).join("/");
      return dir === "." ? "/" : `/${dir}`;
    })
    .sort();
}

const routeHrefs = publicRoutes.map((route) => route.href);

describe("canonical page routes", () => {
  it("match the marketing pages on disk exactly", () => {
    expect([...routeHrefs].sort()).toEqual(marketingPageRoutes());
  });

  it("contain no fragment links", () => {
    expect(routeHrefs.every((href) => !href.includes("#"))).toBe(true);
  });

  it("include Experience and Architecture", () => {
    expect(routeHrefs).toEqual(expect.arrayContaining(["/experience", "/architecture"]));
  });
});

describe("sitemap", () => {
  it("lists exactly the canonical public routes", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual(
      routeHrefs.map((href) => joinUrl(siteConfig.url, href)),
    );
  });

  it("does not list homepage anchors", () => {
    expect(sitemap().some((entry) => entry.url.includes("#"))).toBe(false);
  });
});

describe("navigation menus", () => {
  const isAnchor = (href: string) => href.includes("#");

  it.each([
    ["main", mainNavigation],
    ["footer", footerNavigation],
  ])("%s navigation only links to canonical pages or the Philosophy anchor", (_, items) => {
    for (const item of items) {
      if (isAnchor(item.href)) expect(item.href).toBe(philosophyLink.href);
      else expect(routeHrefs).toContain(item.href);
    }
  });

  it("points the Philosophy anchor at the homepage section id", () => {
    expect(philosophyLink.href).toBe(`/#${PHILOSOPHY_SECTION_ID}`);
  });

  it("links Experience from the header and footer", () => {
    expect(mainNavigation.map((item) => item.href)).toContain(pages.experience.href);
    expect(footerNavigation.map((item) => item.href)).toContain(pages.experience.href);
  });

  it("makes every public page reachable from the header or footer", () => {
    const linked = new Set(
      [...mainNavigation, ...footerNavigation, pages.contact].map((item) => item.href),
    );
    for (const href of routeHrefs) expect(linked).toContain(href);
  });
});
