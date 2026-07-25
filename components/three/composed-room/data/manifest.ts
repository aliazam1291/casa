import type { RoomObject, RoomPart, Vec3 } from "./types";

/**
 * The Composed Room object manifest — single source of truth. Geometry,
 * hover labels, click-through, and assembly choreography all derive from
 * this array; nothing downstream should hand-wire an individual mesh.
 *
 * Object → Named Object mapping note: only 4 of the 6 Named Objects
 * currently in lib/objects.ts are represented here (Low Sofa, Quiet
 * Wardrobe, Heirloom Table are Named Objects; Materials Library and
 * Signature Reveal are Experiences, not PDPs). Pebbles/staircase/accent
 * lines are decorative (label: null). This needs brand sign-off before
 * the diorama is treated as an exhaustive catalogue door — see
 * files/Wolf_Casa_Website_IA.md §3.3 for the full 12-object list.
 */

const discs: RoomPart[] = [0, 1, 2, 3, 4].map((i) => ({
  id: `low-sofa-disc-${i}`,
  geometry: { kind: "cylinder", args: [0.3, 0.3, 0.08, 32] },
  position: [-4.42, 2.9, -1.6 + i * 0.8] as Vec3,
  rotation: [0, 0, Math.PI / 2] as Vec3,
  material: { kind: "matte" },
}));

const slats: RoomPart[] = [0, 1, 2, 3, 4, 5].map((i) => ({
  id: `wardrobe-slat-${i}`,
  geometry: { kind: "box", args: [0.12, 3.2, 0.12] },
  position: [-1.7 + i * 0.34, 1.9, -2.5] as Vec3,
  material: { kind: "matte" },
}));

const pebblePlacements: { r: number; pos: Vec3; rot: Vec3 }[] = [
  { r: 0.42, pos: [-0.9, 0.19, 2.1], rot: [0.1, 0.4, 0] },
  { r: 0.3, pos: [-0.35, 0.14, 2.4], rot: [0.2, 1.1, 0.1] },
  { r: 0.22, pos: [-1.35, 0.11, 2.5], rot: [0, 0.6, 0.2] },
  { r: 0.36, pos: [0.15, 0.17, 1.95], rot: [0.15, 2.0, 0] },
  { r: 0.18, pos: [-0.65, 0.09, 1.75], rot: [0, 1.4, 0.05] },
  { r: 0.27, pos: [0.45, 0.13, 2.45], rot: [0.1, 0.2, 0.15] },
  { r: 0.15, pos: [-1.1, 0.08, 1.85], rot: [0, 0.9, 0] },
];

const pebbles: RoomPart[] = pebblePlacements.map((p, i) => ({
  id: `pebble-${i}`,
  geometry: { kind: "sphere", args: [p.r, 20, 14] },
  position: p.pos,
  rotation: p.rot,
  scale: [1, 0.55, 1],
  material: { kind: "matte" },
}));

const stairs: RoomPart[] = [0, 1, 2, 3, 4].map((i) => ({
  id: `stair-${i}`,
  geometry: { kind: "box", args: [0.9, 0.22, 0.85] },
  position: [4.3, 0.11 + i * 0.22, -2.4 + i * 0.85] as Vec3,
  material: { kind: "matte" },
}));

