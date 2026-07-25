/**
 * Wolf Casa design tokens — typed mirror of app/globals.css.
 * Source of truth: files/Wolf_Casa_Design_System_v3.md. Values are calibrated
 * to the working prototype (wolf-casa-homepage-v3.html) and must not be
 * reinterpreted — see Design_System_v3.md §0.
 */

export const COLOR = {
  bg: "#0A0A0A",
  bg2: "#111111",
  fg: "#F5F5F0",
  fgDim: "rgba(245,245,240,.5)",
  fgFaint: "rgba(245,245,240,.22)",
  line: "rgba(245,245,240,.14)",
} as const;

/**
 * World mood accents — used only inside the vase hero's key light / emissive
 * glow and (by extension) the Composed Room's hover-pulse. Never used in
 * global UI, buttons, or type. Design_System_v3.md §2.
 */
export const WORLD_ACCENTS = [
  { id: "heirloom", name: "The Heirloom Way", accent: 0xc9963f, emissive: 0x3a2410 },
  { id: "low-house", name: "The Low House Way", accent: 0x8b4a34, emissive: 0x2c1610 },
  { id: "courtyard", name: "The Courtyard Way", accent: 0x6e7a5c, emissive: 0x1e2418 },
  { id: "monastic", name: "The Monastic Way", accent: 0xd8d2c4, emissive: 0x1a1815 },
  { id: "ritual", name: "The Ritual Way", accent: 0xb8813c, emissive: 0x33220f },
] as const;

export const FONT = {
  serif: "var(--serif)",
  mono: "var(--mono)",
} as const;

export const MOTION = {
  cursor: "0.18s cubic-bezier(0.2, 0.9, 0.3, 1.4)",
  hover: "0.4s ease",
  reveal: "1s cubic-bezier(0.16, 1, 0.3, 1)",
  crossfade: "0.4s ease",
  /** Composed Room stage cross-fade — Design_System_v3.md §8 (sanctioned deviation). */
  stage: "800ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
