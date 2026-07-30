// THE MATERIAL LIBRARY — Brand Book §ML, "Materials & Light: the tactile
// system", derived from what the pieces are actually made of.
//
// WHY DERIVED, NOT WRITTEN. components/sections/MaterialsBoard.tsx hand-writes
// four materials (Marble, Wood, Stone, Textile) with four specimen paragraphs.
// Meanwhile lib/pieces.ts already names 44 distinct materials across the 41
// pieces — Champagne brass on 17 of them, Cognac saddle leather on 7, Nero
// Marquina, Kiln-dried ash, Green cased glass, Burmese teak. The library was
// covering roughly a tenth of its own vocabulary, and every material the studio
// actually specifies was invisible.
//
// So this file reads the vocabulary out of PIECES rather than restating it. A
// new piece with a new material appears in the library the day it is added, and
// the counts are true by construction rather than by maintenance.
//
// THE FAMILIES are the book's: "Stone. Wood. Metal. Cloth. Light." Two
// additions, both because the piece data demands them and neither invented:
//   · Leather — §08 gives Saddle its own colour ("Leather tone") and the book
//     treats hide as its own material world, not a sub-case of cloth.
//   · Glass — 8 pieces are made of it and it belongs to no other family.
// Light is the book's fifth and has no entries here on purpose: it is the one
// material you cannot list on a bill of materials, which is exactly the point
// §ML makes by putting it in the list at all.

import { PIECES, type Piece } from "./pieces";

export type MaterialFamily = {
  slug: string;
  /** The book's own name for the family. */
  name: string;
  /** The book's line for it, §ML. */
  note: string;
  body: string;
  tone: string;
};

export const MATERIAL_FAMILIES: MaterialFamily[] = [
  {
    slug: "stone",
    name: "Stone",
    note: "Cool, grounding, permanent.",
    body: "Marble and lava stone carry the weight of a Wolf Casa room. Slabs are selected by vein and translucency in person — a stone chosen from a catalogue sheet arrives as a surface, not as a decision.",
    tone: "#c9bda6",
  },
  {
    slug: "wood",
    name: "Wood",
    note: "Warm, oiled, alive.",
    body: "Walnut is the house timber: its red-brown grain ages with the leather and the brass rather than against them. Ash is used where an upholstered frame needs lightness, oak where a floor has to take a life.",
    tone: "#c9a87e",
  },
  {
    slug: "metal",
    name: "Metal",
    note: "Brass and bronze — thin accents only.",
    body: "Metal is punctuation, never structure you can see. Champagne brass is on more pieces than any other material in the house, and on almost none of them is it more than a line.",
    tone: "#a78657",
  },
  {
    slug: "cloth",
    name: "Cloth",
    note: "Bouclé, linen, wool — the hand of the room.",
    body: "The upholstery palette is narrow on purpose. Decisions inside it are made by touch, with samples brought into the room they are for — never specified from a screen.",
    tone: "#8a8376",
  },
  {
    slug: "leather",
    name: "Leather",
    note: "Hide, tanned and left to age.",
    body: "One leather runs through the house: cognac saddle, vegetable-tanned, unfinished enough to take a patina. It is on the bench you first sit on and the bindings in the archive, and it is meant to look used.",
    tone: "#c98a5e",
  },
  {
    slug: "glass",
    name: "Glass",
    note: "What the light is allowed through.",
    body: "Blown, cased and smoked glass do the work a lamp cannot: they colour the light rather than adding more of it. Low-iron is used only where the glass must disappear entirely.",
    tone: "#7d9682",
  },
  {
    slug: "light",
    name: "Light",
    note: "2700K, layered — the first material laid.",
    body: "The book lists light as a material and it is the only one with no entry in any bill of materials. Nothing here is specified until the light is: mood is set before a single object lands, which is the first of the ten principles.",
    tone: "#e8e1d3",
  },
];

export type MaterialEntry = {
  /** Verbatim as it appears on the piece. */
  name: string;
  family: string;
  swatch: string;
  pieces: Piece[];
};

/**
 * Keyword → family. Ordered: the FIRST match wins, so the specific rules must
 * come before the general ones. "Walnut cabinetry" is wood, but "Dried walnut
 * branch" is not a timber — it is a plant standing in a vase — which is why
 * `branch` is tested before `walnut`.
 */
const FAMILY_RULES: [RegExp, string][] = [
  [/branch|olive|tree/i, "wood"],
  [/leather|bindings/i, "leather"],
  // Before the metal rule: "Low-iron glass" is glass, not iron.
  [/glass/i, "glass"],
  // `marquina` is load-bearing: two pieces list the stone as bare "Nero
  // Marquina" with no "marble" after it, and without this they file as cloth.
  [/marble|marquina|calacatta|stone|travertine|ceramic/i, "stone"],
  // \b is load-bearing here too: without it `ash` matches inside "W-ash-ed
  // linen" and files a Belgian linen as a timber.
  [/\b(walnut|oak|ash|teak|pine|timber|wood)/i, "wood"],
  [/\b(brass|steel|iron|bronze|metal)/i, "metal"],
  [/velvet|bouclé|boucle|linen|wool|cotton|fabric|cloth|books/i, "cloth"],
];

