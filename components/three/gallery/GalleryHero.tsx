"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { FLOORS } from "./galleryData";
import { useCursor } from "@/components/cursor/CursorProvider";
import styles from "./GalleryHero.module.css";

type SceneHandle = {
  goToRoom: (i: number) => void;
  nextRoom: () => void;
  prevRoom: () => void;
  setFloor: (i: number) => void;
};

type GallerySceneProps = {
  onRoomChange?: (i: number) => void;
  onFloorChange?: (i: number) => void;
};

// ssr:false must live inside a Client Component in Next.js 16. The engine is
// vendored JS (allowJs), so we cast it to a typed forwardRef component.
const GalleryScene = dynamic(() => import("./GalleryScene"), {
  ssr: false,
}) as unknown as ForwardRefExoticComponent<GallerySceneProps & RefAttributes<SceneHandle>>;

type Floor = { name: string; level: string; rooms: { name: string }[] };
const FLOOR_LIST = FLOORS as Floor[];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      {dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

/**
 * The immersive "Step Inside" gallery hero — an ICG-style walkthrough where
 * you move through furnished rooms across floors. The Three.js engine lives
 * in GalleryScene.jsx (vendored from the handoff); this component owns the
 * cream HUD: the entry gate, room name, navigation arrows, floor selector,
 * and room indicators.
 */
export function GalleryHero() {
  const sceneRef = useRef<SceneHandle | null>(null);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [entered, setEntered] = useState(false);
  const [floorsOpen, setFloorsOpen] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  const floor = FLOOR_LIST[currentFloor];
  const roomNames = floor.rooms.map((r) => r.name);
  const totalRooms = floor.rooms.length;

  const onRoomChange = useCallback((idx: number) => setCurrentRoom(idx), []);
  const onFloorChange = useCallback((idx: number) => setCurrentFloor(idx), []);

  const hover = (label: string) => {
    setCursor("hover", label);
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.mount}>
        <GalleryScene ref={sceneRef} onRoomChange={onRoomChange} onFloorChange={onFloorChange} />
      </div>
      <div className={styles.frameVignette} />

      <div className={styles.overlay}>
        {!entered ? (
          <div className={styles.gate}>
            <span className={styles.eyebrow}>Way of Light &amp; Form</span>
            <h1 className={styles.gateFloor}>{floor.name}</h1>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => setEntered(true)}
              onMouseEnter={() => hover("Enter")}
              onMouseLeave={resetCursor}
            >
              Step Inside
            </button>
            <div className={styles.hint}>Scroll · drag · or use the arrows</div>
          </div>
        ) : (
          <>
            {/* Left */}
            <div className={`${styles.side} ${styles.sideLeft}`}>
              <button
                type="button"
                className={styles.arrow}
                disabled={currentRoom === 0}
                onClick={() => sceneRef.current?.prevRoom()}
                onMouseEnter={() => hover("Prev")}
                onMouseLeave={resetCursor}
                aria-label="Previous room"
              >
                <Chevron dir="left" />
              </button>
              {currentRoom > 0 && <span className={styles.sideLabel}>{roomNames[currentRoom - 1]}</span>}
            </div>

            {/* Right */}
            <div className={`${styles.side} ${styles.sideRight}`}>
              {currentRoom < totalRooms - 1 && (
                <span className={styles.sideLabel}>{roomNames[currentRoom + 1]}</span>
              )}
              <button
                type="button"
                className={styles.arrow}
                disabled={currentRoom === totalRooms - 1}
                onClick={() => sceneRef.current?.nextRoom()}
                onMouseEnter={() => hover("Next")}
                onMouseLeave={resetCursor}
                aria-label="Next room"
              >
                <Chevron dir="right" />
              </button>
            </div>

            {/* Room name */}
            <div className={styles.roomName}>{roomNames[currentRoom]}</div>

            {/* Floor selector */}
            <div className={styles.floors}>
              <button
                type="button"
                className={styles.floorsBtn}
                onClick={() => setFloorsOpen((v) => !v)}
                onMouseEnter={() => hover("Floors")}
                onMouseLeave={resetCursor}
              >
                <span>{floor.name}</span>
                <span aria-hidden>▚</span>
              </button>
              {floorsOpen && (
                <div className={styles.floorPanel}>
                  <div className={styles.floorPanelHead}>
                    <span className="eyebrow">Change Floor</span>
                    <button
                      type="button"
                      className={styles.panelClose}
                      onClick={() => setFloorsOpen(false)}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  {FLOOR_LIST.map((f, i) => (
                    <button
                      key={f.name}
                      type="button"
                      className={`${styles.floorRow} ${i === currentFloor ? styles.active : ""}`}
                      onClick={() => {
                        sceneRef.current?.setFloor(i);
                        setFloorsOpen(false);
                      }}
                      onMouseEnter={() => hover("Go")}
                      onMouseLeave={resetCursor}
                    >
                      <span className={styles.floorLevel}>{f.level}</span>
                      <span className={styles.floorLabel}>{f.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room indicator bars */}
            <div className={styles.bars}>
              <span>{String(currentRoom + 1).padStart(2, "0")}</span>
              <span aria-hidden>·</span>
              <div className={styles.barsList}>
                {Array.from({ length: totalRooms }).map((_, i) => (
                  <span key={i} className={`${styles.bar} ${i === currentRoom ? styles.on : ""}`} />
                ))}
              </div>
            </div>

            {/* Spatial Architectural Minimap — Top Right */}
            <div className={styles.minimap}>
              <div className={styles.minimapTitle}>Villa Spatial Plan</div>
              <svg viewBox="-25 -25 50 50" className={styles.blueprintSvg}>
                <polygon points="-22,-22 22,-22 22,22 -22,22" fill="none" stroke="rgba(140, 120, 100, 0.25)" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                {floor.rooms.map((r: any, idx: number) => {
                  const pos = r.pos || { x: idx * 12, z: 0 };
                  const mapX = (pos.x / 24) * 20;
                  const mapZ = (pos.z / 24) * 20;
                  const isActive = idx === currentRoom;
                  return (
                    <g
                      key={r.name}
                      onClick={() => sceneRef.current?.goToRoom(idx)}
                      onMouseEnter={() => hover(r.name)}
                      onMouseLeave={resetCursor}
                      className={styles.nodeGroup}
                    >
                      <circle
                        cx={mapX}
                        cy={mapZ}
                        r={isActive ? 3.8 : 2.4}
                        fill={isActive ? '#8b7355' : 'rgba(160, 140, 120, 0.5)'}
                      />
                      {isActive && (
                        <circle cx={mapX} cy={mapZ} r="7" fill="none" stroke="#8b7355" strokeWidth="0.8" className={styles.pulseRing} />
                      )}
                      <text
                        x={mapX}
                        y={mapZ + (isActive ? 8 : 6.5)}
                        textAnchor="middle"
                        fontSize="3.4"
                        fill={isActive ? '#2b1d14' : '#8b7a6c'}
                        fontWeight={isActive ? '700' : '400'}
                      >
                        {isActive ? r.name : `0${idx + 1}`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

          </>
        )}
      </div>
    </section>
  );
}

