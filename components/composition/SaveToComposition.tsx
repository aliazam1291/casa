"use client";

import { useComposition } from "./CompositionProvider";
import { useCursor } from "@/components/cursor/CursorProvider";
import styles from "./SaveToComposition.module.css";

/**
 * The save control that appears on a piece. Two shapes:
 *   "inline" — a labelled button, for a piece's own page.
 *   "mark"   — a compact brass tick, for a card in a grid.
 */
export function SaveToComposition({
  slug,
  name,
  variant = "inline",
  className,
}: {
  slug: string;
  /** Used for the accessible label, so the control names what it saves. */
  name: string;
  variant?: "inline" | "mark";
  className?: string;
}) {
  const { has, toggle, ready } = useComposition();
  const { setCursor, resetCursor } = useCursor();
  const saved = has(slug);

  // Until the stored board is read, `saved` is false for everything — showing
  // that would flash "Save" on pieces the visitor has already saved. Render
  // the control disabled and unlabelled for the one frame that takes.
  const label = !ready ? "" : saved ? "Saved" : "Save to composition";

  return (
    <button
      type="button"
      className={[
        variant === "mark" ? styles.mark : styles.inline,
        saved ? styles.on : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from your composition` : `Save ${name} to your composition`}
      disabled={!ready}
      onClick={(e) => {
        // On a card the button sits inside a link/dialog trigger; without this
        // saving would also navigate or open the lightbox.
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      onMouseEnter={() => setCursor("hover", saved ? "Remove" : "Save")}
      onMouseLeave={resetCursor}
    >
      <svg viewBox="0 0 16 16" aria-hidden className={styles.icon}>
        {/* A plan-mark: the crossbar-less apex the brand uses, closed into a
            tick once the piece is on the board. */}
        {saved ? (
          <path d="M3 8.4 6.4 12 13 4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        ) : (
          <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.2" />
        )}
      </svg>
      {variant === "inline" && <span>{label}</span>}
    </button>
  );
}
