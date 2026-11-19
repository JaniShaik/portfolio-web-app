// @vitest-environment node
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { siteConfig } from "@/lib/constants";
import { createPageMetadata, defaultMetadata } from "@/lib/seo";

describe("site branding", () => {
  it("uses the profile name as the portfolio brand", () => {
    expect(siteConfig.name).toBe("Jani Shaik");
    expect(siteConfig.name).toBe(profile.name);
  });

  it("keeps the title template, application name and Open Graph site name consistent", () => {
    expect(defaultMetadata.title).toEqual({
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    });
    expect(defaultMetadata.applicationName).toBe(siteConfig.name);
    expect(defaultMetadata.openGraph?.siteName).toBe(siteConfig.name);
  });

  it("keeps page metadata on the shared Open Graph site name", () => {
    const metadata = createPageMetadata({
      title: "About",
      description: "About page",
      path: "/about",
    });

    expect(metadata.title).toBe("About");
    expect(metadata.openGraph?.siteName).toBe(siteConfig.name);
  });
});
