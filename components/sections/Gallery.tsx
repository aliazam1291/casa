"use client";

import { useState } from "react";
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
        <span className={styles.num}>§ 03 — Curation Gallery</span>
        <h2 className={styles.heading}>
          <span className="upright">{PIECES.length}</span> <em>composed pieces.</em>
        </h2>
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

      {/* Masonry Pinterest Board */}
      <div className={styles.masonry}>
        {filteredPieces.map((piece, i) => (
          <GalleryCard key={piece.slug} piece={piece} index={i} onSelect={setSelectedPiece} />
        ))}
      </div>

      {/* Lightbox / Curation Detail Modal */}
      {selectedPiece && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPiece(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedPiece(null)}
              onMouseEnter={() => setCursor("hover", "Close")}
              onMouseLeave={resetCursor}
            >
              ✕
            </button>
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
                <span className={styles.modalLabel}>§ Curation Spec Sheets</span>
                <h3 className={styles.modalTitle}>{selectedPiece.name}</h3>
                
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

                <div className={styles.modalDesc}>
                  <small>The Composition Note</small>
                  <p>{selectedPiece.description}</p>
                </div>

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
          </div>
        </div>
      )}
    </section>
  );
}
