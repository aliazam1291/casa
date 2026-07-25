import { Vector2 } from "three";

/**
 * 14-point profile revolved via LatheGeometry — lifted verbatim from
 * wolf-casa-homepage-v3.html (~line 716). See Wolf_Casa_3D_Concept_v3.md
 * "The vase geometry" for the silhouette description. Do not reinterpret.
 */
const PROFILE: [number, number][] = [
  [0.0, -1.2],
  [0.35, -1.2],
  [0.45, -1.15],
  [0.5, -1.0],
  [0.55, -0.7],
  [0.62, -0.3],
  [0.68, 0.1],
  [0.7, 0.45],
  [0.65, 0.7],
  [0.55, 0.9],
  [0.48, 1.05],
  [0.5, 1.15],
  [0.55, 1.22],
  [0.55, 1.28],
  [0.0, 1.28],
];

export const VASE_PROFILE_POINTS = PROFILE.map(([x, y]) => new Vector2(x, y));
export const VASE_LATHE_SEGMENTS = 96;
