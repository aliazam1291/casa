"use client";

import { useRef } from "react";
import * as THREE from "three";

/**
 * Warm directional key (only shadow caster), cool hemisphere fill, warm
 * accent point light near the painting. Design_System_v3.md §8 sanctions
 * this scene's real shadows as scoped depth cues, not a global "shadows
 * are back" precedent.
 */
export function Lights() {
  const keyRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      <directionalLight
        ref={keyRef}
        color={0xfff3df}
        intensity={1.6}
        position={[6, 8, 4]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0015}
      />
      <hemisphereLight color={0xeaf0f5} groundColor={0xb8a888} intensity={0.35} />
      <pointLight color={0xffe6bf} intensity={0.6} distance={6} decay={2} position={[2.6, 2.4, 0.9]} />
    </>
  );
}
