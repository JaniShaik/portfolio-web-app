import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Navigation } from "@/components/layout/navigation";
import { mainNavigation } from "@/data/navigation";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

describe("Navigation", () => {
  beforeEach(() => {
    pathname.current = "/";
  });

  it("renders the Stitch header items in order", () => {
    render(<Navigation />);
    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual([
      "Home",
      "About",
      "Experience",
      "Expertise",
      "Projects",
      "Insights",
      "Philosophy",
      "Contact",
    ]);
    expect(mainNavigation.find((item) => item.title === "Philosophy")?.href).toBe("/#philosophy");
  });

  it("marks only Home as current on the homepage", () => {
    render(<Navigation />);
    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");

    expect(current.map((link) => link.textContent)).toEqual(["Home"]);
  });

  it("marks a section as current on its nested routes", () => {
    pathname.current = "/projects/some-case-study";
    render(<Navigation />);

    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });
});
