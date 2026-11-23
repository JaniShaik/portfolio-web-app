/** A call-to-action link to an internal route. */
export interface CallToAction {
  label: string;
  href: `/${string}`;
}

/** A local image served from `public/`; rendered with `fill` inside a fixed-aspect frame. */
export interface LocalImage {
  src: `/${string}`;
  alt: string;
}

export interface HeroPortrait {
  /** Professional photograph. Unset until the asset is added to `public/images/profile/`. */
  image?: LocalImage;
  /** Label on the badge overlaid on the photograph. */
  badge: string;
  /** Decorative blueprint legend shown beneath the frame on desktop. */
  legend: {
    reference: string;
    coordinates: string;
  };
}

export interface HeroContent {
  designation: string;
  headline: string;
  introduction: string;
  primaryCta: CallToAction;
  secondaryCta: CallToAction;
  portrait: HeroPortrait;
}

/** A homepage impact metric, e.g. `10` + `+` + "Years of Experience". */
export interface Metric {
  value: string;
  /** Unit rendered in the accent colour, e.g. `+`, `%`, `×`. */
  suffix?: string;
  label: string;
}

export interface MetricsContent {
  title: string;
  items: readonly Metric[];
}

/** One stage of the professional journey, rendered as a numbered pillar card. */
export interface JourneyStage {
  /** Short category shown beside the number, e.g. "Foundation". */
  label: string;
  title: string;
  /** Impact themes associated with this stage. */
  themes: readonly string[];
}

export interface BackgroundImpactContent {
  eyebrow: string;
  /** Headline lines; the last line renders in the muted accent colour. */
  headline: readonly [string, ...string[]];
  narrative: readonly string[];
  journey: readonly JourneyStage[];
  link: CallToAction;
}

/** Shared heading content for homepage sections: eyebrow, title and optional intro. */
export interface SectionHeadingContent {
  /** Numbered overline, e.g. "02 / Core Capabilities". */
  eyebrow: string;
  title: string;
  intro?: string;
}

export type CapabilityIcon =
  "architecture" | "modernization" | "backend" | "ai" | "cloud" | "leadership";

export interface Capability {
  /** Stable unique key, e.g. "architecture". */
  id: string;
  title: string;
  description: string;
  icon: CapabilityIcon;
  /** Representative technologies and practices, shown as tags. */
  tags: readonly string[];
}

export interface CoreCapabilitiesContent extends SectionHeadingContent {
  items: readonly Capability[];
}

export interface CaseStudy {
  /** Stable unique key, e.g. "java-modernization-platform"; reusable as a future route slug. */
  id: string;
  /** Short category shown in the card overline, e.g. "Financial Systems". */
  category: string;
  title: string;
  /** Headline outcome. Only use results stated in the resume or profile. */
  impact: string;
  summary: string;
  technologies: readonly string[];
  /** Business domain shown in the card footer. */
  domain: string;
  /** Detailed case study route; omit until the page exists. */
  href?: `/${string}`;
}

export interface CaseStudiesContent extends SectionHeadingContent {
  items: readonly CaseStudy[];
}

/**
 * A Writing & Perspectives card: a topic today, or a published article once it has an
 * `href` (and optional `meta`, e.g. reading time). Never add an `href` for unpublished work.
 */
export interface InsightItem {
  /** Stable unique key; reusable as the article slug once published. */
  id: string;
  category: string;
  title: string;
  summary: string;
  href?: string;
  meta?: string;
}

export interface InsightsContent extends SectionHeadingContent {
  items: readonly InsightItem[];
  /** "View all" link; rendered top-right on desktop and as a full-width button on mobile. */
  allLink?: { label: string; href: string };
}

export type FoundationIcon = "experience" | "architecture" | "cloud" | "ai";

/** A professional foundation: an area of experience, not a certification. */
export interface Foundation {
  id: string;
  title: string;
  icon: FoundationIcon;
  points: readonly string[];
}

/** A formal certification. Only add certifications that have actually been earned. */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
}

export interface StrategicChannelContent {
  /** Small label above the heading, e.g. "Direct Strategic Channel". */
  label: string;
  title: string;
  description: readonly string[];
  /** Primary CTA label; its target is the profile email link (or the contact page). */
  connectLabel: string;
  /** Secondary CTA label; its target is `profile.resume`. */
  resumeLabel: string;
}

export interface CredentialsContent {
  eyebrow: string;
  title: string;
  narrative: readonly string[];
  foundations: readonly Foundation[];
  /** Rendered as an "Industry Certifications" list when non-empty. */
  certifications: readonly Certification[];
  channel: StrategicChannelContent;
}
