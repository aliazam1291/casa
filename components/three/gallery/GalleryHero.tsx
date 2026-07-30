"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
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
  /** Next room, rolling over to the next floor. See GalleryScene.advance(). */
  advance: () => boolean;
  readonly hasNext: boolean;
  resetRoom: () => void;
  enablePhysics: () => void;
  nudgeZoom: (delta: number) => number;
  readonly zoom: number;
  setFloor: (i: number) => void;
  goToFloorRoom: (floorIndex: number, roomIndex: number) => void;
};

type GallerySceneProps = {
  onRoomChange?: (i: number) => void;
  onFloorChange?: (i: number) => void;
  onPieceHover?: (info: PieceInfo | null) => void;
  onReady?: () => void;
};

// ssr:false must live inside a Client Component in Next.js 16. The engine is
// vendored JS (allowJs), so we cast it to a typed forwardRef component.
const GalleryScene = dynamic(() => import("./GalleryScene"), {
  ssr: false,
}) as unknown as ForwardRefExoticComponent<GallerySceneProps & RefAttributes<SceneHandle>>;

type Room = {
  name: string;
  eyebrow?: string;
  detail?: string;
  materials?: string[];
  pos?: { x: number; z: number };
};
type Floor = { name: string; level: string; rooms: Room[] };
const FLOOR_LIST = FLOORS as Floor[];

/** Material/description record surfaced when a furniture piece is hovered. */
type PieceInfo = { name: string; materials: string[]; description: string };

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
// Deep link from /rooms/[slug]'s "Step inside in 3D" — e.g. /?floor=2&room=1
// should skip the gate and drop the visitor straight into that room.
// Read from window.location rather than useSearchParams: that hook forces a
// Suspense boundary around this component, and a suspended boundary parks its
// children in a display:none container — which hid the whole 3D hero on load.
function readDeepLink(): { floorIdx: number; roomIdx: number } | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const floorParam = params.get("floor");
  const roomParam = params.get("room");
  if (floorParam === null || roomParam === null) return null;
  const floorIdx = Math.max(0, Math.min(FLOOR_LIST.length - 1, Number(floorParam)));
  if (Number.isNaN(floorIdx)) return null;
  const roomIdx = Math.max(0, Math.min(FLOOR_LIST[floorIdx].rooms.length - 1, Number(roomParam)));
  if (Number.isNaN(roomIdx)) return null;
  return { floorIdx, roomIdx };
}

