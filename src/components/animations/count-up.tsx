"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { observeOnce, shouldAnimateOnScroll } from "./use-scroll-reveal";

interface CountUpProps {
  /** Final value as displayed, e.g. "40". Non-integer values render unchanged. */
  value: string;
  /** Milliseconds. */
  duration?: number;
}

/** Fast start, gentle settle; matches the `--ease-out-expo` feel of the reveals. */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Counts an integer up from 0 once, when it scrolls into view. Like `FadeIn`, it only runs
 * for values that start below the fold and never for reduced-motion users; otherwise (and
 * without JavaScript) the final value is shown. The text is updated directly in a finite
 * `requestAnimationFrame` loop, so counting never re-renders React, and the width is
 * reserved so the layout does not shift.
 */
export function CountUp({ value, duration = 1200 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isArmed = useRef(false);
  const target = /^\d+$/.test(value) ? Number(value) : null;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || target === null || !shouldAnimateOnScroll(element)) return;
    isArmed.current = true;
    element.textContent = "0";
  }, [target]);

  useEffect(() => {
    const element = ref.current;
    if (!element || target === null || !isArmed.current) return;

    let frame = 0;
    const stopObserving = observeOnce(element, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = String(Math.round(easeOutExpo(progress) * target));
        if (progress < 1) frame = requestAnimationFrame(tick);
        else element.textContent = value;
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      stopObserving();
      cancelAnimationFrame(frame);
      element.textContent = value;
    };
  }, [duration, target, value]);

  return (
    <span
      ref={ref}
      className="inline-block text-right tabular-nums"
      // Reserve the final width so counting through shorter numbers never shifts layout.
      style={{ minWidth: `${value.length}ch` }}
    >
      {value}
    </span>
  );
}
