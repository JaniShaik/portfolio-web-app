"use client";

import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Shared reveal timing; matches the `--ease-out-expo` token in `globals.css`. */
export const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
export const REVEAL_DURATION_MS = 550;

/** Whether `element` should animate: motion allowed and it starts below the fold. */
export function shouldAnimateOnScroll(element: Element): boolean {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  return element.getBoundingClientRect().top >= window.innerHeight;
}

/** Calls `onEnter` once, when `element` first enters the viewport (minus the bottom 10%). */
export function observeOnce(element: Element, onEnter: () => void): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      onEnter();
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  observer.observe(element);
  return () => observer.disconnect();
}

export interface ScrollRevealOptions {
  /** CSS selector for descendants to reveal; omit to reveal the scope element itself. */
  target?: string;
  /** Vertical offset in pixels to animate from. */
  offsetY?: number;
  /** Delay in milliseconds before the reveal starts. */
  delay?: number;
  /** Milliseconds between each `target` element. */
  stagger?: number;
}

const ANIMATED_PROPERTIES = ["opacity", "transform", "transition", "transition-delay"] as const;

/**
 * Progressive-enhancement scroll reveal shared by `FadeIn` and `RevealGroup`, built on CSS
 * transitions and `IntersectionObserver` (no animation library).
 *
 * The server (and hydration) render plain, visible content, so it is readable without
 * JavaScript and there is no hydration mismatch. After mount, content that starts below the
 * fold is hidden before the browser paints, then transitioned in once when it scrolls into
 * view; the inline styles are removed afterwards so the element's own transitions (e.g.
 * hover) are untouched. Content already on screen is never hidden, and nothing animates for
 * users who prefer reduced motion.
 */
export function useScrollReveal<T extends HTMLElement>({
  target,
  offsetY = 16,
  delay = 0,
  stagger = 0,
}: ScrollRevealOptions = {}): RefObject<T | null> {
  const scope = useRef<T>(null);
  const items = useRef<HTMLElement[]>([]);

  useLayoutEffect(() => {
    const element = scope.current;
    if (!element || !shouldAnimateOnScroll(element)) return;

    const elements = target ? Array.from(element.querySelectorAll<HTMLElement>(target)) : [element];
    for (const item of elements) {
      item.style.opacity = "0";
      item.style.transform = `translateY(${offsetY}px)`;
    }
    items.current = elements;
  }, [offsetY, target]);

  useEffect(() => {
    const element = scope.current;
    if (!element || items.current.length === 0) return;

    return observeOnce(element, () => {
      items.current.forEach((item, index) => {
        item.style.transition = `opacity ${REVEAL_DURATION_MS}ms ${REVEAL_EASE}, transform ${REVEAL_DURATION_MS}ms ${REVEAL_EASE}`;
        item.style.transitionDelay = `${delay + index * stagger}ms`;
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
        item.addEventListener(
          "transitionend",
          () => ANIMATED_PROPERTIES.forEach((property) => item.style.removeProperty(property)),
          { once: true },
        );
      });
    });
  }, [delay, stagger]);

  return scope;
}
