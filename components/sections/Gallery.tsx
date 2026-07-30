"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { PIECES, type Piece } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { useTilt } from "@/hooks/useTilt";
import { getPieceImage } from "@/lib/library-images";
import styles from "./Gallery.module.css";

function GalleryCard({
  piece,
  index,
  onSelect,
}: {
  piece: Piece;
  index: number;
  onSelect: (p: Piece) => void;
}) {
  const { setCursor, resetCursor } = useCursor();
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>(7);
  const imgUrl = getPieceImage(piece.slug, index);

  return (
    <div
      ref={ref}
      className={styles.card}
      onClick={() => onSelect(piece)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        onPointerLeave();
        resetCursor();
      }}
      onMouseEnter={() => setCursor("hover", "Inspect")}
    >
      {/* Picture wire + hook — every piece reads as hung, not posted */}
      <svg className={styles.wire} viewBox="0 0 40 26" aria-hidden>
        <circle cx="20" cy="4" r="2.6" />
        <path d="M6 26 L20 6 L34 26" fill="none" />
      </svg>
      <div className={styles.frame}>
        <div className={styles.img} style={{ aspectRatio: RATIOS[index % RATIOS.length] }}>
          <Image
            src={imgUrl}
            alt={piece.name}
            fill
            loading="lazy"
            sizes="(max-width: 720px) 92vw, (max-width: 1200px) 45vw, 22vw"
          />
          <span className={styles.imgSheen} aria-hidden />
        </div>
      </div>
      <span className={styles.cardNum}>
        {String(index + 1).padStart(2, "0")} · {getRoom(piece.roomSlug)?.name}
      </span>
      <div className={styles.cardTitle}>{piece.name}</div>
    </div>
  );
}

const CATEGORIES = [
  { slug: "all", label: "All Curation" },
  { slug: "seating", label: "Seating" },
  { slug: "bespoke", label: "Bespoke" },
  { slug: "tables", label: "Tables" },
  { slug: "lighting", label: "Lighting" },
  { slug: "kitchen-bath", label: "Kitchen & Bath" },
  { slug: "decor", label: "Objects & Decor" }
] as const;

function matchesCategory(piece: Piece, category: string): boolean {
  if (category === "all") return true;
  if (category === "seating") return piece.categorySlug === "seating";
  if (category === "bespoke") return piece.categorySlug === "bespoke-interiors" && !piece.subtypeSlug.includes("table") && !piece.subtypeSlug.includes("bed");
  if (category === "tables") return piece.subtypeSlug.includes("table") || piece.slug.includes("table");
  if (category === "lighting") return piece.categorySlug === "lighting-smart-living";
  if (category === "kitchen-bath") return piece.categorySlug === "kitchen-bath";
  if (category === "decor") return piece.categorySlug === "decor-finishes" || piece.categorySlug === "greenery-entertainment";
  return false;
}

const RATIOS = [1.25, 0.8, 1, 1.4, 0.9, 1.15] as const;

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();

  const filteredPieces = PIECES.filter((p) => matchesCategory(p, activeCategory));

  return (
    <section className={styles.section} id="home-curation">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        {/* The section title itself hangs on the wall, like the pieces below it */}
        <div className={styles.plaqueWire} aria-hidden>
          <svg viewBox="0 0 120 40"><circle cx="60" cy="6" r="3" /><path d="M14 40 L60 9 L106 40" fill="none" /></svg>
        </div>
        <div className={styles.plaque}>
          <span className={styles.num}>The pieces</span>
          <h2 className={styles.heading}>
            <span className="upright">{PIECES.length}</span> <em>composed pieces.</em>
          </h2>
          <span className={styles.plaqueFoot}>Hung, not listed — every piece framed as it lives in the room.</span>
        </div>
      </div>

      {/* Interactive Category Filter Bar */}
      <nav className={styles.filters} aria-label="Filter gallery items">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.filterBtnActive : ""}`}
            onClick={() => setActiveCategory(cat.slug)}
            onMouseEnter={() => setCursor("hover", cat.label)}
            onMouseLeave={resetCursor}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* The picture rail the whole wall hangs from */}
      <div className={styles.rail} aria-hidden />

      {/* Masonry Pinterest Board */}
      <div className={styles.masonry}>
        {filteredPieces.map((piece, i) => (
          <GalleryCard key={piece.slug} piece={piece} index={i} onSelect={setSelectedPiece} />
        ))}
      </div>

      {/* Lightbox / Curation Detail Modal — Radix Dialog underneath so ESC,
          focus trap, scroll lock, outside-click and ARIA all come for free.
          Visual design is untouched: same classNames, same CSS module. */}
      <Dialog.Root open={selectedPiece !== null} onOpenChange={(open) => { if (!open) setSelectedPiece(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.modalOverlay}>
            <Dialog.Content className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              {selectedPiece && (
                <>
                  <Dialog.Close asChild>
                    <button
                      className={styles.closeBtn}
                      onMouseEnter={() => setCursor("hover", "Close")}
                      onMouseLeave={resetCursor}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </Dialog.Close>
                  <div className={styles.modalGrid}>
                    <div className={styles.modalImageWrap}>
                      <Image
                        src={getPieceImage(selectedPiece.slug, PIECES.indexOf(selectedPiece))}
                        alt={selectedPiece.name}
                        fill
                        sizes="(max-width: 1000px) 100vw, 50vw"
                      />
                    </div>
                    <div className={styles.modalInfo}>
                      <span className={styles.modalLabel}>Spec sheet</span>
                      <Dialog.Title className={styles.modalTitle}>{selectedPiece.name}</Dialog.Title>

                      <div className={styles.metaRow}>
                        <div>
                          <small>Room Location</small>
                          <p>{getRoom(selectedPiece.roomSlug)?.name}</p>
                        </div>
                        <div>
                          <small>Classification</small>
                          <p>{selectedPiece.categorySlug.replace("-", " ")}</p>
                        </div>
                      </div>

                      <Dialog.Description asChild>
                        <div className={styles.modalDesc}>
                          <small>The Composition Note</small>
                          <p>{selectedPiece.description}</p>
                        </div>
                      </Dialog.Description>

                      <div className={styles.modalMaterials}>
                        <small>Materials & Finishes</small>
                        <div className={styles.tagWrap}>
                          {selectedPiece.materials.map((m) => (
                            <span key={m} className={styles.tag}>{m}</span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.modalActions}>
                        <Link
                          href={`/rooms/${selectedPiece.roomSlug}`}
                          className={styles.primaryAction}
                          onClick={() => setSelectedPiece(null)}
                          onMouseEnter={() => setCursor("hover", "Go")}
                          onMouseLeave={resetCursor}
                        >
                          View Room in 3D Walkthrough <span>→</span>
                        </Link>
                        <Link
                          href={`/pieces/${selectedPiece.slug}`}
                          className={styles.secondaryAction}
                          onClick={() => setSelectedPiece(null)}
                          onMouseEnter={() => setCursor("hover", "Info")}
                          onMouseLeave={resetCursor}
                        >
                          Bespoke Product Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
