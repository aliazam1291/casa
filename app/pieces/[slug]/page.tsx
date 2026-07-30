import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PIECES, getPiece, piecesInRoom } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { getSubtype } from "@/lib/catalogue";
import { getPieceImage } from "@/lib/library-images";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

function getPieceHero(slug: string): string {
  return getPieceImage(slug, PIECES.findIndex((p) => p.slug === slug));
}

export function generateStaticParams() {
  return PIECES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const piece = getPiece((await params).slug);
  if (!piece) return {};
  return {
    // Both names in the title: the Italian/German is what the piece is called,
    // the English is what someone actually searches for.
    title: `${piece.name} — ${piece.subtitle} — Wolf Casa`,
    description: piece.description,
    alternates: { canonical: `/pieces/${piece.slug}` },
  };
}

export default async function PiecePage({ params }: Props) {
  const piece = getPiece((await params).slug);
  if (!piece) notFound();

  const room = getRoom(piece.roomSlug);
  const found = getSubtype(piece.categorySlug, piece.subtypeSlug);
  const siblings = piecesInRoom(piece.roomSlug).filter((p) => p.slug !== piece.slug);
  const heroImage = getPieceHero(piece.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.name,
    alternateName: piece.subtitle,
    description: piece.description,
    material: piece.materials.join(", "),
    brand: { "@type": "Brand", name: "Wolf Casa" },
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link>
        {found && (
          <>
            <span aria-hidden>/</span>
            <Link href="/shop">{found.category.name}</Link>
            <span aria-hidden>/</span>
            <Link href="/shop">{found.subtype.name}</Link>
          </>
        )}
        <span aria-hidden>/</span>
        <span aria-current="page">{piece.subtitle}</span>
      </nav>

      {/* Cinematic split hero */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          {/* alt uses the English: a screen reader reading "Schwebewaschtisch"
              phonetically in an en-IN voice describes nothing. */}
          <Image src={heroImage} alt={piece.subtitle} fill priority sizes="(max-width: 900px) 100vw, 55vw" />
        </div>
        <div className={styles.heroInfo}>
          <p className={styles.kicker}>
            Named Piece · {piece.lang === "it" ? "Italiano" : "Deutsch"}
          </p>
          <h1 lang={piece.lang}>{piece.name}.</h1>
          <p className={styles.translation}>{piece.subtitle}</p>
          <p className={styles.heroDesc}>{piece.description}</p>
          <div className={styles.matSection}>
            <span className={styles.matLabel}>Materials &amp; Finishes</span>
            <div className={styles.chips}>
              {piece.materials.map((m) => (
                <span key={m} className={styles.chip}>{m}</span>
              ))}
            </div>
          </div>
          {room && (
            <div className={styles.roomRef}>
              <span className={styles.matLabel}>Composed in</span>
              <p className={styles.roomName}><em>{room.name}</em></p>
              <Link href={`/rooms/${room.slug}`} className={styles.roomLink}>See the room →</Link>
            </div>
          )}
          <Link href="/experiences/consultation" className={styles.cta}>
            Specify this piece
          </Link>
        </div>
      </section>

      {/* Sibling pieces */}
      {siblings.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Also in this room</span>
            <h2>The rest of {room?.name}.</h2>
          </div>
          <div className={styles.siblingGrid}>
            {siblings.map((s) => (
              <Link key={s.slug} href={`/pieces/${s.slug}`} className={styles.siblingCard}>
                <div className={styles.siblingThumb}>
                  <Image
                    src={getPieceHero(s.slug)}
                    alt={s.subtitle}
                    fill
                    loading="lazy"
                    sizes="(max-width: 720px) 48vw, 22vw"
                  />
                </div>
                <div className={styles.siblingInfo}>
                  <h3 lang={s.lang}>{s.name}</h3>
                  <p className={styles.siblingSub}>{s.subtitle}</p>
                  <p>{s.materials.slice(0, 2).join(" · ")}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.note}>
        <p>Specify this piece, or the whole room it composes, for your own home.</p>
        <Link href="/experiences/consultation">Begin a consultation</Link>
      </section>
    </main>
  );
}
