"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { FLOORS, type Room } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./FloorPlans.module.css";

// The plan's 80-unit width represents the 18 400 mm called out on the
// dimension line below it, so one SVG unit is 0.23 m. Room areas are derived
// from that rather than an arbitrary divisor.
const M_PER_UNIT = 18.4 / 80;

type Door = { x: number; y: number; axis: "h" | "v"; len: number };

// A real plan reads as a house because rooms connect through openings, not
// because the rectangles are labelled well. This finds every pair of rooms
// on a floor whose rectangles face each other across a wall and places a
// doorway (gap + swing arc) at the middle of that shared run.
function findDoors(rooms: Room[]): Door[] {
  const doors: Door[] = [];
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const a = rooms[i].plan;
      const b = rooms[j].plan;
      const aRight = a.x + a.w;
      const bRight = b.x + b.w;
      const aBottom = a.y + a.h;
      const bBottom = b.y + b.h;

      const vGap = Math.abs(aRight - b.x) < 3 ? aRight : Math.abs(bRight - a.x) < 3 ? bRight : null;
      if (vGap !== null) {
        const start = Math.max(a.y, b.y);
        const end = Math.min(aBottom, bBottom);
        if (end - start > 6) doors.push({ axis: "v", x: vGap, y: (start + end) / 2, len: 3.4 });
      }

      const hGap = Math.abs(aBottom - b.y) < 3 ? aBottom : Math.abs(bBottom - a.y) < 3 ? bBottom : null;
      if (hGap !== null) {
        const start = Math.max(a.x, b.x);
        const end = Math.min(aRight, bRight);
        if (end - start > 6) doors.push({ axis: "h", x: (start + end) / 2, y: hGap, len: 3.4 });
      }
    }
  }
  return doors;
}

// A small line-art furniture glyph per room, matched by name — the detail
// that makes a plan read as "a bed goes here" rather than an abstract box.
function RoomGlyph({ room }: { room: Room }) {
  const n = room.name.toLowerCase();
  const gx = room.plan.x + room.plan.w - 10.5;
  const gy = room.plan.y + 2.6;

  let content: ReactNode;
  if (n.includes("bed") || n.includes("suite")) {
    content = (
      <>
        <rect x="0" y="0" width="7.4" height="5.6" rx="0.5" />
        <rect x="0" y="0" width="7.4" height="1.6" rx="0.4" />
        <ellipse cx="1.7" cy="0.85" rx="1" ry="0.55" />
        <ellipse cx="5.7" cy="0.85" rx="1" ry="0.55" />
      </>
    );
  } else if (n.includes("bath") || n.includes("spa")) {
    content = (
      <>
        <rect x="0" y="0.6" width="7.2" height="4" rx="2" />
        <circle cx="6.2" cy="2.6" r="0.35" />
      </>
    );
  } else if (n.includes("kitchen")) {
    content = (
      <>
        <rect x="0" y="0" width="7.6" height="3.2" rx="0.3" />
        <circle cx="1.7" cy="1.6" r="0.55" />
        <circle cx="4" cy="1.6" r="0.55" />
        <circle cx="6.2" cy="1.6" r="0.55" />
      </>
    );
  } else if (n.includes("dining")) {
    content = (
      <>
        <rect x="0.8" y="0.6" width="6" height="3.2" rx="0.3" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={1.6 + i * 1.5} cy={i % 2 === 0 ? -0.3 : 4.7} r="0.5" />
        ))}
      </>
    );
  } else if (n.includes("study")) {
    content = (
      <>
        <rect x="0" y="0" width="6.2" height="2.4" rx="0.3" />
        <path d="M6.2 2.4 a1.4 1.4 0 0 1 -1.4 1.4" fill="none" />
      </>
    );
  } else if (n.includes("wine") || n.includes("vault")) {
    content = (
      <>
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => <circle key={`${row}-${col}`} cx={col * 1.7} cy={row * 1.7} r="0.4" />)
        )}
      </>
    );
  } else if (n.includes("archive")) {
    content = (
      <>
        <line x1="0" y1="0" x2="7" y2="0" />
        <line x1="0" y1="1.4" x2="7" y2="1.4" />
        <line x1="0" y1="2.8" x2="5.2" y2="2.8" />
      </>
    );
  } else if (n.includes("terrace")) {
    content = (
      <>
        <rect x="0" y="0" width="3" height="5.6" rx="0.6" />
        <circle cx="5.4" cy="4.4" r="1" />
      </>
    );
  } else {
    // living / atrium / salon / hall — a low sofa is the universal social anchor.
    content = (
      <>
        <rect x="0" y="0.9" width="7.6" height="2.6" rx="0.6" />
        <rect x="0" y="0" width="7.6" height="1.2" rx="0.4" />
        <line x1="2.55" y1="0" x2="2.55" y2="3.5" />
        <line x1="5.1" y1="0" x2="5.1" y2="3.5" />
      </>
    );
  }

  return (
    <g transform={`translate(${gx} ${gy})`} className={styles.glyph} aria-hidden>
      {content}
    </g>
  );
}

