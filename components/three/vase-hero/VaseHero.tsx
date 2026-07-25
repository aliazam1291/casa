"use client";

import dynamic from "next/dynamic";
import { useWorldMood } from "./WorldMoodProvider";
import { WORLDS } from "@/lib/worlds";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import styles from "./VaseHero.module.css";

// ssr:false must be declared inside a Client Component in Next.js 16 —
// see node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md.
const VaseCanvas = dynamic(() => import("./VaseCanvas"), { ssr: false });

/**
 * The homepage hero — a rotating sculpted vase whose key light shifts to
 * match the currently-hovered World. Full spec: Wolf_Casa_3D_Concept_v3.md.
 * Ported from wolf-casa-homepage-v3.html's <section class="hero"> (~line 447).
 */
export function VaseHero() {
  const { activeIndex, setActiveIndex } = useWorldMood();
  const { setCursor, resetCursor } = useCursor();
  const webglSupported = useWebGLSupport();
  const activeWorld = WORLDS[activeIndex];

  return (
    <section
      className={styles.hero}
      id="hero"
      onMouseEnter={() => setCursor("3d")}
      onMouseLeave={resetCursor}
    >
      <div className={styles.heroBg} />
      {webglSupported && (
        <div className={styles.canvasMount}>
          <VaseCanvas />
        </div>
      )}
      <div className={styles.vignette} />

      <div className={styles.hint}>Drag to compose — light &amp; form</div>

      <div className={styles.index}>
        {WORLDS.map((w, i) => (
          <button
            key={w.name}
            type="button"
            className={`${styles.indexButton} ${i === activeIndex ? styles.active : ""}`}
            onMouseEnter={() => {
              setActiveIndex(i);
              setCursor("hover", "Set");
            }}
            onMouseLeave={resetCursor}
            onClick={() => setActiveIndex(i)}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <div />
        <div className={styles.lead}>
          <span className={styles.eyebrow}>— Vol. I / 2026 —</span>
          <h1 className={styles.title}>
            A home is not
            <br />
            furnished. <span className="upright">It is</span>
            <br />
            <em>composed.</em>
          </h1>
          <p className={styles.sub}>Way of Light &amp; Form — Modern Indian Living, carefully composed</p>
        </div>
        <div className={styles.footer}>
          <div>
            <span>Currently viewing</span>
            <span className={styles.activeWorld}>{activeWorld.name}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span>15 years · 40,000 sq ft · 110 hands</span>
            <br />
            <span>Indore — Central India</span>
          </div>
        </div>
      </div>
      <div className={styles.scrollCue}>Enter</div>
    </section>
  );
}
