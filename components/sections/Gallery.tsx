"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PIECES, type Piece } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Gallery.module.css";

// Curated stock photo mappings that match the high-end monochrome, plaster, 
// wood, marble, and warm lighting luxury aesthetics of Wolf Casa.
const AESTHETIC_IMAGES: Record<string, string> = {
  "the-low-sofa": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
  "the-horizon-sofa": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
  "the-arrival-bench": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
  "the-dining-chairs": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
  "the-counter-stools": "https://images.unsplash.com/photo-1505080856163-267552912e1f?auto=format&fit=crop&q=80&w=800",
  "the-reading-chair": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
  "the-still-chair": "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800",
  "the-archive-reading-chair": "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800",
  "the-heirloom-table": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800",
  "the-stone-table": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  "the-side-table": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
  "the-writing-desk": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800",
  "the-tasting-table": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
  "the-design-workbench": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
  "the-drafting-table": "https://images.unsplash.com/photo-1507207611509-ec012433ff52?auto=format&fit=crop&q=80&w=800",
  "the-ring-chandelier": "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=800",
  "the-linear-pendant": "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800",
  "the-reading-lamp": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
  "the-bankers-lamp": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
  "the-monastic-bed": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800",
  "the-marble-nightstand": "https://images.unsplash.com/photo-1532372320978-9b4d6a3a854c?auto=format&fit=crop&q=80&w=800",
  "the-still-bath": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
  "the-floating-vanity": "https://images.unsplash.com/photo-1620626011161-997e5a919020?auto=format&fit=crop&q=80&w=800",
  "the-rain-shower": "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800",
  "the-wine-wall": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800",
  "the-aging-barrels": "https://images.unsplash.com/photo-1474747917300-344400e9d6d3?auto=format&fit=crop&q=80&w=800",
  "the-vintage-crates": "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=800",
  "the-sample-racks": "https://images.unsplash.com/photo-1582555172866-f73bb12a2abf?auto=format&fit=crop&q=80&w=800",
  "the-archive-cabinets": "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800",
  "the-fire-table": "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800",
  "the-olive-tree": "https://images.unsplash.com/photo-1445510861639-5651173bc5d5?auto=format&fit=crop&q=80&w=800"
};

const GENERIC_AESTHETICS = [
  "https://images.unsplash.com/photo-1615876234886-fd9a39faa97f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
];

function getPieceImage(slug: string, index: number): string {
  if (AESTHETIC_IMAGES[slug]) return AESTHETIC_IMAGES[slug];
  return GENERIC_AESTHETICS[index % GENERIC_AESTHETICS.length];
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
        {filteredPieces.map((piece, i) => {
          const imgUrl = getPieceImage(piece.slug, i);
          return (
            <div
              key={piece.slug}
              className={styles.card}
              onClick={() => setSelectedPiece(piece)}
              onMouseEnter={() => setCursor("hover", "Inspect")}
              onMouseLeave={resetCursor}
            >
              <div className={styles.img} style={{ aspectRatio: RATIOS[i % RATIOS.length] }}>
                <Image
                  src={imgUrl}
                  alt={piece.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 720px) 92vw, (max-width: 1200px) 45vw, 22vw"
                />
              </div>
              <span className={styles.cardNum}>
                {String(i + 1).padStart(2, "0")} · {getRoom(piece.roomSlug)?.name}
              </span>
              <div className={styles.cardTitle}>{piece.name}</div>
            </div>
          );
        })}
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
