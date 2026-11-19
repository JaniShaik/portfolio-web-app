import { z } from "zod";

/**
 * Public environment access, validated lazily where each value is used.
 *
 * This module is reachable from shared code (e.g. `siteConfig`), so it must only
 * contain values that are safe to expose to the browser. Secrets and other
 * server-only configuration belong in `@/lib/server-env`.
 */

const DEFAULT_SITE_URL = "http://localhost:3000";

const urlSchema = z.url({ protocol: /^https?$/ });

/** Canonical site URL: NEXT_PUBLIC_SITE_URL → Vercel production URL → localhost. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const parsed = urlSchema.safeParse(explicit);
    if (!parsed.success) {
      throw new Error(`NEXT_PUBLIC_SITE_URL must be a valid http(s) URL. Received: "${explicit}"`);
    }
    return parsed.data.replace(/\/+$/, "");
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return DEFAULT_SITE_URL;
}
