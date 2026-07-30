"use client";

import { useState } from "react";
import Link from "next/link";
import { FLOORS, type Room } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { IsoHouse } from "@/components/house/IsoHouse";
import styles from "./HouseSketch.module.css";

/**
 * The villa as a drawn axonometric — one solid house, not a stack of
 * floating slabs. Selecting a level lights that floor in the drawing and
 * opens it in the panel; hovering a room in either place highlights it in
 * the other, so the drawing and the list are one object.
 */
export function HouseSketch() {
  const [active, setActive] = useState<number>(1);
  const [hovered, setHovered] = useState<Room | null>(null);
  const { setCursor, resetCursor } = useCursor();
  const activeFloor = FLOORS[active];

  return (
    <section className={`${styles.section} plaster`} aria-label="An axonometric sketch of the villa">
      <div className={styles.head}>
        <span className={styles.num}>The villa, in section</span>
        <h2>
          Four floors, <em>one house.</em>
        </h2>
        <p>An architect&rsquo;s drawing, not a photograph — choose a level to light it, and a room to step inside.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.stage}>
          <IsoHouse
            focusFloor={active}
            hoveredRoom={hovered}
            onHoverRoom={(room) => {
              setHovered(room);
              if (room) setCursor("hover", room.name);
              else resetCursor();
            }}
            onSelectFloor={setActive}
          />
        </div>

        <div className={styles.panel}>
          <span className={styles.panelEyebrow}>Level {activeFloor.level}</span>
          <h3>{activeFloor.label}</h3>
          <p>{activeFloor.note}</p>
          <ul className={styles.roomList}>
            {activeFloor.rooms.map((room) => (
              <li key={room.slug}>
                <Link
                  href={`/rooms/${room.slug}`}
                  className={hovered?.slug === room.slug ? styles.roomLinkActive : undefined}
                  onMouseEnter={() => {
                    setHovered(room);
                    setCursor("hover", "View");
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    resetCursor();
                  }}
                >
                  {room.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <nav className={styles.levels} aria-label="Choose a level">
        {[...FLOORS].reverse().map((floor) => (
          <button
            key={floor.index}
            type="button"
            className={active === floor.index ? styles.levelBtnActive : styles.levelBtn}
            onClick={() => setActive(floor.index)}
            onMouseEnter={() => setCursor("hover", floor.label)}
            onMouseLeave={resetCursor}
          >
            <span className={styles.levelNum}>{floor.level}</span>
            {floor.label}
          </button>
        ))}
      </nav>
    </section>
  );
}
