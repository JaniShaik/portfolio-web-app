import type { InsightsContent } from "@/types";

/**
 * Homepage "Writing & Perspectives" content; layout follows the Google Stitch homepage design.
 *
 * No articles are published yet, so the cards describe the topics this section covers: they
 * have no link, date or reading time. When an article is published (e.g. as MDX under
 * `src/content/articles/`), add it here with its `href` and `meta` (e.g. "5 min read").
 */
export const insightsContent: InsightsContent = {
  eyebrow: "04 / Writing & Perspectives",
  title: "Thoughts, Experiences & Perspectives.",
  intro:
    "Ideas on enterprise architecture, software modernization, AI in engineering and technology leadership.",
  items: [
    {
      id: "resilient-distributed-systems",
      category: "Enterprise Architecture",
      title: "Designing Resilient Distributed Systems",
      summary:
        "Architecture trade-offs, event-driven design, API boundaries and the resilience patterns that keep distributed platforms reliable.",
    },
    {
      id: "ai-assisted-modernization",
      category: "AI & Modernization",
      title: "AI-Assisted Software Modernization",
      summary:
        "Agentic AI in software engineering, AI-assisted code migration and practical strategies for modernizing legacy systems at enterprise scale.",
    },
    {
      id: "engineering-leadership-ai",
      category: "Engineering Leadership",
      title: "Engineering Leadership in the Age of AI",
      summary:
        "Building engineering capabilities, architecture governance, mentoring and engineering culture as AI changes how software teams work.",
    },
  ],
  // TODO: Add `allLink` (e.g. "Follow on LinkedIn") once `socialLinks` has the real profile URL.
};
