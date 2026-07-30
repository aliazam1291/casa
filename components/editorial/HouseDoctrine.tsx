"use client";

import { useReveal } from "@/hooks/useReveal";
import { CONTACT } from "@/lib/contact";
import styles from "./TheHouse.module.css";

/**
 * The brand bands that used to open /the-house — at-a-glance numbers, the
 * positioning framework, and the ten rules.
 *
 * Split out of TheHouse so /the-house-and-rooms can place them inside its own
 * narrative (house → doctrine → villa → the thirteen rooms) rather than
 * inheriting that page's hero and CTA. Still reads TheHouse.module.css: these
 * are the same bands, only relocated, and duplicating ~120 lines of CSS to
 * rename the classes would be the actual mistake.
 */

const STATS = [
  { value: `${new Date().getFullYear() - CONTACT.founded}+`, label: "Years, a working legacy" },
  { value: "110+", label: "Specialist hands in-house" },
  { value: "40k", label: "Sq ft across Indore & Dewas" },
  { value: "Indore", label: "& Dewas, and every home" },
];

// What used to sit here was the internal positioning framework, verbatim —
// "Market role", "Customer need", "Commercial: higher basket, faster decisions,
// less discounting". That is a strategy deck, and the last line is sales
// targets. None of it belongs on a page a customer reads: it tells them how
// they are being sold to and nothing about what they get.
//
// Replaced with the same information turned outward — what actually happens if
// you work with Wolf Casa, in the order it happens.
const HOW_IT_WORKS: [string, string][] = [
  ["You bring a room", "A photo, a floor plan, or just the address. Whatever you have."],
  ["We measure it", "Light, dimensions, what the windows face, where you actually sit."],
  ["You see it whole", "One scheme — furniture, lighting, stone, joinery, plants — before you spend anything."],
  ["You change your mind", "Twice, three times. This is the part people skip and regret."],
  ["We build and fit", "Made in our own workshops in Indore and Dewas. We install it ourselves."],
  ["It stays fixable", "Reupholstery, refinishing, a piece added in five years. Same team."],
];


export function HouseStats() {
  return (
    <section className={styles.stats} aria-label="Wolf Casa at a glance">
      {STATS.map((item) => (
        <article key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </section>
  );
}

export function HouseFramework() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <section className={styles.framework}>
      <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
        <p className={styles.sectionLabel}>How it works</p>
        <h2>Six steps, and you can stop at any of them.</h2>
      </div>
      <dl className={styles.defs}>
        {HOW_IT_WORKS.map(([term, def]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{def}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