export const COMPOSED_ROOM: RoomObject[] = [
  {
    id: "low-sofa",
    group: "walls",
    label: "The Low Sofa",
    href: "/the-wolf-way/object/the-low-sofa",
    cursorLabel: "View",
    hitbox: { size: [4.0, 3.6, 3.2], center: [-4.0, 1.8, 0] },
    dropFrom: 0.6,
    parts: [
      { id: "low-sofa-wall", geometry: { kind: "box", args: [0.18, 4.2, 6.0] }, position: [-4.6, 2.1, 0], material: { kind: "matte" } },
      ...discs,
      { id: "low-sofa-bench", geometry: { kind: "box", args: [3.6, 0.35, 0.8] }, position: [-3.0, 0.42, 1.4], rotation: [0, Math.PI / 2, 0], material: { kind: "matte" } },
    ],
  },
  {
    id: "quiet-wardrobe",
    group: "walls",
    label: "The Quiet Wardrobe",
    href: "/the-wolf-way/object/the-quiet-wardrobe",
    cursorLabel: "View",
    hitbox: { size: [2.4, 3.4, 0.6], center: [-0.5, 1.9, -2.5] },
    dropFrom: 0.6,
    parts: slats,
  },
  {
    id: "materials-library",
    group: "furniture",
    label: "The Materials Library",
    href: "/experiences/materials-library",
    cursorLabel: "Enter",
    hitbox: { size: [2.6, 2.3, 0.9], center: [0.4, 1.05, -1.3] },
    dropFrom: 0.5,
    parts: [
      { id: "slab-marble", geometry: { kind: "box", args: [1.1, 1.9, 0.06] }, position: [-0.4, 0.95, -1.35], rotation: [0, 0.22, 0.02], material: { kind: "textured", map: "marble", roughness: 0.35 } },
      { id: "slab-marble2", geometry: { kind: "box", args: [0.95, 1.55, 0.06] }, position: [0.45, 0.78, -1.05], rotation: [0, -0.14, -0.03], material: { kind: "textured", map: "marble2", roughness: 0.3 } },
      { id: "slab-travertine", geometry: { kind: "box", args: [0.8, 2.1, 0.06] }, position: [1.25, 1.05, -1.4], rotation: [0, 0.35, 0.015], material: { kind: "textured", map: "travertine", roughness: 0.55 } },
    ],
  },
  {
    id: "signature-reveal",
    group: "art",
    label: "The Signature Reveal",
    href: "/experiences/signature-reveal",
    cursorLabel: "Enter",
    hitbox: { size: [1.9, 2.4, 0.8], center: [2.6, 1.3, 0.6] },
    dropFrom: 0.7,
    parts: [
      { id: "portrait-wall", geometry: { kind: "box", args: [0.18, 4.2, 6.0] }, position: [3.3, 2.1, 0], material: { kind: "matte" } },
      { id: "portrait-frame", geometry: { kind: "box", args: [1.5, 2.0, 0.04] }, position: [2.62, 1.35, 0.6], material: { kind: "matte" } },
      { id: "portrait-art", geometry: { kind: "box", args: [1.36, 1.86, 0.02] }, position: [2.65, 1.35, 0.62], material: { kind: "textured", map: "portrait" } },
      { id: "easel-leg-a", geometry: { kind: "box", args: [0.05, 1.5, 0.05] }, position: [2.3, 0.6, 0.85], rotation: [0.18, 0, 0], material: { kind: "matte" } },
      { id: "easel-leg-b", geometry: { kind: "box", args: [0.05, 1.5, 0.05] }, position: [2.9, 0.6, 0.85], rotation: [0.18, 0, 0], material: { kind: "matte" } },
    ],
  },
  {
    id: "heirloom-table",
    group: "furniture",
    label: "The Heirloom Table",
    href: "/the-wolf-way/object/the-heirloom-table",
    cursorLabel: "View",
    hitbox: { size: [1.6, 1.2, 1.6], center: [2.2, 0.3, 1.9] },
    dropFrom: 0.5,
    parts: [
      { id: "table-base", geometry: { kind: "cylinder", args: [0.05, 0.05, 0.55, 16] }, position: [2.0, 0.275, 1.6], material: { kind: "matte" } },
      { id: "table-top", geometry: { kind: "cylinder", args: [0.35, 0.35, 0.04, 32] }, position: [2.0, 0.57, 1.6], material: { kind: "matte" } },
      { id: "pouf", geometry: { kind: "cylinder", args: [0.4, 0.42, 0.4, 24] }, position: [2.65, 0.2, 2.15], material: { kind: "matte" } },
    ],
  },
  {
    id: "staircase",
    group: "walls",
    label: null,
    href: null,
    dropFrom: 0.6,
    parts: stairs,
  },
  {
    id: "pebbles",
    group: "sculpture",
    label: null,
    href: null,
    dropFrom: 0.35,
    parts: [
      { id: "rug-base", geometry: { kind: "box", args: [2.0, 0.1, 1.4] }, position: [-0.75, 0.05, 2.15], material: { kind: "ground" } },
      ...pebbles,
    ],
  },
];
