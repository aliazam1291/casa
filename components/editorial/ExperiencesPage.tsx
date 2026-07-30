"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { COMPOSITIONS } from "@/lib/compositions";
import { SEATING_IMAGES, DECOR_IMAGES, MATERIAL_IMAGES } from "@/lib/library-images";
import styles from "./ExperiencesPage.module.css";

// ── ONE SET OF NAMED ROOMS, NOT TWO ──────────────────────────────────────────
// This page used to define its own seven "compositions" — The Evening Den, The
// Shadow Lounge, The Courtyard Pause, The Guest Hour, The Reading Corner, The
// Family Frame, The Material Room — under the heading "Named schemes".
//
// None of them exists. The Brand Book names eight compositions and files them
// under owned IP: "Eight named compositions (Nocturne, Terra Form, Luxe
// Minimal…) are IP too — sellable moods a customer can ask for by name" (§10).
// A customer cannot ask for "The Guest Hour" by name, because nobody at Wolf
// Casa has ever sold one. Running an invented seven next to the real eight is
// the exact failure the IA doc flags: two competing systems for one layer.
//
// So the masonry now renders lib/compositions.ts — the same eight as
// /the-wolf-way and /shop, with their own photography and accent tones, each
// linking back to its full entry. It also stops this page borrowing the piece
// photographs, which is what collided with /shop's wall.

const JOURNEY = [
  // Book-verbatim, §SR "The Showroom · Composed territories". The seven that
  // were here (Welcome Frame, Living Zone, Guest Lounge, Closing Lounge…) were
  // invented too, and the book's own six are better copy than the invention.
  { num: "01", label: "The Welcome", detail: "Arrival composed — the brand felt in the first three metres." },
  { num: "02", label: "The Material Wall", detail: "Stone, wood, metal and cloth, touchable and named." },
  { num: "03", label: "The Composed Rooms", detail: "The eight moods, staged as complete decisions." },
  { num: "04", label: "The Light Studio", detail: "Ambient, accent and task — light as direction." },
  { num: "05", label: "The Consultation", detail: "The Wolf Way, applied to the customer's own plan." },
  { num: "06", label: "The Close", detail: "Where the room becomes an order, quietly." },
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

// Varying aspect ratios for masonry rhythm. Indexed modulo, so this no longer
// has to be exactly as long as the list it decorates.
const RATIOS = ["4/3", "3/4", "1/1", "4/5", "4/3", "3/4", "1/1", "4/5"] as const;

const hex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;

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
          <p className={styles.kicker}>Things you can book</p>
          <h1>Experiences.</h1>
          <p>Not a warehouse. A sequence of composed territories — a showroom designed to help people decide, not browse.</p>
        </div>
      </section>

      {/* Showroom journey numbered flow */}
      <section className={styles.journey}>
        <div ref={journeyRef} className={`reveal ${journeyIn ? "in" : ""} ${styles.journeyHead}`}>
          <span className={styles.sectionLabel}>At the showroom</span>
          <h2>Six territories, in one visit.</h2>
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
          <span className={styles.sectionLabel}>The eight signature compositions</span>
          <h2>Ready to enter.</h2>
          <p className={styles.galleryNote}>
            Staged on the floor as complete decisions. Ask for one by name.
          </p>
        </div>
        <div className={styles.masonry}>
          {COMPOSITIONS.map((item, i) => (
            <Link
              key={item.slug}
              href={`/the-wolf-way#${item.slug}`}
              className={styles.card}
              style={{ "--card-accent": hex(item.accent) } as React.CSSProperties}
              onMouseEnter={() => { setCursor("hover", item.name); setHovered(item.slug); }}
              onMouseLeave={() => { resetCursor(); setHovered(null); }}
              onFocus={() => setHovered(item.slug)}
              onBlur={() => setHovered(null)}
            >
              <div className={styles.cardImage} style={{ aspectRatio: RATIOS[i % RATIOS.length] }}>
                <Image src={item.img} alt={item.name} fill loading="lazy" sizes="(max-width: 720px) 96vw, 30vw" />
                <div className={`${styles.cardOverlay} ${hovered === item.slug ? styles.cardOverlayVisible : ""}`} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardTag}>
                  {String(i + 1).padStart(2, "0")} · {item.materials.join(" · ")}
                </span>
                <h3>{item.name}</h3>
                <p>{item.blurb}</p>
              </div>
            </Link>
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
