"use client";

import Image from "next/image";
import Link from "next/link";
import { PRODUCT_UNIVERSE, type UniverseGroup } from "@/lib/product-universe";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { TiltCard3D, TiltLayer } from "@/components/motion/TiltCard3D";
import styles from "./CatalogueGrid.module.css";

// Curated photography per catalogue category — editorial quality, matching
// the aesthetic of each Wolf Casa product family. Local files only.
const MOOD_IMAGES = [
  "/images/editorial/materials.webp",
  "/images/editorial/light-form-atrium.webp",
  "/images/editorial/villa-hero.webp",
  "/images/editorial/sojourn.webp",
] as const;

/**
 * The metadata panel that slides up on hover.
 *
 * Everything in it is real data out of lib/product-universe.ts — the group's
 * part count, its constituent part names, and the book's own note on what the
 * group does. The one synthesised field is the composition ID, which is a
 * stable label derived from the group's position in the book's sequence
 * (§06 is an ordered list), not an invented SKU.
 */
function GroupMeta({ group, index }: { group: UniverseGroup; index: number }) {
  return (
    <div className={styles.meta}>
      <div className={styles.metaRow}>
        <span className={styles.metaKey}>Composition ID</span>
        <span className={styles.metaVal}>WC·PU—{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaKey}>Parts</span>
        <span className={styles.metaVal}>{String(group.items.length).padStart(2, "0")}</span>
      </div>
      <ul className={styles.metaParts}>
        {group.items.map((item) => (
          <li key={item.slug}>{item.name}</li>
        ))}
      </ul>
      <p className={styles.metaNote}>{group.note}</p>
    </div>
  );
}

function GridCard({
  href,
  num,
  title,
  image,
  group,
  index,
  terminal,
}: {
  href: string;
  num: string;
  title: string;
  image?: string;
  group?: UniverseGroup;
  index?: number;
  terminal?: boolean;
}) {
  const { setCursor, resetCursor } = useCursor();

  return (
    // The tilt viewport wraps the link rather than being the link: the
    // perspective has to live on an ancestor of the rotated plane, and the
    // whole card still needs to be one hit target.
    <TiltCard3D
      maxDeg={terminal ? 6 : 10}
      className={terminal ? `${styles.tilt} ${styles.tiltTerminal}` : styles.tilt}
      onPointerEnter={() => setCursor("hover", terminal ? "Enter" : "Inspect")}
      onPointerLeave={resetCursor}
    >
      <Link
        href={href}
        className={terminal ? `${styles.card} ${styles.cardTerminal}` : styles.card}
      >
        {image && (
          <TiltLayer depth={0} className={styles.cardImage}>
            <Image src={image} alt={title} fill loading="lazy" sizes="(max-width: 1100px) 50vw, 25vw" />
          </TiltLayer>
        )}
        {/* Floated toward the viewer so it parallaxes against the image
            behind it as the card turns — the depth cue the flat grid lacked. */}
        <TiltLayer depth={46} className={styles.cardBody}>
          <span>{num}</span>
          <h3>{title}</h3>
        </TiltLayer>
        {group && index !== undefined && (
          <TiltLayer depth={64} className={styles.metaLayer}>
            <GroupMeta group={group} index={index} />
          </TiltLayer>
        )}
      </Link>
    </TiltCard3D>
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
          is twenty parts in five groups; the grid shows the five groups, since
          twenty cells would not read at this size. The twenty parts themselves
          are now reachable — they're in each card's hover metadata.
          (The comment here used to say "four stages" in three places while the
          data has always had five groups.) */}
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
              group={group}
              index={i}
            />
          );
        })}
        {/* The terminal cell — the whole list resolving to one thing, which is
            where the book ends the Product Universe too. Brass, per
            "punctuation only". */}
        <GridCard
          href="/the-house-and-rooms"
          num={String(PRODUCT_UNIVERSE.length + 1).padStart(2, "0")}
          title="The Room"
          terminal
        />
      </nav>
      <div className={styles.foot}>
        <Link href="/shop" onMouseEnter={() => setCursor("hover", "Browse")} onMouseLeave={resetCursor}>
          Every category, under one roof <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
