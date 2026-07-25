"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { Line } from "@react-three/drei";
import { ACCENT_LINE } from "./data/tokens";

const PERIMETER: [number, number, number][] = [
  [-5, 0.03, -3.5],
  [5, 0.03, -3.5],
  [5, 0.03, 3.5],
  [-5, 0.03, 3.5],
  [-5, 0.03, -3.5],
];

/**
 * Thin brass perimeter line outlining the diorama "stage" — the one
 * accent color reused across the site (Ritual Way accent, lib/tokens.ts).
 * Draws on along its length when `assemble` flips true (by growing the
 * visible point count — drei's <Line> wrapper sidesteps the raw <line>
 * JSX tag colliding with the SVG namespace under TypeScript); renders
 * complete immediately when `instant` is set (reduced motion).
 */
export function AccentLines({ assemble, instant }: { assemble: boolean; instant: boolean }) {
  // Only the animated (assemble && !instant) case needs stored state —
  // the instant and not-yet-assembling cases are pure functions of props,
  // so they're derived at render time rather than pushed through setState.
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    if (instant || !assemble) return;

    const proxy = { n: 0 };
    const tween = gsap.to(proxy, {
      n: PERIMETER.length - 1,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => setAnimatedCount(Math.max(2, Math.round(proxy.n) + 1)),
    });
    return () => {
      tween.kill();
      setAnimatedCount(0);
    };
  }, [assemble, instant]);

  const count = instant ? PERIMETER.length : !assemble ? 0 : animatedCount;

  if (count < 2) return null;

  return <Line points={PERIMETER.slice(0, count)} color={ACCENT_LINE} lineWidth={1} raycast={() => null} />;
}
