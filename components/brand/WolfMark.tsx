import { MARK_ICON } from "./logoPaths";

/**
 * THE WOLF MARK — public/logo/Icon.svg verbatim, one compound path.
 *
 * This replaced a hand-traced approximation measured off a bitmap of the Brand
 * Book cover: twelve stroked paths reconstructing the mark as ears, brow, jaw,
 * nose, ruff and fangs. Careful work, and still a drawing of a logo rather than
 * the logo — which is what the §12 usage rules ("don't stretch, don't rotate,
 * don't colour") exist to prevent.
 *
 * Inlined rather than <img src="/logo/Icon.svg"> so the fill can be
 * `currentColor`: the source is #231f20, invisible on Soft Black, and the nav's
 * mix-blend-mode treatment needs the mark to take its surface's ink.
 *
 * NOTE FOR CONSUMERS: this is a FILLED path, not strokes. Styling it with
 * `stroke`/`stroke-width` outlines the silhouette and reads as a blob.
 */
export function WolfMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 65.07 78.83" fill="currentColor" aria-hidden>
      <path d={MARK_ICON} />
    </svg>
  );
}
