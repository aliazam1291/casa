"use client";

import { useInViewport } from "./useInViewport";

/**
 * Ports the prototype's `.reveal` IntersectionObserver (threshold 0.12,
 * fires once) — wolf-casa-homepage-v3.html ~line 935. Pair with the
 * `.reveal` class in app/globals.css.
 */
export function useReveal<T extends Element>() {
  const [ref, inView] = useInViewport<T>({ threshold: 0.12, once: true });
  return { ref, inView };
}
