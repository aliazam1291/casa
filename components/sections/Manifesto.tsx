"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./Manifesto.module.css";

/** Ported from wolf-casa-homepage-v3.html <section class="manifesto"> (~line 482). */
export function Manifesto() {
  const { ref, inView } = useReveal<HTMLElement>();

  return (
    <section id="manifesto" ref={ref} className={`${styles.manifesto} reveal ${inView ? "in" : ""}`}>
      <div className="curtain" />
      <span className={styles.num}>§ 01 — The Composition</span>
      <h2 className={styles.heading}>
        A room is not furnished.
        <br />
        <span className="upright">It is</span> <em>composed.</em>
      </h2>
      <div className={styles.principles}>
        <article>
          <span>01 / Light</span>
          <p>Every room begins with the way daylight arrives and where it rests.</p>
        </article>
        <article>
          <span>02 / Material</span>
          <p>Stone, timber and textile are selected for tactility, not spectacle.</p>
        </article>
        <article>
          <span>03 / Composition</span>
          <p>Seating, joinery, lighting, stone and greenery, resolved as one decision.</p>
        </article>
      </div>
    </section>
  );
}
