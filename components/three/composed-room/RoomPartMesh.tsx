"use client";

import { forwardRef } from "react";
import * as THREE from "three";
import type { RoomPart } from "./data/types";
import { CREAM_MATTE, CREAM_GROUND } from "./data/tokens";

type Props = {
  part: RoomPart;
  texture: THREE.Texture | null | undefined;
};

/** Pure GeometrySpec + MaterialSpec → <mesh>. No logic, no state. */
export const RoomPartMesh = forwardRef<THREE.Mesh, Props>(function RoomPartMesh(
  { part, texture },
  ref,
) {
  const { geometry, material, position, rotation, scale } = part;

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      {geometry.kind === "box" && <boxGeometry args={geometry.args} />}
      {geometry.kind === "cylinder" && <cylinderGeometry args={geometry.args} />}
      {geometry.kind === "sphere" && <sphereGeometry args={geometry.args} />}

      {material.kind === "matte" && (
        <meshStandardMaterial color={CREAM_MATTE} roughness={0.85} />
      )}
      {material.kind === "ground" && (
        <meshStandardMaterial color={CREAM_GROUND} roughness={0.95} />
      )}
      {material.kind === "textured" &&
        (texture ? (
          <meshStandardMaterial map={texture} roughness={material.roughness ?? 0.4} />
        ) : (
          // Texture failed/timed out — fall back to flat cream rather than
          // erroring the scene. useRoomTextures.ts documents the timeout.
          <meshStandardMaterial color={CREAM_MATTE} roughness={0.6} />
        ))}
    </mesh>
  );
});
