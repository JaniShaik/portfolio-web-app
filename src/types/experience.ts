export type EmploymentType = "full-time" | "contract" | "advisory" | "freelance";

/** Metadata exported from each `src/content/experience/*.mdx` file. */
export interface ExperienceMetadata {
  company: string;
  role: string;
  slug: string;
  employmentType: EmploymentType;
  location?: string;
  /** ISO 8601 date, e.g. `2021-04-01`. */
  startDate: string;
  /** ISO 8601 date; omit for the current role. */
  endDate?: string;
  highlights: readonly string[];
  technologies?: readonly string[];
}
