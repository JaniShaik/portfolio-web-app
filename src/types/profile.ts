export interface Profile {
  name: string;
  /** Short role shown beside the brand in the header, e.g. "Enterprise AI Architect". */
  role: string;
  headline: string;
  summary: string;
  location: string;
  email?: string;
  /** Downloadable resume/CV served from `public/`. */
  resume?: {
    href: `/${string}`;
  };
  avatar?: {
    src: string;
    alt: string;
  };
}

export type SocialPlatform = "linkedin" | "github" | "x" | "email" | "website";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export type SkillCategory =
  | "digital-engineering"
  | "software-architecture"
  | "cloud-engineering"
  | "ai-genai"
  | "engineering-leadership";

export interface Skill {
  name: string;
  category: SkillCategory;
}

export interface SkillGroup {
  category: SkillCategory;
  title: string;
  skills: readonly string[];
}
