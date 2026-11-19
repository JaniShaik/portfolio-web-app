import { getSiteUrl } from "@/lib/env";

// TODO: Replace placeholder values before launch.
export const siteConfig = {
  name: "Portfolio",
  title: "Portfolio — Technology Leader",
  description:
    "Placeholder description: digital engineering, software architecture, cloud engineering, AI/GenAI and engineering leadership.",
  url: getSiteUrl(),
  locale: "en_US",
  // Default Open Graph image: add `src/app/opengraph-image.png` (1200×630) and
  // Next.js will wire it into metadata automatically.
  twitterHandle: undefined as string | undefined,
} as const;

export const CONTACT_API_ROUTE = "/api/contact";

/** Max contact request body: generous for a 5000-character message, cheap to buffer. */
export const CONTACT_MAX_BODY_BYTES = 10 * 1024;
