"use client";

import { useMemo } from "react";
import { FLOORS, type Floor, type Room } from "@/lib/rooms";
import styles from "./IsoHouse.module.css";

/**
 * The villa drawn as a mansion in true 30° isometric — wide and low rather
 * than a narrow tower, under a shallow HIPPED roof (a ridge shorter than the
 * building, hipped back at both ends) instead of the single leaning slope a
 * gable gives you from this angle. A cornice, a base course and a columned
 * portico carry the classical read; the colonnade is drawn open so it never
 * occludes the rooms behind it.
 *
 * Projection: px = (x - z)·cos30, py = (x + z)·sin30 - y — x along the front
 * facade, z into the page, y up. Every coordinate is exact and hand-checkable,
 * which is the whole reason this is SVG and not a WebGL camera.
 */

const W = 300; // facade width  (x)
const D = 92; // depth          (z)
const FLOOR_H = 30;
const H = FLOOR_H * FLOORS.length; // 120, wall height to the eaves
const RISE = 26; // shallow ridge above the eaves
const OH = 10; // roof overhang
const HIP = D / 2; // 45° hip — ridge is this much shorter at each end
const GRADE_Y = FLOOR_H; // top of the cellar = ground level
const GE = 30; // grade line extension past the walls

const CORNICE = 7; // entablature band under the eaves
const BASE = 5; // plinth course at grade

// Portico
const PX0 = 118;
const PX1 = 182;
const PD = 16; // how far it projects forward of the facade
const PORT_TOP = GRADE_Y + FLOOR_H * 2;
const PED = 14; // pediment rise
const COL_W = 6;

const COS30 = Math.cos(Math.PI / 6);

type P3 = [number, number, number];

// Every vertex the drawing can touch, so the viewBox is derived, not guessed.
const EXTENTS: P3[] = [
  [0, 0, 0], [W, 0, 0], [W, 0, D], [0, 0, D],
  [0, H, 0], [W, H, 0], [W, H, D], [0, H, D],
  [-OH, H, D + OH], [W + OH, H, D + OH],
  [-OH, H, -OH], [W + OH, H, -OH],
  [HIP, H + RISE, D / 2], [W - HIP, H + RISE, D / 2],
  [PX0 - 4, GRADE_Y, D + PD], [PX1 + 4, PORT_TOP + PED, D + PD],
  [-GE, GRADE_Y, D], [W, GRADE_Y, -GE],
];

const PAD = 16;
const rawX = EXTENTS.map(([x, , z]) => (x - z) * COS30);
const rawY = EXTENTS.map(([x, y, z]) => (x + z) * 0.5 - y);
const OX = -Math.min(...rawX) + PAD;
const OY = -Math.min(...rawY) + PAD;
const VB_W = Math.max(...rawX) - Math.min(...rawX) + PAD * 2;
const VB_H = Math.max(...rawY) - Math.min(...rawY) + PAD * 2;

function iso(x: number, y: number, z: number): [number, number] {
  return [OX + (x - z) * COS30, OY + (x + z) * 0.5 - y];
}
const poly = (pts: P3[]) =>
  pts.map((p) => iso(...p).map((n) => n.toFixed(2)).join(",")).join(" ");

/** A band on the front plane, e.g. the cornice or the base course. */
const frontBand = (y0: number, y1: number): P3[] => [
  [0, y0, D], [W, y0, D], [W, y1, D], [0, y1, D],
];
/** The same band carried around the return wall. */
const sideBand = (y0: number, y1: number): P3[] => [
  [W, y0, D], [W, y0, 0], [W, y1, 0], [W, y1, D],
];

const COLUMNS = [0, 1, 2, 3].map((i) => PX0 + 8 + i * 14);

/** Rooms laid across the facade, each as wide as its real plan width. */
function facadeSegments(floor: Floor) {
  const rooms = [...floor.rooms].sort((a, b) => a.plan.x - b.plan.x || a.plan.y - b.plan.y);
  const total = rooms.reduce((sum, r) => sum + r.plan.w, 0);
  let cursor = 0;
  return rooms.map((room) => {
    const w = (room.plan.w / total) * W;
    const seg = { room, x0: cursor, x1: cursor + w };
    cursor += w;
    return seg;
  });
}

export type IsoHouseProps = {
  focusFloor: number | null;
  hoveredRoom?: Room | null;
  onHoverRoom?: (room: Room | null) => void;
  onSelectRoom?: (room: Room) => void;
  onSelectFloor?: (index: number) => void;
  className?: string;
};

