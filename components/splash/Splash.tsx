"use client";

import { useEffect, useState } from "react";
import { FullLogo } from "@/components/brand/FullLogo";
import styles from "./Splash.module.css";

/**
 * The front door. The lockup inks in — mark first, then WOLF and CASA letter by
 * letter — and the whole thing lifts away, covering the moment the gallery hero
 * spends warming up its WebGL context.
 *
 * Mounted in the root layout, which persists across client-side navigation, so
 * this runs once per real page load rather than on every route change — no
 * sessionStorage flag needed, and no hydration mismatch from reading one.
 *
 * NOW THE REAL ARTWORK. The old comment here read "the mark is drawn rather
 * than served: there is no logo asset in /public" — there is, in public/logo,
 * and this now renders it (see components/brand/FullLogo.tsx). One consequence
 * is deliberate and worth stating: the mark used to *draw itself* stroke by
 * stroke, which only worked because it was twelve open paths pretending to be
 * a logo. The real mark is a single closed compound path, and stroking its
 * outline to animate it would trace the silhouette as a wireframe — a
 * different, wrong mark for half a second. So the mark inks in and the eight
 * letters stagger instead: same choreography, real artwork.
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
        <h1 className={styles.wordmarkLine}>
          <FullLogo
            className={styles.logo}
            markClassName={styles.mark}
            letterClassName={styles.letter}
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
