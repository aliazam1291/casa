"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { ContactShadows } from "@react-three/drei";
import { COMPOSED_ROOM } from "./data/manifest";
import { Ground } from "./Ground";
import { Lights } from "./Lights";
import { RoomCluster } from "./RoomCluster";
import { AccentLines } from "./AccentLines";
import { DioramaDirector, type DirectorState } from "./DioramaDirector";
import { useAssemblyTimeline } from "./useAssemblyTimeline";
import { useRoomTextures } from "./useRoomTextures";
import { CREAM_STAGE } from "./data/tokens";

export function ComposedRoomScene({
  run,
  reducedMotion,
}: {
  run: boolean;
  reducedMotion: boolean;
}) {
  const clusterRefs = useRef<Record<string, THREE.Group | null>>({});
  const directorState = useRef<DirectorState>({ phase: "armed", orbitStart: 0 });
  const [linesOn, setLinesOn] = useState(reducedMotion);
  const [shadowsReady, setShadowsReady] = useState(reducedMotion);
  const [, forceRender] = useState(0);

  const { textures } = useRoomTextures();

  useAssemblyTimeline({
    objects: COMPOSED_ROOM,
    clusterRefs,
    run,
    reducedMotion,
    directorState,
    onLinesReveal: () => setLinesOn(true),
    onComplete: () => {
      // directorState is owned by this component (created via useRef
      // above), so mutating it here — not inside a hook that merely
      // received it as an argument — is the normal case, not the
      // ref-as-parameter pattern flagged elsewhere in this directory.
      directorState.current.phase = reducedMotion ? "static" : "orbiting";
      setShadowsReady(true);
      forceRender((n) => n + 1);
    },
  });

  return (
    <>
      <color attach="background" args={[CREAM_STAGE]} />
      <Ground />
      <Lights />
      <DioramaDirector state={directorState} />

      {COMPOSED_ROOM.map((obj) => (
        <group
          key={obj.id}
          ref={(el) => {
            clusterRefs.current[obj.id] = el;
          }}
        >
          <RoomCluster object={obj} textures={textures} onHover={() => {}} />
        </group>
      ))}

      <AccentLines assemble={linesOn} instant={reducedMotion} />

      {shadowsReady && (
        <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={12} blur={1.6} far={4} frames={1} />
      )}
    </>
  );
}
