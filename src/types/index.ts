export type * from "./experience";
export type * from "./home";
export type * from "./profile";
export type * from "./project";

export interface NavigationItem {
  title: string;
  href: `/${string}`;
  description?: string;
}

/** Metadata exported from each `src/content/articles/*.mdx` file. */
export interface ArticleMetadata {
  title: string;
  slug: string;
  summary: string;
  /** ISO 8601 date, e.g. `2025-01-31`. */
  publishedAt: string;
  tags: readonly string[];
}