/**
 * Keyword → swatch. Brand Book §08 hexes where the material maps onto one of
 * the seven colours; otherwise the closest honest reading of the material.
 * Ordered first-match-wins for the same reason as FAMILY_RULES.
 */
const SWATCH_RULES: [RegExp, string][] = [
  // Glass first, for the same reason as above — "Low-iron glass" matches the
  // steel rule's `iron` otherwise and comes out gunmetal.
  [/green cased/i, "#3d5544"],
  [/smoked glass|bottle glass/i, "#4c4a45"],
  [/glass/i, "#9aa39c"],
  [/champagne brass/i, "#c2a271"],
  [/antiqued brass/i, "#8f7148"],
  [/blackened brass/i, "#5c4a30"],
  [/brass/i, "#a78657"],
  [/blackened steel|integrated steel|iron/i, "#3a3a3c"],
  [/nero marquina/i, "#1c1c1e"],
  [/calacatta|book-matched|weathered marble|fluted marble/i, "#ded7c8"],
  [/marble/i, "#cfc7b6"],
  [/lava stone/i, "#4a4744"],
  [/ceramic/i, "#b9ad98"],
  [/forest .*velvet/i, "#253528"],
  [/terracotta/i, "#8a5938"],
  [/velvet/i, "#5c4438"],
  [/bouclé|boucle/i, "#d8cfbc"],
  [/linen|bolt-end|fabric/i, "#c9bda6"],
  [/leather|bindings/i, "#8a5938"],
  [/caramel walnut/i, "#8a5f3e"],
  [/walnut/i, "#5a3d2e"],
  [/dark oak/i, "#3b2b1f"],
  [/french oak|oak/i, "#7d5c3d"],
  [/ash/i, "#b6a894"],
  [/teak/i, "#8a6440"],
  [/pine/i, "#c0a276"],
  [/olive|branch|tree/i, "#5d6b4e"],
  [/books/i, "#6b5a48"],
];

function firstMatch(rules: [RegExp, string][], value: string, fallback: string) {
  for (const [re, out] of rules) if (re.test(value)) return out;
  return fallback;
}

/** Every distinct material named on a piece, with the pieces that use it. */
export const MATERIALS: MaterialEntry[] = (() => {
  const byName = new Map<string, MaterialEntry>();
  for (const piece of PIECES) {
    for (const name of piece.materials) {
      let entry = byName.get(name);
      if (!entry) {
        entry = {
          name,
          family: firstMatch(FAMILY_RULES, name, "cloth"),
          swatch: firstMatch(SWATCH_RULES, name, "#8a8376"),
          pieces: [],
        };
        byName.set(name, entry);
      }
      entry.pieces.push(piece);
    }
  }
  // Commonest first inside a family: the material on seventeen pieces is more
  // representative of the house than the one on a single vase.
  return [...byName.values()].sort(
    (a, b) => b.pieces.length - a.pieces.length || a.name.localeCompare(b.name)
  );
})();

export const MATERIALS_BY_FAMILY: Record<string, MaterialEntry[]> = Object.fromEntries(
  MATERIAL_FAMILIES.map((f) => [f.slug, MATERIALS.filter((m) => m.family === f.slug)])
);

export function materialCount(familySlug: string) {
  return MATERIALS_BY_FAMILY[familySlug]?.length ?? 0;
}

// ── The guard ───────────────────────────────────────────────────────────────
// A material that matches no FAMILY_RULES silently lands in "cloth", and a
// stone that quietly files itself under textiles is worse than a build error.
// Same for swatches: the grey fallback is legitimate for exactly nothing.
if (process.env.NODE_ENV !== "production") {
  const unclassified = MATERIALS.filter(
    (m) => !FAMILY_RULES.some(([re]) => re.test(m.name))
  );
  if (unclassified.length) {
    console.error(
      `lib/materials.ts: ${unclassified.length} material(s) matched no family rule and ` +
        `defaulted to "cloth". Add a rule for each:\n  ${unclassified.map((m) => m.name).join("\n  ")}`
    );
  }
  const unswatched = MATERIALS.filter((m) => !SWATCH_RULES.some(([re]) => re.test(m.name)));
  if (unswatched.length) {
    console.error(
      `lib/materials.ts: ${unswatched.length} material(s) have no swatch rule and fell back to grey:\n  ` +
        unswatched.map((m) => m.name).join("\n  ")
    );
  }
}
