"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PIECES } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { getPieceImage } from "@/lib/library-images";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./DomeGallery.module.css";

const COUNT = 14;
const RADIUS = 480;

// A curated spread across the catalogue rather than the first N pieces —
// every third piece keeps the ring from reading as "all sofas."
function pickPieces() {
  const step = Math.max(1, Math.floor(PIECES.length / COUNT));
  const picked = [];
  for (let i = 0; i < COUNT; i++) picked.push(PIECES[(i * step) % PIECES.length]);
  return picked;
}

/**
 * The signature interactive moment: pieces mounted on the inside of a
 * rotating ring — drag (or auto-drift) to bring each into the light, like
 * walking a slow circle inside a gallery dome. Pure CSS 3D transforms (no
 * WebGL) — a rotateY(itemAngle) translateZ(radius) per card, with the whole
 * ring's rotateY(R) driven by pointer drag. Depth fade/scale is computed per
 * frame from each item's angular distance to the front, not from React state,
 * so dragging 14 cards stays smooth.
 */
export function DomeGallery() {
  const items = useMemo(() => pickPieces(), []);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotation = useRef(0);
  const velocity = useRef(0.035); // slow ambient drift
  const dragging = useRef(false);
  const lastX = useRef(0);
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const [activeIndex, setActiveIndex] = useState(0);

  const applyFrame = useCallback(() => {
    const ring = ringRef.current;
    if (!ring) return;
    ring.style.transform = `rotateY(${rotation.current}deg)`;

    let frontIdx = 0;
    let frontDelta = Infinity;
    const segment = 360 / COUNT;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const itemAngle = i * segment;
      let delta = (itemAngle + rotation.current) % 360;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const abs = Math.abs(delta);
      if (abs < frontDelta) {
        frontDelta = abs;
        frontIdx = i;
      }
      const closeness = Math.max(0, 1 - abs / 100);
      card.style.opacity = String(0.22 + closeness * 0.78);
      const scale = 0.78 + closeness * 0.3;
      card.style.setProperty("--card-scale", scale.toFixed(3));
      card.style.filter = `saturate(${(0.6 + closeness * 0.4).toFixed(2)}) brightness(${(0.75 + closeness * 0.3).toFixed(2)})`;
    });
    setActiveIndex((prev) => (prev !== frontIdx ? frontIdx : prev));
  }, []);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (!dragging.current) rotation.current += velocity.current;
      applyFrame();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyFrame]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    rotation.current += dx * 0.25;
    velocity.current = dx * 0.02;
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const active = items[activeIndex];

  return (
    <section className={`${styles.section} woodgrain`} id="dome-gallery">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.num}>§ 04 — The Dome</span>
        <h2 className={styles.heading}>
          Walk the room, <em>slowly.</em>
        </h2>
        <p className={styles.sub}>Drag to turn. Every piece takes its moment in the light before it passes.</p>
      </div>

      <div
        className={styles.stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onMouseEnter={() => setCursor("hover", "Drag")}
        onMouseLeave={resetCursor}
      >
        <div className={styles.ring} ref={ringRef}>
          {items.map((piece, i) => (
            <div
              key={piece.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={styles.card}
              style={{
                transform: `rotateY(${(360 / COUNT) * i}deg) translateZ(${RADIUS}px)`,
              }}
            >
              <div className={styles.cardImg}>
                <Image
                  src={getPieceImage(piece.slug, i)}
                  alt={piece.name}
                  fill
                  sizes="280px"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.floor} aria-hidden />
      </div>

      {active && (
        <div className={styles.caption}>
          <span className={styles.captionNum}>{String(activeIndex + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}</span>
          <h3>{active.name}</h3>
          <span className={styles.captionRoom}>{getRoom(active.roomSlug)?.name}</span>
          <Link
            href={`/pieces/${active.slug}`}
            className={styles.captionLink}
            onMouseEnter={() => setCursor("hover", "Info")}
            onMouseLeave={resetCursor}
          >
            View piece <span>→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
