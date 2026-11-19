import type { NavigationItem } from "@/types";

/**
 * Canonical list of public pages: the single source of truth for page routes.
 * Each entry must have a matching `page.tsx` under `src/app/(marketing)/` (enforced by tests).
 * The sitemap and every navigation menu are derived from this object.
 */
export const pages = {
  home: { title: "Home", href: "/" },
  about: { title: "About", href: "/about" },
  experience: { title: "Experience", href: "/experience" },
  expertise: { title: "Expertise", href: "/expertise" },
  projects: { title: "Projects", href: "/projects" },
  architecture: { title: "Architecture", href: "/architecture" },
  insights: { title: "Insights", href: "/insights" },
  contact: { title: "Contact", href: "/contact" },
} as const satisfies Record<string, NavigationItem>;

/** `id` of the homepage Philosophy section, shared by the section and its links. */
export const PHILOSOPHY_SECTION_ID = "philosophy";

/** In-page anchor to a homepage section. Not a page, so never part of the sitemap. */
export const philosophyLink: NavigationItem = {
  title: "Philosophy",
  href: `/#${PHILOSOPHY_SECTION_ID}`,
};

/** Every public, indexable page. Used by the sitemap. */
export const publicRoutes: readonly NavigationItem[] = Object.values(pages);

/** Primary navigation, rendered in the header (desktop and mobile). Follows the Stitch header. */
export const mainNavigation: readonly NavigationItem[] = [
  pages.home,
  pages.about,
  pages.experience,
  pages.expertise,
  pages.projects,
  pages.insights,
  philosophyLink,
  pages.contact,
];

/** Footer "Directory" links, using the editorial labels from the Stitch footer. */
export const footerNavigation: readonly NavigationItem[] = [
  pages.home,
  { ...pages.about, title: "About Leader" },
  { ...pages.experience, title: "Professional Experience" },
  { ...pages.expertise, title: "AI & Enterprise Architecture" },
  { ...pages.projects, title: "Selected Works" },
  { ...pages.architecture, title: "Reference Architectures" },
  { ...pages.insights, title: "Monographs & Insights" },
  { ...philosophyLink, title: "Engineering Philosophy" },
];
