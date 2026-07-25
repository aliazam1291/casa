"use client";

import { useEffect, useRef, useState } from "react";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Stats.module.css";

type Stat = { target: number; suffix: string; label: string };

const STATS: Stat[] = [
  { target: 15, suffix: "yrs", label: "Of craft & built legacy" },
  { target: 40, suffix: "k ft²", label: "In-house manufacturing" },
  { target: 110, suffix: "+", label: "Hands behind the house" },
  { target: 12, suffix: "", label: "Named objects composed" },
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
    <div ref={ref} className={styles.stats}>
      {STATS.map((stat) => (
        <StatCell key={stat.label} stat={stat} active={inView} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}