export function IsoHouse({
  focusFloor,
  hoveredRoom = null,
  onHoverRoom,
  onSelectRoom,
  onSelectFloor,
  className,
}: IsoHouseProps) {
  const floors = useMemo(
    () => FLOORS.map((floor) => ({ floor, segments: facadeSegments(floor) })),
    []
  );

  return (
    <svg
      className={`${styles.svg} ${className ?? ""}`}
      viewBox={`0 0 ${VB_W.toFixed(2)} ${VB_H.toFixed(2)}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="An axonometric drawing of the Wolf Casa villa"
    >
      {/* ── mass ─────────────────────────────────────────────── */}
      <polygon className={styles.wallSide} points={poly([[W, 0, 0], [W, 0, D], [W, H, D], [W, H, 0]])} />
      <polygon className={styles.wallFront} points={poly([[0, 0, D], [W, 0, D], [W, H, D], [0, H, D]])} />
      <polygon
        className={styles.belowGrade}
        points={poly([[0, 0, D], [W, 0, D], [W, GRADE_Y, D], [0, GRADE_Y, D]])}
      />

      {/* ── rooms, as panels on the long facade ──────────────── */}
      {floors.map(({ floor, segments }) => {
        const dimmed = focusFloor !== null && focusFloor !== floor.index;
        return (
          <g key={floor.index} className={dimmed ? styles.floorDim : styles.floorLit}>
            {segments.map(({ room, x0, x1 }) => {
              const y0 = floor.index * FLOOR_H + 6;
              const y1 = floor.index * FLOOR_H + FLOOR_H - 8;
              const isHot = hoveredRoom?.slug === room.slug;
              return (
                <polygon
                  key={room.slug}
                  className={isHot ? styles.roomHot : styles.room}
                  points={poly([
                    [x0 + 4, y0, D], [x1 - 4, y0, D], [x1 - 4, y1, D], [x0 + 4, y1, D],
                  ])}
                  onMouseEnter={() => onHoverRoom?.(room)}
                  onMouseLeave={() => onHoverRoom?.(null)}
                  onClick={() => {
                    onSelectFloor?.(floor.index);
                    onSelectRoom?.(room);
                  }}
                />
              );
            })}
            <polyline
              className={styles.floorLine}
              points={poly([
                [0, (floor.index + 1) * FLOOR_H, D],
                [W, (floor.index + 1) * FLOOR_H, D],
                [W, (floor.index + 1) * FLOOR_H, 0],
              ])}
            />
          </g>
        );
      })}

      {/* ── classical banding ────────────────────────────────── */}
      <polygon className={styles.cornice} points={poly(frontBand(H - CORNICE, H))} />
      <polygon className={styles.corniceSide} points={poly(sideBand(H - CORNICE, H))} />
      <polygon className={styles.base} points={poly(frontBand(GRADE_Y, GRADE_Y + BASE))} />
      <polygon className={styles.baseSide} points={poly(sideBand(GRADE_Y, GRADE_Y + BASE))} />

      {/* ── windows on the return wall, for depth ────────────── */}
      {[1, 2, 3].map((fi) =>
        [0.3, 0.66].map((t) => (
          <polygon
            key={`${fi}-${t}`}
            className={styles.sideWindow}
            points={poly([
              [W, fi * FLOOR_H + 8, D * t + 9], [W, fi * FLOOR_H + 8, D * t - 9],
              [W, fi * FLOOR_H + 22, D * t - 9], [W, fi * FLOOR_H + 22, D * t + 9],
            ])}
          />
        ))
      )}

      {/* ── entrance, seen through the colonnade ─────────────── */}
      <polygon
        className={styles.door}
        points={poly([
          [143, GRADE_Y, D], [157, GRADE_Y, D], [157, GRADE_Y + 26, D], [143, GRADE_Y + 26, D],
        ])}
      />

      {/* ── portico: open colonnade, entablature, pediment ───── */}
      <g className={styles.portico}>
        {COLUMNS.map((cx) => (
          <polygon
            key={cx}
            className={styles.column}
            points={poly([
              [cx, GRADE_Y, D + PD], [cx + COL_W, GRADE_Y, D + PD],
              [cx + COL_W, PORT_TOP - 8, D + PD], [cx, PORT_TOP - 8, D + PD],
            ])}
          />
        ))}
        <polygon
          className={styles.entablature}
          points={poly([
            [PX0 - 4, PORT_TOP - 8, D + PD], [PX1 + 4, PORT_TOP - 8, D + PD],
            [PX1 + 4, PORT_TOP, D + PD], [PX0 - 4, PORT_TOP, D + PD],
          ])}
        />
        {/* the portico's own depth, back to the facade */}
        <polygon
          className={styles.porticoReturn}
          points={poly([
            [PX1 + 4, PORT_TOP - 8, D + PD], [PX1 + 4, PORT_TOP - 8, D],
            [PX1 + 4, PORT_TOP, D], [PX1 + 4, PORT_TOP, D + PD],
          ])}
        />
        <polygon
          className={styles.pediment}
          points={poly([
            [PX0 - 4, PORT_TOP, D + PD], [PX1 + 4, PORT_TOP, D + PD],
            [(PX0 + PX1) / 2, PORT_TOP + PED, D + PD],
          ])}
        />
      </g>

      {/* ── hipped roof: front slope + the right-hand hip ────── */}
      <polygon
        className={styles.roofHip}
        points={poly([
          [W + OH, H, -OH], [W + OH, H, D + OH], [W - HIP, H + RISE, D / 2],
        ])}
      />
      <polygon
        className={styles.roof}
        points={poly([
          [-OH, H, D + OH], [W + OH, H, D + OH],
          [W - HIP, H + RISE, D / 2], [HIP, H + RISE, D / 2],
        ])}
      />
      <polyline className={styles.ridge} points={poly([[HIP, H + RISE, D / 2], [W - HIP, H + RISE, D / 2]])} />

      {/* ── grade ────────────────────────────────────────────── */}
      <polyline
        className={styles.grade}
        points={poly([[-GE, GRADE_Y, D], [W, GRADE_Y, D], [W, GRADE_Y, -GE]])}
      />

      {/* ── level tags, clickable ────────────────────────────── */}
      {FLOORS.map((floor) => {
        const [lx, ly] = iso(-4, floor.index * FLOOR_H + FLOOR_H / 2, D);
        const active = focusFloor === floor.index;
        return (
          <text
            key={floor.index}
            x={lx - 10}
            y={ly + 3}
            textAnchor="end"
            className={active ? styles.levelTagActive : styles.levelTag}
            onClick={() => onSelectFloor?.(floor.index)}
          >
            {floor.level}
          </text>
        );
      })}
    </svg>
  );
}
