"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FEATURED_PIECES } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Gallery.module.css";

// The first six are real showroom photography (sourced from Wolf Casa's own
// site); the rest fall back to the site's ambient editorial mood shots.
const CARD_IMAGES = [
  "/images/showroom/living-lounge-brass.webp",
  "/images/showroom/dining-marble-mirror.webp",
  "/images/showroom/bedroom-suite-warm.webp",
  "/images/showroom/dining-set-black-gold.webp",
  "/images/showroom/dining-room-mirrorwall.webp",
  "/images/showroom/living-room-sectional.webp",
  "/images/editorial/light-form-atrium.png",
  "/images/editorial/villa-hero.png",
  "/images/editorial/materials.png",
  "/images/editorial/sojourn.png",
  "/images/catalogue/seating-sofas.webp",
  "/images/catalogue/bespoke-interiors-beds.webp",
] as const;

/** Horizontal drag gallery, fed by the real named pieces from the 3D
 * walkthrough (lib/pieces.ts) — count derived from the data instead of
 * a hardcoded "twelve" that used to contradict the six objects it named. */
export function Gallery() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(`01 / ${String(FEATURED_PIECES.length).padStart(2, "0")}`);

  useEffect(() => {
    if (!inView) return;
    const zone = trackRef.current?.parentElement;
    if (!zone) return;

    let dragging = false;
    let startX = 0;
    let current = 0;
    let target = 0;
    let raf = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX - current;
      setCursor("drag");
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      resetCursor();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || !trackRef.current) return;
      target = e.clientX - startX;
      const maxDrag = -(trackRef.current.scrollWidth - window.innerWidth + 32);
      target = Math.min(0, Math.max(maxDrag, target));
    };

    const tick = () => {
      current += (target - current) * 0.1;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${current}px)`;
        const max = -(trackRef.current.scrollWidth - window.innerWidth + 32);
        const prog = max ? Math.abs(current) / Math.abs(max) : 0;
        if (fillRef.current) fillRef.current.style.width = `${prog * 100}%`;
        const idx = Math.min(FEATURED_PIECES.length, Math.floor(prog * FEATURED_PIECES.length) + 1);
        setCount(`${String(idx).padStart(2, "0")} / ${String(FEATURED_PIECES.length).padStart(2, "0")}`);
      }
      raf = requestAnimationFrame(tick);
    };

    zone.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      zone.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [inView, setCursor, resetCursor]);

  return (
    <section className={styles.section} data-cursor-zone="drag">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.num}>§ 04 — Named Pieces</span>
        <h2 className={styles.heading}>
          <span className="upright">{FEATURED_PIECES.length}</span> <em>named pieces.</em>
        </h2>
      </div>
      <div
        className={styles.drag}
        ref={trackRef}
        onMouseEnter={() => setCursor("hover", "Drag")}
        onMouseLeave={resetCursor}
      >
        {FEATURED_PIECES.map((piece, i) => (
          <Link key={piece.slug} href={`/pieces/${piece.slug}`} className={styles.card}>
            <div className={styles.img}>
              <Image
                src={CARD_IMAGES[i % CARD_IMAGES.length]}
                alt={piece.name}
                fill
                draggable={false}
                loading="lazy"
                sizes="(max-width: 720px) 82vw, min(56vw, 680px)"
              />
            </div>
            <span className={styles.cardNum}>{String(i + 1).padStart(2, "0")} · {getRoom(piece.roomSlug)?.name}</span>
            <div className={styles.cardTitle}>{piece.name}</div>
          </Link>
        ))}
      </div>
      <div className={styles.progress}>
        <span>Drag to explore</span>
        <div className={styles.bar}>
          <div ref={fillRef} className={styles.fill} />
        </div>
        <span>{count}</span>
      </div>
    </section>
  );
}
