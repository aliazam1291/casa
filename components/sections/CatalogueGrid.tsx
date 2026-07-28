"use client";

import Image from "next/image";
import Link from "next/link";
import { CATALOGUE } from "@/lib/catalogue";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./CatalogueGrid.module.css";

// Real photography only exists for two categories so far; the rest use the
// site's ambient architectural mood shots (not literal product photos, so
// there's no risk of mislabeling a piece under the wrong category).
const CATEGORY_IMAGES: Record<string, string> = {
  seating: "/images/catalogue/seating-sofas.webp",
  "bespoke-interiors": "/images/catalogue/bespoke-interiors-beds.webp",
};
const MOOD_IMAGES = [
  "/images/editorial/materials.png",
  "/images/editorial/light-form-atrium.png",
  "/images/editorial/villa-hero.png",
  "/images/editorial/sojourn.png",
] as const;

/** What a composition draws on — deliberately placed after the rooms
 * section, so it reads as "the material a room is built from" rather
 * than a shop menu. */
export function CatalogueGrid() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  let moodIndex = 0;

  return (
    <section className={styles.section} id="catalogue">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <p className={styles.rail}>
          <b>03</b> Product Universe
          <i>From SKU to room</i>
        </p>
        <h2>Every room draws on <em>eight categories.</em></h2>
      </div>
      <nav className={styles.grid} aria-label="Catalogue categories">
        {CATALOGUE.map((cat, i) => {
          const image = CATEGORY_IMAGES[cat.slug] ?? MOOD_IMAGES[moodIndex++ % MOOD_IMAGES.length];
          return (
            <Link
              key={cat.slug}
              href={`/catalogue/${cat.slug}`}
              className={styles.card}
              onMouseEnter={() => setCursor("hover", "View")}
              onMouseLeave={resetCursor}
            >
              <div className={styles.cardImage}>
                <Image src={image} alt={cat.name} fill loading="lazy" sizes="(max-width: 1100px) 50vw, 25vw" />
              </div>
              <div className={styles.cardBody}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{cat.name}</h3>
              </div>
            </Link>
          );
        })}
        {/* The terminal cell of the reference grid — the whole taxonomy
            resolving to one thing. Brass, per "punctuation only". */}
        <Link
          href="/rooms"
          className={`${styles.card} ${styles.cardTerminal}`}
          onMouseEnter={() => setCursor("hover", "Enter")}
          onMouseLeave={resetCursor}
        >
          <div className={styles.cardBody}>
            <span>09</span>
            <h3>The Room</h3>
          </div>
        </Link>
      </nav>
      <div className={styles.foot}>
        <Link href="/catalogue" onMouseEnter={() => setCursor("hover", "Browse")} onMouseLeave={resetCursor}>
          Browse the catalogue <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
