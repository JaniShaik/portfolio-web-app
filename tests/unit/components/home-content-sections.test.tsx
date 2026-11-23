import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  CaseStudiesSection,
  CoreCapabilitiesSection,
  InsightsSection,
} from "@/components/sections/home";
import { caseStudiesContent } from "@/data/case-studies";
import { insightsContent } from "@/data/insights";

describe("CoreCapabilitiesSection", () => {
  it("renders six numbered capability cards with their technologies", () => {
    render(<CoreCapabilitiesSection />);

    const region = screen.getByRole("region", { name: "What I Bring to the Table." });
    expect(within(region).getByText("02 / Core Capabilities")).toBeInTheDocument();
    expect(
      within(region)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([
      "Enterprise Architecture & System Design",
      "Enterprise Modernization",
      "Backend & Platform Engineering",
      "AI & Intelligent Engineering",
      "Cloud & DevOps Engineering",
      "Engineering Leadership",
    ]);
    expect(
      within(
        within(region).getByRole("list", { name: "AI & Intelligent Engineering technologies" }),
      )
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["LangChain", "LangGraph", "RAG", "MCP"]);
  });
});

describe("CaseStudiesSection", () => {
  it("renders the four case studies with their resume-backed impact", () => {
    render(<CaseStudiesSection />);

    const region = screen.getByRole("region", { name: "Selected Work & Engineering Impact." });
    const articles = within(region).getAllByRole("article");
    expect(articles).toHaveLength(4);
    expect(articles.map((a) => within(a).getByRole("heading", { level: 3 }).textContent)).toEqual(
      caseStudiesContent.items.map((study) => study.title),
    );
    expect(within(region).getByText("≈3× Bulk Payment Throughput")).toBeInTheDocument();
    expect(within(region).getByText("≈40% Migration Effort Reduction")).toBeInTheDocument();
  });

  it("does not render case study links until a detail page exists", () => {
    render(<CaseStudiesSection />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("links to a detail page when one is configured", () => {
    const [first, ...rest] = caseStudiesContent.items;
    if (!first) throw new Error("expected at least one case study");
    render(
      <CaseStudiesSection
        content={{ ...caseStudiesContent, items: [{ ...first, href: "/projects" }, ...rest] }}
      />,
    );

    expect(screen.getByRole("link", { name: `View Case Study: ${first.title}` })).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});

describe("InsightsSection", () => {
  it("renders topic cards without fabricated links, dates or reading times", () => {
    render(<InsightsSection />);

    const region = screen.getByRole("region", { name: "Thoughts, Experiences & Perspectives." });
    expect(within(region).getAllByRole("article")).toHaveLength(insightsContent.items.length);
    expect(within(region).queryAllByRole("link")).toHaveLength(0);
    expect(region).not.toHaveTextContent(/min read/i);
  });

  it("links published articles and the view-all link, flagging external ones", () => {
    render(
      <InsightsSection
        content={{
          ...insightsContent,
          items: [
            {
              category: "AI",
              title: "Internal Article",
              summary: "…",
              href: "/insights/a",
              meta: "5 min read",
            },
            {
              category: "AI",
              title: "External Article",
              summary: "…",
              href: "https://example.com/b",
            },
          ],
          allLink: { label: "Follow on LinkedIn", href: "https://www.linkedin.com/in/example" },
        }}
      />,
    );

    expect(screen.getByRole("link", { name: /Read article: Internal Article/ })).toHaveAttribute(
      "href",
      "/insights/a",
    );
    expect(screen.getByText("5 min read")).toBeInTheDocument();

    const external = screen.getByRole("link", { name: /Read article: External Article/ });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAccessibleName(/opens in a new tab/);

    // Desktop header link and mobile full-width button.
    expect(screen.getAllByRole("link", { name: /Follow on LinkedIn/ })).toHaveLength(2);
  });
});
