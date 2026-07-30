"use client";

import { useCallback, useRef, type ReactNode, type PointerEvent } from "react";
import styles from "./TiltCard3D.module.css";

/**
 * 3D Card Effect — the Aceternity component, rebuilt on the custom-property
 * idiom already used by hooks/useTilt.
 *
 * The difference from `useTilt` (which this does NOT replace — useTilt is
 * still right for a flat card that just needs a lean) is `preserve-3d` plus
 * <TiltLayer>: children sit at real Z depths inside the rotated plane, so the
 * image, the label and the metadata separate from each other as the card
 * turns. That parallax between layers is what sells the depth; a single-plane
 * rotation just looks like a skew.
 *
 * Pointer state is written to CSS custom properties on the ref, never React
 * state, so a grid of these costs no re-renders while the pointer moves.
 */

export function TiltCard3D({
  children,
  maxDeg = 12,
  className,
  onPointerEnter,
  onPointerLeave: onPointerLeaveProp,
}: {
  children: ReactNode;
  /** Peak rotation at the card's corner, in degrees. */
  maxDeg?: number;
  className?: string;
  onPointerEnter?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLDivElement>) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const element = ref.current;
      // Touch drags would tilt the card while the user is trying to scroll.
      if (!element || e.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--tilt-x", `${(-py * maxDeg).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(px * maxDeg).toFixed(2)}deg`);
      element.style.setProperty("--tilt-s", "1.03");
      // Drives the specular sheen so the highlight tracks the pointer.
      element.style.setProperty("--glow-x", `${((px + 0.5) * 100).toFixed(1)}%`);
      element.style.setProperty("--glow-y", `${((py + 0.5) * 100).toFixed(1)}%`);
      element.dataset.hovered = "true";
    },
    [maxDeg],
  );

  const onPointerLeave = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const element = ref.current;
      if (element) {
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
        element.style.setProperty("--tilt-s", "1");
        element.dataset.hovered = "false";
      }
      onPointerLeaveProp?.(e);
    },
    [onPointerLeaveProp],
  );

  return (
    <div
      ref={ref}
      className={className ? `${styles.viewport} ${className}` : styles.viewport}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerEnter={onPointerEnter}
    >
      <div className={styles.plane}>
        {children}
        <span className={styles.sheen} aria-hidden />
      </div>
    </div>
  );
}

/**
 * A child at a fixed Z depth inside the card. Higher `depth` floats further
 * toward the viewer and so parallaxes more as the card turns.
 * Depth is in px of translateZ; 0-80 is the useful range at this perspective.
 */
export function TiltLayer({
  children,
  depth = 0,
  className,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  return (
    <div
      className={className ? `${styles.layer} ${className}` : styles.layer}
      style={{ "--depth": `${depth}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
