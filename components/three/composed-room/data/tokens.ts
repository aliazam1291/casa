/**
 * §8 — Sanctioned deviation (see app/globals.css §8 and
 * Wolf_Casa_Design_System_v3.md §8).
 *
 * These four cream hexes are the ONLY place warm-neutral color is allowed
 * outside the vase hero's mood lighting. They must never leak into
 * lib/tokens.ts or :root CSS custom properties — this file is the single
 * bounded exception.
 */
export const CREAM_STAGE = 0xe8dfc9;
export const CREAM_GROUND = 0xd4c7a8;
export const CREAM_MATTE = 0xddd1b8;
/** The one accent line. This used to cite lib/tokens.ts WORLD_ACCENTS ("Ritual
    Way"), which no longer exists — the Five Worlds were retired in favour of
    the Brand Book's eight compositions. The value is kept as-is because it is
    calibrated to this scene's lighting; it sits between the book's Brass
    (#A78657) and Walnut and reads as brass under the cream key light. */
export const ACCENT_LINE = 0xb8813c;

export const CREAM_STAGE_CSS = "#E8DFC9";
