"use client";

import { useEffect, useRef, useState } from "react";
import { OBJECTS } from "@/lib/objects";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Gallery.module.css";

/** Horizontal drag gallery — physics ported from wolf-casa-homepage-v3.html ~line 862. */
export function Gallery() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(`01 / ${String(OBJECTS.length).padStart(2, "0")}`);

  useEffect(() => {
    const zone = trackRef.current?.parentElement;
    if (!zone) return;

    let dragging = false;
    let startX = 0;
    let current = 0;
    let target = 0;
    let raf = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX - current;
      setCursor("drag");
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      resetCursor();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || !trackRef.current) return;
      target = e.clientX - startX;
      const maxDrag = -(trackRef.current.scrollWidth - window.innerWidth + 32);
      target = Math.min(0, Math.max(maxDrag, target));
    };

    const tick = () => {
      current += (target - current) * 0.1;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${current}px)`;
        const max = -(trackRef.current.scrollWidth - window.innerWidth + 32);
        const prog = max ? Math.abs(current) / Math.abs(max) : 0;
        if (fillRef.current) fillRef.current.style.width = `${prog * 100}%`;
        const idx = Math.min(OBJECTS.length, Math.floor(prog * OBJECTS.length) + 1);
        setCount(`${String(idx).padStart(2, "0")} / ${String(OBJECTS.length).padStart(2, "0")}`);
      }
      raf = requestAnimationFrame(tick);
    };

    zone.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      zone.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [setCursor, resetCursor]);

  return (
    <section className={styles.section} data-cursor-zone="drag">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.num}>§ 04 — Named Objects</span>
        <h2 className={styles.heading}>
          <span className="upright">Twelve</span> <em>heirlooms.</em>
        </h2>
      </div>
      <div
        className={styles.drag}
        ref={trackRef}
        onMouseEnter={() => setCursor("hover", "Drag")}
        onMouseLeave={resetCursor}
      >
        {OBJECTS.map((o) => (
          <div key={o.slug} className={styles.card}>
            <div className={styles.img}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.img} draggable={false} alt="" loading="lazy" />
            </div>
            <span className={styles.cardNum}>{o.n} · Named Object</span>
            <div className={styles.cardTitle}>{o.t}</div>
          </div>
        ))}
      </div>
      <div className={styles.progress}>
        <span>Drag to explore</span>
        <div className={styles.bar}>
          <div ref={fillRef} className={styles.fill} />
        </div>
        <span>{count}</span>
      </div>
    </section>
  );
}
