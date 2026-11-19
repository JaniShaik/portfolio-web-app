import { act, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FadeIn } from "@/components/animations/fade-in";

type ObserverEntry = { callback: IntersectionObserverCallback; elements: Set<Element> };
const observers: ObserverEntry[] = [];

class MockIntersectionObserver {
  private entry: ObserverEntry;
  constructor(callback: IntersectionObserverCallback) {
    this.entry = { callback, elements: new Set() };
    observers.push(this.entry);
  }
  observe(element: Element) {
    this.entry.elements.add(element);
  }
  unobserve(element: Element) {
    this.entry.elements.delete(element);
  }
  disconnect() {
    this.entry.elements.clear();
  }
  takeRecords() {
    return [];
  }
}

function scrollIntoView(element: Element) {
  for (const { callback, elements } of observers) {
    if (!elements.has(element)) continue;
    const entry = { isIntersecting: true, target: element } as IntersectionObserverEntry;
    callback([entry], {} as IntersectionObserver);
  }
}

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    })),
  );
}

function placeBelowFold() {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    top: window.innerHeight + 500,
  } as DOMRect);
}

describe("FadeIn", () => {
  beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
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
