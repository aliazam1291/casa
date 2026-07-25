"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export type DirectorPhase = "armed" | "assembling" | "orbiting" | "static";
export type DirectorState = { phase: DirectorPhase; orbitStart: number };

const REST_POSITION: [number, number, number] = [6, 5, 6];
const LOOK_AT: [number, number, number] = [0, 1, 0];
const RADIUS = Math.hypot(6, 6); // ~8.485
const THETA_0 = Math.PI / 4;
const SWEEP = (7.5 * Math.PI) / 180; // ±7.5° => ~15° total
const PERIOD_S = 20;

/**
 * The ONLY component that writes to the camera each frame. Assembly
 * choreography (RoomCluster drops) never touches it — this is what keeps
 * the choreography and the idle orbit from fighting over ownership.
 */
export function DioramaDirector({ state }: { state: React.RefObject<DirectorState> }) {
  const { camera } = useThree();
  const mounted = useRef(false);
  const prevPhase = useRef<DirectorPhase>("armed");

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    camera.position.set(...REST_POSITION);
    camera.lookAt(...LOOK_AT);
  }, [camera]);

  /* eslint-disable react-hooks/immutability --
   * `state` is a ref shared with useAssemblyTimeline specifically so this
   * is the single writer for camera-relevant fields each frame — the
   * canonical R3F "mutate a ref in useFrame" pattern; the rule doesn't
   * yet model refs-as-parameters this way. */
  useFrame(({ clock }) => {
    const s = state.current;
    if (s.phase === "static" || s.phase === "armed" || s.phase === "assembling") {
      prevPhase.current = s.phase;
      return;
    }
    // 'orbiting' — capture the clock time on the transition edge so the
    // sweep is a pure function of (elapsed - orbitStart) and always
    // starts exactly at the rest pose (sin(0) = 0): no jump, no drift.
    if (prevPhase.current !== "orbiting") {
      s.orbitStart = clock.elapsedTime;
    }
    prevPhase.current = "orbiting";

    const t = (clock.elapsedTime - s.orbitStart) * ((Math.PI * 2) / PERIOD_S);
    const theta = THETA_0 + Math.sin(t) * SWEEP;
    camera.position.set(RADIUS * Math.cos(theta), 5, RADIUS * Math.sin(theta));
    camera.lookAt(...LOOK_AT);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}
