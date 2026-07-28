"use client";

import Image from "next/image";
import Link from "next/link";
import { FEATURED_PIECES } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Gallery.module.css";

// The first six are real showroom photography (sourced from Wolf Casa's own
// site); the rest fall back to the site's ambient editorial mood shots.
const CARD_IMAGES = [
  "/images/showroom/living-lounge-brass.webp",
  "/images/showroom/dining-marble-mirror.webp",
  "/images/showroom/bedroom-suite-warm.webp",
  "/images/showroom/dining-set-black-gold.webp",
  "/images/showroom/dining-room-mirrorwall.webp",
  "/images/showroom/living-room-sectional.webp",
  "/images/editorial/light-form-atrium.png",
  "/images/editorial/villa-hero.png",
  "/images/editorial/materials.png",
  "/images/editorial/sojourn.png",
  "/images/catalogue/seating-sofas.webp",
  "/images/catalogue/bespoke-interiors-beds.webp",
] as const;

// A fixed cycle of aspect ratios gives the masonry its Pinterest rhythm —
// tall/short/square cards breaking the grid rather than a uniform strip.
const RATIOS = [1.25, 0.8, 1, 1.4, 0.9, 1.15] as const;

/** Vertical masonry (CSS columns, no JS layout) of the real named pieces
 * from the 3D walkthrough — scroll to browse, the way a Pinterest board
 * works, rather than a single-row drag strip. */
export function Gallery() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();

  return (
    <section className={styles.section}>
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.num}>§ 03 — Named Pieces</span>
        <h2 className={styles.heading}>
          <span className="upright">{FEATURED_PIECES.length}</span> <em>named pieces.</em>
        </h2>
      </div>
      <div className={styles.masonry}>
        {FEATURED_PIECES.map((piece, i) => (
          <Link
            key={piece.slug}
            href={`/pieces/${piece.slug}`}
            className={styles.card}
            onMouseEnter={() => setCursor("hover", "View")}
            onMouseLeave={resetCursor}
          >
            <div className={styles.img} style={{ aspectRatio: RATIOS[i % RATIOS.length] }}>
              <Image
                src={CARD_IMAGES[i % CARD_IMAGES.length]}
                alt={piece.name}
                fill
                loading="lazy"
                sizes="(max-width: 720px) 92vw, (max-width: 1200px) 45vw, 22vw"
              />
            </div>
            <span className={styles.cardNum}>{String(i + 1).padStart(2, "0")} · {getRoom(piece.roomSlug)?.name}</span>
            <div className={styles.cardTitle}>{piece.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
