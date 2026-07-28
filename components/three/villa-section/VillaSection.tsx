"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FLOORS, type Room } from "@/lib/rooms";
import { COMPOSITIONS_BY_FLOOR } from "@/lib/compositions";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { useTilt } from "@/hooks/useTilt";
import { IsoHouse } from "@/components/house/IsoHouse";
import { FloorPlanKey } from "@/components/house/FloorPlanKey";
import styles from "./VillaSection.module.css";

/**
 * "The Villa, In Section" — the drawn mansion on the left, and on the right
 * the same floor read two ways: as a key plan with a numbered room schedule,
 * and as the compositions that floor is usually specified in. Hovering a room
 * anywhere lights it everywhere; the three are one object, not three widgets.
 */
export function VillaSection() {
  const [hovered, setHovered] = useState<Room | null>(null);
  const [focusFloor, setFocusFloor] = useState(1); // ground floor
  const { ref: headRef, inView } = useReveal<HTMLDivElement>();
  const { ref: stageRef, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>(4);
  const { setCursor, resetCursor } = useCursor();
  const router = useRouter();

  const orderedFloors = useMemo(() => [...FLOORS].reverse(), []);
  const floor = FLOORS[focusFloor];
  const compositions = COMPOSITIONS_BY_FLOOR[focusFloor] ?? [];

  const hoverRoom = (room: Room | null) => {
    setHovered(room);
    setCursor("hover", room ? "Enter" : "Explore");
  };

  return (
    <section className={styles.section}>
      <div ref={headRef} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.num}>§ 02 — The Villa, In Section</span>
        <h2 className={styles.heading}>
          One house, <em>drawn through.</em>
        </h2>
      </div>

      <div className={styles.layout}>
        <div
          ref={stageRef}
          className={styles.stage}
          onPointerMove={onPointerMove}
          onPointerLeave={() => {
            onPointerLeave();
            setHovered(null);
            resetCursor();
          }}
          onMouseEnter={() => setCursor("hover", "Explore")}
        >
          <div className={styles.houseWrap}>
            <IsoHouse
              focusFloor={focusFloor}
              hoveredRoom={hovered}
              onHoverRoom={hoverRoom}
              onSelectFloor={setFocusFloor}
              onSelectRoom={(room) => router.push(`/rooms/${room.slug}`)}
            />
          </div>

          <nav className={styles.legend} aria-label="Focus a floor">
            {orderedFloors.map((f) => {
              const active = focusFloor === f.index;
              const isHovered = hovered?.floorIndex === f.index;
              return (
                <button
                  key={f.index}
                  type="button"
                  className={active || isHovered ? styles.legendRowActive : styles.legendRow}
                  onClick={() => setFocusFloor(f.index)}
                  onMouseEnter={() => setCursor("hover", `Focus ${f.label}`)}
                  onMouseLeave={() => setCursor("hover", "Explore")}
                >
                  <span className={styles.legendLevel}>{f.level}</span>
                  <span className={styles.legendLabel}>{f.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={styles.hint}>Choose a floor · hover a room · click to step inside</div>
        </div>

        <aside className={styles.side}>
          <header className={styles.sideHead}>
            <span className={styles.sideEyebrow}>
              Level {floor.level} · Sheet {String(focusFloor + 1).padStart(2, "0")}/{String(FLOORS.length).padStart(2, "0")}
            </span>
            <h3 className={styles.sideTitle}>{floor.label}</h3>
            <p className={styles.sideNote}>{floor.note}</p>
          </header>

          <div className={styles.planBlock}>
            <FloorPlanKey
              floor={floor}
              hoveredRoom={hovered}
              onHoverRoom={hoverRoom}
              onSelectRoom={(room) => router.push(`/rooms/${room.slug}`)}
            />
            <ol className={styles.schedule}>
              {floor.rooms.map((room, i) => (
                <li key={room.slug}>
                  <Link
                    href={`/rooms/${room.slug}`}
                    className={hovered?.slug === room.slug ? styles.scheduleRowActive : styles.scheduleRow}
                    onMouseEnter={() => hoverRoom(room)}
                    onMouseLeave={() => hoverRoom(null)}
                  >
                    <span className={styles.scheduleNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.scheduleName}>{room.name}</span>
                    <span className={styles.scheduleRitual}>{room.ritual}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.compBlock}>
            <span className={styles.compLabel}>Composed most often as</span>
            <div className={styles.compGrid}>
              {compositions.map((composition) => (
                <Link
                  key={composition.slug}
                  href={`/the-wolf-way#${composition.slug}`}
                  className={styles.compCard}
                  onMouseEnter={() => setCursor("hover", composition.name)}
                  onMouseLeave={() => setCursor("hover", "Explore")}
                >
                  <span className={styles.compThumb}>
                    <Image src={composition.img} alt="" fill sizes="200px" loading="lazy" />
                  </span>
                  <span className={styles.compBody}>
                    <span className={styles.compName}>{composition.name}</span>
                    <span className={styles.compBlurb}>{composition.blurb}</span>
                    <span className={styles.compMaterials}>{composition.materials.join(" · ")}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
