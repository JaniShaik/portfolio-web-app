import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CredentialsSection } from "@/components/sections/home";
import { credentialsContent } from "@/data/credentials";
import { profile } from "@/data/profile";
import { emailLink, socialLinks } from "@/data/social-links";

describe("CredentialsSection", () => {
  it("renders the numbered heading, narrative and the four professional foundations", () => {
    render(<CredentialsSection />);

    const region = screen.getByRole("region", {
      name: "Built on experience. Driven by curiosity.",
    });
    expect(within(region).getByText("06 / Credentials")).toBeInTheDocument();
    for (const paragraph of credentialsContent.narrative) {
      expect(within(region).getByText(paragraph)).toBeInTheDocument();
    }
    expect(
      within(region)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Professional Experience",
      "Architecture & Engineering Leadership",
      "Cloud & Technology Expertise",
      "AI & Continuous Learning",
      "Let's discuss what we can build next.",
    ]);
  });

  it("does not render a certifications list while none are configured", () => {
    render(<CredentialsSection />);
    expect(
      screen.queryByRole("heading", { name: "Industry Certifications" }),
    ).not.toBeInTheDocument();
  });

  it("renders earned certifications when they are added", () => {
    render(
      <CredentialsSection
        content={{
          ...credentialsContent,
          certifications: [{ id: "cert", name: "Example Certification", issuer: "Example Issuer" }],
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Industry Certifications" })).toBeInTheDocument();
    expect(screen.getByText("Example Certification")).toBeInTheDocument();
  });

  it("points Let's Connect at the shared email link and View Resume at the profile resume", () => {
    render(<CredentialsSection />);

    expect(screen.getByRole("link", { name: "Let's Connect" })).toHaveAttribute(
      "href",
      emailLink?.href,
    );
    const resume = screen.getByRole("link", { name: /View Resume/ });
    expect(resume).toHaveAttribute("href", profile.resume?.href);
    expect(resume).toHaveAttribute("target", "_blank");
    expect(resume).toHaveAttribute("rel", "noopener noreferrer");
    expect(resume).toHaveAccessibleName("View Resume (PDF, opens in a new tab)");
  });

  it("lists the configured professional profiles as secure new-tab links", () => {
    render(<CredentialsSection />);

    const profiles = within(
      screen.getByRole("list", { name: "Professional profiles" }),
    ).getAllByRole("link");
    const expected = socialLinks.filter((link) => link.platform !== "email");
    expect(profiles.map((link) => link.getAttribute("href"))).toEqual(
      expected.map((link) => link.href),
    );
    for (const link of profiles) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAccessibleName(/opens in a new tab/);
    }
  });
});
