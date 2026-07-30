"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";
import styles from "./ParallaxRows.module.css";

/**
 * Hero Parallax — the Aceternity showcase, rebuilt on GSAP ScrollTrigger.
 *
 * Two pieces, composed by the caller:
 *   <ParallaxStage>  the 3D entrance — the whole slab starts pitched back and
 *                    rises to flat as it scrolls in.
 *   <ParallaxRow>    a horizontal track that drifts as you scroll, alternating
 *                    direction per row so the wall shears rather than slides.
 *
 * WHY `scrub` AND NOT A TWEEN: these are scroll-*linked*, not scroll-triggered.
 * `scrub: 1` ties progress to scroll position with a 1s catch-up, which is what
 * makes it feel weighted against the Lenis momentum rather than fighting it.
 *
 * OVERFLOW: rows are deliberately wider than the viewport and translate on X.
 * The stage clips them, otherwise every row would extend the document width
 * and produce a horizontal scrollbar on the whole page.
 */

export function ParallaxStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    registerMotion();

    const inner = element.querySelector(`.${styles.stageInner}`);
    if (!inner) return;

    const tween = gsap.fromTo(
      inner,
      { rotateX: 14, y: 80, opacity: 0.25, scale: 0.94 },
      {
        rotateX: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top 92%",
          // Resolves to flat by the time the slab is a third up the viewport,
          // so the visitor reads the gallery straight-on, not pitched.
          end: "top 32%",
          scrub: 0.6,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className ? `${styles.stage} ${className}` : styles.stage}>
      <div className={styles.stageInner}>{children}</div>
    </div>
  );
}

export function ParallaxRow({
  children,
  /** 1 drifts right as you scroll down, -1 drifts left. */
  direction = 1,
  /** Total horizontal travel in px across the row's whole scroll range. */
  distance = 260,
  className,
}: {
  children: ReactNode;
  direction?: 1 | -1;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    registerMotion();

    const track = element.querySelector(`.${styles.track}`);
    if (!track) return;

    const tween = gsap.fromTo(
      track,
      { x: -direction * distance * 0.5 },
      {
        x: direction * distance * 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          // The row's travel is a function of viewport height, so a resize
          // (or a phone rotating) has to recompute it.
          invalidateOnRefresh: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [direction, distance]);

  return (
    <div ref={ref} className={className ? `${styles.row} ${className}` : styles.row}>
      <div className={styles.track}>{children}</div>
    </div>
  );
}
