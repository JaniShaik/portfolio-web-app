export type ProjectStatus = "completed" | "in-progress" | "archived";

/** Metadata exported from each `src/content/projects/*.mdx` file. */
export interface ProjectMetadata {
  title: string;
  slug: string;
  summary: string;
  /** ISO 8601 date, e.g. `2025-01-31`. */
  date: string;
  status: ProjectStatus;
  technologies: readonly string[];
  featured?: boolean;
  coverImage?: {
    src: string;
    alt: string;
  };
  links?: {
    live?: string;
    repository?: string;
  };
}
