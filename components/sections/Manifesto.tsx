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
    </section>
  );
}
