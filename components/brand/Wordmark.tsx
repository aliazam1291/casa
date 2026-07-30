import {
  LETTERS,
  ROW2_SHIFT_X,
  WORDMARK_METRICS,
  WORDMARK_WIDTH,
} from "./logoPaths";

/**
 * WOLF CASA on one line, from the real outlines.
 *
 * The nav and the footer were both setting the words as plain text in
 * `var(--display)`. That variable falls back to Jost, because the book's
 * display face (Posterama 2001) is licensed and not in this repo — so the two
 * most-seen instances of the brand name on the site were rendering in the wrong
 * face, with the wrong tracking, and with a crossbarred A. §09 is explicit that
 * the bare-apex A *is* the mark; a crossbar is the one thing the wordmark
 * cannot get wrong.
 *
 * HOW THE ONE LINE IS BUILT. The source artwork sets WOLF above CASA. Rather
 * than respace anything, this lifts row 2 onto row 1's baseline with a single
 * constant and slides it to the right of WOLF, so every letter keeps the
 * optical spacing the designer gave it — the gaps in the artwork are uneven on
 * purpose (A beside S needs less air than C beside A), and evening them out
 * would be redrawing the logo. See WORDMARK_METRICS for the measurements and
 * why row 2 moves as a block.
 *
 * The viewBox is exactly the cap height, with no ascender or descender space,
 * so `height` on this element is cap height — set it to about 0.7× the type
 * size you would have used for text.
 */
export function Wordmark({
  className,
  letterClassName,
}: {
  className?: string;
  /** Applied to each of the eight letters, in reading order. */
  letterClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WORDMARK_WIDTH.toFixed(2)} ${WORDMARK_METRICS.HEIGHT}`}
      fill="currentColor"
      role="img"
      aria-label="Wolf Casa"
    >
      <g transform={`translate(0 ${-WORDMARK_METRICS.TOP})`}>
        {LETTERS.map((letter, i) => (
          <path
            key={i}
            className={letterClassName}
            d={letter.d}
            transform={
              letter.row === 2
                ? `translate(${ROW2_SHIFT_X.toFixed(2)} ${-WORDMARK_METRICS.ROW_LIFT})`
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  );
}
