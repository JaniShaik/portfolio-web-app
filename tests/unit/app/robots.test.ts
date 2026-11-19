// @vitest-environment node
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { siteConfig } from "@/lib/constants";

describe("robots", () => {
  const result = robots();

  it("uses a bare hostname for the Host directive", () => {
    expect(result.host).toBe(new URL(siteConfig.url).host);
    expect(result.host).not.toMatch(/^https?:\/\//);
  });

  it("points to the absolute sitemap URL", () => {
    expect(result.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
  });
});
