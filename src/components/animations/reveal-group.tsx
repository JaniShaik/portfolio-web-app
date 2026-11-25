"use client";

import type { HTMLAttributes } from "react";
import { REVEAL_ITEM_SELECTOR } from "./reveal-item";
import { useScrollReveal } from "./use-scroll-reveal";

interface RevealGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Milliseconds between items. */
  stagger?: number;
  /** Vertical offset in pixels to animate from. */
  offsetY?: number;
}

/**
 * Reveals every `[data-reveal]` descendant in document order, with a short stagger, when the
 * group scrolls into view. Children stay Server Components; spread `REVEAL_ITEM` on the
 * elements to animate so lists keep their semantic `ul`/`li` markup.
 */
export function RevealGroup({
  stagger = 0.08,
  offsetY = 16,
  children,
  ...props
}: RevealGroupProps) {
  const scope = useScrollReveal<HTMLDivElement>({ target: REVEAL_ITEM_SELECTOR, stagger, offsetY });

  return (
    <div ref={scope} {...props}>
      {children}
    </div>
  );
}
