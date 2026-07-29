/**
 * The wolf mark, everywhere it appears. Two open paths — each running from
 * an ear tip, across the face to the OPPOSITE cheek, down to a shared chin
 * point — cross each other a third of the way down. That crossing is what
 * reads as the brow/eyes; it is a property of the two paths overlapping, not
 * a separate drawn shape, which is what makes the mark read as one gesture
 * rather than an assembled icon.
 *
 * Geometry (100×100 box): ears at (32,15)/(68,15), cheeks flared wider than
 * the ears at (76,54)/(24,54), one chin vertex at (50,90). The two paths'
 * intersection is exactly (50, 31) — solved algebraically, not eyeballed —
 * which is where the eye ticks sit.
 *
 * Child order is fixed so a consumer's own CSS module can target parts with
 * plain nth-child selectors (no :global needed — element selectors aren't
 * scoped by CSS Modules): 1st/2nd = the two outline strokes, 3rd/4th = the
 * eyes, 5th = the nose bridge. Stroke defaults below so the mark renders
 * with no CSS at all; override stroke/stroke-width per part as needed.
 */
export function WolfMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden>
      <path d="M32 15 L76 54 L50 90" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M68 15 L24 54 L50 90" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M43 37 L47.5 41.5" strokeWidth="2" strokeLinecap="round" />
      <path d="M57 37 L52.5 41.5" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 50 L50 76" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
