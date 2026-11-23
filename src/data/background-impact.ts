import { philosophyLink } from "@/data/navigation";
import type { BackgroundImpactContent } from "@/types";

/** Homepage "Background & Impact" content; layout follows the Google Stitch homepage design. */
export const backgroundImpactContent: BackgroundImpactContent = {
  eyebrow: "01 / Background & Impact",
  headline: ["Engineering Depth.", "Architectural Thinking.", "Leadership Impact."],
  narrative: [
    "My journey has evolved from hands-on software engineering into architecture, engineering leadership and enterprise transformation. Over the years, I've worked across complex enterprise platforms, distributed systems, modernization initiatives and engineering teams, translating business challenges into scalable technology solutions.",
    "Today, I focus on building engineering capabilities, designing scalable systems, modernizing legacy platforms and enabling teams to deliver high-impact solutions through engineering excellence, cloud technologies and AI-driven innovation.",
  ],
  journey: [
    {
      label: "Foundation",
      title: "Software Engineering",
      themes: ["Scalable Distributed Systems", "Cloud-Native Architecture"],
    },
    {
      label: "Leadership",
      title: "Technical Leadership",
      themes: ["Engineering Leadership", "Technical Strategy and Execution"],
    },
    {
      label: "Architecture",
      title: "Enterprise Architecture",
      themes: ["Enterprise Platform Modernization"],
    },
    {
      label: "Practice",
      title: "Digital Engineering Practice Leadership",
      themes: ["AI-Driven Engineering"],
    },
  ],
  link: { label: "Read Executive Narrative & Philosophy", href: philosophyLink.href },
};
