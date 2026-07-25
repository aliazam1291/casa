"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { RoomObject, TextureKey } from "./data/types";
import { RoomPartMesh } from "./RoomPartMesh";
import { useCursor } from "@/components/cursor/CursorProvider";

type Props = {
  object: RoomObject;
  textures: Partial<Record<TextureKey, THREE.Texture | null>>;
  onHover: (id: string | null) => void;
};

/**
 * One interactive Named Object: its parts, an invisible raycast proxy
 * (so hover doesn't flicker crossing between a cluster's own parts),
 * pointer handlers (hover brightness pulse + cursor label, click → PDP).
 */
export function RoomCluster({ object, textures, onHover }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const router = useRouter();
  const { setCursor, resetCursor } = useCursor();
  const interactive = object.label !== null && object.href !== null;

  const pulseMaterials = useCallback((intensity: number) => {
    const group = groupRef.current;
    if (!group) return;
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat?.emissive) {
          gsap.to(mat, { emissiveIntensity: intensity, duration: intensity ? 0.25 : 0.35, ease: "power2.out" });
          if (mat.emissive.getHex() === 0) mat.emissive.setHex(0xddd1b8);
        }
      }
    });
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    return () => {
      if (!group) return;
      gsap.killTweensOf(
        Array.from(group.children).flatMap((c) =>
          c instanceof THREE.Mesh ? [c.material] : [],
        ),
      );
    };
  }, []);

  if (!interactive) {
    return (
      <group ref={groupRef} name={object.id}>
        {object.parts.map((part) => (
          <RoomPartMesh key={part.id} part={part} texture={textures[part.material.kind === "textured" ? part.material.map : "marble"]} />
        ))}
      </group>
    );
  }

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(object.id);
    setCursor("hover", object.label ?? "View");
    pulseMaterials(0.18);
    router.prefetch(object.href!);
  };
  const onPointerOut = () => {
    onHover(null);
    resetCursor();
    pulseMaterials(0);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    router.push(object.href!);
  };

  return (
    <group ref={groupRef} name={object.id}>
      {object.parts.map((part) => (
        <RoomPartMesh
          key={part.id}
          part={part}
          texture={textures[part.material.kind === "textured" ? part.material.map : "marble"]}
        />
      ))}
      {object.hitbox && (
        <mesh
          position={object.hitbox.center}
          visible={false}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onClick={onClick}
        >
          <boxGeometry args={object.hitbox.size} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}
