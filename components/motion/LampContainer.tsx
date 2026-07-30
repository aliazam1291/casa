"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerMotion, prefersReducedMotion } from "@/lib/motion";
import styles from "./LampContainer.module.css";

/**
 * Lamp Effect — the Aceternity component, rebuilt in CSS Modules on the Wolf
 * Casa palette instead of Tailwind + framer-motion.
 *
 * Two mirrored conic gradients form the light cone, a blurred bar forms the
 * filament, and a radial glow sits under the content. On entering the
 * viewport the cone opens (width) and the filament ignites (opacity/scale),
 * which is the whole point of the effect — it should read as a light being
 * switched on above the headline, not as a static gradient.
 *
 * The brief calls for Brass here, and the Brand Book's rule is "Brass
 * punctuates, never a fill" — so the cone is Brass at low alpha and the
 * filament is the only place it reaches full strength.
 */

export function LampContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ScrollTrigger = registerMotion();

    // Reduced motion: show the lamp fully lit, skip the ignition.
    if (prefersReducedMotion()) {
      root.dataset.lit = "true";
      return;
    }

    const filament = root.querySelector(`.${styles.filament}`);
    const glow = root.querySelector(`.${styles.glow}`);

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: root,
        // Ignite a little before the lamp is centred, so the content below is
        // already lit by the time it is comfortably in view.
        start: "top 85%",
        once: true,
      },
    });

    // The filament strikes first and the pool swells after it, which is the
    // order a real fitting lights in — and the reason this reads as switching
    // on rather than as a gradient fading up.
    timeline
      .fromTo(
        filament,
        { width: "6rem", opacity: 0 },
        { width: "24rem", opacity: 1, duration: 0.85 },
        0,
      )
      .fromTo(glow, { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1, duration: 1.3 }, 0.12);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={rootRef} className={className ? `${styles.lamp} ${className}` : styles.lamp}>
      <div className={styles.rig} aria-hidden>
        <div className={styles.glow} />
        <div className={styles.filament} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
