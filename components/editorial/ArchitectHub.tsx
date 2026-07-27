"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./ArchitectHub.module.css";

const SPEC = [
  { num: "01", title: "Access the materials", body: "Request finishes, dimensions and curated material support for your project." },
  { num: "02", title: "Build a project edit", body: "Work with our team to create a composition that fits the brief and the room." },
  { num: "03", title: "Confirm the timeline", body: "Get visibility into lead times, craft and scale before you commit." },
  { num: "04", title: "Install with support", body: "Placement, sequencing and the small pauses that make it feel resolved." },
];

// Exact eight from the Brand Book's Colour System (§08).
const COLOURS = [
  { name: "Soft Black", hex: "#0E0E0C" },
  { name: "Charcoal", hex: "#141311" },
  { name: "Walnut", hex: "#5A3D2E" },
  { name: "Green", hex: "#253528" },
  { name: "Brass", hex: "#A78657" },
  { name: "Saddle", hex: "#8A5938" },
  { name: "Sand", hex: "#C9BDA6" },
  { name: "Ivory", hex: "#E8E1D3" },
];

export function ArchitectHub() {
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/materials.png"
          alt="Material samples and interior finishes curated for a project"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>Architect Hub</p>
          <h1>For architects of atmosphere.</h1>
          <p>A dedicated Wolf Casa partnership for architects, designers and builders — technical detail without catalogue language.</p>
        </div>
      </section>

      <section className={styles.dossier}>
        <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Project Dossier</p>
          <h2>A clear route from concept to installation.</h2>
        </div>
        <div className={styles.spec}>
          {SPEC.map((item) => (
            <div key={item.num}>
              <small>{item.num}</small>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        <div className={styles.swatches} aria-label="Material colour reference">
          {COLOURS.map((c) => (
            <div key={c.hex}>
              <i style={{ background: c.hex }} aria-hidden />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.cta} leather`}>
        <p>Made for ambitious rooms — reach the Architect Hub for project support.</p>
        <Link href="/visit" onMouseEnter={() => setCursor("hover", "Request")} onMouseLeave={resetCursor}>
          Request project access
        </Link>
      </section>
    </main>
  );
}
