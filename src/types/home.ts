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
