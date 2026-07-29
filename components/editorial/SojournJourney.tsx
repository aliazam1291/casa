"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import styles from "./SojournJourney.module.css";

const villa = "/images/editorial/villa-hero.webp";
const materials = "/images/editorial/materials.webp";
const sojourn = "/images/editorial/sojourn.webp";
const atrium = "/images/editorial/light-form-atrium.webp";

const LEGS = [
  { tag: "Day 01", title: "Read the material", body: "Start with timber, stone and textile before looking at a finished object.", image: materials },
  { tag: "Day 02", title: "Meet the maker", body: "Visit the workshops and factories where scale, finish and care become visible.", image: sojourn },
  { tag: "Day 03", title: "Make the edit", body: "Return with a smaller, stronger set of objects for your home.", image: atrium },
  { tag: "After", title: "Carry it home", body: "A shortlist carried straight into your consultation, ready to compose.", image: villa },
];

export function SojournJourney() {
  const { setCursor, resetCursor } = useCursor();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src={sojourn}
          alt="Design workshop with furniture prototypes and material samples"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>Casa Sojourn</p>
          <h1>Go where the objects begin.</h1>
          <p>A curated sourcing journey through furniture, craft and material culture, revealing the making behind the objects you choose.</p>
        </div>
      </section>

      <section className={styles.itinerary}>
        <p>Sourcing is a form of seeing.</p>
        {LEGS.map((leg, index) => (
          <article key={leg.tag} className={`${styles.leg} ${index % 2 ? styles.legReverse : ""}`}>
            <div className={styles.legImage}>
              <Image src={leg.image} alt={leg.title} fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className={styles.legCopy}>
              <span>{leg.tag}</span>
              <h3>{leg.title}</h3>
              <p>{leg.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.cta}>
        <p>A journey changes the way you choose. The best objects carry provenance.</p>
        <Link
          href="/experiences/consultation"
          onMouseEnter={() => setCursor("hover", "Enquire")}
          onMouseLeave={resetCursor}
        >
          Enquire about Casa Sojourn
        </Link>
      </section>
    </main>
  );
}
