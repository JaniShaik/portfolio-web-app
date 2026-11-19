import { profile } from "@/data/profile";
import type { SocialLink } from "@/types";

/** The single `mailto:` link for the profile email, reused wherever email is shown. */
export const emailLink: SocialLink | undefined = profile.email
  ? { platform: "email", label: "Email", href: `mailto:${profile.email}` }
  : undefined;

// TODO: Replace placeholder URLs with real profiles.
export const socialLinks: readonly SocialLink[] = [
  { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
  { platform: "github", label: "GitHub", href: "https://github.com/" },
  ...(emailLink ? [emailLink] : []),
];
