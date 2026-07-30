"use client";

import Image from "next/image";
import Link from "next/link";
import { PRODUCT_UNIVERSE } from "@/lib/product-universe";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { useTilt } from "@/hooks/useTilt";
import { KITCHEN_BATH_IMAGES, LIGHTING_IMAGES, DECOR_IMAGES } from "@/lib/library-images";
import styles from "./CatalogueGrid.module.css";

// Curated photography per catalogue category — editorial quality, matching
// the aesthetic of each Wolf Casa product family. Local files only.
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
        <h2>Every room draws on <em>twenty parts.</em></h2>
      </div>
      {/* Was the eight invented categories. The book's Product Universe (§06)
          is twenty parts in four stages; the grid shows the four stages, since
          twenty cells would not read at this size. */}
      <nav className={styles.grid} aria-label="What a room is composed from">
        {PRODUCT_UNIVERSE.map((group, i) => {
          const image = MOOD_IMAGES[moodIndex++ % MOOD_IMAGES.length];
          return (
            <GridCard
              key={group.slug}
              href="/shop"
              num={String(i + 1).padStart(2, "0")}
              title={group.title}
              image={image}
            />
          );
        })}
        {/* The terminal cell — the whole list resolving to one thing, which is
            where the book ends the Product Universe too. Brass, per
            "punctuation only". */}
        <GridCard href="/the-house-and-rooms" num="05" title="The Room" terminal />
      </nav>
      <div className={styles.foot}>
        <Link href="/shop" onMouseEnter={() => setCursor("hover", "Browse")} onMouseLeave={resetCursor}>
          Every category, under one roof <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
