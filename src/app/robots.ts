import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { joinUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: joinUrl(siteConfig.url, "/sitemap.xml"),
    // The Host directive takes a bare hostname (optionally with port), not a URL.
    host: new URL(siteConfig.url).host,
  };
}
