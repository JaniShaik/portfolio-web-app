import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom lacks the browser APIs used by the scroll-reveal animations. Provide inert fallbacks
// (no reduced-motion preference, nothing ever intersects) so components render their
// default, fully visible state. Tests that need control stub these with `vi.stubGlobal`.
if (typeof window !== "undefined") {
  window.matchMedia ??= (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  });

  globalThis.IntersectionObserver ??= class implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };
}
