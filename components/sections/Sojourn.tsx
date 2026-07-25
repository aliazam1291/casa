"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Sojourn.module.css";

const FRAMES = [
  "https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=2400&q=85",
];

const COPY = [
  { s: "§ 05 — Casa Sojourn / 01 of 04", t: ["Sourced across", "the world."] },
  { s: "§ 05 — Casa Sojourn / 02 of 04", t: ["Factory visits,", "hand-selected."] },
  { s: "§ 05 — Casa Sojourn / 03 of 04", t: ["The final lock,", "and the return."] },
  { s: "§ 05 — Casa Sojourn / 04 of 04", t: ["Composed", "in your home."] },
];

/** Scroll-scrub sequence (Casa Sojourn) — ported from ~line 534/909. */
export function Sojourn() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const passed = Math.min(1, Math.max(0, -rect.top / total));
      setStep(Math.min(FRAMES.length - 1, Math.floor(passed * FRAMES.length)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section ref={sectionRef} className={styles.scrub} id="sojourn">
      <div className={styles.sticky}>
        {FRAMES.map((src, i) => (
          <div
            key={src}
            className={`${styles.frame} ${i === step ? styles.active : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className={styles.vignette} />
        <div className={styles.text}>
          <span className={styles.step}>{COPY[step].s}</span>
          <h2 className={styles.title}>
            {COPY[step].t[0]}
            <br />
            <em>{COPY[step].t[1]}</em>
          </h2>
        </div>
        <div className={styles.progress}>
          {COPY.map((c, i) => (
            <span key={c.s} className={i === step ? styles.on : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
