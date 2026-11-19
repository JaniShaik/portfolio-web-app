import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/header";
import { profile } from "@/data/profile";
import { emailLink } from "@/data/social-links";
import { siteConfig } from "@/lib/constants";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("Header", () => {
  it("renders the banner with brand, role, navigation and menu toggle", () => {
    render(<Header />);
    const banner = screen.getByRole("banner");

    expect(within(banner).getByRole("link", { name: siteConfig.name })).toHaveAttribute(
      "href",
      "/",
    );
    expect(within(banner).getByText(profile.role)).toBeInTheDocument();
    expect(within(banner).getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(
      within(banner).getByRole("button", { name: "Open navigation menu" }),
    ).toBeInTheDocument();
  });

  it("links the resume download", () => {
    render(<Header />);
    const resume = screen.getByRole("link", { name: "Resume (PDF)" });

    expect(resume).toHaveAttribute("href", profile.resume?.href);
    expect(resume).toHaveAttribute("download");
  });

  it("groups social links in a labelled navigation landmark", () => {
    render(<Header />);
    const social = screen.getByRole("navigation", { name: "Social links" });

    expect(
      within(social)
        .getAllByRole("link")
        .map((link) => link.getAttribute("aria-label")),
    ).toEqual(["LinkedIn (opens in a new tab)", "GitHub (opens in a new tab)", "Email"]);
  });

  it("opens external profiles in a new tab and reuses the shared email link", () => {
    render(<Header />);

    const linkedIn = screen.getByRole("link", { name: "LinkedIn (opens in a new tab)" });
    expect(linkedIn).toHaveAttribute("target", "_blank");
    expect(linkedIn).toHaveAttribute("rel", "noopener noreferrer");

    const email = screen.getByRole("link", { name: "Email" });
    expect(email).toHaveAttribute("href", emailLink?.href);
    expect(email).not.toHaveAttribute("target");
  });

  it("uses brand marks, not generic glyphs, for LinkedIn and GitHub", () => {
    render(<Header />);

    for (const name of ["LinkedIn (opens in a new tab)", "GitHub (opens in a new tab)"]) {
      const icon = screen.getByRole("link", { name }).querySelector("svg");
      expect(icon).toHaveAttribute("fill", "currentColor");
      // Lucide's generic glyphs carry a `lucide` class; brand marks do not.
      expect(icon?.getAttribute("class")).not.toMatch(/\blucide\b/);
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });
});
