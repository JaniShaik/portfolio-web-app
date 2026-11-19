import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { mainNavigation } from "@/data/navigation";

vi.mock("next/navigation", () => ({ usePathname: () => "/about" }));

describe("MobileNavigation", () => {
  it("lists the header navigation and marks the current page", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const nav = await screen.findByRole("navigation", { name: "Mobile" });
    const links = within(nav).getAllByRole("link");

    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual(
      mainNavigation.map((route) => [route.title, route.href]),
    );
    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("closes after a navigation item is selected", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    const nav = await screen.findByRole("navigation", { name: "Mobile" });
    await user.click(within(nav).getByRole("link", { name: "Projects" }));

    await waitFor(() => {
      expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    });
  });

  it("closes on Escape and returns focus to the menu button", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(trigger);
    await screen.findByRole("navigation", { name: "Mobile" });
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
