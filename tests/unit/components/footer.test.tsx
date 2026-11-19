import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/footer";
import { footerNavigation, pages } from "@/data/navigation";
import { profile } from "@/data/profile";
import { emailLink } from "@/data/social-links";
import { siteConfig } from "@/lib/constants";

describe("Footer", () => {
  it("renders the directory links, including Experience and Architecture", () => {
    render(<Footer />);
    const directory = screen.getByRole("navigation", { name: "Directory" });
    const links = within(directory).getAllByRole("link");

    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual(
      footerNavigation.map((item) => [item.title, item.href]),
    );
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toContain(pages.experience.href);
    expect(hrefs).toContain(pages.architecture.href);
  });

  it("uses the site brand name", () => {
    render(<Footer />);
    expect(
      within(screen.getByRole("contentinfo")).getByText(siteConfig.name, { selector: "p" }),
    ).toBeInTheDocument();
  });

  it("renders a single email link built from the shared email configuration", () => {
    render(<Footer />);
    const mailtoLinks = within(screen.getByRole("contentinfo"))
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("mailto:"));

    expect(mailtoLinks).toHaveLength(1);
    expect(mailtoLinks[0]).toHaveAttribute("href", emailLink?.href);
    expect(mailtoLinks[0]).toHaveTextContent(profile.email ?? "");
  });

  it("shows the location only once", () => {
    render(<Footer />);
    const footerText = screen.getByRole("contentinfo").textContent ?? "";

    expect(footerText.split(profile.location)).toHaveLength(2);
    expect(footerText).not.toMatch(/Hyderabad.*Hyderabad/s);
  });

  it("renders the resume download and contact call to action", () => {
    render(<Footer />);

    const resume = screen.getByRole("link", { name: "Curriculum Vitae (PDF)" });
    expect(resume).toHaveAttribute("href", profile.resume?.href);
    expect(resume).toHaveAttribute("download");
    expect(screen.getByRole("link", { name: "Initiate Dialogue" })).toHaveAttribute(
      "href",
      pages.contact.href,
    );
  });

  it("shows the current year in the copyright notice", () => {
    render(<Footer />);

    expect(
      within(screen.getByRole("contentinfo")).getByText(
        new RegExp(`© ${new Date().getFullYear()} ${siteConfig.name}\\.`),
      ),
    ).toBeInTheDocument();
  });
});
