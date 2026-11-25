import { act, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CountUp } from "@/components/animations/count-up";
import { RevealGroup } from "@/components/animations/reveal-group";
import { REVEAL_ITEM } from "@/components/animations/reveal-item";
import { HeroSection } from "@/components/sections/home";
import {
  installIntersectionObserver,
  mockReducedMotion,
  placeBelowFold,
  scrollIntoView,
} from "../../helpers/motion";

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

beforeEach(() => {
  installIntersectionObserver();
  mockReducedMotion(false);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function Group() {
  return (
    <RevealGroup data-testid="group">
      <h2 {...REVEAL_ITEM}>Heading</h2>
      <ul>
        <li {...REVEAL_ITEM}>One</li>
        <li {...REVEAL_ITEM}>Two</li>
      </ul>
      <p>Not an item</p>
    </RevealGroup>
  );
}

describe("RevealGroup", () => {
  it("server-renders every item visible", () => {
    const html = renderToString(<Group />);
    expect(html).toContain("Heading");
    expect(html).not.toMatch(/opacity|transform/);
  });

  it("hides below-the-fold items and reveals them, in order, when scrolled into view", async () => {
    placeBelowFold();
    render(<Group />);
    const items = [screen.getByText("Heading"), screen.getByText("One"), screen.getByText("Two")];

    await waitFor(() => items.forEach((item) => expect(item.style.opacity).toBe("0")));
    expect(screen.getByText("Not an item").style.opacity).toBe("");

    act(() => scrollIntoView(screen.getByTestId("group")));
    await waitFor(() => items.forEach((item) => expect(item.style.opacity).toBe("1")), {
      timeout: 3000,
    });
  });

  it("leaves content that is on screen at load untouched", async () => {
    render(<Group />);
    await settle();
    expect(screen.getByText("One").style.opacity).toBe("");
  });

  it("never hides items for users who prefer reduced motion", async () => {
    mockReducedMotion(true);
    placeBelowFold();
    render(<Group />);
    await settle();
    expect(screen.getByText("One").style.opacity).toBe("");
    expect(screen.getByText("One").style.transform).toBe("");
  });
});

describe("CountUp", () => {
  it("server-renders the final value", () => {
    expect(renderToString(<CountUp value="38" />)).toContain(">38<");
  });

  it("counts a below-the-fold value up from 0 and ends exactly on the final value", async () => {
    placeBelowFold();
    render(<CountUp value="38" duration={200} />);
    const number = screen.getByText(/^\d+$/);

    await waitFor(() => expect(number.textContent).toBe("0"));
    act(() => scrollIntoView(number));
    await waitFor(() => expect(number.textContent).toBe("38"), { timeout: 3000 });
  });

  it.each([
    ["reduced motion", true, "40"],
    ["a non-integer value", false, "3.5"],
  ])("shows the final value immediately for %s", async (_, reduce, value) => {
    mockReducedMotion(reduce);
    placeBelowFold();
    render(<CountUp value={value} />);
    await settle();
    expect(screen.getByText(value)).toBeInTheDocument();
  });
});

describe("HeroSection entrance", () => {
  it("only animates behind the motion-safe variant, so reduced motion shows it statically", () => {
    const { container } = render(<HeroSection />);
    const classes = [...container.querySelectorAll("[class]")].flatMap(
      (element) => element.getAttribute("class")?.split(/\s+/) ?? [],
    );
    const animated = classes.filter((name) => /animate-fade|animation-delay/.test(name));

    expect(animated.length).toBeGreaterThan(0);
    for (const name of animated) expect(name).toMatch(/(^|:)motion-safe:/);
  });
});
