"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./Manifesto.module.css";

/** Ported from wolf-casa-homepage-v3.html <section class="manifesto"> (~line 482). */
export function Manifesto() {
  const { ref, inView } = useReveal<HTMLElement>();

  return (
    <section id="manifesto" ref={ref} className={`${styles.manifesto} reveal ${inView ? "in" : ""}`}>
      <div className="curtain" />
      <span className={styles.num}>§ 01 — The Doctrine</span>
      <h2 className={styles.heading}>
        Luxury is not excess.
        <br />
        <span className="upright">It is precision.</span> <em>It is restraint.</em>
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
          <span>03 / Proportion</span>
          <p>Furniture, circulation and empty space are composed as one whole.</p>
        </article>
      </div>
    </section>
  );
}
