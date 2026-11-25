import { act, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FadeIn } from "@/components/animations/fade-in";
import {
  installIntersectionObserver,
  mockReducedMotion,
  placeBelowFold,
  scrollIntoView,
} from "../../helpers/motion";

describe("FadeIn", () => {
  beforeEach(() => {
    installIntersectionObserver();
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("server-renders visible content without hiding styles", () => {
    const html = renderToString(<FadeIn data-testid="fade">Visible without JavaScript</FadeIn>);

    expect(html).toContain("Visible without JavaScript");
    expect(html).not.toMatch(/opacity|transform/);
  });

  it.each([false, true])("hydrates without errors (reduced motion: %s)", async (reduce) => {
    mockReducedMotion(reduce);
    placeBelowFold();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const onRecoverableError = vi.fn();
    const ui = <FadeIn>Hydrated content</FadeIn>;

    const container = document.createElement("div");
    container.innerHTML = renderToString(ui);
    document.body.append(container);
    const root = await act(async () => hydrateRoot(container, ui, { onRecoverableError }));

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(container).toHaveTextContent("Hydrated content");

    act(() => root.unmount());
    container.remove();
  });

  it("keeps content that is on screen at load visible", async () => {
    render(<FadeIn data-testid="fade">Above the fold</FadeIn>);
    const element = screen.getByTestId("fade");

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(element.style.opacity).toBe("");
  });

  it("does not hide or animate content for users who prefer reduced motion", async () => {
    mockReducedMotion(true);
    placeBelowFold();
    render(<FadeIn data-testid="fade">Reduced motion</FadeIn>);
    const element = screen.getByTestId("fade");

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(element.style.opacity).toBe("");
    expect(element.style.transform).toBe("");
  });

  it("hides below-the-fold content after mount and fades it in when scrolled into view", async () => {
    placeBelowFold();
    render(
      <FadeIn data-testid="fade" offsetY={24}>
        Below the fold
      </FadeIn>,
    );
    const element = screen.getByTestId("fade");

    await waitFor(() => expect(element.style.opacity).toBe("0"));

    act(() => scrollIntoView(element));

    await waitFor(() => expect(element.style.opacity).toBe("1"), { timeout: 2000 });
  });
});