export function GalleryHero() {
  const sceneRef = useRef<SceneHandle | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [entered, setEntered] = useState(false);
  const [floorsOpen, setFloorsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [piece, setPiece] = useState<PieceInfo | null>(null);
  const [ready, setReady] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  const onPieceHover = useCallback((info: PieceInfo | null) => setPiece(info), []);
  const onReady = useCallback(() => setReady(true), []);

  // Stepping inside is the moment worth spending the physics engine's 2.1MB on.
  // Fetching it at page load would bill every visitor for a feature most never
  // reach; fetching it on first grab would make that first grab miss.
  const enter = useCallback(() => {
    setEntered(true);
    sceneRef.current?.enablePhysics();
  }, []);

  // Safety net: if the scene never reports a first frame — no WebGL, a lost
  // context, a device that refuses the renderer — the loader must still lift
  // rather than sit over the hero permanently.
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 8000);
    return () => clearTimeout(id);
  }, []);

  // The hover card used to be a 460px panel pinned to the centre of the frame,
  // which covered the very room it was describing. It is now a compact tooltip
  // that trails the pointer — small, near where you are already looking, and
  // out of the way of everything else. Positioned by transform so following the
  // pointer costs a compositor move rather than a layout.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: PointerEvent) => {
      const tip = tipRef.current;
      if (!tip) return; // not rendered — nothing hovered
      const r = hero.getBoundingClientRect();
      const pad = 14;
      let x = e.clientX - r.left + 20;
      let y = e.clientY - r.top + 20;
      // Flip rather than clip when near an edge.
      if (x + tip.offsetWidth > r.width - pad) x = e.clientX - r.left - tip.offsetWidth - 20;
      if (y + tip.offsetHeight > r.height - pad) y = e.clientY - r.top - tip.offsetHeight - 20;
      tip.style.transform = `translate3d(${Math.max(pad, x)}px, ${Math.max(pad, y)}px, 0)`;
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    return () => hero.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const deepLink = readDeepLink();
    if (!deepLink) return;
    // Applied after mount rather than at declaration time: the server render
    // has no access to the query string, so deriving it eagerly desyncs
    // hydration. Timers rather than rAF, which never fires on a backgrounded
    // tab — the deep link must still resolve if the visitor opens it in a
    // background tab and switches to it later.
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => {
      setEntered(true);
      // A deep link skips the gate, so the gate's enablePhysics() never fires.
      sceneRef.current?.enablePhysics();
      setCurrentFloor(deepLink.floorIdx);
      setCurrentRoom(deepLink.roomIdx);
      // GalleryScene is a dynamic ssr:false import, so its imperative handle
      // may not exist yet; poll briefly rather than firing once and missing.
      let tries = 0;
      const drive = () => {
        if (sceneRef.current) {
          sceneRef.current.goToFloorRoom(deepLink.floorIdx, deepLink.roomIdx);
        } else if (tries++ < 60) {
          timers.push(setTimeout(drive, 50));
        }
      };
      drive();
    }, 0));
    return () => timers.forEach(clearTimeout);
  }, []);

  const floor = FLOOR_LIST[currentFloor];
  const roomNames = floor.rooms.map((r) => r.name);
  const room = floor.rooms[currentRoom];
  const totalRooms = floor.rooms.length;

  // Derived from the same FLOOR_LIST the scene walks, rather than read off the
  // imperative handle — the handle is a dynamic ssr:false import and is null on
  // the first render, which would make the button flicker its label.
  const atHouseEnd = currentFloor === FLOOR_LIST.length - 1 && currentRoom === totalRooms - 1;

  const onRoomChange = useCallback((idx: number) => {
    setCurrentRoom(idx);
    setDetailsOpen(false);
  }, []);
  const onFloorChange = useCallback((idx: number) => {
    setCurrentFloor(idx);
    setDetailsOpen(false);
  }, []);

  const hover = (label: string) => {
    setCursor("hover", label);
  };

  return (
    <section id="hero" ref={heroRef} className={styles.hero}>
      <div className={styles.mount}>
        <GalleryScene
          ref={sceneRef}
          onRoomChange={onRoomChange}
          onFloorChange={onFloorChange}
          onPieceHover={onPieceHover}
          onReady={onReady}
        />
      </div>

      {/* Held until the scene's first rendered frame, so the visitor never
          sees an empty cream box while the rooms and textures are built. */}
      <div className={`${styles.loader} ${ready ? styles.loaderDone : ""}`} aria-hidden={ready}>
        <span className={styles.loaderMark}>Wolf Casa</span>
        <div className={styles.loaderBar}><i /></div>
        <span className={styles.loaderNote}>Composing the house</span>
      </div>

      <div className={styles.overlay}>
        {!entered ? (
          <div className={styles.gate}>
            {/* Anchored into the bottom-left corner rather than boxed in the
                middle: the room behind is the entire point of this hero, so
                the copy is weighted into one corner and the scrim is a soft
                directional wash. A panel with hard edges reads as a dialog
                sitting on top of the scene instead of part of it. */}
            <div className={styles.gateCopy}>
              <span className={styles.gateRule} aria-hidden />
              <span className={styles.eyebrow}>Wolf Casa · Indore, established 2024</span>
              <h1 className={styles.gateFloor}>A room is not furnished. It is composed.</h1>
              <p className={styles.gateSub}>Step inside thirteen complete rooms — furniture, lighting, stone, joinery, greenery. One house, one composition.</p>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={enter}
                onMouseEnter={() => hover("Enter")}
                onMouseLeave={resetCursor}
              >
                Step Inside
              </button>
            </div>
            <div className={styles.hint}>Swipe sideways · shift + scroll · or use the arrows</div>
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
            {/* Hovering a furniture piece swaps the room title for that
                piece's name, materials and description. */}
            {/* The room title stays put while hovering — losing it was
                disorienting, and the tooltip carries the piece detail. */}
            <div className={`${styles.roomName} ${piece ? styles.roomNameMuted : ""}`}>
              <span>{room.eyebrow}</span>
              {roomNames[currentRoom]}
            </div>

            {piece && (
              <div ref={tipRef} className={styles.pieceTip}>
                <h3 className={styles.tipName}>{piece.name}</h3>
                {piece.materials.length > 0 && (
                  <div className={styles.tipMaterials}>
                    {piece.materials.slice(0, 3).map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                )}
                <p className={styles.tipDesc}>{piece.description}</p>
              </div>
            )}

            <div className={styles.roomBrief}>
              <button
                type="button"
                className={styles.roomBriefButton}
                onClick={() => setDetailsOpen((open) => !open)}
                onMouseEnter={() => hover(detailsOpen ? "Close" : "Details")}
                onMouseLeave={resetCursor}
                aria-expanded={detailsOpen}
              >
                <span>Room notes</span>
                <span aria-hidden>{detailsOpen ? "−" : "+"}</span>
              </button>
              {detailsOpen && (
                <div className={styles.roomBriefPanel}>
                  <p>{room.detail}</p>
                  <div className={styles.materials}>
                    {room.materials?.map((material) => <span key={material}>{material}</span>)}
                  </div>
                  {/* advance() rather than nextRoom(): nextRoom() stops at each
                      floor's last room, so this button was inert on the last
                      room of every floor. */}
                  {atHouseEnd ? (
                    <button
                      type="button"
                      className={styles.exploreButton}
                      onClick={() => sceneRef.current?.setFloor(0)}
                      onMouseEnter={() => hover("Restart")}
                      onMouseLeave={resetCursor}
                    >
                      Back to the cellar <span aria-hidden>↺</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.exploreButton}
                      onClick={() => sceneRef.current?.advance()}
                      onMouseEnter={() => hover("Explore")}
                      onMouseLeave={resetCursor}
                    >
                      Explore the next room <span aria-hidden>→</span>
                    </button>
                  )}
                </div>
              )}
            </div>

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

            {/* Furniture is physically draggable, which nothing on screen would
                otherwise tell you — and once it has been shoved around there
                needs to be a way back. */}
            <div className={styles.roomTools}>
              <span className={styles.dragTip}>Drag the furniture</span>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={() => sceneRef.current?.resetRoom()}
                onMouseEnter={() => hover("Reset")}
                onMouseLeave={resetCursor}
              >
                Reset room <span aria-hidden>↺</span>
              </button>
              <div className={styles.zoomGroup}>
                <button
                  type="button"
                  className={styles.zoomBtn}
                  onClick={() => sceneRef.current?.nudgeZoom(-0.18)}
                  onMouseEnter={() => hover("Closer")}
                  onMouseLeave={resetCursor}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  className={styles.zoomBtn}
                  onClick={() => sceneRef.current?.nudgeZoom(0.18)}
                  onMouseEnter={() => hover("Back")}
                  onMouseLeave={resetCursor}
                  aria-label="Zoom out"
                >
                  −
                </button>
              </div>
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
                {floor.rooms.map((r, idx) => {
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
                        fill={isActive ? '#A78657' : 'rgba(201, 168, 126, 0.5)'}
                      />
                      {isActive && (
                        <circle cx={mapX} cy={mapZ} r="7" fill="none" stroke="#A78657" strokeWidth="0.8" className={styles.pulseRing} />
                      )}
                      <text
                        x={mapX}
                        y={mapZ + (isActive ? 8 : 6.5)}
                        textAnchor="middle"
                        fontSize="3.4"
                        fill={isActive ? '#E8E1D3' : '#a89a8c'}
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
