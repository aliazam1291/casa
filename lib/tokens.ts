/**
 * Wolf Casa design tokens — typed mirror of app/globals.css.
 *
 * WAS STALE, AND NOTHING CAUGHT IT. This file described itself as a mirror of
 * globals.css while holding the pre-rebrand palette (#0A0A0A ground, #F5F5F0
 * ink) and the retired "Five Worlds" taxonomy — a system the site now redirects
 * away from (see next.config.ts). Nothing imported it, so it drifted silently
 * and would have misled the next person to open it.
 *
 * Source of truth is the client's Brand Book §08 Colour, which is also what
 * app/globals.css :root now implements. If these disagree, globals.css wins and
 * this file is the bug.
 */

/** The live UI tokens, matching app/globals.css :root. */
export const COLOR = {
  bg: "#0E0E0C",
  bg2: "#141311",
  fg: "#E8E1D3",
  fgDim: "rgba(232,225,211,.56)",
  fgFaint: "rgba(232,225,211,.26)",
  line: "rgba(232,225,211,.14)",
} as const;

export type BrandColour = {
  name: string;
  hex: string;
  /** Where the book says this colour lives. §08, "Colour · In use". */
  role: string;
};

/**
 * THE EIGHT, in the book's own order and with the book's own role for each.
 *
 * This array existed twice — verbatim, name-and-hex only — in
 * components/editorial/WayOfLightForm.tsx and components/editorial/ArchitectHub.tsx.
 * Two copies of one palette is how a palette goes out of sync, and neither copy
 * carried the roles, which are the part that actually tells a specifier what to
 * do with the colour.
 *
 * The book's summary line, worth keeping next to the data: "Black holds the
 * space. Ivory speaks. Brass punctuates — never a fill. Walnut & green carry
 * the material world."
 */
export const BRAND_COLOURS: BrandColour[] = [
  { name: "Soft Black", hex: "#0E0E0C", role: "Page grounds, covers, OOH. ~70% of every surface." },
  { name: "Charcoal", hex: "#141311", role: "Panels, insets and product fields against the black." },
  { name: "Walnut", hex: "#5A3D2E", role: "The material world — dividers, warmth, catalogue." },
  { name: "Green", hex: "#253528", role: "Territory and nature accents. Used sparingly." },
  { name: "Brass", hex: "#A78657", role: "Punctuation only — a rule, a line, one word." },
  { name: "Saddle", hex: "#8A5938", role: "Leather tone — merch, tags, tactile goods." },
  { name: "Sand", hex: "#C9BDA6", role: "Kraft and secondary paper. Quiet grounds." },
  { name: "Ivory", hex: "#E8E1D3", role: "The voice — all type and marks on black." },
];

/** The book's own tint scale, §08: 100 / 62 / 38 / 16. */
export const TINT_STEPS = [100, 62, 38, 16] as const;

export const FONT = {
  /** Cormorant — display and voice. */
  serif: "var(--serif)",
  /** Jost — system and labels. */
  sans: "var(--sans)",
  mono: "var(--mono)",
  /** Posterama — signature word only, never body copy. */
  display: "var(--display)",
} as const;

export const MOTION = {
  cursor: "0.18s cubic-bezier(0.2, 0.9, 0.3, 1.4)",
  hover: "0.4s ease",
  reveal: "1s cubic-bezier(0.16, 1, 0.3, 1)",
  crossfade: "0.4s ease",
  stage: "800ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
