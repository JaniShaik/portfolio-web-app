"use client";

import { motion, useAnimate, useInView, type HTMLMotionProps } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  /** Delay in seconds. */
  delay?: number;
  /** Vertical offset in pixels to animate from. */
  offsetY?: number;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Fades and slides content in when it scrolls into the viewport.
 *
 * Progressive enhancement: the server (and hydration) render plain, visible content,
 * so it is readable without JavaScript and there is no hydration mismatch. After
 * mount, only content that starts below the fold is hidden — before the browser
 * paints — and then animated in. Content already on screen is never hidden, and
 * nothing animates for users who prefer reduced motion.
 */
export function FadeIn({ delay = 0, offsetY = 16, children, ...props }: FadeInProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const isInView = useInView(scope, { once: true, margin: "0px 0px -10% 0px" });
  const isArmed = useRef(false);

  useLayoutEffect(() => {
    const element = scope.current;
    if (!element || isArmed.current) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    isArmed.current = true;
    void animate(element, { opacity: 0, y: offsetY }, { duration: 0 });
  }, [animate, offsetY, scope]);

  useEffect(() => {
    if (!isInView || !isArmed.current) return;
    void animate(scope.current, { opacity: 1, y: 0 }, { duration: 0.5, ease: "easeOut", delay });
  }, [animate, delay, isInView, scope]);

  return (
    <motion.div ref={scope} {...props}>
      {children}
    </motion.div>
  );
}
