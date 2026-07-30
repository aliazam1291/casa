"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import {
  MATERIALS,
  MATERIALS_BY_FAMILY,
  MATERIAL_FAMILIES,
  type MaterialEntry,
} from "@/lib/materials";
import { PIECES } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { getPieceImage } from "@/lib/library-images";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./MaterialIndex.module.css";

/** Stable index into the piece pool, so a piece's photograph never changes. */
const PIECE_INDEX = new Map(PIECES.map((p, i) => [p.slug, i]));

/**
 * THE MATERIAL INDEX — the tactile system, §ML, with all of it on the page.
 *
 * components/sections/MaterialsBoard.tsx (on /the-house-and-rooms) covers four
 * hand-written materials with a specimen paragraph each. That is a good
 * knowledge panel and a bad library: the studio specifies 44 distinct materials
 * across the 41 pieces and the site named four of them, so "Materials" read as
 * a token section rather than a discipline.
 *
 * This is the other half — breadth where the board has depth. Every material
 * the house actually uses, grouped into the book's families, with a swatch, a
 * count, and — the part that makes it a library rather than a list — the pieces
 * that are made of it, with their photographs. Picking "Champagne brass" shows
 * you the seventeen pieces it is on.
 *
 * All of it is derived from lib/pieces.ts (see lib/materials.ts), so it cannot
 * drift out of date the way four hand-written paragraphs can.
 */
export function MaterialIndex() {
  const [family, setFamily] = useState(MATERIAL_FAMILIES[0].slug);
  const [selected, setSelected] = useState<string | null>(null);
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();

  const activeFamily =
    MATERIAL_FAMILIES.find((f) => f.slug === family) ?? MATERIAL_FAMILIES[0];
  // Memoised so the `?? []` fallback does not mint a new array identity every
  // render and re-run the `active` memo below with it.
  const entries = useMemo(() => MATERIALS_BY_FAMILY[family] ?? [], [family]);

  // The selected material, or the family's commonest — the panel is never
  // empty, and the default is the material most representative of the family.
  const active: MaterialEntry | undefined = useMemo(
    () => entries.find((m) => m.name === selected) ?? entries[0],
    [entries, selected]
  );

  return (
    <section
      className={styles.section}
      id="materials"
      style={{ "--family-tone": activeFamily.tone } as React.CSSProperties}
    >
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.label}>The material library</span>
        <h2>
          {MATERIALS.length} materials. <em>Seven families.</em>
        </h2>
        <p>
          Stone, wood, metal, cloth, leather, glass — and light, which is the first one laid and the only
          one that never appears on a bill of materials. Pick any of them to see what in the house is made
          of it.
        </p>
        {/* The depth half. This index is every material, shallow; the board on
            /the-house-and-rooms is four materials in specimen detail — how a
            slab is chosen, how it ages, what it is for. */}
        <Link
          href="/the-house-and-rooms#materials-knowledge"
          className={styles.depthLink}
          onMouseEnter={() => setCursor("hover", "Read")}
          onMouseLeave={resetCursor}
        >
          How a material is chosen <span aria-hidden>→</span>
        </Link>
      </div>

      <Tabs.Root
        value={family}
        onValueChange={(v) => {
          setFamily(v);
          setSelected(null);
        }}
        activationMode="automatic"
        className={styles.body}
      >
        <Tabs.List className={styles.families} aria-label="Material families">
          {MATERIAL_FAMILIES.map((f, i) => (
            <Tabs.Trigger
              key={f.slug}
              value={f.slug}
              className={styles.family}
              style={{ "--tone": f.tone } as React.CSSProperties}
              onMouseEnter={() => setCursor("hover", f.name)}
              onMouseLeave={resetCursor}
            >
              <span className={styles.familySwatch} aria-hidden />
              <span className={styles.familyName}>{f.name}</span>
              <span className={styles.familyCount}>
                {MATERIALS_BY_FAMILY[f.slug]?.length ?? 0}
              </span>
              <span className={styles.familyNum}>{String(i + 1).padStart(2, "0")}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value={family} asChild forceMount>
          <div className={styles.panel} key={family}>
            <p className={styles.familyNote}>
              <em>{activeFamily.note}</em> {activeFamily.body}
            </p>

            {entries.length === 0 ? (
              // Light. Deliberately empty — see lib/materials.ts.
              <p className={styles.empty}>
                Nothing is listed here, and that is the entry. Light is specified before any object in the
                room and appears on no bill of materials — 2700K, layered, and decided first.
              </p>
            ) : (
              <>
                <div className={styles.swatches}>
                  {entries.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      className={`${styles.swatch} ${active?.name === m.name ? styles.swatchActive : ""}`}
                      style={{ "--swatch": m.swatch } as React.CSSProperties}
                      aria-pressed={active?.name === m.name}
                      onClick={() => setSelected(m.name)}
                      onMouseEnter={() => setCursor("hover", m.name)}
                      onMouseLeave={resetCursor}
                    >
                      <span className={styles.swatchChip} aria-hidden />
                      <span className={styles.swatchName}>{m.name}</span>
                      <span className={styles.swatchCount}>
                        {m.pieces.length} {m.pieces.length === 1 ? "piece" : "pieces"}
                      </span>
                    </button>
                  ))}
                </div>

                {active && (
                  <div className={styles.specimens} key={active.name}>
                    <div className={styles.specimensHead}>
                      <span className={styles.specimensSwatch} style={{ background: active.swatch }} aria-hidden />
                      <h3>{active.name}</h3>
                      <span className={styles.specimensCount}>
                        on {active.pieces.length} {active.pieces.length === 1 ? "piece" : "pieces"}
                      </span>
                    </div>
                    <div className={styles.specimensGrid}>
                      {active.pieces.map((piece) => (
                        <Link
                          key={piece.slug}
                          href={`/pieces/${piece.slug}`}
                          className={styles.specimen}
                          onMouseEnter={() => setCursor("hover", "View")}
                          onMouseLeave={resetCursor}
                        >
                          <div className={styles.specimenImage}>
                            <Image
                              src={getPieceImage(piece.slug, PIECE_INDEX.get(piece.slug) ?? 0)}
                              alt={piece.subtitle}
                              fill
                              loading="lazy"
                              sizes="(max-width: 720px) 45vw, 15vw"
                            />
                          </div>
                          <span className={styles.specimenName} lang={piece.lang}>
                            {piece.name}
                          </span>
                          <span className={styles.specimenSub}>{piece.subtitle}</span>
                          <span className={styles.specimenRoom}>
                            {getRoom(piece.roomSlug)?.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
