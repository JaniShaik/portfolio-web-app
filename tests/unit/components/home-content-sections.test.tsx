import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CaseStudiesSection,
  CoreCapabilitiesSection,
  InsightsSection,
} from "@/components/sections/home";
import { caseStudiesContent } from "@/data/case-studies";
import { coreCapabilitiesContent } from "@/data/core-capabilities";
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
              id: "internal",
              category: "AI",
              title: "Internal Article",
              summary: "…",
              href: "/insights/a",
              meta: "5 min read",
            },
            {
              id: "external",
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

describe("InsightsSection link handling", () => {
  const renderWithHref = (href: string) =>
    render(
      <InsightsSection
        content={{
          ...insightsContent,
          items: [{ id: "a", category: "Topic", title: "Article", summary: "…", href }],
        }}
      />,
    );

  it.each(["/projects", "/architecture"])("renders %s as a same-tab app link", (href) => {
    renderWithHref(href);
    const link = screen.getByRole("link", { name: "Read article: Article" });
    expect(link).toHaveAttribute("href", href);
    expect(link).not.toHaveAttribute("target");
  });

  it.each(["//medium.com/@x/post", "https://medium.com/article", "http://example.com"])(
    "opens %s in a new tab and announces it",
    (href) => {
      renderWithHref(href);
      const link = screen.getByRole("link", { name: /Read article: Article/ });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAccessibleName(/opens in a new tab/);
    },
  );

  it.each(["#insights", "#topic", "mailto:someone@example.com"])(
    "keeps %s in the current tab without a new-tab notice",
    (href) => {
      renderWithHref(href);
      const link = screen.getByRole("link", { name: "Read article: Article" });
      expect(link).toHaveAttribute("href", href);
      expect(link).not.toHaveAttribute("target");
    },
  );
});

describe("home content cards", () => {
  afterEach(() => vi.restoreAllMocks());

  it("render duplicate titles and tags without React key warnings", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const [capability] = coreCapabilitiesContent.items;
    const [study] = caseStudiesContent.items;
    if (!capability || !study) throw new Error("expected content");

    render(
      <>
        <CoreCapabilitiesSection
          content={{
            ...coreCapabilitiesContent,
            items: [
              { ...capability, id: "one", tags: ["Java", "Java"] },
              { ...capability, id: "two" },
            ],
          }}
        />
        <CaseStudiesSection
          content={{
            ...caseStudiesContent,
            items: [
              { ...study, id: "one", technologies: ["Kafka", "Kafka"] },
              { ...study, id: "two" },
            ],
          }}
        />
      </>,
    );

    expect(error.mock.calls.flat().map(String).join(" ")).not.toMatch(/same key/);
  });

  it("do not style static cards as interactive on hover", () => {
    const { container } = render(
      <>
        <CoreCapabilitiesSection />
        <CaseStudiesSection />
        <InsightsSection />
      </>,
    );
    const hoverStyled = [...container.querySelectorAll("[class*='hover:border']")];
    expect(hoverStyled).toHaveLength(0);
  });
});
