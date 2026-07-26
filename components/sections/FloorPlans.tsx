"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./FloorPlans.module.css";

type Room = { id: string; name: string; ritual: string; materials: string; x: number; y: number; w: number; h: number };
type Floor = { label: string; level: string; note: string; rooms: Room[] };

const FLOORS: Floor[] = [
  { label: "The cellar", level: "-01", note: "A lower level for collecting, making and lingering.", rooms: [
    { id: "wine", name: "Wine Cellar", ritual: "The long table", materials: "Oak · glass · brass", x: 16, y: 18, w: 42, h: 48 },
    { id: "vault", name: "Material Vault", ritual: "The tactile edit", materials: "Stone · timber · linen", x: 60, y: 18, w: 24, h: 30 },
    { id: "archive", name: "Archive", ritual: "The quiet research", materials: "Leather · paper · walnut", x: 60, y: 50, w: 24, h: 28 },
  ] },
  { label: "Ground floor", level: "00", note: "The social composition—arrival, preparation, gathering and air.", rooms: [
    { id: "foyer", name: "Grand Foyer", ritual: "The first pause", materials: "Travertine · bronze", x: 16, y: 18, w: 23, h: 30 },
    { id: "kitchen", name: "Gourmet Kitchen", ritual: "The daily gathering", materials: "Calacatta · walnut", x: 41, y: 18, w: 43, h: 30 },
    { id: "living", name: "Atrium Living", ritual: "The long afternoon", materials: "Linen · clay · stone", x: 16, y: 50, w: 43, h: 28 },
    { id: "dining", name: "Courtyard Dining", ritual: "The hosted evening", materials: "Oak · bronze · air", x: 61, y: 50, w: 23, h: 28 },
  ] },
  { label: "First floor", level: "+01", note: "The private composition—rest, ritual, work and a room for guests.", rooms: [
    { id: "master", name: "Master Suite", ritual: "The unhurried return", materials: "Velvet · nero marble · walnut", x: 16, y: 18, w: 43, h: 34 },
    { id: "bath", name: "Spa Bath", ritual: "The morning ritual", materials: "Stone · brass · glass", x: 61, y: 18, w: 23, h: 34 },
    { id: "study", name: "Executive Study", ritual: "The focused hour", materials: "Leather · linen · timber", x: 16, y: 54, w: 28, h: 24 },
    { id: "guest", name: "Guest Bedroom", ritual: "The generous welcome", materials: "Bouclé · oak · caramel", x: 46, y: 54, w: 38, h: 24 },
  ] },
  { label: "Sky pavilion", level: "+02", note: "A high, open composition for late light and the city beyond.", rooms: [
    { id: "salon", name: "Skyline Salon", ritual: "The last light", materials: "Bouclé · marble · brass", x: 16, y: 18, w: 43, h: 60 },
    { id: "terrace", name: "Penthouse Terrace", ritual: "The evening outside", materials: "Teak · linen · black stone", x: 61, y: 18, w: 23, h: 60 },
  ] },
];

export function FloorPlans() {
  const [floorIndex, setFloorIndex] = useState(1);
  const [roomId, setRoomId] = useState(FLOORS[1].rooms[0].id);
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();
  const floor = FLOORS[floorIndex];
  const room = floor.rooms.find((item) => item.id === roomId) ?? floor.rooms[0];

  const chooseFloor = (index: number) => { setFloorIndex(index); setRoomId(FLOORS[index].rooms[0].id); };
  const chooseRoom = (id: string) => setRoomId(id);

  return (
    <section className={styles.section} id="floor-plans">
      <div ref={ref} className={`${styles.heading} reveal ${inView ? "in" : ""}`}>
        <div><span>§ 02 — The Composition</span><p>Plan the feeling,<br />not just the room.</p></div>
        <h2>Every floor is<br /><em>a composition.</em></h2>
      </div>
      <div className={styles.explorer}>
        <nav className={styles.floors} aria-label="Select a floor">
          {FLOORS.map((item, index) => <button key={item.level} type="button" className={index === floorIndex ? styles.floorActive : ""} onClick={() => chooseFloor(index)} onMouseEnter={() => setCursor("hover", "View")} onMouseLeave={resetCursor}><span>{item.level}</span>{item.label}</button>)}
        </nav>
        <div className={styles.planWrap}>
          <div className={styles.compass} aria-hidden>N<br /><i>↑</i></div>
          <svg viewBox="0 0 100 96" className={styles.plan} aria-label={`${floor.label} floor plan`}>
            <rect x="10" y="10" width="80" height="76" className={styles.outline} />
            {floor.rooms.map((item) => <g key={item.id} className={item.id === room.id ? styles.roomActive : styles.room} role="button" tabIndex={0} aria-label={`Select ${item.name}`} onClick={() => chooseRoom(item.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") chooseRoom(item.id); }} onMouseEnter={() => { chooseRoom(item.id); setCursor("hover", "Room"); }} onMouseLeave={resetCursor}>
              <rect x={item.x} y={item.y} width={item.w} height={item.h} />
              <text x={item.x + item.w / 2} y={item.y + item.h / 2} textAnchor="middle">{item.name}</text>
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
            <p>{room.materials}</p>
          </div>
          <Link href="/experiences/consultation">Compose this floor <b>→</b></Link>
        </aside>
      </div>
    </section>
  );
}
