"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { MATERIAL_IMAGES } from "@/lib/library-images";
import { MATERIALS as ALL_MATERIALS } from "@/lib/materials";
import styles from "./MaterialsBoard.module.css";

/** Read off the derived library so the cross-link can never quote a stale
    number — see lib/materials.ts. */
const MATERIALS_COUNT = ALL_MATERIALS.length;

const MATERIALS = [
  {
    id: "marble",
    label: "Marble",
    subtitle: "Calcite · Metamorphic Stone",
    heading: "Calacatta & Nero Marquina",
    body: "Marble is the primary surface material in every Wolf Casa composition. We source from quarries in Carrara and the Basque country, selecting slabs by the vein pattern and the translucency of the stone — never from a catalogue sheet.",
    specs: [
      { key: "Primary use", value: "Counters, floors, statement walls" },
      { key: "Typical thickness", value: "20–30 mm honed or polished" },
      { key: "Signature grades", value: "Calacatta Gold, Nero Marquina" },
      { key: "Finish", value: "Honed matte or polished high-gloss" },
    ],
    image: MATERIAL_IMAGES.marble,
    accent: "#c9a87e",
  },
  {
    id: "wood",
    label: "Wood",
    subtitle: "Walnut · Ash · Teak",
    heading: "Walnut & Kiln-Dried Ash",
    body: "Timber enters Wolf Casa as cabinetry, desk surfaces and bed frames. Walnut is the house wood — its warm red-brown grain ages with the leather and the brass rather than against it. Ash is used for upholstered frames where lightness is structural.",
    specs: [
      { key: "Primary use", value: "Cabinetry, frames, flooring" },
      { key: "Grain treatment", value: "Stain-free, natural oil finish" },
      { key: "Signature species", value: "American Walnut, Kiln-dried Ash" },
      { key: "Ageing quality", value: "Darkens gradually, improves" },
    ],
    image: MATERIAL_IMAGES.wood,
    accent: "#8a5938",
  },
  {
    id: "stone",
    label: "Stone",
    subtitle: "Travertine · Limestone",
    heading: "Travertine & Lava Stone",
    body: "Travertine and limestone are used for wall cladding and outdoor surfaces. Their porous quality means they age openly — the weathering is intentional, not a failure. Lava stone grounds fire elements and outdoor cooking structures.",
    specs: [
      { key: "Primary use", value: "Wall cladding, terrace paving" },
      { key: "Surface character", value: "Filled or unfilled, aged" },
      { key: "Signature grades", value: "Classic Travertine, Pietra Serena" },
      { key: "Ageing quality", value: "Weathers naturally to patina" },
    ],
    image: MATERIAL_IMAGES.stone,
    accent: "#8a8376",
  },
  {
    id: "textile",
    label: "Textile",
    subtitle: "Velvet · Bouclé · Linen",
    heading: "Velvet, Bouclé & Saddle Leather",
    body: "The Wolf Casa upholstery palette is narrow on purpose: one leather, two wovens and two velvets. Decisions inside that palette are made by touch rather than swatch — we bring samples home rather than specifying from a screen.",
    specs: [
      { key: "Primary use", value: "Upholstery, bed headers, cushions" },
      { key: "Signature fabrics", value: "Cognac saddle leather, ivory bouclé" },
      { key: "Velvet tones", value: "Forest cotton, Terracotta" },
      { key: "Linen weight", value: "Heavy Belgian linen, washed" },
    ],
    image: MATERIAL_IMAGES.textile,
    accent: "#c9bda6",
  },
] as const;

export function MaterialsBoard() {
  const [active, setActive] = useState<string>("marble");
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();

  const material = MATERIALS.find((m) => m.id === active) ?? MATERIALS[0];

  return (
    <section className={`${styles.section} plaster`} id="materials-knowledge">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.num}>Knowing the materials</span>
        <h2 className={styles.heading}>
          Stone, timber &amp; textile —<br />
          <em>resolved as one decision.</em>
        </h2>
        <p className={styles.subhead}>
          Every surface in the villa is chosen for tactility, ageing quality and the way it relates to every other material in the composition — not for its name or its price.
        </p>
      </div>

      {/* Material selector tabs — Radix gives this real tablist semantics
          (roving tabindex, arrow-key navigation, aria-selected/aria-controls)
          instead of a row of plain buttons faking the role. */}
      <Tabs.Root value={active} onValueChange={setActive}>
        <Tabs.List className={styles.tabs} aria-label="Material categories">
          {MATERIALS.map((m) => (
            <Tabs.Trigger
              key={m.id}
              value={m.id}
              className={`${styles.tab} ${active === m.id ? styles.tabActive : ""}`}
              onMouseEnter={() => setCursor("hover", m.label)}
              onMouseLeave={resetCursor}
              style={{ "--tab-accent": m.accent } as React.CSSProperties}
            >
              <span className={styles.tabLabel}>{m.label}</span>
              <span className={styles.tabSub}>{m.subtitle}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Active material detail panel */}
        <Tabs.Content value={active} asChild>
          <div className={styles.panel} key={material.id}>
            <div className={styles.panelImage}>
              <Image
                src={material.image}
                alt={material.heading}
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                priority={active === "marble"}
              />
              <div className={styles.panelImageOverlay} />
              <span className={styles.panelTag}>{material.label} · Wolf Casa Library</span>
            </div>
            <div className={styles.panelInfo}>
              <small className={styles.panelEyebrow}>{material.subtitle}</small>
              <h3 className={styles.panelTitle}>{material.heading}</h3>
              <p className={styles.panelBody}>{material.body}</p>
              <dl className={styles.specList}>
                {material.specs.map((s) => (
                  <div key={s.key} className={styles.specRow}>
                    <dt>{s.key}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Grid of all 4 material thumbnails — a second, always-visible way to
          switch material alongside the tablist above. */}
      <div className={styles.thumbGrid}>
        {MATERIALS.map((m, i) => (
          <div
            key={m.id}
            className={`${styles.thumb} ${active === m.id ? styles.thumbActive : ""}`}
            onClick={() => setActive(m.id)}
            onMouseEnter={() => setCursor("hover", m.label)}
            onMouseLeave={resetCursor}
          >
            <div className={styles.thumbImg}>
              <Image
                src={m.image}
                alt={m.heading}
                fill
                loading="lazy"
                sizes="25vw"
              />
            </div>
            <span className={styles.thumbNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.thumbName}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* DEPTH HERE, BREADTH THERE. This board is four materials with a
          specimen paragraph each — how a slab is chosen, how it ages, what it
          is for. /shop's MaterialIndex is the other half: all {MATERIALS_COUNT}
          materials the house actually specifies, derived from the pieces, with
          a swatch and the pieces made of each.
          Neither replaces the other, and until now neither knew the other
          existed — so a visitor who wanted the full palette had no way to find
          it from the page that says "knowing the materials". */}
      <Link
        href="/shop#materials"
        className={styles.libraryLink}
        onMouseEnter={() => setCursor("hover", "Open")}
        onMouseLeave={resetCursor}
      >
        <span>The full library</span>
        <em>
          All {MATERIALS_COUNT} materials in the house, across seven families
        </em>
        <i aria-hidden>→</i>
      </Link>
    </section>
  );
}
