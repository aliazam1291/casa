"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single place where GSAP plugins get registered.
 *
 * GSAP 3.13+ ships every former "Club" plugin in the public package, so
 * ScrollTrigger/SplitText/Observer are all available from the `gsap` dep
 * already in package.json — no extra install, no auth'd registry.
 *
 * Registration is idempotent (gsap dedupes internally) but guarded anyway so
 * this can be called from every motion component's effect without thought.
 * It must only ever run in the browser: ScrollTrigger touches window on
 * import-time side effects, so every consumer is a "use client" component and
 * calls this inside an effect, never at module scope of a server component.
 */
let registered = false;

export function registerMotion(): typeof ScrollTrigger {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return ScrollTrigger;
}

/** True when the visitor has asked the OS for less motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The eases already used across the CSS layer, mirrored for GSAP so a
 * JS-driven tween and a CSS transition on the same element agree.
 * `--ease-gallery` / `--ease-smooth` in app/globals.css are the source.
 */
export const EASE = {
  gallery: "cubic-bezier(0.22, 1, 0.36, 1)",
  smooth: "cubic-bezier(0.16, 0.84, 0.36, 1)",
} as const;

/** Clamp helper used by the proximity/velocity maths in several primitives. */
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/** Linear interpolation, for frame-rate independent easing toward a target. */
export function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/** Map a value from one range to another, clamped to the output range. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return clamp(outMin + t * (outMax - outMin), Math.min(outMin, outMax), Math.max(outMin, outMax));
}

export { gsap, ScrollTrigger };
