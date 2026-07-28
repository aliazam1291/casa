"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/catalogue";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useTilt } from "@/hooks/useTilt";
import styles from "./page.module.css";

/**
 * The category tiles carry the category's own photography as a dimming
 * background, revealed and tilted toward the cursor, so "eight categories"
 * reads as eight rooms rather than a menu. The sub-type names are printed
 * directly on the tile as their own links — previously you had to open the
 * category page to learn what was even inside it.
 */
export function CatalogueCard({ category, index, image }: { category: Category; index: number; image: string }) {
  const { setCursor, resetCursor } = useCursor();
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>(5);

  return (
    <div
      ref={ref}
      className={styles.card}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        onPointerLeave();
        resetCursor();
      }}
    >
      <Link
        href={`/catalogue/${category.slug}`}
        className={styles.cardMain}
        onMouseEnter={() => setCursor("hover", "Enter")}
        onMouseLeave={resetCursor}
      >
        <div className={styles.cardImage}>
          <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" loading="lazy" />
        </div>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h2>{category.name}</h2>
        <p>{category.description}</p>
      </Link>
      <div className={styles.subtypeRow} aria-label={`${category.name} sub-types`}>
        {category.subtypes.map((st) => (
          <Link
            key={st.slug}
            href={`/catalogue/${category.slug}/${st.slug}`}
            className={styles.subtypeChip}
            onMouseEnter={() => setCursor("hover", st.name)}
            onMouseLeave={resetCursor}
          >
            {st.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
