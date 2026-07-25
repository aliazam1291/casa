"use client";

import { WORLDS } from "@/lib/worlds";
import { useWorldMood } from "@/components/three/vase-hero/WorldMoodProvider";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Worlds.module.css";

/**
 * World rows — hovering fades in a background image and lerps the hero
 * vase's key light to that world's accent, per Design_System_v3.md §5
 * "World hover linking." Ported from ~line 509 of the prototype.
 */
export function Worlds() {
  const { setActiveIndex } = useWorldMood();
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <section className={styles.worlds} id="worlds">
      <div ref={ref} className={`${styles.sectionMark} reveal ${inView ? "in" : ""}`}>
        <h3>
          Five worlds. <em>One doctrine.</em>
        </h3>
        <div className={styles.meta}>
          § 03
          <br />
          The Wolf Way
          <br />—
        </div>
      </div>
      <div>
        {WORLDS.map((w, i) => (
          <div
            key={w.name}
            className={styles.row}
            onMouseEnter={() => {
              setActiveIndex(i);
              setCursor("hover", "Enter");
            }}
            onMouseLeave={resetCursor}
          >
            <div className={styles.rowBg} style={{ backgroundImage: `url('${w.img}')` }} />
            <div className={styles.idx}>
              {String(i + 1).padStart(2, "0")} / 05
            </div>
            <div className={styles.name}>
              {w.name.startsWith("The ") ? (
                <>
                  <span className="upright">The </span>
                  {w.name.slice(4)}
                </>
              ) : (
                w.name
              )}
            </div>
            <div className={styles.desc}>{w.desc}</div>
            <div className={styles.arr}>Enter →</div>
          </div>
        ))}
      </div>
    </section>
  );
}
