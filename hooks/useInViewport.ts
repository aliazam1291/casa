"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  rootMargin?: string;
  threshold?: number | number[];
  /** Once true, stay true — for one-shot mount/reveal triggers. */
  once?: boolean;
};

export function useInViewport<T extends Element>(
  options: Options = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const { rootMargin = "0px", threshold = 0, once = false } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootMargin, JSON.stringify(threshold), once]);

  return [ref, inView];
}
