"use client";

import type { Floor, Room } from "@/lib/rooms";
import styles from "./FloorPlanKey.module.css";

/**
 * A key plan for the selected floor, drawn from the same plan rectangles the
 * elevation is sized from (lib/rooms.ts). Rooms are numbered rather than
 * labelled in place — at this size a name like "Spa Bath En-Suite" cannot fit
 * inside a 23-unit room without colliding with its neighbour, so the drawing
 * carries numbers and the schedule beneath carries the names. That is also
 * how a real key plan is drawn.
 */

// The plan rectangles live in a ~10..90 x 10..86 space; the envelope is the
// villa's outer wall.
const ENV = { x: 10, y: 10, w: 80, h: 76 };
const PAD = 5;

export type FloorPlanKeyProps = {
  floor: Floor;
  hoveredRoom?: Room | null;
  onHoverRoom?: (room: Room | null) => void;
  onSelectRoom?: (room: Room) => void;
};

export function FloorPlanKey({ floor, hoveredRoom, onHoverRoom, onSelectRoom }: FloorPlanKeyProps) {
  return (
    <svg
      className={styles.plan}
      viewBox={`${ENV.x - PAD} ${ENV.y - PAD} ${ENV.w + PAD * 2} ${ENV.h + PAD * 2}`}
      role="img"
      aria-label={`Key plan — ${floor.label}`}
    >
      <rect className={styles.envelope} x={ENV.x} y={ENV.y} width={ENV.w} height={ENV.h} />

      {floor.rooms.map((room, i) => {
        const isHot = hoveredRoom?.slug === room.slug;
        const { x, y, w, h } = room.plan;
        return (
          <g
            key={room.slug}
            onMouseEnter={() => onHoverRoom?.(room)}
            onMouseLeave={() => onHoverRoom?.(null)}
            onClick={() => onSelectRoom?.(room)}
          >
            <rect className={isHot ? styles.roomHot : styles.room} x={x} y={y} width={w} height={h} />
            <text className={styles.roomNum} x={x + w / 2} y={y + h / 2 + 1.6} textAnchor="middle">
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}

      {/* north point — a plan is not a plan without one */}
      <g className={styles.north}>
        <line x1={ENV.x + ENV.w - 4} y1={ENV.y - 1} x2={ENV.x + ENV.w - 4} y2={ENV.y - 5} />
        <polygon points={`${ENV.x + ENV.w - 4},${ENV.y - 6.4} ${ENV.x + ENV.w - 5.4},${ENV.y - 3.6} ${ENV.x + ENV.w - 2.6},${ENV.y - 3.6}`} />
      </g>
    </svg>
  );
}
