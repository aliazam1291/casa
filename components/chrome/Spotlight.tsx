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
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div id="spotlight" aria-hidden />;
}
