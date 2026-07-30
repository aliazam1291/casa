/**
 * THE WOLF MARK — the real one.
 *
 * Geometry is public/logo/Icon.svg verbatim: the client's own artwork, one
 * compound path, viewBox 0 0 65.07 78.83. Nothing here is redrawn.
 *
 * This replaces a hand-traced approximation that was measured off a bitmap of
 * the Brand Book cover — twelve stroked paths reconstructing the mark as ears,
 * brow, jaw, nose, ruff and fangs. It was careful work and it was still a
 * drawing of a logo rather than the logo, which the §12 usage rules ("don't
 * stretch, don't rotate, don't colour") exist precisely to prevent.
 *
 * WHY INLINE RATHER THAN <img src="/logo/Icon.svg">. The source artwork is
 * filled #231f20, near-black, which is invisible on this site's Soft Black
 * ground. Inlining is what lets the fill be `currentColor`, so the mark takes
 * the colour of whatever it sits in — and it is what makes the nav's
 * mix-blend-mode: difference treatment work at all. §12 forbids *colouring* the
 * mark; it is monochrome here, in the one ink the surface is using.
 */
export function WolfMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 65.07 78.83"
      fill="currentColor"
      aria-hidden
    >
      <path d="M54.94,58.04c3.51-1.72,7.13-4.04,10.13-6.72-.79-4.91-5.01-8.42-5.1-13.21L59.26.07l-17.04,19.39c-5.11,1.38-14.62,1.32-19.5-.09L5.75,0l-.56,37.82c-.07,4.84-4.21,8.54-5.19,13.3,2.09,2.05,4.45,4.26,7.79,4.77-5.52-4.86-1.97-9.73,1.86-15.27l20.47,15.45c1.62,5.02,1.73,13.47.34,18.53-1.36,2.28-5.34-1.02-6.33-2.23-.72,1.93.43,5.44,2.66,5.85,3.83.7,8.13.99,11.81-.23,2.22-.73,3.34-4.6,2.7-6.2-1.92,2.11-5.51,5.31-6.65,2.95-1.54-6.05-.43-12.56-.4-18.65l21.64-15.53c1.79,3.39,4.44,6.84,4.45,10.53,0,3.06-3.97,4.86-5.4,6.95ZM9.14,32.21c-.67-7.4-.57-14.28-.01-22.21,3.91,3.13,6.03,6.81,9.94,10.96-3.11,4.2-6.01,7.38-9.93,11.25ZM32.63,52.64l-22.04-15.67,11.71-13.51c6.76-.54,13.35-.43,20.25-.08l12.06,13.53-21.98,15.73ZM56.09,31.91c-3.72-2.94-6.53-6.53-9.89-10.67,3.18-4.29,5.81-7.65,9.82-11.45.47,7.43.37,13.91.07,22.12Z" />
    </svg>
  );
}
