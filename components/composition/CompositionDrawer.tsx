"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PIECES } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { getPieceImage } from "@/lib/library-images";
import { useCursor } from "@/components/cursor/CursorProvider";
import { WHATSAPP_AVAILABLE, compositionEnquiryUrl } from "@/lib/whatsapp";
import { useComposition } from "./CompositionProvider";
import styles from "./CompositionDrawer.module.css";

/**
 * The visitor's saved board, and the two ways out of it.
 *
 * It is deliberately a floating pill rather than a nav item: the board is
 * stateful and personal, the nav is navigation, and on a phone the nav is
 * already collapsed behind a toggle where a live count would never be seen.
 * The pill is hidden entirely until something is saved, so it costs a visitor
 * who never uses it nothing at all.
 */
export function CompositionDrawer() {
  const { slugs, count, remove, clear, ready } = useComposition();
  const { setCursor, resetCursor } = useCursor();
  const [open, setOpen] = useState(false);

  // Resolve slugs to pieces here rather than storing whole objects: the stored
  // board is just IDs, so a piece being renamed or re-photographed is picked
  // up automatically and a deleted one simply drops out.
  const saved = slugs
    .map((slug) => PIECES.find((p) => p.slug === slug))
    .filter((p): p is (typeof PIECES)[number] => Boolean(p));

  if (!ready || count === 0) return null;

  const consultationHref = `/experiences/consultation?composition=${saved
    .map((p) => p.slug)
    .join(",")}`;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={styles.pill}
          onMouseEnter={() => setCursor("hover", "Your composition")}
          onMouseLeave={resetCursor}
        >
          <span className={styles.pillCount}>{String(count).padStart(2, "0")}</span>
          <span className={styles.pillLabel}>
            {count === 1 ? "Piece saved" : "Pieces saved"}
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.panel} aria-describedby={undefined}>
          <header className={styles.head}>
            <div>
              <span className={styles.kicker}>Your composition</span>
              <Dialog.Title className={styles.title}>
                {count} {count === 1 ? "piece" : "pieces"}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className={styles.close}
                aria-label="Close your composition"
                onMouseEnter={() => setCursor("hover", "Close")}
                onMouseLeave={resetCursor}
              >
                ✕
              </button>
            </Dialog.Close>
          </header>

          {/* Its own scroller, marked so the momentum scroller lets the wheel
              act on this list rather than the page behind it. */}
          <ul className={styles.list} data-lenis-prevent>
            {saved.map((piece, i) => (
              <li key={piece.slug} className={styles.row}>
                <span className={styles.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <div className={styles.rowImage}>
                  <Image
                    src={getPieceImage(piece.slug, PIECES.indexOf(piece))}
                    alt={piece.subtitle}
                    fill
                    sizes="72px"
                  />
                </div>
                <div className={styles.rowCopy}>
                  <Link
                    href={`/pieces/${piece.slug}`}
                    className={styles.rowName}
                    lang={piece.lang}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setCursor("hover", "View")}
                    onMouseLeave={resetCursor}
                  >
                    {piece.name}
                  </Link>
                  <span className={styles.rowSub}>
                    {piece.subtitle}
                    {getRoom(piece.roomSlug) ? ` · ${getRoom(piece.roomSlug)?.name}` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.rowRemove}
                  aria-label={`Remove ${piece.subtitle} from your composition`}
                  onClick={() => remove(piece.slug)}
                  onMouseEnter={() => setCursor("hover", "Remove")}
                  onMouseLeave={resetCursor}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <footer className={styles.foot}>
            <Link
              href={consultationHref}
              className={styles.primary}
              onClick={() => setOpen(false)}
              onMouseEnter={() => setCursor("hover", "Book")}
              onMouseLeave={resetCursor}
            >
              Begin a consultation <span aria-hidden>→</span>
            </Link>
            {WHATSAPP_AVAILABLE && (
              <a
                href={compositionEnquiryUrl(saved.map((p) => `${p.name} — ${p.subtitle}`))}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondary}
                onMouseEnter={() => setCursor("hover", "WhatsApp")}
                onMouseLeave={resetCursor}
              >
                Send on WhatsApp
              </a>
            )}
            <button type="button" className={styles.clear} onClick={clear}>
              Clear
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
