"use client";

import Image from "next/image";
import { useState } from "react";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./MoodBoard.module.css";

/**
 * A pinned mood board, not a product grid.
 *
 * The shop page needs imagery, but a fourth uniform card grid is what made the
 * site feel repetitive in the first place. This is deliberately the opposite:
 * unequal tiles at unequal angles on a scattered layout, like boards actually
 * pinned on a studio wall. Every tile is tilted and can be picked up — clicking
 * one brings it to the front and straightens it.
 *
 * The photographs are the showroom and material shots, which no other page owns
 * (see lib/library-images.ts for the one-photograph-one-owner rule).
 */

export type MoodTile = {
  src: string;
  alt: string;
  label: string;
  /** Percentage position and size on the board — hand-placed, not generated. */
  x: number;
  y: number;
  w: number;
  rotate: number;
  /**
   * Print format, e.g. "4/5" or "1/1". Defaults to 4/5. A real board is pinned
   * with prints at whatever size they came off the printer; eleven tiles at one
   * identical ratio reads as a grid someone rotated, which is the thing this
   * component exists to not be.
   */
  ratio?: string;
};

export function MoodBoard({
  tiles,
  label,
  heading,
  body,
}: {
  tiles: MoodTile[];
  label: string;
  heading: React.ReactNode;
  body: string;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const [front, setFront] = useState<number | null>(null);

  return (
    <section className={styles.section} id="mood-board">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.label}>{label}</span>
        <h2>{heading}</h2>
        <p>{body}</p>
        <span className={styles.hint}>Pick one up</span>
      </div>

      <div className={styles.board}>
        {tiles.map((t, i) => {
          const lifted = front === i;
          return (
            <button
              key={t.src}
              type="button"
              className={`${styles.tile} ${lifted ? styles.tileLifted : ""}`}
              style={
                {
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  width: `${t.w}%`,
                  // Straightens and rises when picked up.
                  "--tile-rotate": lifted ? "0deg" : `${t.rotate}deg`,
                  "--tile-ratio": t.ratio ?? "4 / 5",
                } as React.CSSProperties
              }
              onClick={() => setFront(lifted ? null : i)}
              onMouseEnter={() => setCursor("hover", lifted ? "Put back" : t.label)}
              onMouseLeave={resetCursor}
              aria-pressed={lifted}
            >
              <span className={styles.pin} aria-hidden />
              <span className={styles.tileImage}>
                <Image src={t.src} alt={t.alt} fill loading="lazy" sizes="(max-width: 720px) 60vw, 30vw" />
              </span>
              <span className={styles.tileLabel}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
