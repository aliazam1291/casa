"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { SEATING_IMAGES, DECOR_IMAGES, MATERIAL_IMAGES } from "@/lib/library-images";
import styles from "./ExperiencesPage.module.css";

const COMPOSITIONS = [
  {
    num: "01", title: "The Evening Den",
    body: "Low light, deep upholstery and a single brass lamp.",
    image: SEATING_IMAGES[0],
    tag: "Seating · Lighting",
  },
  {
    num: "02", title: "The Shadow Lounge",
    body: "Charcoal sofa, sculptural lamp and wood panelling.",
    image: SEATING_IMAGES[1],
    tag: "Lounge · Minimal",
  },
  {
    num: "03", title: "The Courtyard Pause",
    body: "Cane, foliage and textured fabric in slow morning light.",
    image: DECOR_IMAGES[0],
    tag: "Greenery · Outdoor",
  },
  {
    num: "04", title: "The Guest Hour",
    body: "A formal lounge composed to receive, not merely to seat.",
    image: SEATING_IMAGES[2],
    tag: "Reception · Formal",
  },
  {
    num: "05", title: "The Reading Corner",
    body: "Armchair, side table, floor lamp and a warm shadow.",
    image: SEATING_IMAGES[3],
    tag: "Study · Retreat",
  },
  {
    num: "06", title: "The Family Frame",
    body: "Shared seating, TV unit and rugs — a room built to hold a life.",
    image: SEATING_IMAGES[4],
    tag: "Family · Living",
  },
  {
    num: "07", title: "The Material Room",
    body: "Stone, wood, fabric and brass in layered surfaces.",
    image: MATERIAL_IMAGES.marble,
    tag: "Marble · Layered",
  },
] as const;

const JOURNEY = [
  { num: "01", label: "Welcome Frame", detail: "The showroom begins at the threshold." },
  { num: "02", label: "Material Wall", detail: "Every surface and finish, side by side." },
  { num: "03", label: "Living Zone", detail: "Composed seating for every context." },
  { num: "04", label: "Guest Lounge", detail: "A room built to receive." },
  { num: "05", label: "Lighting Room", detail: "Chandeliers, pendants and architectural fixtures." },
  { num: "06", label: "Consultation", detail: "A private space for decisions." },
  { num: "07", label: "Closing Lounge", detail: "Rest before you choose." },
] as const;

const ACTIONS = [
  {
    tag: "01 / Consultation", title: "Signature Consultation",
    body: "A guided reading of the room you already have.",
    href: "/experiences/consultation",
    image: DECOR_IMAGES[1],
  },
  {
    tag: "02 / Sojourn", title: "Casa Sojourn",
    body: "A sourcing journey through makers and material.",
    href: "/experiences/furniture-tourism",
    image: MATERIAL_IMAGES.stone,
  },
  {
    tag: "03 / Library", title: "Materials Library",
    body: "Stone, wood, textile and metal, side by side.",
    href: "/experiences/materials-library",
    image: MATERIAL_IMAGES.wood,
  },
] as const;

// Varying aspect ratios for masonry rhythm
const RATIOS = ["4/3", "3/4", "1/1", "4/5", "4/3", "3/4", "1/1"] as const;

export function ExperiencesPage() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: journeyRef, inView: journeyIn } = useReveal<HTMLDivElement>();
  const { ref: galleryRef, inView: galleryIn } = useReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      {/* Full-bleed cinematic hero */}
      <section className={styles.hero}>
        <Image
          src={SEATING_IMAGES[5]}
          alt="A refined furniture sourcing atelier with samples and prototypes"
          fill priority sizes="100vw" className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>§ The Rituals</p>
          <h1>Experiences.</h1>
          <p>Not a warehouse. A sequence of composed territories — a showroom designed to help people decide, not browse.</p>
        </div>
      </section>

      {/* Showroom journey numbered flow */}
      <section className={styles.journey}>
        <div ref={journeyRef} className={`reveal ${journeyIn ? "in" : ""} ${styles.journeyHead}`}>
          <span className={styles.sectionLabel}>§ Showroom Experience</span>
          <h2>Seven territories, in one visit.</h2>
        </div>
        <div className={styles.rail}>
          {JOURNEY.map((item) => (
            <article key={item.label} className={styles.railItem}>
              <span className={styles.railNum}>{item.num}</span>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pinterest masonry gallery of compositions */}
      <section className={styles.gallery}>
        <div ref={galleryRef} className={`reveal ${galleryIn ? "in" : ""} ${styles.galleryHead}`}>
          <span className={styles.sectionLabel}>§ Named Compositions</span>
          <h2>Ready to enter.</h2>
        </div>
        <div className={styles.masonry}>
          {COMPOSITIONS.map((item, i) => (
            <article
              key={item.num}
              className={styles.card}
              onMouseEnter={() => { setCursor("hover", "View"); setHovered(item.num); }}
              onMouseLeave={() => { resetCursor(); setHovered(null); }}
            >
              <div className={styles.cardImage} style={{ aspectRatio: RATIOS[i] }}>
                <Image src={item.image} alt={item.title} fill loading="lazy" sizes="(max-width: 720px) 96vw, 30vw" />
                <div className={`${styles.cardOverlay} ${hovered === item.num ? styles.cardOverlayVisible : ""}`} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardTag}>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Experience action cards with images */}
      <nav className={styles.actions} aria-label="Begin an experience">
        {ACTIONS.map((item) => (
          <Link
            key={item.href} href={item.href}
            className={styles.actionCard}
            onMouseEnter={() => setCursor("hover", "Enter")}
            onMouseLeave={resetCursor}
          >
            <div className={styles.actionImage}>
              <Image src={item.image} alt={item.title} fill loading="lazy" sizes="33vw" />
              <div className={styles.actionShade} />
            </div>
            <div className={styles.actionBody}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <b>Begin →</b>
            </div>
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
