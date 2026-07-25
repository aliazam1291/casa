"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { VaseScene } from "./VaseScene";
import { useVaseDrag } from "./useVaseDrag";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The vase hero canvas. Loaded via next/dynamic with ssr:false from
 * VaseHero.tsx — must never be imported directly by a Server Component
 * (Next.js 16 forbids `ssr:false` dynamic imports there; see AGENTS.md).
 */
export default function VaseCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const drag = useVaseDrag(mountRef, reducedMotion);

  return (
    <div ref={mountRef} style={{ position: "absolute", inset: 0, touchAction: "none" }}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ fov: 35, position: [0, 0.4, 5], near: 0.1, far: 100 }}
      >
        <VaseScene drag={drag} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
