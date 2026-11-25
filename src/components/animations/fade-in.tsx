"use client";

import type { HTMLAttributes } from "react";
import { useScrollReveal } from "./use-scroll-reveal";

interface FadeInProps extends HTMLAttributes<HTMLDivElement> {
  /** Delay in milliseconds. */
  delay?: number;
  /** Vertical offset in pixels to animate from. */
  offsetY?: number;
}

/** Fades and slides a single block in when it scrolls into view (see `useScrollReveal`). */
export function FadeIn({ delay = 0, offsetY = 16, children, ...props }: FadeInProps) {
  const scope = useScrollReveal<HTMLDivElement>({ delay, offsetY });

  return (
    <div ref={scope} {...props}>
      {children}
    </div>
  );
}
