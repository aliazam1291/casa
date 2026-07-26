"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { WORLDS } from "@/lib/worlds";
import { useWorldMood } from "@/components/three/vase-hero/WorldMoodProvider";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Worlds.module.css";

const WORLD_SLUGS = ["heirloom", "low-house", "courtyard", "monastic", "ritual"];

export function Worlds() {
  const { setActiveIndex } = useWorldMood();
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const movePreview = (event: MouseEvent<HTMLElement>) => setPointer({ x: event.clientX + 28, y: event.clientY - 120 });

  return (
    <section className={styles.worlds} id="worlds">
      <div ref={ref} className={`${styles.sectionMark} reveal ${inView ? "in" : ""}`}>
        <h3>Five worlds. <em>One doctrine.</em></h3>
        <div className={styles.meta}>Section 03<br />The Wolf Way<br />—</div>
      </div>
      <div className={styles.list}>
        {WORLDS.map((world, index) => (
          <Link
            key={world.name}
            href={`/the-wolf-way/${WORLD_SLUGS[index]}`}
            className={`${styles.row} ${hovered === index ? styles.active : ""}`}
            onMouseEnter={(event) => {
              movePreview(event);
              setHovered(index);
              setActiveIndex(index);
              setCursor("hover", "Enter");
            }}
            onMouseMove={movePreview}
            onMouseLeave={() => { setHovered(null); resetCursor(); }}
            onFocus={() => { setHovered(index); setActiveIndex(index); }}
            onBlur={() => setHovered(null)}
          >
            <div className={styles.index}>
              <span className={styles.idx}>{String(index + 1).padStart(2, "0")} / 05</span>
              <span className={styles.enter}>Enter <b>→</b></span>
            </div>
            <div className={styles.name}>
              {world.name.startsWith("The ") ? <><span className="upright">The </span>{world.name.slice(4)}</> : world.name}
            </div>
            <div className={styles.desc}>{world.desc}</div>
            <div className={styles.arr} aria-hidden>↗</div>
          </Link>
        ))}
      </div>
      {hovered !== null && (
        <div className={styles.preview} style={{ left: pointer.x, top: pointer.y }} aria-hidden>
          <div className={styles.previewImage} style={{ backgroundImage: `url('${WORLDS[hovered].img}')` }} />
          <span>{WORLDS[hovered].name}</span>
        </div>
      )}
    </section>
  );
}
