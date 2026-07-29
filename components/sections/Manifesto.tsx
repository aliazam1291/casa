"use client";

import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Manifesto.module.css";

/** Ported from wolf-casa-homepage-v3.html <section class="manifesto"> (~line 482). */
export function Manifesto() {
  const { ref, inView } = useReveal<HTMLElement>();

  return (
    <section id="manifesto" ref={ref} className={`${styles.manifesto} reveal ${inView ? "in" : ""}`}>
      <div className="curtain" />
      <span className={styles.num}>§ 01 — The Composition</span>
      <div className={styles.layout}>
        <div className={styles.copy}>
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
        </div>
        <div className={styles.collage}>
          <div className={styles.collageMain}>
            <Image src="/images/editorial/light-form-atrium.webp" alt="Sunlight crossing a composed interior of wood and stone" fill sizes="(max-width: 900px) 90vw, 32vw" />
          </div>
          <div className={styles.collageSecondary}>
            <Image src="/images/showroom/dining-room-mirrorwall.webp" alt="A composed dining room with a mirrored feature wall" fill sizes="(max-width: 900px) 60vw, 20vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
