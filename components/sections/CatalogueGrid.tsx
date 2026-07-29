"use client";

import Image from "next/image";
import Link from "next/link";
import { CATALOGUE } from "@/lib/catalogue";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { useTilt } from "@/hooks/useTilt";
import { KITCHEN_BATH_IMAGES, LIGHTING_IMAGES, DECOR_IMAGES } from "@/lib/library-images";
import styles from "./CatalogueGrid.module.css";

// Curated photography per catalogue category — editorial quality, matching
// the aesthetic of each Wolf Casa product family. Local files only.
const CATEGORY_IMAGES: Record<string, string> = {
  seating: "/images/catalogue/seating-sofas.webp",
  "bespoke-interiors": "/images/catalogue/bespoke-interiors-beds.webp",
  "kitchen-bath": KITCHEN_BATH_IMAGES[0],
  lighting: LIGHTING_IMAGES[0],
  "decor-finishes": DECOR_IMAGES[0],
  "office-outdoor": DECOR_IMAGES[1],
  "greenery-entertainment": DECOR_IMAGES[2],
  "lighting-smart-living": LIGHTING_IMAGES[1],
};
const MOOD_IMAGES = [
  "/images/editorial/materials.webp",
  "/images/editorial/light-form-atrium.webp",
  "/images/editorial/villa-hero.webp",
  "/images/editorial/sojourn.webp",
] as const;

function GridCard({
  href,
  num,
  title,
  image,
  terminal,
}: {
  href: string;
  num: string;
  title: string;
  image?: string;
  terminal?: boolean;
}) {
  const { setCursor, resetCursor } = useCursor();
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLAnchorElement>(4);

  return (
    <Link
      ref={ref}
      href={href}
      className={terminal ? `${styles.card} ${styles.cardTerminal}` : styles.card}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        onPointerLeave();
        resetCursor();
      }}
      onMouseEnter={() => setCursor("hover", terminal ? "Enter" : "View")}
    >
      {image && (
        <div className={styles.cardImage}>
          <Image src={image} alt={title} fill loading="lazy" sizes="(max-width: 1100px) 50vw, 25vw" />
        </div>
      )}
      <div className={styles.cardBody}>
        <span>{num}</span>
        <h3>{title}</h3>
      </div>
    </Link>
  );
}

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
          <b>02</b> Product Universe
          <i>From SKU to room</i>
        </p>
        <h2>Every room draws on <em>eight categories.</em></h2>
      </div>
      <nav className={styles.grid} aria-label="Catalogue categories">
        {CATALOGUE.map((cat, i) => {
          const image = CATEGORY_IMAGES[cat.slug] ?? MOOD_IMAGES[moodIndex++ % MOOD_IMAGES.length];
          return (
            <GridCard
              key={cat.slug}
              href={`/catalogue/${cat.slug}`}
              num={String(i + 1).padStart(2, "0")}
              title={cat.name}
              image={image}
            />
          );
        })}
        {/* The terminal cell of the reference grid — the whole taxonomy
            resolving to one thing. Brass, per "punctuation only". */}
        <GridCard href="/the-house-and-rooms" num="09" title="The Room" terminal />
      </nav>
      <div className={styles.foot}>
        <Link href="/catalogue" onMouseEnter={() => setCursor("hover", "Browse")} onMouseLeave={resetCursor}>
          Browse the catalogue <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
