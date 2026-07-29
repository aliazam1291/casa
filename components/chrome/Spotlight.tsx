"use client";

import { useEffect } from "react";

/**
 * A soft warm spotlight that trails the cursor (soft-light blend) — the
 * quiet cursor glow from the handoff. Purely decorative; disabled
 * under reduced motion via the CSS in globals.css.
 */
export function Spotlight() {
  useEffect(() => {
    const el = document.getElementById("spotlight");
    if (!el) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div id="spotlight" aria-hidden />;
}
