"use client";

import { useEffect, useState } from "react";
import styles from "./Splash.module.css";

/**
 * The front door. A geometric wolf mark draws itself, the wordmark settles
 * under it, and the whole thing lifts away — covering the moment the gallery
 * hero spends warming up its WebGL context, which previously showed as a bare
 * "Composing the house" bar over an empty stage.
 *
 * Mounted in the root layout, which persists across client-side navigation,
 * so this runs once per real page load rather than on every route change —
 * no sessionStorage flag needed, and no hydration mismatch from reading one.
 *
 * The mark is drawn rather than served: there is no logo asset in /public,
 * and an inline SVG can animate its own strokes.
 */

const HOLD_MS = 1750;
const FADE_MS = 750;

export function Splash() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 400 : HOLD_MS;

    const toLeave = window.setTimeout(() => setLeaving(true), hold);
    const toGone = window.setTimeout(() => setGone(true), hold + FADE_MS);

    // The page behind must not scroll under the splash.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(toLeave);
      window.clearTimeout(toGone);
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (gone) document.body.style.overflow = "";
  }, [gone]);

  if (gone) return null;

  return (
    <div
      className={`${styles.splash} ${leaving ? styles.leaving : ""} leather`}
      role="status"
      aria-label="Wolf Casa"
    >
      <div className={styles.inner}>
        <svg className={styles.mark} viewBox="0 0 100 100" aria-hidden>
          {/* head: two ears, a brow dip, tapering to the snout */}
          <path
            className={styles.head}
            d="M18 10 L36 34 L50 28 L64 34 L82 10 L76 46 L50 92 L24 46 Z"
          />
          <path className={styles.eye} d="M35 47 L44 51" />
          <path className={styles.eye} d="M65 47 L56 51" />
          <path className={styles.muzzle} d="M50 62 L50 79" />
        </svg>

        <h1 className={styles.wordmark}>
          <span>W</span><span>O</span><span>L</span><span>F</span>
          <i className={styles.gap} />
          <span>C</span><span>A</span><span>S</span><span>A</span>
        </h1>

        <span className={styles.established}>Established since 2024</span>

        <div className={styles.rule}>
          <i />
        </div>

        <span className={styles.note}>Composing the house</span>
      </div>
    </div>
  );
}
