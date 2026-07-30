"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { registerMotion } from "@/lib/motion";
import styles from "./StickyScrollReveal.module.css";

/**
 * Sticky Scroll Reveal — the Aceternity component, rebuilt in CSS Modules.
 *
 * The text column scrolls normally; the media column is `position: sticky` and
 * cross-fades between images as each text step becomes active.
 *
 * WHY STICKY AND NOT ScrollTrigger's `pin`: pinning injects a pin-spacer
 * element and rewrites the section's height, which fights both the momentum
 * scroller and the ResizeObserver-driven refresh in SmoothScrollProvider.
 * `position: sticky` is native, compositor-driven, survives resize for free,
 * and needs no layout rewriting. ScrollTrigger is used only to decide which
 * step is active — a job that changes state 3-4 times over the whole section,
 * so React state is the right tool there (unlike the per-frame effects).
 *
 * ON "DEPTH SHADERS": the cross-fade is done with a scale + blur + brightness
 * ramp per layer rather than a WebGL shader. app/page.tsx deliberately keeps
 * exactly one WebGL context on the homepage (the gallery hero) to avoid GPU
 * context contention; a second canvas here for a 3-image cross-fade would cost
 * far more than it returns. The layered scale/blur reads as depth and stays on
 * the compositor.
 */

export type StickyItem = {
  id: string;
  /** Small mono label, e.g. "01 / Light". */
  label: string;
  /** The step's body copy. */
  body: ReactNode;
  image: string;
  alt: string;
};

export function StickyScrollReveal({
  items,
  className,
  /** Sizes hint passed to next/image for the media column. */
  sizes = "(max-width: 900px) 90vw, 44vw",
}: {
  items: StickyItem[];
  className?: string;
  sizes?: string;
}) {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ScrollTrigger = registerMotion();

    // One trigger per step. Whichever step's band contains the viewport
    // midpoint wins, which makes the highlight track reading position rather
    // than the top of the element.
    const triggers = stepsRef.current.map((step, index) => {
      if (!step) return null;
      return ScrollTrigger.create({
        trigger: step,
        start: "top 62%",
        end: "bottom 38%",
        onToggle: ({ isActive }) => {
          if (isActive) setActive(index);
        },
      });
    });

    return () => {
      for (const trigger of triggers) trigger?.kill();
    };
  }, [items.length]);

  return (
    <div className={className ? `${styles.wrap} ${className}` : styles.wrap}>
      <div className={styles.steps}>
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              stepsRef.current[index] = node;
            }}
            className={styles.step}
            data-active={index === active ? "true" : undefined}
          >
            <span className={styles.label}>{item.label}</span>
            <div className={styles.body}>{item.body}</div>
          </div>
        ))}
      </div>

      <div className={styles.mediaColumn}>
        <div className={styles.media}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={styles.layer}
              data-active={index === active ? "true" : undefined}
              // Layers stack in source order; the active one is raised so the
              // cross-fade always resolves in favour of the incoming image.
              style={{ zIndex: index === active ? 2 : 1 }}
              aria-hidden={index !== active}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes={sizes}
                // The first layer is above the fold on some viewports; the
                // rest are genuinely below it.
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
              />
            </div>
          ))}
          {/* Progress ticks — tells the visitor the section has three beats
              and which one they are on, which a pure cross-fade doesn't. */}
          <div className={styles.ticks} aria-hidden>
            {items.map((item, index) => (
              <span key={item.id} data-active={index === active ? "true" : undefined} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
