/**
 * THE FULL LOCKUP — public/logo/Full Logo.svg, verbatim.
 *
 * The mark over WOLF over CASA, in the client's own artwork and the client's
 * own proportions. Every path below is copied from that file unchanged; the
 * only edits are (a) fill comes from `currentColor` instead of the source's
 * #231f20, for the reason given in WolfMark.tsx, and (b) the eight letter paths
 * are reordered into reading order.
 *
 * THE REORDER IS THE ONLY LIBERTY TAKEN, AND IT MOVES NOTHING. Illustrator
 * exported the letters as O, L, F, W, C, S, A, A — the order they happened to
 * be drawn. Each path carries its own absolute coordinates, so listing them
 * W, O, L, F, C, A, S, A changes the DOM order and not one pixel of the render,
 * and it lets a consumer stagger the letters with plain nth-child selectors
 * instead of a lookup table (see Splash.module.css).
 *
 * Note the A: no crossbar. That is not a fallback-font artifact, it is the
 * brand — §09, "We stripped the crossbar so the bare apex reads as the wolf's
 * muzzle. The letter becomes the mark." The previous hand-built wordmark
 * simulated this by setting seven letters as live text and drawing the A as a
 * chevron, because the real face (Posterama 2001) is licensed and not in the
 * repo. With the outlined artwork that whole workaround is unnecessary.
 *
 * (public/logo/Wordmark_1.svg is NOT used anywhere: it stores the wordmark as a
 * live <text> element in Posterama 2001 rather than as outlines, so it renders
 * in whatever fallback the browser picks — including a crossbarred A. These
 * outlines are the same wordmark, correct on any machine.)
 */

/** Letter paths in reading order — see the note above. */
const LETTERS = [
  // W
  "M8.07,144.44L0,112.65h4.34l3.77,16.08c.94,3.96,1.79,7.93,2.36,10.99h.09c.52-3.16,1.51-6.93,2.59-11.04l4.24-16.04h4.29l3.87,16.13c.9,3.77,1.75,7.55,2.22,10.89h.09c.66-3.49,1.56-7.03,2.55-10.99l4.2-16.04h4.2l-9.01,31.79h-4.29l-4.01-16.55c-.99-4.05-1.65-7.17-2.08-10.38h-.09c-.57,3.16-1.27,6.27-2.45,10.38l-4.53,16.55h-4.29Z",
  // O
  "M102.55,128.47c0,10.66-6.48,16.31-14.38,16.31s-13.92-6.34-13.92-15.71c0-9.83,6.11-16.26,14.38-16.26s13.92,6.48,13.92,15.66ZM78.53,128.98c0,6.62,3.58,12.54,9.87,12.54s9.92-5.83,9.92-12.86c0-6.15-3.21-12.59-9.88-12.59s-9.92,6.11-9.92,12.91Z",
  // L
  "M137.72,112.66h4.11v28.41h13.61v3.45h-17.72v-31.86Z",
  // F
  "M194.15,112.81h17.16v3.45h-13.04v10.59h12.05v3.4h-12.05v14.42h-4.11v-31.86Z",
  // C
  "M30.4,198.88c.33-.27.58-.4.75-.4.12,0,.24.05.36.13.12.09.22.2.31.31l1.29,1.78c.15.18.22.38.22.62,0,.12-.05.24-.13.38s-.22.27-.4.42c-1.57,1.33-3.34,2.36-5.31,3.09-1.97.73-4.04,1.09-6.2,1.09-2.9,0-5.56-.68-7.97-2.04s-4.32-3.26-5.73-5.69c-1.41-2.43-2.11-5.15-2.11-8.17s.7-5.8,2.11-8.26c1.41-2.45,3.33-4.39,5.77-5.79,2.44-1.41,5.17-2.11,8.19-2.11,2.13,0,4.17.37,6.11,1.11,1.94.74,3.67,1.75,5.17,3.02.3.21.44.43.44.67,0,.21-.09.44-.27.71l-1.29,1.73c-.24.33-.47.49-.71.49-.18,0-.43-.12-.76-.35-1.27-.98-2.65-1.75-4.13-2.31-1.48-.56-3.03-.84-4.66-.84-2.1,0-4.02.5-5.75,1.51-1.73,1.01-3.1,2.41-4.11,4.22s-1.51,3.85-1.51,6.13.5,4.19,1.49,6c.99,1.81,2.35,3.22,4.09,4.24,1.73,1.02,3.66,1.53,5.8,1.53,3.35,0,6.32-1.07,8.93-3.2Z",
  // A — no crossbar, by design
  "M77.97,204.96c-.24.54-.48.89-.71,1.07-.24.18-.6.27-1.07.27h-2.32c-.6,0-.89-.19-.89-.58,0-.15.07-.4.22-.76l13.46-28.34c.45-.92.77-1.53.98-1.81.21-.28.46-.43.76-.43.27,0,.5.14.69.43.19.28.51.89.96,1.81l13.59,28.34c.15.36.22.61.22.76,0,.39-.31.58-.94.58h-2.5c-.48,0-.83-.09-1.05-.27-.22-.18-.47-.53-.74-1.07l-10.33-22.26-10.33,22.26Z",
  // S
  "M137.73,198.49c.15,0,.37.12.66.36,2.68,2.09,5.37,3.14,8.09,3.14,1.35,0,2.53-.19,3.53-.58,1-.38,1.77-.93,2.32-1.65.54-.72.82-1.55.82-2.5s-.22-1.66-.66-2.25c-.44-.59-1.16-1.1-2.14-1.52s-2.38-.88-4.17-1.35c-2.12-.53-3.87-1.15-5.24-1.86-1.37-.71-2.43-1.63-3.18-2.76s-1.13-2.56-1.13-4.26c0-1.86.46-3.46,1.37-4.81.91-1.36,2.16-2.39,3.73-3.12,1.57-.72,3.35-1.08,5.32-1.08,3.71,0,7.07,1.17,10.08,3.49.15.12.26.23.33.33.07.1.11.22.11.33,0,.09-.03.19-.09.31-.06.12-.13.25-.22.4l-1.28,1.9c-.12.18-.23.3-.33.38-.1.07-.21.11-.33.11-.21,0-.46-.1-.75-.31-1.18-.85-2.39-1.53-3.62-2.03-1.24-.5-2.55-.75-3.93-.75-1.12,0-2.11.19-2.98.55s-1.55.9-2.03,1.59c-.49.69-.73,1.51-.73,2.45s.24,1.72.73,2.34c.49.62,1.21,1.13,2.17,1.55.96.41,2.26.82,3.91,1.24,2.27.59,4.1,1.25,5.5,1.99,1.4.73,2.45,1.65,3.14,2.76.69,1.1,1.04,2.47,1.04,4.08,0,1.83-.49,3.44-1.46,4.84-.97,1.4-2.31,2.47-4.02,3.23s-3.67,1.13-5.88,1.13c-2,0-3.88-.34-5.63-1.01-1.75-.68-3.37-1.61-4.84-2.79-.32-.29-.49-.54-.49-.75s.1-.46.31-.75l1.33-1.86c.24-.33.46-.49.66-.49Z",
  // A
  "M192.29,204.85c-.24.54-.48.89-.71,1.07-.24.18-.6.27-1.07.27h-2.32c-.6,0-.89-.19-.89-.58,0-.15.07-.4.22-.76l13.46-28.34c.45-.92.77-1.53.98-1.81.21-.28.46-.43.76-.43.27,0,.5.14.69.43.19.28.51.89.96,1.81l13.59,28.34c.15.36.22.61.22.76,0,.39-.31.58-.94.58h-2.5c-.48,0-.83-.09-1.05-.27-.22-.18-.47-.53-.74-1.07l-10.33-22.26-10.33,22.26Z",
];

