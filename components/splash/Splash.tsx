"use client";

import { useEffect, useState } from "react";
import { WolfMark } from "@/components/brand/WolfMark";
import { Wordmark } from "@/components/brand/Wordmark";
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

// The splash locks body scroll for HOLD + FADE on every full page load, so
// these are a direct tax on time-to-interactive rather than just decoration.
// Timings here and the choreography in Splash.module.css are one clock — keep
// them in step if either moves.
const HOLD_MS = 1100;
const FADE_MS = 450;

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
        <WolfMark className={styles.mark} />

        <h1 className={styles.wordmarkLine}>
          <Wordmark
            className={styles.wordmark}
            letterClassName={styles.letter}
            gapClassName={styles.gap}
          />
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
