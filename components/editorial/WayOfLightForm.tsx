"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
// The eight were declared inline here AND in ArchitectHub.tsx — see the note
// in lib/tokens.ts. One array now, and it carries the book's role for each
// colour, which is the half that was being dropped.
import { BRAND_COLOURS } from "@/lib/tokens";
import { CompositionBuilder } from "./CompositionBuilder";
import styles from "./WayOfLightForm.module.css";

const LENSES = [
  {
    tag: "01 / Light",
    title: "The room's first instruction.",
    quote: "Light decides what the eye remembers.",
    body: "Window light, lamp glow and curtain-filtered shadow are composed first. Furniture is placed into the light — never the other way round.",
    image: "/images/editorial/light-form-atrium.webp",
  },
  {
    tag: "02 / Form",
    title: "The honest weight of things.",
    quote: "Premium is not more. Premium is resolved.",
    body: "Every composition is built on proportion — the dialogue between heights, masses and the negative space that lets them breathe.",
    image: "/images/editorial/materials.webp",
  },
];

export function WayOfLightForm() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: paletteRef, inView: paletteIn } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/light-form-atrium.webp"
          alt="Sunlight cutting across a composed interior of wood and stone"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>Design Philosophy · Internal</p>
          <h1>Way of Light &amp; Form.</h1>
          <p>
            Our internal philosophy for how illumination, proportion, material and furniture geometry create emotional clarity inside a room —
            the lens behind every composition, felt by the customer, named only by us.
          </p>
        </div>
      </section>

      <section className={styles.diptych} aria-label="Light and Form">
        {LENSES.map((lens) => (
          <article
            key={lens.tag}
            className={styles.lens}
            onMouseEnter={() => setCursor("hover", "Read")}
            onMouseLeave={resetCursor}
          >
            <div className={styles.lensImage}>
              <Image src={lens.image} alt={lens.title} fill sizes="(max-width: 1000px) 100vw, 50vw" />
            </div>
            <div className={styles.lensCopy}>
              <span>{lens.tag}</span>
              <h2>{lens.title}</h2>
              <p className={styles.quote}>&ldquo;{lens.quote}&rdquo;</p>
              <p>{lens.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.palette}>
        <div ref={paletteRef} className={`reveal ${paletteIn ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Colour System</p>
          <h2>Leather, walnut, tea, shadow.</h2>
        </div>
        {/* The role is the useful half — "Brass: punctuation only, a rule, a
            line, one word" is the instruction; the hex is just the value. It
            arrives on hover/focus rather than sitting on eight cards at once. */}
        <div className={styles.swatchRow}>
          {BRAND_COLOURS.map((c) => (
            <div
              key={c.hex}
              tabIndex={0}
              onMouseEnter={() => setCursor("hover", c.name)}
              onMouseLeave={resetCursor}
            >
              <i style={{ background: c.hex }} aria-hidden />
              <span>{c.name}</span>
              <small>{c.hex}</small>
              {/* The inner span is required, not decorative: the 0fr → 1fr
                  grid reveal in the stylesheet needs a child box to collapse,
                  and a bare text node cannot be one. */}
              <p className={styles.swatchRole}>
                <span>{c.role}</span>
              </p>
            </div>
          ))}
        </div>
        <p className={styles.paletteRule}>
          Black holds the space. Ivory speaks. Brass punctuates — never a fill. Walnut &amp; green carry the
          material world.
        </p>
      </section>

      {/* Was four static cards describing a process. It now runs one — see
          components/editorial/CompositionBuilder.tsx. */}
      <CompositionBuilder />

      <section className={styles.quoteBanner}>
        <p>&ldquo;The lamp gives the sofa memory. The rug gives it territory.&rdquo;</p>
        <Link
          href="/experiences/consultation"
          onMouseEnter={() => setCursor("hover", "Begin")}
          onMouseLeave={resetCursor}
        >
          Begin your home composition
        </Link>
      </section>
    </main>
  );
}
