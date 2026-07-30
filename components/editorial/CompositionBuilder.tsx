"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMPOSITIONS, type TimeOfDay } from "@/lib/compositions";
import { MATERIAL_FAMILIES } from "@/lib/materials";
import { PIECES, type Piece } from "@/lib/pieces";
import { getPieceImage } from "@/lib/library-images";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./CompositionBuilder.module.css";

/**
 * THE COMPOSITION BUILDER — "From SKU to Room", for real this time.
 *
 * This section was called a builder and was four static cards reading
 * "Step 01 — The anchor", "Step 02 — The light", "Step 03 — The layers",
 * "Result — The composition". It described a process instead of running one,
 * which on the page that explains the method is the weakest possible version
 * of the idea.
 *
 * It now actually resolves. The three steps are the book's own first three
 * principles, in the book's own order, and each one is a real input:
 *
 *   01 Begin with light          → picks the time of day
 *   02 Anchor with one form      → picks the dominant object
 *   03 Layer the material        → picks the material family
 *
 * WHAT DECIDES WHAT. Light and material choose the MOOD, because the book says
 * they do — "Light decides what the eye remembers", "Texture is proof". The
 * anchor chooses the OBJECT, not the mood: a low sofa can sit in Nocturne or in
 * Luxe Minimal, so letting it swing the result would be inventing a rule the
 * brand does not have.
 *
 * The output is always one of the eight owned compositions. There is no ninth
 * outcome and no "your custom mood" — the whole point of §10's IP section is
 * that a customer asks for these by name.
 */

const LIGHT_STEPS: { id: TimeOfDay; label: string; detail: string }[] = [
  { id: "dawn", label: "First light", detail: "Cool, low and blue — the room before the day starts." },
  { id: "midday", label: "Flat daylight", detail: "Overhead and honest. Nothing is hidden." },
  { id: "golden", label: "Late afternoon", detail: "Raking, warm, long shadows across the grain." },
  { id: "dusk", label: "Last hour", detail: "Falling light, and the lamps not yet winning." },
  { id: "night", label: "Lamplight only", detail: "One warm source. Everything else is shadow." },
];

/**
 * Anchors, matched to a real piece by its English subtitle so the builder can
 * never recommend an object the house does not make. `match` is checked
 * against `subtitle`, not `name`, because the names are Italian and German now
 * (see lib/pieces.ts) and "sofa" does not appear in "Divano Basso".
 */
const ANCHORS = [
  { id: "sofa", label: "A sofa", match: "sofa" },
  { id: "bed", label: "A bed", match: "bed" },
  { id: "table", label: "A table", match: "table" },
  { id: "chair", label: "A chair", match: "chair" },
];

function anchorPiece(match: string): Piece | undefined {
  return PIECES.find((p) => p.subtitle.toLowerCase().includes(match));
}

/** Families a customer actually picks between. Light is excluded — it is step 01. */
const MATERIAL_CHOICES = MATERIAL_FAMILIES.filter((f) => f.slug !== "light");

/**
 * Score every composition against the light and material chosen, and return
 * the best. Light is worth more than material because the book puts it first
 * and is unambiguous about why.
 */
