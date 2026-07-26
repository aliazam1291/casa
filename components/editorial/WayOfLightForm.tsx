"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./WayOfLightForm.module.css";

const LENSES = [
  {
    tag: "01 / Light",
    title: "The room's first instruction.",
    quote: "Light decides what the eye remembers.",
    body: "Window light, lamp glow and curtain-filtered shadow are composed first. Furniture is placed into the light — never the other way round.",
    image: "/images/editorial/light-form-atrium.png",
  },
  {
    tag: "02 / Form",
    title: "The honest weight of things.",
    quote: "Premium is not more. Premium is resolved.",
    body: "Every composition is built on proportion — the dialogue between heights, masses and the negative space that lets them breathe.",
    image: "/images/editorial/materials.png",
  },
];

const COLOURS = [
  { name: "Wolf Charcoal", hex: "#141311" },
  { name: "Territory Green", hex: "#253528" },
  { name: "Burnt Walnut", hex: "#5A3D2E" },
  { name: "Saddle Leather", hex: "#8A5938" },
  { name: "Aged Brass", hex: "#A78657" },
  { name: "Linen Sand", hex: "#C9BDA6" },
  { name: "Casa Ivory", hex: "#E8E1D3" },
  { name: "Warm Stone", hex: "#8A8376" },
];

const BUILDER = [
  { tag: "Step 01", title: "The anchor", body: "Choose the dominant form — usually the sofa or bed." },
  { tag: "Step 02", title: "The light", body: "Set the mood with lamp, ambient and natural light." },
  { tag: "Step 03", title: "The layers", body: "Add rug, table, textile and material in dialogue." },
  { tag: "Result", title: "The composition", body: "One named, sellable room the customer can feel.", result: true },
];

export function WayOfLightForm() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: paletteRef, inView: paletteIn } = useReveal<HTMLDivElement>();
  const { ref: builderRef, inView: builderIn } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/light-form-atrium.png"
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
        <div className={styles.swatchRow}>
          {COLOURS.map((c) => (
            <div key={c.hex}>
              <i style={{ background: c.hex }} aria-hidden />
              <span>{c.name}</span>
              <small>{c.hex}</small>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.builder}>
        <div ref={builderRef} className={`reveal ${builderIn ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Composition Builder · From SKU to Room</p>
          <h2>How a product becomes a decision.</h2>
        </div>
        <div className={styles.steps}>
          {BUILDER.map((step) => (
            <article key={step.tag} className={step.result ? styles.result : ""}>
              <span>{step.tag}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

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
