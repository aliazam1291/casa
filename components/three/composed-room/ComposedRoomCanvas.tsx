"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ComposedRoomScene } from "./ComposedRoomScene";

/**
 * Loaded via next/dynamic with ssr:false from ComposedRoomSection.tsx —
 * kept intentionally thin so the client chunk boundary stays clean.
 */
export default function ComposedRoomCanvas({
  run,
  reducedMotion,
}: {
  run: boolean;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ fov: 28, position: [6, 5, 6], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        camera.lookAt(0, 1, 0);
      }}
    >
      <ComposedRoomScene run={run} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
