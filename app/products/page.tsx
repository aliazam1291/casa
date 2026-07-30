import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STOCK_PIECES } from "@/lib/products";
import { PIECES } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { getPieceImage } from "@/lib/library-images";
import { DomeGallery } from "@/components/sections/DomeGallery";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Products — Wolf Casa",
  description:
    "Every Wolf Casa piece in one place — accent seating in stock on the Indore floor this week, and the full set of named pieces composed into the thirteen rooms.",
  alternates: { canonical: "/products" },
};

/**
 * The whole product surface on one page.
 *
 * Two distinct sets live here and the page keeps them visibly separate,
 * because conflating them would misrepresent both. STOCK_PIECES are real
 * accent pieces on the Indore floor with real rupee prices; PIECES are the
 * named pieces composed into rooms, which are specified rather than priced.
 * The stock band leads — it is the only part a visitor can actually buy — and
 * the named collection follows as the deeper catalogue.
 *
 * The dome sits between them as the turn from "in stock" to "composed": it is
 * built from PIECES, so it introduces the section it precedes.
 */
export default function ProductsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Everything we make and stock</p>
        <h1>Every piece, in one place.</h1>
        <p>
          {STOCK_PIECES.length} accent pieces on the Indore floor this week, priced and ready — and the{" "}
          {PIECES.length} named pieces composed into the thirteen rooms. Two different things, kept apart
          on purpose.
        </p>
      </section>

      <section className={styles.stock} aria-label="Currently in stock">
        <div className={styles.bandHead}>
          <span className={styles.sectionLabel}>On The Floor Now</span>
          <h2>Real pieces, in stock this week.</h2>
          <p>
            A rotating edit of accent seating currently on the Indore showroom floor — priced and ready,
            not a composed room.
          </p>
        </div>
        <div className={styles.stockGrid}>
          {STOCK_PIECES.map((item) => (
            <div key={item.name} className={styles.stockCard}>
              <div className={styles.stockImage}>
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 900px) 45vw, 16vw" />
              </div>
              <span className={styles.stockName}>{item.name}</span>
              <span className={styles.stockDesc}>{item.desc}</span>
              <span className={styles.stockPrice}>&#8377;{item.price.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
        <div className={styles.stockFoot}>
          <Link href="/visit">Enquire at the showroom &rarr;</Link>
        </div>
      </section>

      <DomeGallery />

      <section className={styles.named} aria-label="Named pieces">
        <div className={styles.bandHead}>
          <span className={styles.sectionLabel}>The Named Collection</span>
          <h2>Composed, not shelved.</h2>
          <p>
            Every piece below belongs to a room. They are specified rather than priced — the room is the
            unit Wolf Casa sells, and the piece is how it is built.
          </p>
        </div>
        <div className={styles.namedGrid}>
          {PIECES.map((piece, i) => {
            const room = getRoom(piece.roomSlug);
            return (
              <Link key={piece.id} href={`/pieces/${piece.slug}`} className={styles.namedCard}>
                <div className={styles.namedImage}>
                  <Image
                    src={getPieceImage(piece.slug, i)}
                    alt={piece.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 23vw"
                  />
                </div>
                <div className={styles.namedBody}>
                  <span className={styles.namedRoom}>{room?.name ?? "Wolf Casa"}</span>
                  <h3>{piece.name}</h3>
                  <div className={styles.chips}>
                    {piece.materials.slice(0, 3).map((m) => (
                      <span key={m}>
                        <i aria-hidden />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.note}>
        <p>A piece only means something once it is in a room. See them composed.</p>
        <div className={styles.noteActions}>
          <Link href="/the-house-and-rooms">The house &amp; rooms</Link>
          <Link href="/catalogue">Browse by category</Link>
        </div>
      </section>
    </main>
  );
}
