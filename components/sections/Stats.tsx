"use client";

import { useEffect, useRef, useState } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PIECES } from "@/lib/pieces";
import { ROOMS } from "@/lib/rooms";
import styles from "./Stats.module.css";

type Stat = { target: number; suffix: string; label: string };

const FOUNDED_YEAR = 2024;

const STATS: Stat[] = [
  { target: FOUNDED_YEAR, suffix: "", label: "Established — Indore & Dewas" },
  { target: 40, suffix: "k ft²", label: "Across both facilities" },
  { target: 110, suffix: "+", label: "Specialist hands in-house" },
  { target: PIECES.length, suffix: "", label: `Named pieces across ${ROOMS.length} rooms` },
];

function StatCell({ stat, active, reducedMotion }: { stat: Stat; active: boolean; reducedMotion: boolean }) {
  const [animated, setAnimated] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    // Reduced motion shows the final value immediately, via the derived
    // `value` below — nothing to animate, so no effect/interval runs.
    if (reducedMotion || !active || done.current) return;
    done.current = true;

    const step = Math.max(1, Math.round(stat.target / 40));
    let n = 0;
    const iv = setInterval(() => {
      n += step;
      if (n >= stat.target) {
        n = stat.target;
        clearInterval(iv);
      }
      setAnimated(n);
    }, 30);

    return () => clearInterval(iv);
  }, [active, reducedMotion, stat.target]);

  const value = reducedMotion ? stat.target : animated;

  return (
    <div className={styles.stat}>
      <div className={styles.val}>
        {value}
        {stat.suffix && <em>{stat.suffix}</em>}
      </div>
      <div className={styles.lbl}>{stat.label}</div>
    </div>
  );
}

/** Ported from wolf-casa-homepage-v3.html's <div class="stats"> (~line 489). */
export function Stats() {
  const [ref, inView] = useInViewport<HTMLDivElement>({ threshold: 0.4, once: true });
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div ref={ref} className={`${styles.stats} leather`}>
      {STATS.map((stat) => (
        <StatCell key={stat.label} stat={stat} active={inView} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}
