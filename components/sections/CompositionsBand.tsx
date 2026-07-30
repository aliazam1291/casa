"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { COMPOSITIONS } from "@/lib/compositions";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./CompositionsBand.module.css";

/**
 * The eight compositions, on the rooms page.
 *
 * A room and a composition are different things and the site never said so: the
 * thirteen rooms are the villa Wolf Casa has built, the eight compositions are
 * the moods you can ask for by name — "sellable moods a customer can ask for by
 * name", per the book's IP section. This band is the join between them, which is
 * why it sits with the rooms rather than only on /the-wolf-way.
 *
 * Each composition carries its own accent and emissive tone from
 * lib/compositions.ts, so hovering across the eight changes the colour of the
 * band. That is the point — eight named moods that all looked identically brass
 * were not eight of anything.
 */
export function CompositionsBand() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? 0;
  const comp = COMPOSITIONS[active];

  const hex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;

  return (
    <section
      className={styles.band}
      id="compositions"
      style={
        {
          "--comp-accent": hex(comp.accent),
          "--comp-glow": hex(comp.emissive),
        } as React.CSSProperties
      }
    >
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.label}>Eight signature compositions</span>
        <h2>
          Thirteen rooms. <em>Eight moods.</em>
        </h2>
        <p>
          The rooms above are the house we built. These are the moods you can ask for by name — a
          composition is what we bring to <em>your</em> room.
        </p>
      </div>

      <div className={styles.grid}>
        {COMPOSITIONS.map((c, i) => (
          <Link
            key={c.slug}
            href={`/the-wolf-way#${c.slug}`}
            className={`${styles.tile} ${i === active ? styles.tileActive : ""}`}
            style={{ "--tile-accent": hex(c.accent) } as React.CSSProperties}
            onMouseEnter={() => {
              setHovered(i);
              setCursor("hover", c.name);
            }}
            onMouseLeave={() => {
              setHovered(null);
              resetCursor();
            }}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
          >
            <div className={styles.tileImage}>
              <Image
                src={c.img}
                alt={c.name}
                fill
                loading="lazy"
                sizes="(max-width: 720px) 46vw, (max-width: 1100px) 30vw, 22vw"
              />
              <span className={styles.tileWash} aria-hidden />
            </div>
            <span className={styles.tileNum}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.tileName}>{c.name}</h3>
            <p className={styles.tileBlurb}>{c.blurb}</p>
            <span className={styles.tileMaterials}>{c.materials.join(" · ")}</span>
          </Link>
        ))}
      </div>

      <div className={styles.foot}>
        <p className={styles.quote}>&ldquo;{comp.pullQuote}&rdquo;</p>
        <Link
          href="/the-wolf-way"
          className={styles.footLink}
          onMouseEnter={() => setCursor("hover", "Read")}
          onMouseLeave={resetCursor}
        >
          All eight, in full <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
