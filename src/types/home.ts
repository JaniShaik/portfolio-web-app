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
