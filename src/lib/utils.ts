import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Register the custom font-size tokens from `globals.css` so tailwind-merge treats
 * `text-label-md` etc. as font sizes rather than colours (and keeps them alongside
 * `text-*` colour classes).
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "heading",
        "headline-display",
        "headline-lg",
        "headline-lg-mobile",
        "headline-md",
        "headline-sm",
        "body-lg",
        "body-md",
        "body-sm",
        "label-md",
        "label-sm",
      ],
    },
  },
});

/** Merge conditional class names, resolving Tailwind CSS conflicts (last one wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Join a base URL and a path, normalising slashes. */
export function joinUrl(baseUrl: string, path = "/"): string {
  const base = baseUrl.replace(/\/+$/, "");
  const normalisedPath = path.startsWith("/") ? path : `/${path}`;
  return normalisedPath === "/" ? `${base}/` : `${base}${normalisedPath}`;
}

/**
 * Whether `href` is the current route or an ancestor of it (`/` only matches exactly).
 * In-page anchors such as `/#philosophy` are never the current page: the page that contains
 * them is, so Home stays current while reading its Philosophy section.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
