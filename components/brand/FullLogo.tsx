import { LETTERS, MARK_LOCKUP } from "./logoPaths";

/**
 * THE STACKED LOCKUP — public/logo/Full Logo.svg: the mark over WOLF over CASA,
 * in the client's own artwork and proportions.
 *
 * Paths live in ./logoPaths.ts so this and the horizontal Wordmark render the
 * same outlines. Nothing is repositioned here — the letters keep the source's
 * two-line arrangement, which is what makes this the *stacked* lockup.
 *
 * Fill comes from `currentColor` rather than the source's #231f20: that hex is
 * near-black and invisible on this site's Soft Black ground. §12 forbids
 * *colouring* the mark; it stays monochrome, in whatever single ink the surface
 * is already using.
 */
export function FullLogo({
  className,
  markClassName,
  letterClassName,
}: {
  className?: string;
  markClassName?: string;
  /** Applied to each of the eight letters, in reading order. */
  letterClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 218.17 206.3"
      fill="currentColor"
      role="img"
      aria-label="Wolf Casa"
    >
      <path className={markClassName} d={MARK_LOCKUP} />
      {LETTERS.map((letter, i) => (
        <path key={i} className={letterClassName} d={letter.d} />
      ))}
    </svg>
  );
}
