import { vi } from "vitest";

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

/** Installs a controllable IntersectionObserver; call in `beforeEach`. */
export function installIntersectionObserver() {
  observers.length = 0;
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
}

/** Reports `element` as intersecting to every observer watching it. */
export function scrollIntoView(element: Element) {
  for (const { callback, elements } of observers) {
    if (!elements.has(element)) continue;
    const entry = { isIntersecting: true, target: element } as IntersectionObserverEntry;
    callback([entry], {} as IntersectionObserver);
  }
}

export function mockReducedMotion(reduce: boolean) {
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

/** Makes every element report a position below the fold. */
export function placeBelowFold() {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    top: window.innerHeight + 500,
  } as DOMRect);
}
