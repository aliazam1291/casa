"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "./CursorProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouch } from "@/hooks/useIsTouch";
import styles from "./CustomCursor.module.css";

/**
 * Two-part custom cursor: 6px dot + 36px trailing ring, both
 * mix-blend-mode: difference. Ported from wolf-casa-homepage-v3.html's
 * cursor script (~line 638). Disabled on touch and under reduced motion —
 * Design_System_v3.md §5.
 */
export function CustomCursor() {
  const { state, label } = useCursor();
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const disabled = isTouch || reducedMotion;

  useEffect(() => {
    if (disabled) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${mx}px, ${my + 40}px) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [disabled]);

  if (disabled) return null;

  const stateClass =
    state === "hover"
      ? styles.hover
      : state === "drag"
        ? styles.drag
        : state === "3d"
          ? styles.threeD
          : "";

  return (
    <>
      <div ref={ringRef} className={`${styles.ring} ${stateClass}`} />
      <div ref={dotRef} className={`${styles.dot} ${stateClass}`} />
      <div
        ref={labelRef}
        className={`${styles.label} ${state === "hover" ? styles.labelVisible : ""}`}
      >
        {label}
      </div>
    </>
  );
}
