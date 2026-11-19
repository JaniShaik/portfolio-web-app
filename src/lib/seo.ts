import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

/** Site-wide defaults, applied in the root layout and inherited by every route. */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
  },
  robots: { index: true, follow: true },
};

interface PageMetadataOptions {
  title: string;
  /** Skip the `%s | Site` title template (e.g. for the home page). */
  absoluteTitle?: boolean;
  description: string;
  /** Route path, e.g. `/about`. Used for canonical and Open Graph URLs. */
  path: `/${string}`;
  /** Optional page-specific Open Graph image (absolute or relative to metadataBase). */
  image?: string;
  noIndex?: boolean;
}

/** Build page-level metadata with canonical URL, Open Graph and Twitter card fields. */
export function createPageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  image,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const images = image ? [{ url: image }] : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: path,
      ...(images && { images }),
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      ...(images && { images }),
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
