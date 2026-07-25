"use client";

import { useStage } from "./StageProvider";
import styles from "./StageBackground.module.css";

/**
 * Fixed, full-viewport cream wash sitting behind the whole document.
 * Opacity-only cross-fade (compositor-cheap) — page stays #0A0A0A by
 * default; the Composed Room section is the only claimant of "cream".
 */
export function StageBackground() {
  const { activeColor } = useStage();
  return (
    <div
      aria-hidden
      className={`${styles.wash} ${activeColor === "cream" ? styles.active : ""}`}
    />
  );
}
