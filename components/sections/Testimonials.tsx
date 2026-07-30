"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { TESTIMONIALS } from "@/lib/testimonials";
import styles from "./Testimonials.module.css";

/**
 * "Clients about our work" — the credibility beat, sitting between the counted
 * proof (Stats) and the process (Sojourn).
 *
 * The track is a native scroll-snap container rather than a transform carousel,
 * so touch and trackpad swiping work with no handlers and the arrows only need
 * to nudge scrollLeft. Which card is "current" is read back off scroll position
 * rather than held as the source of truth, so a manual swipe can never
 * disagree with the indicator.
 */
export function Testimonials() {
  const { ref: revealRef, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const syncIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;
    const stride = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
    setIndex(Math.round(track.scrollLeft / stride));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", syncIndex, { passive: true });
    return () => track.removeEventListener("scroll", syncIndex);
  }, [syncIndex]);

  const scrollBy = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;
    const stride = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
    track.scrollBy({ left: dir * stride, behavior: "smooth" });
  };

  const atStart = index <= 0;
  const atEnd = index >= TESTIMONIALS.length - 1;

  return (
    <section className={`${styles.testimonials} leather`} id="testimonials">
      <div className={styles.inner}>
        <div ref={revealRef} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
          <div>
            <p className={styles.eyebrow}>In their words</p>
            <h2 className={styles.heading}>
              <span className="upright">Clients about</span> <em>our work.</em>
            </h2>
          </div>
          <div className={styles.nav}>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Previous testimonial"
              onMouseEnter={() => setCursor("hover", "Prev")}
              onMouseLeave={resetCursor}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M20 12H4M10 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Next testimonial"
              onMouseEnter={() => setCursor("hover", "Next")}
              onMouseLeave={resetCursor}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.track} ref={trackRef}>
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className={styles.card}>
              <span className={styles.quoteMark} aria-hidden>
                &ldquo;
              </span>
              <blockquote className={styles.quote}>{t.quote}</blockquote>
              <figcaption className={styles.by}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.place}>{t.place}</span>
                <span className={styles.scope}>{t.scope}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={styles.bars} aria-hidden>
          {TESTIMONIALS.map((t, i) => (
            <span key={t.name} className={i === index ? styles.on : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
