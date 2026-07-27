"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { CONTACT } from "@/lib/contact";
import styles from "./TheHouse.module.css";

const STATS = [
  { value: `${new Date().getFullYear() - CONTACT.founded}+`, label: "Years, a working legacy" },
  { value: "110+", label: "Specialist hands in-house" },
  { value: "40k", label: "Sq ft across Indore & Dewas" },
  { value: "Indore", label: "& Dewas, and every home" },
];

const FRAMEWORK: [string, string][] = [
  ["Category", "Composed interiors, furniture, lighting & materials"],
  ["Market role", "The Interio Mall for Composed Living"],
  ["Customer need", "“I want my home to feel complete.”"],
  ["Promise", "Complete living compositions under one roof"],
  ["Difference", "We sell rooms, not SKUs"],
  ["Proof", "Furniture + light + material + styling, composed"],
  ["Emotional", "Feel the room before you buy it"],
  ["Commercial", "Higher basket, faster decisions, less discounting"],
];

const STANDARD = [
  "Sell the room.",
  "Light is direction.",
  "Never crowd space.",
  "Materials need hierarchy.",
  "Always with atmosphere.",
  "Resolved beyond price.",
  "Showroom is not storage.",
  "Content teaches.",
  "Never generic.",
  "The room is the product.",
];

export function TheHouse() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: fwRef, inView: fwIn } = useReveal<HTMLDivElement>();
  const { ref: stRef, inView: stIn } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/villa-hero.png"
          alt="A warm contemporary Indian residence with crafted materials"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>The House</p>
          <h1>Modern Indian living, carefully composed.</h1>
          <p>Established 2024, Wolf Casa makes homes through a close relationship with craft, international sourcing and the people who live in the rooms — from Indore and, since expanding, Dewas.</p>
        </div>
      </section>

      <section className={styles.stats} aria-label="Wolf Casa at a glance">
        {STATS.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className={styles.framework}>
        <div ref={fwRef} className={`reveal ${fwIn ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Positioning Framework</p>
          <h2>Most stores sell products. We sell the decision, already composed.</h2>
        </div>
        <dl className={styles.defs}>
          {FRAMEWORK.map(([term, def]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.standard}>
        <div ref={stRef} className={`reveal ${stIn ? "in" : ""}`}>
          <p className={styles.sectionLabel}>The Wolf Casa Standard</p>
          <h2>Ten rules we do not break.</h2>
        </div>
        <div className={styles.rules}>
          {STANDARD.map((rule, index) => (
            <div key={rule}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <p>{rule}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.note}>
        <p>Legacy is built through care. The people behind the object matter.</p>
        <Link href="/visit" onMouseEnter={() => setCursor("hover", "Visit")} onMouseLeave={resetCursor}>
          Visit Wolf Casa
        </Link>
      </section>
    </main>
  );
}
