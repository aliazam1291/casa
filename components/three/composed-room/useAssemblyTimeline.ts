"use client";

import { useEffect } from "react";
import gsap from "gsap";
import * as THREE from "three";
import type { RoomObject, StaggerGroup } from "./data/types";
import type { DirectorState } from "./DioramaDirector";

const GROUP_OFFSET_MS: Record<StaggerGroup, number> = {
  walls: 0,
  furniture: 200,
  sculpture: 400,
  art: 600,
  accents: 800,
};

type Args = {
  objects: RoomObject[];
  clusterRefs: React.RefObject<Record<string, THREE.Group | null>>;
  run: boolean;
  reducedMotion: boolean;
  directorState: React.RefObject<DirectorState>;
  onLinesReveal: () => void;
  onComplete: () => void;
};

function setClusterOpacity(group: THREE.Group, opacity: number, transparent: boolean) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mat = child.material as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
      if ("opacity" in mat) {
        mat.transparent = transparent;
        mat.opacity = opacity;
        mat.needsUpdate = true;
      }
    }
  });
}

/**
 * Staggered fade + drop assembly, built from the manifest's `group` field:
 * walls 0ms → furniture 200ms → sculpture 400ms → art 600ms → accent
 * lines 800ms (handled separately via onLinesReveal). Runs once when
 * `run` flips true; reduced motion skips straight to the final state.
 */
export function useAssemblyTimeline({
  objects,
  clusterRefs,
  run,
  reducedMotion,
  directorState,
  onLinesReveal,
  onComplete,
}: Args) {
  useEffect(() => {
    const refs = clusterRefs.current;
    if (!refs) return;

    // Initial state: dropped + invisible.
    objects.forEach((obj) => {
      const group = refs[obj.id];
      if (!group) return;
      group.position.y = obj.dropFrom ?? 0.6;
      setClusterOpacity(group, 0, true);
    });

    if (reducedMotion) {
      objects.forEach((obj) => {
        const group = refs[obj.id];
        if (!group) return;
        group.position.y = 0;
        setClusterOpacity(group, 1, false);
      });
      // directorState is a ref intentionally shared with DioramaDirector so
      // this one-shot assembly effect can hand off camera ownership on
      // completion — see DioramaDirector.tsx's "single writer" contract.
      // eslint-disable-next-line react-hooks/immutability
      directorState.current.phase = "static";
      onLinesReveal();
      onComplete();
      return;
    }

    if (!run) return;

    const tl = gsap.timeline({
      onComplete: () => {
        objects.forEach((obj) => {
          const group = refs[obj.id];
          if (!group) return;
          setClusterOpacity(group, 1, false);
        });
        onComplete();
      },
    });

    objects.forEach((obj) => {
      const group = refs[obj.id];
      if (!group) return;
      const offsetS = GROUP_OFFSET_MS[obj.group] / 1000;
      const proxy = { t: 0 };

      tl.to(
        proxy,
        {
          t: 1,
          duration: 0.9,
          ease: "power3.out",
          onUpdate: () => {
            group.position.y = THREE.MathUtils.lerp(obj.dropFrom ?? 0.6, 0, proxy.t);
            setClusterOpacity(group, proxy.t, true);
          },
        },
        offsetS,
      );
    });

    // Accent lines draw on last, at 800ms.
    tl.call(onLinesReveal, [], 0.8);

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, reducedMotion]);
}
