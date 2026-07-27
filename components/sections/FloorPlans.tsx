"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FLOORS } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./FloorPlans.module.css";

// The plan's 80-unit width represents the 18 400 mm called out on the
// dimension line below it, so one SVG unit is 0.23 m. Room areas are derived
// from that rather than an arbitrary divisor.
const M_PER_UNIT = 18.4 / 80;

export function FloorPlans() {
  const [floorIndex, setFloorIndex] = useState(1);
  const [roomSlug, setRoomSlug] = useState(FLOORS[1].rooms[0].slug);
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();
  const floor = FLOORS[floorIndex];
  const room = floor.rooms.find((item) => item.slug === roomSlug) ?? floor.rooms[0];

  const chooseFloor = (index: number) => { setFloorIndex(index); setRoomSlug(FLOORS[index].rooms[0].slug); };
  const chooseRoom = (slug: string) => setRoomSlug(slug);

  return (
    <section className={styles.section} id="floor-plans">
      <div ref={ref} className={`${styles.heading} reveal ${inView ? "in" : ""}`}>
        <div><span>§ 02 — The Rooms</span><p>Plan the feeling,<br />not just the room.</p></div>
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
                  <text x={cx} y={cy - 0.6} textAnchor="middle" className={styles.roomLabel}>{item.name}</text>
                  <text x={cx} y={cy + 3.4} textAnchor="middle" className={styles.roomArea}>
                    {Math.round(item.plan.w * item.plan.h * M_PER_UNIT * M_PER_UNIT)} m²
                  </text>
                </g>
              );
            })}

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
