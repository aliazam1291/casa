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

/** Ambient drift, in degrees per frame — a slow walk, not a carousel. */
const DRIFT = 0.035;
/** Per-frame decay applied to a flung ring until it settles back to DRIFT. */
const FRICTION = 0.94;

/**
 * Brand Book §08, verbatim: "Black holds the space. Ivory speaks. Brass
 * punctuates. Walnut & green carry the material world." The ring walks that
 * palette rather than lighting all fourteen plates the same brass — a rotunda
 * where every wall is the same colour is one wall.
 *
 * `accent` is the hairline and the label; `glow` is the pool of light the
 * plate throws onto the wall behind it, so it must stay dark enough to sit on
 * Soft Black without becoming a fill.
 */
const PLATE_TONES = [
  { accent: "#a78657", glow: "58, 36, 16" }, // Brass
  { accent: "#c9a87e", glow: "90, 61, 46" }, // Walnut
  { accent: "#7d9682", glow: "37, 53, 40" }, // Green
  { accent: "#c98a5e", glow: "138, 89, 56" }, // Saddle
  { accent: "#c9bda6", glow: "70, 64, 52" }, // Sand
] as const;

// A curated spread across the catalogue rather than the first N pieces —
// every third piece keeps the ring from reading as "all sofas."
function pickPieces() {
  const step = Math.max(1, Math.floor(PIECES.length / COUNT));
  const picked = [];
  for (let i = 0; i < COUNT; i++) picked.push(PIECES[(i * step) % PIECES.length]);
  return picked;
}

type Props = {
  /** Anchor id — the page decides what this section is called in its nav. */
  id?: string;
  kicker?: string;
  heading?: React.ReactNode;
  sub?: string;
};

/**
 * THE ROTUNDA — the signature interactive moment, and the centrepiece of
 * /shop: fourteen pieces hung on the inside of a slowly turning ring, matted
 * and hairline-framed like plates in a gallery, drag (or auto-drift) to bring
 * each one into the light.
 *
 * Pure CSS 3D transforms, no WebGL — a rotateY(itemAngle) translateZ(radius)
 * per plate, with the ring's own rotateY driven by pointer drag. Depth
 * fade/scale is computed per frame from each plate's angular distance to the
 * front, not from React state, so dragging fourteen plates stays smooth; the
 * only thing that crosses into React is which plate is currently front.
 *
 * The front plate colours the whole section — its tone drives --stage-accent
 * and --stage-glow, so walking the ring walks the book's palette.
 */
