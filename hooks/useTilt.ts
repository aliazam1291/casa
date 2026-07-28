"use client";

import { useRef, useCallback } from "react";

/**
 * Pointer-driven 3D tilt for gallery/composition cards — the cursor position
 * over the card drives --tilt-x/--tilt-y/--tilt-s CSS custom properties,
 * which the card's own stylesheet turns into a perspective transform. Style
 * is mutated directly on the ref (no state, no re-render) so it stays smooth
 * at 60fps under the masonry grid's many simultaneous listeners.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 10) {
  const ref = useRef<T | null>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-x", `${(-py * maxDeg).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(px * maxDeg).toFixed(2)}deg`);
      el.style.setProperty("--tilt-s", "1.02");
      el.style.setProperty("--glow-x", `${(px * 0.5 + 0.5) * 100}%`);
      el.style.setProperty("--glow-y", `${(py * 0.5 + 0.5) * 100}%`);
    },
    [maxDeg]
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-s", "1");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