function resolve(light: TimeOfDay, familySlug: string) {
  const family = MATERIAL_CHOICES.find((f) => f.slug === familySlug);
  const needle = family?.name.toLowerCase() ?? "";

  let best = COMPOSITIONS[0];
  let bestScore = -1;
  for (const c of COMPOSITIONS) {
    let score = 0;
    if (c.timeOfDay === light) score += 3;
    // The composition's own material list is prose ("Honed stone", "Blackened
    // brass"), so match the family name inside it rather than expecting a tag.
    if (needle && c.materials.some((m) => m.toLowerCase().includes(needle))) score += 2;
    // Green and stone read as the same family in the prose often enough that a
    // near-miss on tone is still worth a point over a total mismatch.
    if (needle === "wood" && c.materials.some((m) => /oak|walnut|teak/i.test(m))) score += 2;
    if (needle === "metal" && c.materials.some((m) => /brass|steel|bronze/i.test(m))) score += 2;
    if (needle === "cloth" && c.materials.some((m) => /linen|velvet|bouclé|boucle|wool/i.test(m))) score += 2;
    if (needle === "leather" && c.materials.some((m) => /leather|saddle/i.test(m))) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

const hex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;

export function CompositionBuilder() {
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();
  const [light, setLight] = useState<TimeOfDay>("night");
  const [anchor, setAnchor] = useState(ANCHORS[0].id);
  const [family, setFamily] = useState(MATERIAL_CHOICES[0].slug);

  const composition = useMemo(() => resolve(light, family), [light, family]);
  const piece = useMemo(() => {
    const found = ANCHORS.find((a) => a.id === anchor);
    return found ? anchorPiece(found.match) : undefined;
  }, [anchor]);
  const pieceIndex = piece ? PIECES.indexOf(piece) : 0;

  return (
    <section
      className={styles.section}
      id="composition-builder"
      style={{ "--result-accent": hex(composition.accent) } as React.CSSProperties}
    >
      <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
        <p className={styles.sectionLabel}>Composition Builder · From SKU to Room</p>
        <h2>How a product becomes a decision.</h2>
      </div>

      <div className={styles.body}>
        <div className={styles.steps}>
          <fieldset className={styles.step}>
            <legend>
              <span>01</span> Begin with light
            </legend>
            <div className={styles.choices}>
              {LIGHT_STEPS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={light === l.id}
                  className={`${styles.choice} ${light === l.id ? styles.choiceOn : ""}`}
                  onClick={() => setLight(l.id)}
                  onMouseEnter={() => setCursor("hover", l.label)}
                  onMouseLeave={resetCursor}
                >
                  <strong>{l.label}</strong>
                  <em>{l.detail}</em>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.step}>
            <legend>
              <span>02</span> Anchor the room with one form
            </legend>
            <div className={styles.choicesRow}>
              {ANCHORS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={anchor === a.id}
                  className={`${styles.pill} ${anchor === a.id ? styles.pillOn : ""}`}
                  onClick={() => setAnchor(a.id)}
                  onMouseEnter={() => setCursor("hover", a.label)}
                  onMouseLeave={resetCursor}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.step}>
            <legend>
              <span>03</span> Layer the material
            </legend>
            <div className={styles.choicesRow}>
              {MATERIAL_CHOICES.map((f) => (
                <button
                  key={f.slug}
                  type="button"
                  aria-pressed={family === f.slug}
                  className={`${styles.pill} ${family === f.slug ? styles.pillOn : ""}`}
                  style={{ "--pill-tone": f.tone } as React.CSSProperties}
                  onClick={() => setFamily(f.slug)}
                  onMouseEnter={() => setCursor("hover", f.name)}
                  onMouseLeave={resetCursor}
                >
                  <i aria-hidden />
                  {f.name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* The result. aria-live so the resolved composition is announced when
            a choice changes — otherwise the whole payoff is silent. */}
        <div className={styles.result} aria-live="polite">
          <div className={styles.resultImage}>
            <Image
              src={composition.img}
              alt={composition.name}
              fill
              sizes="(max-width: 1000px) 100vw, 42vw"
            />
            <span className={styles.resultBadge}>The composition</span>
          </div>
          <div className={styles.resultBody}>
            <h3>{composition.name}</h3>
            <p className={styles.resultBlurb}>{composition.blurb}</p>

            {piece && (
              <div className={styles.resultAnchor}>
                <div className={styles.resultAnchorImage}>
                  <Image
                    src={getPieceImage(piece.slug, pieceIndex)}
                    alt={piece.subtitle}
                    fill
                    sizes="88px"
                  />
                </div>
                <div>
                  <span className={styles.resultAnchorLabel}>Anchored by</span>
                  <Link
                    href={`/pieces/${piece.slug}`}
                    className={styles.resultAnchorName}
                    lang={piece.lang}
                    onMouseEnter={() => setCursor("hover", "View")}
                    onMouseLeave={resetCursor}
                  >
                    {piece.name}
                  </Link>
                  <span className={styles.resultAnchorSub}>{piece.subtitle}</span>
                </div>
              </div>
            )}

            <p className={styles.resultQuote}>&ldquo;{composition.pullQuote}&rdquo;</p>

            <div className={styles.resultActions}>
              <Link
                href={`/the-wolf-way#${composition.slug}`}
                onMouseEnter={() => setCursor("hover", "Read")}
                onMouseLeave={resetCursor}
              >
                See {composition.name} in full
              </Link>
              <Link
                href="/experiences/consultation"
                className={styles.resultPrimary}
                onMouseEnter={() => setCursor("hover", "Book")}
                onMouseLeave={resetCursor}
              >
                Compose this room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
