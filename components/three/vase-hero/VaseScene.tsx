"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VASE_PROFILE_POINTS, VASE_LATHE_SEGMENTS } from "./vaseProfile";
import { useWorldMood } from "./WorldMoodProvider";
import { WORLDS } from "@/lib/worlds";
import type { DragState } from "./useVaseDrag";

const PARTICLE_COUNT = 60;

// Generated once at module scope, not during render — Math.random() inside
// a render-phase useMemo is an impure call under React's purity rules.
// A fixed scatter is fine here: this is atmosphere, not simulation.
function generateParticlePositions() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  return positions;
}

const PARTICLE_POSITIONS = generateParticlePositions();

/**
 * The vase scene contents — lights, the LatheGeometry vase, base ring,
 * particles. Full spec: Wolf_Casa_3D_Concept_v3.md. Ported from
 * wolf-casa-homepage-v3.html (~line 690).
 */
export function VaseScene({
  drag,
  reducedMotion,
}: {
  drag: React.RefObject<DragState>;
  reducedMotion: boolean;
}) {
  const vaseMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const keyLightRef = useRef<THREE.PointLight>(null);
  const baseRingRef = useRef<THREE.Mesh>(null);
  const vaseRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const { activeIndex } = useWorldMood();

  const targetAccent = useMemo(() => new THREE.Color(WORLDS[0].accent), []);
  const targetEmissive = useMemo(() => new THREE.Color(WORLDS[0].emissive), []);

  useMemo(() => {
    targetAccent.setHex(WORLDS[activeIndex].accent);
    targetEmissive.setHex(WORLDS[activeIndex].emissive);
  }, [activeIndex, targetAccent, targetEmissive]);

  /* eslint-disable react-hooks/immutability --
   * `drag` is a ref passed in by useVaseDrag specifically so this
   * per-frame R3F render loop (which runs outside React's render phase)
   * can read and update it — the standard R3F "mutate a ref in useFrame"
   * pattern. The rule doesn't yet model refs-as-parameters this way. */
  useFrame(() => {
    const d = drag.current;

    if (reducedMotion) {
      if (vaseRef.current) vaseRef.current.rotation.set(0, 0, 0);
    } else {
      if (!d.dragging) d.targetRotY += 0.003;
      d.rotY += (d.targetRotY - d.rotY) * 0.08;
      d.rotX += (d.targetRotX - d.rotX) * 0.08;

      if (vaseRef.current) {
        vaseRef.current.rotation.y = d.rotY;
        vaseRef.current.rotation.x = d.rotX;
      }
      if (baseRingRef.current) {
        baseRingRef.current.rotation.z = d.rotY * 0.5;
      }
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005;
        particlesRef.current.rotation.x += 0.0002;
      }
    }

    const lerpAlpha = reducedMotion ? 1 : 0.04;
    if (keyLightRef.current) keyLightRef.current.color.lerp(targetAccent, lerpAlpha);
    if (vaseMatRef.current) vaseMatRef.current.emissive.lerp(targetEmissive, lerpAlpha);
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <fogExp2 attach="fog" args={[0x0a0a0a, 0.08]} />
      <ambientLight color={0x1a1512} intensity={0.5} />
      <pointLight
        ref={keyLightRef}
        color={0xc9963f}
        intensity={3.2}
        distance={10}
        decay={2}
        position={[1.8, 1.6, 2]}
      />
      <pointLight color={0x6a5a4a} intensity={0.9} distance={8} decay={2} position={[-2, -0.5, 1]} />
      <directionalLight color={0xffffff} intensity={0.15} position={[-2, 3, -2]} />

      <mesh ref={vaseRef} scale={0.9}>
        <latheGeometry args={[VASE_PROFILE_POINTS, VASE_LATHE_SEGMENTS]} />
        <meshStandardMaterial
          ref={vaseMatRef}
          color={0x1a1512}
          roughness={0.35}
          metalness={0.75}
          emissive={0x3a2410}
          emissiveIntensity={0.15}
        />
      </mesh>

      <mesh ref={baseRingRef} rotation-x={Math.PI / 2} position-y={-1.09}>
        <torusGeometry args={[0.55, 0.008, 12, 96]} />
        <meshStandardMaterial color={0x2a2a2a} roughness={0.4} metalness={0.9} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[PARTICLE_POSITIONS, 3]} />
        </bufferGeometry>
        <pointsMaterial color={0xc9963f} size={0.015} transparent opacity={0.6} sizeAttenuation />
      </points>
    </>
  );
}