export function DomeGallery({
  id = "dome-gallery",
  kicker = "Every piece, up close",
  heading = (
    <>
      Walk the room, <em>slowly.</em>
    </>
  ),
  sub = "Drag to turn, or choose a piece directly. Every piece takes its moment in the light before it passes.",
}: Props = {}) {
  const items = useMemo(() => pickPieces(), []);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotation = useRef(0);
  const velocity = useRef(DRIFT);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const reduced = useRef(false);
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
    // Wall labels only exist for the plate you are standing in front of —
    // fourteen labels turning at once is a carousel, one is a gallery.
    cardRefs.current.forEach((card, i) => {
      if (card) card.dataset.front = i === frontIdx ? "true" : "false";
    });
    setActiveIndex((prev) => (prev !== frontIdx ? frontIdx : prev));
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduced.current = query.matches;
      // A reader who asked for no motion still gets the ring, just parked —
      // and still gets to turn it themselves with drag or the dots.
      if (query.matches) velocity.current = 0;
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (!dragging.current) {
        rotation.current += velocity.current;
        // Decay a fling back to the ambient drift instead of spinning at the
        // release speed forever. Below the drift, snap to it so the ring never
        // stalls halfway between two plates.
        const rest = reduced.current ? 0 : DRIFT;
        if (Math.abs(velocity.current - rest) > 0.001) {
          velocity.current = rest + (velocity.current - rest) * FRICTION;
        } else {
          velocity.current = rest;
        }
      }
      applyFrame();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyFrame]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    rotation.current += dx * 0.25;
    velocity.current = dx * 0.08;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    const el = e.currentTarget as Element;
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  // Clicking a plate (rather than dragging past it) turns the ring so that
  // plate becomes the front one — direct navigation, not just ambient drag.
  const goToIndex = useCallback((i: number) => {
    const segment = 360 / COUNT;
    const itemAngle = i * segment;
    const current = rotation.current % 360;
    let delta = (itemAngle + current) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    rotation.current -= delta;
    velocity.current = 0;
  }, []);

  // The ring is a real focus stop, so arrow keys walk it plate by plate and
  // Home/End jump to either end — the same affordances the dot rail has, for
  // someone who never reaches the dot rail.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = (n: number) => {
      e.preventDefault();
      goToIndex((activeIndex + n + COUNT) % COUNT);
    };
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Home") step(-activeIndex);
    else if (e.key === "End") step(COUNT - 1 - activeIndex);
  };

  const active = items[activeIndex];
  const tone = PLATE_TONES[activeIndex % PLATE_TONES.length];

  return (
    <section
      className={`${styles.section} woodgrain`}
      id={id}
      style={
        {
          "--stage-accent": tone.accent,
          "--stage-glow": tone.glow,
        } as React.CSSProperties
      }
    >
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.num}>{kicker}</span>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.sub}>{sub}</p>
      </div>

      <div
        className={styles.stage}
        role="group"
        aria-roledescription="carousel"
        aria-label="The rotunda — fourteen pieces, turned by drag or arrow keys"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setCursor("hover", "Drag")}
        onMouseLeave={resetCursor}
      >
        <div className={styles.wash} aria-hidden />
        <div className={styles.ring} ref={ringRef}>
          {items.map((piece, i) => {
            const plateTone = PLATE_TONES[i % PLATE_TONES.length];
            return (
              <div
                key={piece.slug}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={styles.card}
                style={
                  {
                    transform: `rotateY(${(360 / COUNT) * i}deg) translateZ(${RADIUS}px)`,
                    "--plate-accent": plateTone.accent,
                  } as React.CSSProperties
                }
                onClick={() => goToIndex(i)}
              >
                {/* Ivory mat + brass hairline: the plate is framed, not cropped */}
                <div className={styles.frame}>
                  <div className={styles.cardImg}>
                    <Image
                      src={getPieceImage(piece.slug, i)}
                      alt={piece.subtitle}
                      fill
                      sizes="280px"
                      loading="lazy"
                    />
                  </div>
                </div>
                {/* The wall label — only rendered legible for the front plate */}
                <span className={styles.plaque} aria-hidden>
                  <i>{String(i + 1).padStart(2, "0")}</i>
                  <b lang={piece.lang}>{piece.name}</b>
                  <em>{piece.subtitle}</em>
                </span>
              </div>
            );
          })}
        </div>
        <div className={styles.floor} aria-hidden />
        <span className={styles.dragHint} aria-hidden>
          ← drag, or use ← → →
        </span>

        {/* Floating glass-chip caption, echoing the 3D walkthrough's HUD */}
        {active && (
          <div className={styles.caption}>
            <span className={styles.captionNum}>
              {String(activeIndex + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
            </span>
            <h3 lang={active.lang}>{active.name}</h3>
            <span className={styles.captionSub}>{active.subtitle}</span>
            <span className={styles.captionRoom}>{getRoom(active.roomSlug)?.name}</span>
            <span className={styles.captionMaterials}>{active.materials.join(" · ")}</span>
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
      </div>

      {/* Live region so the front plate is announced to a screen reader as the
          ring turns — otherwise the caption changes silently. */}
      <p className={styles.live} aria-live="polite">
        {active ? `${active.subtitle} — ${getRoom(active.roomSlug)?.name}` : ""}
      </p>

      <div className={styles.dots} role="tablist" aria-label="Choose a piece">
        {items.map((piece, i) => (
          <button
            key={piece.slug}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`${piece.name} — ${piece.subtitle}`}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            style={{ "--dot-accent": PLATE_TONES[i % PLATE_TONES.length].accent } as React.CSSProperties}
            onClick={() => goToIndex(i)}
            onMouseEnter={() => setCursor("hover", piece.name)}
            onMouseLeave={resetCursor}
          />
        ))}
      </div>
    </section>
  );
}
