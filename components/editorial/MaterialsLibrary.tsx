"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./MaterialsLibrary.module.css";

const TILES = [
  { tag: "Stone", title: "Read the veins", body: "Every slab carries a different movement, temperature and degree of reflection.", image: "/images/editorial/materials.webp" },
  { tag: "Timber", title: "Learn the grain", body: "The right wood gives a room depth long before it gives it colour.", image: "/images/editorial/light-form-atrium.webp" },
  { tag: "Textile", title: "Feel the finish", body: "The difference between a room that photographs well and a room that lives well.", image: "/images/editorial/sojourn.webp" },
];

const DIRECTION = ["Full Room", "Detail as Art", "Light Fall", "Material Macro", "Quiet Corner", "Shadow on Wall"];

export function MaterialsLibrary() {
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/materials.webp"
          alt="Curated interior material samples and objects"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>Materials Library</p>
          <h1>Touch changes the decision.</h1>
          <p>Texture is proof — it tells the hand what the eye is trying to believe. Compare temperature, grain, patina and scale in one calm place.</p>
        </div>
      </section>

      <section className={styles.materials}>
        <h2>Stone, wood and textile, read closely.</h2>
        <div className={styles.grid}>
          {TILES.map((tile) => (
            <article
              key={tile.tag}
              className={styles.tile}
              onMouseEnter={() => setCursor("hover", "View")}
              onMouseLeave={resetCursor}
            >
              <Image src={tile.image} alt={tile.title} fill sizes="(max-width: 900px) 100vw, 33vw" />
              <div className={styles.tileCopy}>
                <span>{tile.tag}</span>
                <h3>{tile.title}</h3>
                <p>{tile.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.direction}>
        <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Photography Direction</p>
          <h2>Warm, dim, composed — never lit like product.</h2>
        </div>
        <div className={styles.tags}>
          {DIRECTION.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>

      <section className={styles.note}>
        <p>Material choices should age well. Contrast is more useful than matching.</p>
        <Link href="/visit" onMouseEnter={() => setCursor("hover", "Visit")} onMouseLeave={resetCursor}>
          Visit the library
        </Link>
      </section>
    </main>
  );
}
