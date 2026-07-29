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
  );
}

export function HouseStandard() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <section className={styles.standard}>
      <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
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
  );
}
