"use client";

import { useEffect, useRef } from "react";
import { onScrollVelocity } from "./SmoothScrollProvider";
import { prefersReducedMotion, clamp, lerp } from "@/lib/motion";
import styles from "./VariableProximity.module.css";

/**
 * Variable Proximity — the React Bits effect, rebuilt on the real variable
 * axes of --font-kinetic (Archivo: wght 100-900, wdth 62-125).
 *
 * Each glyph's distance from the cursor drives its weight and width
 * continuously, so the line thickens and expands under the pointer and thins
 * back out as it leaves. Scroll velocity is folded into the same value, which
 * is what ties the type to the momentum scrolling: a hard flick swells the
 * whole line at once.
 *
 * PERFORMANCE — this is the expensive effect on the page, so:
 *   - One rAF for the whole component, not one per glyph.
 *   - ONE getBoundingClientRect per frame (the container's). Glyph centres are
 *     measured once and cached as offsets relative to the container, so a
 *     200-glyph headline costs one layout read per frame instead of 200.
 *   - Writes go straight to `style.fontVariationSettings` on the glyph, never
 *     through React state — a per-frame setState here would re-render the tree
 *     60x/second.
 *   - The loop parks itself when the pointer is far away AND the line has
 *     settled back to its resting value, so an idle headline costs nothing.
 */

type VariableProximityProps = {
  children: string;
  /** Radius in px within which a glyph reacts at all. */
  radius?: number;
  /** Weight axis range, [resting, peak]. */
  weight?: [number, number];
  /** Width axis range, [resting, peak]. */
  width?: [number, number];
  /** How strongly scroll velocity swells the whole line (0 disables). */
  velocityInfluence?: number;
  className?: string;
  /** Rendered element — headlines should pass the real heading tag. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

export function VariableProximity({
  children,
  radius = 220,
  weight = [200, 800],
  width = [92, 118],
  velocityInfluence = 0.55,
  className,
  as: Tag = "span",
}: VariableProximityProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  // Cached glyph centres, relative to the container's top-left.
  const centresRef = useRef<{ x: number; y: number }[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, inside: false });
  const velocityRef = useRef(0);
  // Per-glyph eased state, so glyphs ease toward their target instead of
  // snapping — this is what makes it feel liquid rather than switch-like.
  const easedRef = useRef<number[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reduced motion: leave the glyphs at their resting axes. They are already
    // rendered at those values inline, so there is nothing to undo.
    if (prefersReducedMotion()) return;

    // Collected from the DOM rather than via ref callbacks during render:
    // the glyph list is derived entirely from `children`, which this effect
    // already depends on, so querying here keeps render pure.
    const glyphs = Array.from(
      container.querySelectorAll<HTMLSpanElement>(`.${styles.glyph}`),
    );
    easedRef.current = new Array(glyphs.length).fill(0);

    const measure = () => {
      const base = container.getBoundingClientRect();
      centresRef.current = glyphs.map((glyph) => {
        const r = glyph.getBoundingClientRect();
        return {
          x: r.left - base.left + r.width / 2,
          y: r.top - base.top + r.height / 2,
        };
      });
    };

    measure();

    // Fonts swap in after first paint; without remeasuring, every centre is
    // computed against the fallback face's metrics and the effect is offset.
    if (document.fonts?.ready) void document.fonts.ready.then(measure);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, inside: true };
    };
    const onPointerLeave = () => {
      pointerRef.current.inside = false;
    };

    // Listen on the window, not the element: the effect should respond to the
    // cursor approaching the headline, which means reacting before the pointer
    // is over it. `passive` keeps it off the scroll-blocking path.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const unsubscribe = onScrollVelocity((v) => {
      velocityRef.current = Math.abs(v);
    });

    const [wMin, wMax] = weight;
    const [wdMin, wdMax] = width;

    let frame = 0;
    let idleFrames = 0;

    const tick = () => {
      const base = container.getBoundingClientRect();
      const centres = centresRef.current;
      const eased = easedRef.current;
      const { x: px, y: py, inside } = pointerRef.current;
      const velocity = velocityRef.current * velocityInfluence;

      // Pointer position in container space — one layout read per frame.
      const localX = px - base.left;
      const localY = py - base.top;

      let moved = false;

      for (let i = 0; i < glyphs.length; i += 1) {
        const centre = centres[i];
        if (!centre) continue;

        let target = velocity;
        if (inside) {
          const dx = localX - centre.x;
          const dy = localY - centre.y;
          const distance = Math.hypot(dx, dy);
          if (distance < radius) {
            // Cosine falloff: smooth at both ends, so there is no visible
            // edge where glyphs start reacting.
            const proximity = 0.5 + Math.cos((distance / radius) * Math.PI) / 2;
            target = Math.max(target, proximity);
          }
        }
        target = clamp(target, 0, 1);

        const next = lerp(eased[i] ?? 0, target, 0.18);
        if (Math.abs(next - (eased[i] ?? 0)) > 0.001) moved = true;
        eased[i] = next;

        glyphs[i].style.fontVariationSettings = `"wght" ${Math.round(
          wMin + (wMax - wMin) * next,
        )}, "wdth" ${(wdMin + (wdMax - wdMin) * next).toFixed(1)}`;
      }

      // Park the loop once nothing is changing and nothing can change, then
      // let the next pointermove/velocity tick restart it.
      idleFrames = moved || inside || velocity > 0.001 ? 0 : idleFrames + 1;
      if (idleFrames > 20) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // Restart the parked loop on any input that could change the target.
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", wake, { passive: true });
    const unsubscribeWake = onScrollVelocity((v) => {
      if (Math.abs(v) > 0.002) wake();
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointermove", wake);
      unsubscribe();
      unsubscribeWake();
    };
  }, [radius, weight, width, velocityInfluence, children]);

  // Split to words first, then glyphs, so the browser can still wrap on word
  // boundaries — splitting straight to glyphs breaks wrapping mid-word.
  const words = children.split(" ");

  return (
    <Tag
      ref={containerRef as React.Ref<never>}
      className={className ? `${styles.root} ${className}` : styles.root}
      style={
        {
          "--vp-wght": weight[0],
          "--vp-wdth": width[0],
        } as React.CSSProperties
      }
    >
      {/* The accessible text. The glyph spans below are aria-hidden so screen
          readers get one clean string instead of a letter-by-letter reading. */}
      <span className={styles.sr}>{children}</span>
      <span aria-hidden className={styles.visual}>
        {words.map((word, w) => (
          <span key={`${word}-${w}`} className={styles.word}>
            {Array.from(word).map((char, c) => (
              <span key={`${c}-${char}`} className={styles.glyph}>
                {char}
              </span>
            ))}
            {w < words.length - 1 ? <span className={styles.space}> </span> : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