export function FloorPlans() {
  const [floorIndex, setFloorIndex] = useState(1);
  const [roomSlug, setRoomSlug] = useState(FLOORS[1].rooms[0].slug);
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();
  const floor = FLOORS[floorIndex];
  const room = floor.rooms.find((item) => item.slug === roomSlug) ?? floor.rooms[0];
  const doors = useMemo(() => findDoors(floor.rooms), [floor]);

  const chooseFloor = (index: number) => { setFloorIndex(index); setRoomSlug(FLOORS[index].rooms[0].slug); };
  const chooseRoom = (slug: string) => setRoomSlug(slug);

  return (
    <section className={styles.section} id="floor-plans">
      <div ref={ref} className={`${styles.heading} reveal ${inView ? "in" : ""}`}>
        <div><span>§ 03 — The Rooms</span><p>Plan the feeling,<br />not just the room.</p></div>
        <h2>Thirteen rooms,<br /><em>one composition.</em></h2>
      </div>
      <div className={styles.explorer}>
        <nav className={styles.floors} aria-label="Select a floor">
          {FLOORS.map((item, index) => <button key={item.level} type="button" className={index === floorIndex ? styles.floorActive : ""} onClick={() => chooseFloor(index)} onMouseEnter={() => setCursor("hover", "View")} onMouseLeave={resetCursor}><span>{item.level}</span>{item.label}</button>)}
        </nav>
        <div className={styles.planWrap}>
          <div className={styles.compass} aria-hidden><i>↑</i>N</div>
          <div className={styles.titleBlock} aria-hidden>
            <b>Wolf Casa · Villa</b>
            <span>{floor.label} — Level {floor.level}</span>
            <span>Drawing {String(floorIndex + 1).padStart(2, "0")} / {String(FLOORS.length).padStart(2, "0")}</span>
          </div>
          <svg viewBox="0 0 100 96" className={styles.plan} aria-label={`${floor.label} floor plan`}>
            <defs>
              <pattern id="wc-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M5 0H0v5" className={styles.gridLine} />
              </pattern>
              <pattern id="wc-hatch" width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="1.6" className={styles.hatchLine} />
              </pattern>
            </defs>

            <rect x="10" y="10" width="80" height="76" fill="url(#wc-grid)" />
            {/* Poché: the thick perimeter cut that makes a plan read as built. */}
            <rect x="10" y="10" width="80" height="76" className={styles.poche} />
            <rect x="11.4" y="11.4" width="77.2" height="73.2" className={styles.outline} />

            {floor.rooms.map((item) => {
              const cx = item.plan.x + item.plan.w / 2;
              const cy = item.plan.y + item.plan.h / 2;
              const active = item.slug === room.slug;
              return (
                <g key={item.slug} className={active ? styles.roomActive : styles.room} role="button" tabIndex={0} aria-label={`Select ${item.name}`} onClick={() => chooseRoom(item.slug)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") chooseRoom(item.slug); }} onMouseEnter={() => { chooseRoom(item.slug); setCursor("hover", "Room"); }} onMouseLeave={resetCursor}>
                  <rect x={item.plan.x} y={item.plan.y} width={item.plan.w} height={item.plan.h} className={styles.roomFill} />
                  {active && <rect x={item.plan.x} y={item.plan.y} width={item.plan.w} height={item.plan.h} fill="url(#wc-hatch)" className={styles.roomHatch} />}
                  <rect x={item.plan.x} y={item.plan.y} width={item.plan.w} height={item.plan.h} className={styles.roomStroke} />
                  {/* Corner ticks read as setting-out marks on a working drawing. */}
                  <path
                    className={styles.tick}
                    d={`M${item.plan.x} ${item.plan.y + 2.4}V${item.plan.y}h2.4
                        M${item.plan.x + item.plan.w - 2.4} ${item.plan.y}h2.4v2.4
                        M${item.plan.x + item.plan.w} ${item.plan.y + item.plan.h - 2.4}v2.4h-2.4
                        M${item.plan.x + 2.4} ${item.plan.y + item.plan.h}h-2.4v-2.4`}
                  />
                  <RoomGlyph room={item} />
                  <text x={cx} y={cy - 0.6} textAnchor="middle" className={styles.roomLabel}>{item.name}</text>
                  <text x={cx} y={cy + 3.4} textAnchor="middle" className={styles.roomArea}>
                    {Math.round(item.plan.w * item.plan.h * M_PER_UNIT * M_PER_UNIT)} m²
                  </text>
                </g>
              );
            })}

            {/* Interior doorways: a gap through the double wall line plus a
                quarter-circle swing, at every wall two rooms actually share. */}
            <g className={styles.doors} aria-hidden>
              {doors.map((d, i) =>
                d.axis === "v" ? (
                  <g key={i}>
                    <rect x={d.x - 0.4} y={d.y - d.len / 2} width="0.8" height={d.len} className={styles.doorGap} />
                    <path d={`M${d.x} ${d.y - d.len / 2} A${d.len} ${d.len} 0 0 1 ${d.x + d.len} ${d.y - d.len / 2}`} className={styles.doorSwing} />
                    <line x1={d.x} y1={d.y - d.len / 2} x2={d.x} y2={d.y + d.len / 2} className={styles.doorLeaf} />
                  </g>
                ) : (
                  <g key={i}>
                    <rect x={d.x - d.len / 2} y={d.y - 0.4} width={d.len} height="0.8" className={styles.doorGap} />
                    <path d={`M${d.x - d.len / 2} ${d.y} A${d.len} ${d.len} 0 0 1 ${d.x - d.len / 2} ${d.y - d.len}`} className={styles.doorSwing} />
                    <line x1={d.x - d.len / 2} y1={d.y} x2={d.x + d.len / 2} y2={d.y} className={styles.doorLeaf} />
                  </g>
                )
              )}
            </g>

            {/* Dimension line along the bottom edge. */}
            <g className={styles.dim}>
              <path d="M10 91h80" />
              <path d="M10 89.4v3.2M90 89.4v3.2" />
              <text x="50" y="94.6" textAnchor="middle">18 400</text>
            </g>
          </svg>
          <span className={styles.scale}>Scale 1:200&nbsp;&nbsp;·&nbsp;&nbsp;0 — 5m</span>
        </div>
        <aside className={styles.note}>
          <span>{floor.level} / {floor.label}</span>
          <p className={styles.floorNote}>{floor.note}</p>
          <div className={styles.roomNote}>
            <div className={styles.materialImage}>
              <Image src="/images/editorial/materials.png" alt="Curated material palette" fill sizes="(max-width: 1000px) 50vw, 22vw" />
              <span>Material direction</span>
            </div>
            <small>{room.ritual}</small>
            <h3>{room.name}</h3>
            <p>{room.materials.join(" · ")}</p>
          </div>
          <Link href={`/rooms/${room.slug}`}>View this room <b>→</b></Link>
        </aside>
      </div>
    </section>
  );
}
