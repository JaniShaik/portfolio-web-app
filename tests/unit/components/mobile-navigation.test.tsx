import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { publicRoutes } from "@/data/navigation";

vi.mock("next/navigation", () => ({ usePathname: () => "/about" }));

describe("MobileNavigation", () => {
  it("lists every public route and marks the current page", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    const nav = await screen.findByRole("navigation", { name: "Mobile" });
    const links = within(nav).getAllByRole("link");

    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual(
      publicRoutes.map((route) => [route.title, route.href]),
    );
    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
