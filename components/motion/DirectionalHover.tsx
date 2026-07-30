"use client";

import { useCallback, useRef, type ReactNode, type PointerEvent } from "react";
import styles from "./DirectionalHover.module.css";

/**
 * Directional Hover — the Aceternity effect: the overlay slides in from the
 * edge the pointer actually crossed, and slides back out the edge it leaves by.
 *
 * THE MATHS: normalise the pointer to the element's centre, then compare
 * |dx| against |dy| scaled by the element's aspect ratio. Without the aspect
 * correction a wide card reports "left/right" for almost every entry,
 * including a clear top entry, because dx is simply bigger in absolute px.
 * The winning axis and its sign give one of four directions, which is written
 * to --dir-x/--dir-y as a unit vector and multiplied by the slide distance in
 * CSS. No state, no re-render — same custom-property idiom as hooks/useTilt.
 */

type Direction = { x: number; y: number };

function directionFrom(element: HTMLElement, clientX: number, clientY: number): Direction {
  const rect = element.getBoundingClientRect();
  // -0.5..0.5 on each axis, relative to the centre.
  const dx = (clientX - rect.left) / rect.width - 0.5;
  const dy = (clientY - rect.top) / rect.height - 0.5;
  // Scale dy by the aspect ratio so both axes are compared in the same space.
  const aspect = rect.width / Math.max(rect.height, 1);
  if (Math.abs(dx) > Math.abs(dy * aspect)) {
    return { x: dx > 0 ? 1 : -1, y: 0 };
  }
  return { x: 0, y: dy > 0 ? 1 : -1 };
}

export function DirectionalHover({
  children,
  overlay,
  className,
  onPointerEnter: onPointerEnterProp,
  onPointerLeave: onPointerLeaveProp,
}: {
  /** The card face — usually an image. */
  children: ReactNode;
  /** What slides in: title, index, metadata. */
  overlay: ReactNode;
  className?: string;
  onPointerEnter?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLDivElement>) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const apply = useCallback((e: PointerEvent<HTMLDivElement>, entering: boolean) => {
    const element = ref.current;
    if (!element) return;
    const { x, y } = directionFrom(element, e.clientX, e.clientY);
    element.style.setProperty("--dir-x", String(x));
    element.style.setProperty("--dir-y", String(y));
    element.dataset.hovered = entering ? "true" : "false";
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `${styles.root} ${className}` : styles.root}
      onPointerEnter={(e) => {
        // Touch has no hover — firing this on tap flashes the overlay and
        // then strands it, since no pointerleave follows a tap reliably.
        if (e.pointerType !== "touch") apply(e, true);
        onPointerEnterProp?.(e);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") apply(e, false);
        onPointerLeaveProp?.(e);
      }}
    >
      {children}
      <div className={styles.overlay} aria-hidden>
        <div className={styles.overlayInner}>{overlay}</div>
      </div>
    </div>
  );
}
