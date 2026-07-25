"use client";

import { Line } from "@react-three/drei";
import { CREAM_GROUND } from "./data/tokens";

const FOOTPRINT: [number, number, number][] = [
  [-5, 0.02, -3.5],
  [5, 0.02, -3.5],
  [5, 0.02, 3.5],
  [-5, 0.02, 3.5],
  [-5, 0.02, -3.5],
];

/** PlaneGeometry(20,14) ground + a thin darker wireframe footprint outline. */
export function Ground() {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow raycast={() => null}>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color={CREAM_GROUND} roughness={1} />
      </mesh>
      <Line points={FOOTPRINT} color={0xb3a488} lineWidth={0.5} />
    </>
  );
}
