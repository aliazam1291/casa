"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ComponentType } from "react";
import { FLOORS, type Room } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./VillaSection.module.css";

type VillaSceneProps = { onRoomHover?: (room: Room | null) => void; onRoomClick?: (room: Room) => void };

// ssr:false must live inside a Client Component; the engine is vendored JS
// (allowJs), so we cast it to a typed component the same way GalleryHero does.
const VillaScene = dynamic(() => import("./VillaScene"), {
  ssr: false,
}) as unknown as ComponentType<VillaSceneProps>;

/**
 * "The Villa, In Section" — an exploded architectural axonometric of all
 * four floors, drawn apart so every level is visible at once. A separate,
 * lightweight WebGL scene from the main "Step Inside" gallery (no shared
 * state, no shared canvas) — line-art massing only, not a furnished replay
 * of the walkthrough.
 */
export function VillaSection() {
  const [hovered, setHovered] = useState<Room | null>(null);
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const router = useRouter();

  const onRoomHover = useCallback((room: Room | null) => {
    setHovered(room);
  }, []);

  const onRoomClick = useCallback((room: Room) => {
    router.push(`/rooms/${room.slug}`);
  }, [router]);

  return (
    <section className={styles.section}>
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.num}>§ 02 — The Villa, In Section</span>
        <h2 className={styles.heading}>
          Four floors, <em>drawn apart.</em>
        </h2>
      </div>

      <div className={styles.stage} onMouseEnter={() => setCursor("hover", "Rotate")} onMouseLeave={resetCursor}>
        <div className={styles.canvasMount}>
          <VillaScene onRoomHover={onRoomHover} onRoomClick={onRoomClick} />
        </div>

        <div className={styles.legend} aria-hidden>
          {[...FLOORS].reverse().map((floor) => (
            <div key={floor.index} className={hovered?.floorIndex === floor.index ? styles.legendRowActive : styles.legendRow}>
              <span className={styles.legendLevel}>{floor.level}</span>
              <span className={styles.legendLabel}>{floor.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.hint}>Drag to rotate · click a room to step inside</div>

        {hovered && (
          <Link href={`/rooms/${hovered.slug}`} className={styles.tooltip} onMouseEnter={() => setCursor("hover", "Enter")} onMouseLeave={resetCursor}>
            <span className={styles.tooltipEyebrow}>{hovered.floorLabel}</span>
            <span className={styles.tooltipName}>{hovered.name}</span>
            <span className={styles.tooltipRitual}>{hovered.ritual}</span>
          </Link>
        )}
      </div>
    </section>
  );
}
