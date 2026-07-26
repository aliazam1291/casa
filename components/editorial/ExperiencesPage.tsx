"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./ExperiencesPage.module.css";

const villa = "/images/editorial/villa-hero.png";
const materials = "/images/editorial/materials.png";
const sojourn = "/images/editorial/sojourn.png";
const atrium = "/images/editorial/light-form-atrium.png";

const JOURNEY = [
  "Welcome Frame",
  "Material Wall",
  "Living Zone",
  "Guest Lounge",
  "Lighting Room",
  "Consultation",
  "Closing Lounge",
];

const COMPOSITIONS = [
  { num: "01", title: "The Evening Den", body: "Low light, deep upholstery and a single brass lamp.", image: atrium },
  { num: "02", title: "The Shadow Lounge", body: "Charcoal sofa, sculptural lamp and wood panelling.", image: materials },
  { num: "03", title: "The Courtyard Pause", body: "Cane, foliage and textured fabric in slow morning light.", image: villa },
  { num: "04", title: "The Guest Hour", body: "A formal lounge composed to receive, not merely to seat.", image: sojourn },
  { num: "05", title: "The Reading Corner", body: "Armchair, side table, floor lamp and a warm shadow.", image: atrium },
  { num: "06", title: "The Family Frame", body: "Shared seating, TV unit and rugs — a room built to hold a life.", image: villa },
  { num: "07", title: "The Material Room", body: "Stone, wood, fabric and brass in layered surfaces.", image: materials },
];

const ACTIONS = [
  { tag: "01 / Consultation", title: "Signature Consultation", body: "A guided reading of the room you already have.", href: "/experiences/consultation" },
  { tag: "02 / Sojourn", title: "Casa Sojourn", body: "A sourcing journey through makers and material.", href: "/experiences/furniture-tourism" },
  { tag: "03 / Library", title: "Materials Library", body: "Stone, wood, textile and metal, side by side.", href: "/experiences/materials-library" },
];

export function ExperiencesPage() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: journeyRef, inView: journeyIn } = useReveal<HTMLDivElement>();
  const { ref: galleryRef, inView: galleryIn } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src={sojourn}
          alt="A refined furniture sourcing atelier with samples and prototypes"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>The Rituals</p>
          <h1>Experiences.</h1>
          <p>Not a warehouse. A sequence of composed territories — a showroom designed to help people decide, not browse.</p>
        </div>
      </section>

      <section className={styles.journey}>
        <div ref={journeyRef} className={`reveal ${journeyIn ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Showroom Experience</p>
          <h2>Seven territories, in one visit.</h2>
        </div>
        <div className={styles.rail}>
          {JOURNEY.map((label, index) => (
            <article key={label}>
              <i aria-hidden />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.gallery}>
        <div ref={galleryRef} className={`reveal ${galleryIn ? "in" : ""} ${styles.galleryHead}`}>
          <h2>Named compositions, ready to enter.</h2>
          <p className={styles.sectionLabel}>Scroll to explore</p>
        </div>
        <div className={styles.strip}>
          {COMPOSITIONS.map((item) => (
            <article
              key={item.num}
              className={styles.card}
              onMouseEnter={() => setCursor("hover", "View")}
              onMouseLeave={resetCursor}
            >
              <div className={styles.cardImage}>
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 720px) 78vw, 320px" />
              </div>
              <span>Composition No. {item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <nav className={styles.actions} aria-label="Begin an experience">
        {ACTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={() => setCursor("hover", "Enter")}
            onMouseLeave={resetCursor}
          >
            <span>{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <b>Begin -&gt;</b>
          </Link>
        ))}
      </nav>

      <section className={styles.quoteBanner}>
        <p>&ldquo;A showroom should help people decide, not browse.&rdquo;</p>
        <Link
          href="/experiences/consultation"
          onMouseEnter={() => setCursor("hover", "Book")}
          onMouseLeave={resetCursor}
        >
          Book a consultation
        </Link>
      </section>
    </main>
  );
}
