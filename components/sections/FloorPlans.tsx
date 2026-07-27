"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FLOORS } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./FloorPlans.module.css";

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
          <div className={styles.compass} aria-hidden>N<br /><i>↑</i></div>
          <svg viewBox="0 0 100 96" className={styles.plan} aria-label={`${floor.label} floor plan`}>
            <rect x="10" y="10" width="80" height="76" className={styles.outline} />
            {floor.rooms.map((item) => <g key={item.slug} className={item.slug === room.slug ? styles.roomActive : styles.room} role="button" tabIndex={0} aria-label={`Select ${item.name}`} onClick={() => chooseRoom(item.slug)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") chooseRoom(item.slug); }} onMouseEnter={() => { chooseRoom(item.slug); setCursor("hover", "Room"); }} onMouseLeave={resetCursor}>
              <rect x={item.plan.x} y={item.plan.y} width={item.plan.w} height={item.plan.h} />
              <text x={item.plan.x + item.plan.w / 2} y={item.plan.y + item.plan.h / 2} textAnchor="middle">{item.name}</text>
            </g>)}
            <path d="M10 86h80M10 10v76M90 10v76" className={styles.detailLine} />
          </svg>
          <span className={styles.scale}>0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5m</span>
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
