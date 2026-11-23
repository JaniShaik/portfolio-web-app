import { pages } from "@/data/navigation";
import type { HeroContent, MetricsContent } from "@/types";

/** Homepage hero content. Copy is finalized; layout follows the Google Stitch homepage design. */
export const heroContent: HeroContent = {
  designation: "Enterprise AI Architect · Technical Manager · Engineering Leader",
  headline: "Architecting Intelligent Systems for Tomorrow.",
  introduction:
    "I architect and lead the development of scalable enterprise platforms, modernize complex systems, and drive AI-powered engineering transformation. With 10+ years of experience across enterprise software engineering, distributed systems, cloud architecture, and Agentic AI, I bridge the gap between technology strategy and engineering execution.",
  primaryCta: { label: "Explore My Work", href: pages.projects.href },
  secondaryCta: { label: "Let's Connect", href: pages.contact.href },
  portrait: {
    // TODO: Add the professional photograph to `public/images/profile/` and set it here, e.g.
    // image: { src: "/images/profile/jani-shaik.jpg", alt: "Portrait of Jani Shaik" },
    badge: "Executive Profile",
    legend: {
      reference: "Ref. JS-ARCH-2025",
      coordinates: "LAT 17.3850° N / LON 78.4867° E",
    },
  },
};

/** Homepage impact metrics, rendered directly below the hero. */
export const metricsContent: MetricsContent = {
  title: "Impact at a Glance",
  items: [
    { value: "10", suffix: "+", label: "Years of Experience" },
    { value: "38", label: "Engineers Led" },
    { value: "40", suffix: "%", label: "Migration Effort Reduction" },
    { value: "3", suffix: "×", label: "Payment Throughput Improvement" },
  ],
};
