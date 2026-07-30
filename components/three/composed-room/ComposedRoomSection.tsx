"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { COMPOSED_ROOM } from "./data/manifest";
import { ComposedRoomPoster } from "./ComposedRoomPoster";
import { useStageClaim } from "@/components/stage/StageProvider";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouch } from "@/hooks/useIsTouch";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import styles from "./ComposedRoomSection.module.css";

// ssr:false must live in a Client Component under Next.js 16 (AGENTS.md).
const ComposedRoomCanvas = dynamic(() => import("./ComposedRoomCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * "The Composed Room" — a warm cream isometric diorama, scroll-triggered
 * (not scroll-scrubbed, per Wolf_Casa_3D_Concept_v3.md's restriction on
 * scroll-driven 3D). Sits between Manifesto and Stats. See
 * app/globals.css §8 and data/tokens.ts for the sanctioned palette
 * deviation this section carries.
 */
export function ComposedRoomSection() {
  const [sectionRef, active] = useInViewport<HTMLElement>({
    threshold: 0.5,
  });
  // Separate, wider observer purely to decide when to (un)mount the heavy
  // canvas chunk — 300px pre-roll so texture/chunk fetch starts just
  // before the section is on screen, without contending with hero LCP.
  const [armRef, armed] = useInViewport<HTMLDivElement>({
    rootMargin: "300px 0px",
  });

  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const webglSupported = useWebGLSupport();

  const [viewportW, setViewportW] = useState(1280);
  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useStageClaim("composed-room", "cream", active);

  const usePoster = !webglSupported || (isTouch && viewportW < 768);
  const linkedObjects = COMPOSED_ROOM.filter((o) => o.label && o.href);

  return (
    <section ref={sectionRef} className={styles.section} id="composed-room">
      <div className="curtain" />
      <div className={styles.head}>
        <span className={styles.num}>
          The maquette
          <div className={styles.caption}>A composition, modelled.</div>
        </span>
        <h2 className={styles.heading}>
          A room, <em>composed</em>
          <br />
          before it&apos;s <span className="upright">built.</span>
        </h2>
      </div>

      <div className={styles.stage} ref={armRef}>
        {usePoster ? (
          <ComposedRoomPoster />
        ) : (
          <div className={styles.canvasMount}>
            {armed && <ComposedRoomCanvas run={armed} reducedMotion={reducedMotion} />}
          </div>
        )}

        {!usePoster && (
          <nav className={styles.index} aria-label="Composed Room — Named Objects">
            {linkedObjects.map((obj, i) => (
              <a key={obj.id} href={obj.href!}>
                {String(i + 1).padStart(2, "0")} · {obj.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
