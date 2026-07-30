"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerMotion, prefersReducedMotion, clamp } from "@/lib/motion";

/**
 * Momentum scrolling (Lenis) + the site-wide scroll-velocity bus.
 *
 * WHY A MODULE-LEVEL STORE AND NOT CONTEXT: velocity changes every single
 * frame. Pushing that through React context would re-render every consumer
 * ~60x/second and torch the frame budget the brief asks us to protect. So
 * velocity lives in a plain module variable, is published to a CSS custom
 * property on <html> (so pure-CSS consumers need no JS at all), and JS
 * consumers subscribe with a callback that fires inside the existing rAF —
 * no extra loop, no re-render.
 *
 * ORDERING CONTRACT WITH GSAP: Lenis must drive ScrollTrigger, and GSAP's
 * ticker must drive Lenis. Doing it the other way (Lenis on its own rAF)
 * makes pinned sections jitter by one frame against the smoothed scroll
 * position. `lagSmoothing(0)` stops GSAP from "catching up" after a long
 * frame, which would otherwise teleport the scroll position.
 */

type VelocityListener = (velocity: number, direction: 1 | -1) => void;

let lenisInstance: Lenis | null = null;
let normalizedVelocity = 0;
let scrollDirection: 1 | -1 = 1;
const listeners = new Set<VelocityListener>();

/** The velocity used by the kinetic type, normalized to roughly -1..1. */
export function getScrollVelocity(): number {
  return normalizedVelocity;
}

export function getScrollDirection(): 1 | -1 {
  return scrollDirection;
}

/** Imperative access to the Lenis instance (scrollTo, stop/start for modals). */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Subscribe to per-frame scroll velocity. Returns an unsubscribe function.
 * Callbacks run inside the shared rAF — do DOM writes only, never React
 * state updates, or you reintroduce the per-frame re-render problem.
 */
export function onScrollVelocity(listener: VelocityListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Effect-only: renders no DOM, so it mounts as a sibling rather than wrapping
 * the tree. Mount it once, as early in <body> as possible.
 */
export function SmoothScrollProvider() {
  useEffect(() => {
    const ScrollTrigger = registerMotion();

    // Reduced motion: skip Lenis entirely and hand scrolling back to the
    // browser. ScrollTrigger still works off native scroll, so every pinned
    // section below degrades to plain scrolling rather than breaking.
    if (prefersReducedMotion()) {
      document.documentElement.style.setProperty("--scroll-velocity", "0");
      return;
    }

    const lenis = new Lenis({
      // Tuned for the brief's "high-velocity" feel: a shorter duration than
      // the Lenis default (1.2) so the page still feels immediate, with
      // enough tail to read as momentum rather than a jump.
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      // Touch devices get native scrolling — momentum emulation on top of
      // the OS's own momentum feels laggy and costs battery.
      smoothWheel: true,
      autoRaf: false,
    });

    lenisInstance = lenis;
    document.documentElement.classList.add("lenis");

    const onLenisScroll = ({
      velocity,
      direction,
    }: {
      velocity: number;
      direction: number;
    }) => {
      // Lenis velocity is in px/frame and routinely hits ~40 on a hard
      // flick. /35 puts a normal scroll around 0.2-0.5 and a hard flick at
      // ~1, which is the range the type/skew maths below expect.
      normalizedVelocity = clamp(velocity / 35, -1, 1);
      if (direction === 1 || direction === -1) scrollDirection = direction;
      ScrollTrigger.update();
    };

    lenis.on("scroll", onLenisScroll);

    // Lenis raf is driven by the GSAP ticker so ScrollTrigger and Lenis
    // share one clock. gsap.ticker gives time in seconds; Lenis wants ms.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Decay + publish. When the wheel stops, Lenis stops emitting `scroll`,
    // so without this the last velocity would stay pinned forever and the
    // type would never settle back to its resting weight.
    let published = 0;
    const publish = () => {
      published += (normalizedVelocity - published) * 0.12;
      if (Math.abs(published) < 0.0005) published = 0;
      document.documentElement.style.setProperty(
        "--scroll-velocity",
        published.toFixed(4),
      );
      document.documentElement.style.setProperty(
        "--scroll-velocity-abs",
        Math.abs(published).toFixed(4),
      );
      for (const listener of listeners) listener(published, scrollDirection);
      // Bleed the raw value toward zero too, so a flick that ends mid-frame
      // doesn't leave a stale reading for the next subscriber to pick up.
      normalizedVelocity *= 0.9;
    };
    gsap.ticker.add(publish);

    // ScrollTrigger needs to know the page height can change (image loads,
    // font swap, filtered grids). refresh() on resize is built in; this
    // covers late layout shifts that don't fire resize.
    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    observer.observe(document.body);

    // Modal scroll-lock bridge. Every dialog on this site is a Radix dialog,
    // and Radix locks the page by setting `overflow: hidden` / a lock
    // attribute on <body>. Lenis scrolls the window on its own and does not
    // read that lock, so without this bridge the page keeps scrolling behind
    // every open dialog — a regression introduced by adding momentum
    // scrolling at all. Watching body attributes fixes it once, globally,
    // instead of making each dialog remember to call lenis.stop().
    const syncLock = () => {
      const locked =
        document.body.hasAttribute("data-scroll-locked") ||
        document.body.style.overflow === "hidden" ||
        document.body.style.pointerEvents === "none";
      if (locked) lenis.stop();
      else lenis.start();
    };
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "data-scroll-locked"],
    });
    syncLock();

    return () => {
      lockObserver.disconnect();
      observer.disconnect();
      gsap.ticker.remove(raf);
      gsap.ticker.remove(publish);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisInstance = null;
      normalizedVelocity = 0;
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}
