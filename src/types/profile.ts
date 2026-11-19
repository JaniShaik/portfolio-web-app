export interface Profile {
  name: string;
  headline: string;
  summary: string;
  location: string;
  email?: string;
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