/** The mark, positioned for the lockup (Icon.svg translated, per the source). */
const MARK =
  "M131.49,58.04c3.51-1.72,7.13-4.04,10.13-6.72-.79-4.91-5.01-8.42-5.1-13.21L135.81.07l-17.04,19.39c-5.11,1.38-14.62,1.32-19.5-.09L82.3,0l-.56,37.82c-.07,4.84-4.21,8.54-5.19,13.3,2.09,2.05,4.45,4.26,7.79,4.77-5.52-4.86-1.97-9.73,1.86-15.27l20.47,15.45c1.62,5.02,1.73,13.47.34,18.53-1.36,2.28-5.34-1.02-6.33-2.23-.72,1.93.43,5.44,2.66,5.85,3.83.7,8.13.99,11.81-.23,2.22-.73,3.34-4.6,2.7-6.2-1.92,2.11-5.51,5.31-6.65,2.95-1.54-6.05-.43-12.56-.4-18.65l21.64-15.53c1.79,3.39,4.44,6.84,4.45,10.53,0,3.06-3.97,4.86-5.4,6.95ZM85.69,32.21c-.67-7.4-.57-14.28-.01-22.21,3.91,3.13,6.03,6.81,9.94,10.96-3.11,4.2-6.01,7.38-9.93,11.25ZM109.18,52.64l-22.04-15.67,11.71-13.51c6.76-.54,13.35-.43,20.25-.08l12.06,13.53-21.98,15.73ZM132.64,31.91c-3.72-2.94-6.53-6.53-9.89-10.67,3.18-4.29,5.81-7.65,9.82-11.45.47,7.43.37,13.91.07,22.12Z";

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
      <path className={markClassName} d={MARK} />
      {LETTERS.map((d, i) => (
        <path key={i} className={letterClassName} d={d} />
      ))}
    </svg>
  );
}
