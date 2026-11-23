import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection, MetricsSection } from "@/components/sections/home";
import { pages } from "@/data/navigation";

describe("HeroSection", () => {
  it("renders the finalized headline as the page H1 with the designation and introduction", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Architecting Intelligent Systems for Tomorrow.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enterprise AI Architect · Technical Manager · Engineering Leader"),
    ).toBeInTheDocument();
    expect(screen.getByText(/bridge the gap between technology strategy/)).toBeInTheDocument();
  });

  it("links the two CTAs to the projects and contact pages", () => {
    render(<HeroSection />);

    expect(screen.getByRole("link", { name: "Explore My Work" })).toHaveAttribute(
      "href",
      pages.projects.href,
    );
    expect(screen.getByRole("link", { name: "Let's Connect" })).toHaveAttribute(
      "href",
      pages.contact.href,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});

describe("MetricsSection", () => {
  it("renders exactly the four finalized metrics", () => {
    render(<MetricsSection />);

    const region = screen.getByRole("region", { name: "Impact at a Glance" });
    const items = within(region)
      .getAllByRole("listitem")
      .map((item) => item.textContent);

    expect(items).toEqual([
      "10+Years of Experience",
      "38Engineers Led",
      "40%Migration Effort Reduction",
      "3×Payment Throughput Improvement",
    ]);
  });
});
