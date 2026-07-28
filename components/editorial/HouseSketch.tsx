"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FLOORS } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import styles from "./HouseSketch.module.css";

const CX = 210;
const W = 130; // footprint half-width
const D = 68; // footprint half-depth
const SLAB_H = 46;
const GAP = 6;
const EXPLODE = 40;

type Slab = {
  index: number;
  top: [number, number][];
  right: [number, number][];
  left: [number, number][];
  labelY: number;
};

// Isometric "layer cake" — each floor a flattened hexagonal slab, stacked
// bottom to top. Hovering/selecting a floor pushes every slab above it
// upward, exploding a gap open around the chosen level — a sketch of the
// section, not a photograph of it.
function buildSlabs(activeIndex: number | null): Slab[] {
  const slabs: Slab[] = [];
  let cumulative = 0;
  for (let i = 0; i < FLOORS.length; i++) {
    const explodeShift = activeIndex !== null && i > activeIndex ? EXPLODE : 0;
    const baseY = 340 - cumulative - explodeShift;
    const top: [number, number][] = [
      [CX, baseY - D],
      [CX + W, baseY],
      [CX, baseY + D],
      [CX - W, baseY],
    ];
    const right: [number, number][] = [
      [CX + W, baseY],
      [CX, baseY + D],
      [CX, baseY + D + SLAB_H],
      [CX + W, baseY + SLAB_H],
    ];
    const left: [number, number][] = [
      [CX - W, baseY],
      [CX, baseY + D],
      [CX, baseY + D + SLAB_H],
      [CX - W, baseY + SLAB_H],
    ];
    slabs.push({ index: i, top, right, left, labelY: baseY - D - 8 });
    cumulative += SLAB_H + GAP;
  }
  return slabs;
}

const pts = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(" ");

export function HouseSketch() {
  const [active, setActive] = useState<number | null>(1);
  const { setCursor, resetCursor } = useCursor();
  const slabs = useMemo(() => buildSlabs(active), [active]);
  const activeFloor = active !== null ? FLOORS[active] : null;

  return (
    <section className={`${styles.section} plaster`} aria-label="An axonometric sketch of the villa">
      <div className={styles.head}>
        <span className={styles.num}>§ The Villa, In Section</span>
        <h2>
          Four floors, <em>drawn apart.</em>
        </h2>
        <p>An architect&rsquo;s sketch, not a photograph — select a level to pull it open and see what it holds.</p>
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 420 400" className={styles.svg} aria-hidden>
          <defs>
            <filter id="sketchWobble">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="6" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" />
            </filter>
          </defs>
          <g filter="url(#sketchWobble)">
            {slabs.map((slab) => {
              const isActive = slab.index === active;
              const floor = FLOORS[slab.index];
              return (
                <g
                  key={slab.index}
                  className={styles.slab}
                  onClick={() => setActive(isActive ? null : slab.index)}
                  onMouseEnter={() => setCursor("hover", floor.label)}
                  onMouseLeave={resetCursor}
                >
                  <polygon points={pts(slab.left)} className={`${styles.face} ${styles.faceLeft} ${isActive ? styles.faceActive : ""}`} />
                  <polygon points={pts(slab.right)} className={`${styles.face} ${styles.faceRight} ${isActive ? styles.faceActive : ""}`} />
                  <polygon points={pts(slab.top)} className={`${styles.face} ${styles.faceTop} ${isActive ? styles.faceActive : ""}`} />
                  <text x={CX} y={slab.labelY} textAnchor="middle" className={styles.slabLabel}>
                    {floor.level}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        <div className={styles.panel}>
          {activeFloor ? (
            <>
              <span className={styles.panelEyebrow}>Level {activeFloor.level}</span>
              <h3>{activeFloor.label}</h3>
              <p>{activeFloor.note}</p>
              <ul className={styles.roomList}>
                {activeFloor.rooms.map((room) => (
                  <li key={room.slug}>
                    <Link
                      href={`/rooms/${room.slug}`}
                      onMouseEnter={() => setCursor("hover", "View")}
                      onMouseLeave={resetCursor}
                    >
                      {room.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.panelHint}>Select a floor in the sketch to open it.</p>
          )}
        </div>
      </div>
    </section>
  );
}
