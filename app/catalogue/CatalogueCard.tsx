"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/catalogue";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useTilt } from "@/hooks/useTilt";
import styles from "./page.module.css";

/**
 * The category tiles were plain text on a flat ground — the least composed
 * corner of the catalogue. Each one now carries the category's own
 * photography as a dimming background, revealed and tilted toward the
 * cursor, so "eight categories" reads as eight rooms rather than a menu.
 */
export function CatalogueCard({ category, index, image }: { category: Category; index: number; image: string }) {
  const { setCursor, resetCursor } = useCursor();
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLAnchorElement>(5);

  return (
    <Link
      ref={ref}
      href={`/catalogue/${category.slug}`}
      className={styles.card}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        onPointerLeave();
        resetCursor();
      }}
      onMouseEnter={() => setCursor("hover", "Enter")}
    >
      <div className={styles.cardImage}>
        <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" loading="lazy" />
      </div>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <h2>{category.name}</h2>
      <p>{category.description}</p>
      <b>{category.subtypes.length} sub-types &rarr;</b>
    </Link>
  );
}
