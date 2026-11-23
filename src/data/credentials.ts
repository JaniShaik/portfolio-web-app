import type { CredentialsContent } from "@/types";

/**
 * Homepage "Credentials & Direct Strategic Channel" content; layout follows the Google Stitch
 * "06 / Credentials" and "Direct Strategic Channel" designs. Contact targets come from
 * `profile` and `socialLinks`, not from this file.
 */
export const credentialsContent: CredentialsContent = {
  eyebrow: "06 / Credentials",
  title: "Built on experience. Driven by curiosity.",
  narrative: [
    "My work is grounded in over a decade of engineering experience, spanning enterprise application development, distributed systems, architectural modernization and engineering leadership.",
    "I continuously explore evolving technologies and architectural approaches to help teams build systems that are scalable, resilient and ready for the future.",
  ],
  foundations: [
    {
      id: "professional-experience",
      title: "Professional Experience",
      icon: "experience",
      points: [
        "10+ years of enterprise engineering experience.",
        "Enterprise application development and modernization.",
      ],
    },
    {
      id: "architecture-leadership",
      title: "Architecture & Engineering Leadership",
      icon: "architecture",
      points: [
        "Enterprise architecture and system design.",
        "Engineering and technical leadership.",
      ],
    },
    {
      id: "cloud-technology",
      title: "Cloud & Technology Expertise",
      icon: "cloud",
      points: ["Cloud-native and distributed systems.", "Modern engineering ecosystems."],
    },
    {
      id: "ai-learning",
      title: "AI & Continuous Learning",
      icon: "ai",
      points: [
        "AI-driven engineering transformation.",
        "Agentic AI and emerging architectural patterns.",
      ],
    },
  ],
  // Add earned certifications here, e.g. { id, name, issuer }; the list renders when non-empty.
  certifications: [],
  channel: {
    label: "Direct Strategic Channel",
    title: "Let's discuss what we can build next.",
    description: [
      "I enjoy connecting with people who are solving complex engineering problems, building scalable platforms, modernizing enterprise systems or exploring the practical application of AI.",
      "Whether it's an architecture challenge, engineering transformation, leadership opportunity or strategic collaboration, I'm open to meaningful conversations.",
    ],
    connectLabel: "Let's Connect",
    resumeLabel: "View Resume",
  },
};
