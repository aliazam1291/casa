import styles from "./Wordmark.module.css";

/**
 * "WOLF CASA" set the way the Brand Book sets it — which means the A is a bare
 * chevron with no crossbar.
 *
 * That crossbar-less A is the one letterform the fallback face gets wrong. The
 * book's display face is Posterama 2001, which is licensed and not in this
 * repo (see app/layout.tsx); --display currently resolves to Jost, whose other
 * caps are close enough to pass — W O L F C S are all geometric and Futura-
 * derived — but whose A has a crossbar and reads as the wrong brand instantly.
 * So every letter but A is real text, and A is drawn.
 *
 * Sized in em throughout, so the mark inherits font-size from wherever it is
 * used and needs no per-site-tuning. Consumers style the letters through
 * `letterClassName` — the Splash uses it to stagger each letter's entrance —
 * and the child order is one element per letter with the word gap as the 5th
 * child, so nth-child choreography reads naturally.
 */

const LETTERS = ["W", "O", "L", "F", null, "C", "A", "S", "A"] as const;

function ChevronA() {
  // Cap height 72, width 62 — matched to Jost's caps so the drawn A sits at
  // the same weight and width as the letters either side of it.
  return (
    <svg className={styles.a} viewBox="0 0 62 72" fill="none" stroke="currentColor" aria-hidden>
      <path d="M2 72 L31 2 L60 72" />
    </svg>
  );
}

export function Wordmark({
  className,
  letterClassName,
  gapClassName,
}: {
  className?: string;
  letterClassName?: string;
  gapClassName?: string;
}) {
  return (
    <span className={`${styles.wordmark} ${className ?? ""}`} role="img" aria-label="Wolf Casa">
      {LETTERS.map((letter, i) =>
        letter === null ? (
          <i key="gap" className={`${styles.gap} ${gapClassName ?? ""}`} aria-hidden />
        ) : (
          <span key={i} className={letterClassName} aria-hidden>
            {letter === "A" ? <ChevronA /> : letter}
          </span>
        ),
      )}
    </span>
  );
}
