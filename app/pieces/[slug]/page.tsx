import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PIECES, getPiece, piecesInRoom } from "@/lib/pieces";
import { getRoom } from "@/lib/rooms";
import { getSubtype } from "@/lib/catalogue";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PIECES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const piece = getPiece((await params).slug);
  if (!piece) return {};
  return {
    title: `${piece.name} — Wolf Casa`,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.name,
    description: piece.description,
    material: piece.materials.join(", "),
    brand: { "@type": "Brand", name: "Wolf Casa" },
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className={styles.breadcrumb}>
        {found && (
          <>
            <Link href="/catalogue">Catalogue</Link>
            <span>/</span>
            <Link href={`/catalogue/${found.category.slug}`}>{found.category.name}</Link>
            <span>/</span>
            <Link href={`/catalogue/${found.category.slug}/${found.subtype.slug}`}>{found.subtype.name}</Link>
          </>
        )}
      </nav>
      <section className={styles.hero}>
        <p className={styles.kicker}>Named Piece</p>
        <h1>{piece.name}.</h1>
        <p>{piece.description}</p>
        <div className={styles.chips}>
          {piece.materials.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </section>

      {room && (
        <section className={styles.room}>
          <p>Lives in <em>{room.name}</em>.</p>
          <Link href={`/rooms/${room.slug}`}>See the room</Link>
        </section>
      )}

      {siblings.length > 0 && (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Also In This Room</p>
          <h2>The rest of {room?.name}.</h2>
          <div className={styles.siblingGrid}>
            {siblings.map((s) => (
              <Link key={s.slug} href={`/pieces/${s.slug}`} className={styles.siblingCard}>
                <h3>{s.name}</h3>
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
