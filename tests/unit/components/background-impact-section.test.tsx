import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BackgroundImpactSection } from "@/components/sections/home";
import { backgroundImpactContent } from "@/data/background-impact";
import { philosophyLink } from "@/data/navigation";

describe("BackgroundImpactSection", () => {
  it("renders a labelled region with an H2 and the narrative paragraphs", () => {
    render(<BackgroundImpactSection />);

    const region = screen.getByRole("region", { name: /Engineering Depth\./ });
    expect(within(region).getByRole("heading", { level: 2 })).toHaveTextContent(
      "Engineering Depth. Architectural Thinking. Leadership Impact.",
    );
    expect(within(region).getByText("01 / Background & Impact")).toBeInTheDocument();
    for (const paragraph of backgroundImpactContent.narrative) {
      expect(within(region).getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("renders the journey as an ordered progression covering every impact theme once", () => {
    render(<BackgroundImpactSection />);

    const stages = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(
      stages.map((stage) => within(stage).getByRole("heading", { level: 3 }).textContent),
    ).toEqual([
      "Software Engineering",
      "Technical Leadership",
      "Enterprise Architecture",
      "Digital Engineering Practice Leadership",
    ]);

    const themes = backgroundImpactContent.journey.flatMap((stage) => stage.themes);
    expect([...themes].sort()).toEqual(
      [
        "AI-Driven Engineering",
        "Cloud-Native Architecture",
        "Engineering Leadership",
        "Enterprise Platform Modernization",
        "Scalable Distributed Systems",
        "Technical Strategy and Execution",
      ].sort(),
    );
  });

  it("links to the Philosophy section", () => {
    render(<BackgroundImpactSection />);

    expect(
      screen.getByRole("link", { name: "Read Executive Narrative & Philosophy" }),
    ).toHaveAttribute("href", philosophyLink.href);
  });
});
