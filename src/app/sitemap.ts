import type { MetadataRoute } from "next";
import { publicRoutes } from "@/data/navigation";
import { siteConfig } from "@/lib/constants";
import { joinUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: joinUrl(siteConfig.url, route.href),
    changeFrequency: "monthly",
    priority: route.href === "/" ? 1 : 0.7,
  }));
}
