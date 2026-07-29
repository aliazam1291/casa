/**
 * The wolf mark, traced from the logo as it appears in the Brand Book (the
 * cover of "The Wolf Way", vol. 01). Geometry was measured off that artwork
 * rather than approximated: the source mark was isolated, thresholded and
 * scanned row by row, and the vertices below are those run centres mapped
 * into this 100x125 box.
 *
 * The mark is a face built from six ideas, symmetrical about x=50:
 *   - two hollow ear triangles, outer edge vertical, apex pointing inward
 *   - a brow bar joining the two ear apexes
 *   - two jaw lines running from the cheek corners down to the muzzle point
 *   - a nose line dropping from the muzzle point to the chin
 *   - two ruff barbs hooking out and back from the cheek corners
 *   - two fangs rising from the chin base
 *
 * Ruff tips and fangs are FILLED triangles, not strokes: in the original they
 * taper to a point, and SVG has no tapered stroke. That is also why this
 * component sets fill/stroke per path instead of once on the <svg>.
 *
 * Every stroked path carries pathLength="1", so a consumer animating the
 * draw-on can use stroke-dasharray:1/stroke-dashoffset:1 uniformly without
 * knowing each path's true length (see Splash.module.css).
 *
 * Child order is fixed so a consumer's own CSS module can target parts with
 * plain nth-child selectors (no :global needed — element selectors aren't
 * scoped by CSS Modules):
 *   1-2 ears · 3 brow · 4-5 jaw · 6 nose · 7-8 ruff arms
 *   9-10 ruff tips (filled) · 11-12 fangs (filled)
 */
export function WolfMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-3 -3 106 131"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.6"
      strokeMiterlimit="6"
      aria-hidden
    >
      <path d="M11 1 L33 35 L11 58 Z" pathLength="1" />
      <path d="M89 1 L67 35 L89 58 Z" pathLength="1" />
      <path d="M33 35 H67" pathLength="1" />
      <path d="M11 58 L50 87" pathLength="1" />
      <path d="M89 58 L50 87" pathLength="1" />
      <path d="M50 87 V125" pathLength="1" />
      <path d="M11 58 L2 81" pathLength="1" />
      <path d="M89 58 L98 81" pathLength="1" />
      <path d="M-0.1 80.2 L4.1 81.8 L18 95.5 Z" fill="currentColor" stroke="none" />
      <path d="M100.1 80.2 L95.9 81.8 L82 95.5 Z" fill="currentColor" stroke="none" />
      <path d="M27.5 104.5 L36.5 125 L47.7 125 Z" fill="currentColor" stroke="none" />
      <path d="M72.5 104.5 L63.5 125 L52.3 125 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
