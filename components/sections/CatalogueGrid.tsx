"use client";

import Link from "next/link";
import { CATALOGUE } from "@/lib/catalogue";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./CatalogueGrid.module.css";

/** What a composition draws on — deliberately placed after the rooms
 * section, so it reads as "the material a room is built from" rather
 * than a shop menu. */
export function CatalogueGrid() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();

  return (
    <section className={styles.section} id="catalogue">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span>§ 03 — The Catalogue</span>
        <h2>Every room draws on <em>eight categories.</em></h2>
      </div>
      <nav className={styles.grid} aria-label="Catalogue categories">
        {CATALOGUE.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/catalogue/${cat.slug}`}
            className={styles.card}
            onMouseEnter={() => setCursor("hover", "View")}
            onMouseLeave={resetCursor}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h3>{cat.name}</h3>
          </Link>
        ))}
      </nav>
      <div className={styles.foot}>
        <Link href="/catalogue" onMouseEnter={() => setCursor("hover", "Browse")} onMouseLeave={resetCursor}>
          Browse the catalogue <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
