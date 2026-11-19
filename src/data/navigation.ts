import type { NavigationItem } from "@/types";

export const homeNavigationItem: NavigationItem = { title: "Home", href: "/" };

/** Primary navigation, rendered in the header (desktop and mobile). */
export const mainNavigation: readonly NavigationItem[] = [
  { title: "About", href: "/about" },
  { title: "Experience", href: "/experience" },
  { title: "Expertise", href: "/expertise" },
  { title: "Projects", href: "/projects" },
  { title: "Architecture", href: "/architecture" },
  { title: "Insights", href: "/insights" },
  { title: "Contact", href: "/contact" },
];

/** Every public, indexable route. Used by the sitemap and the mobile navigation. */
export const publicRoutes: readonly NavigationItem[] = [homeNavigationItem, ...mainNavigation];
