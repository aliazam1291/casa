import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATALOGUE, getSubtype } from "@/lib/catalogue";
import { piecesInSubtype } from "@/lib/pieces";
import { ROOMS_BY_SLUG } from "@/lib/rooms";
import styles from "./page.module.css";

type Props = { params: Promise<{ category: string; subtype: string }> };

export function generateStaticParams() {
  return CATALOGUE.flatMap((c) => c.subtypes.map((s) => ({ category: c.slug, subtype: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, subtype: subtypeSlug } = await params;
  const found = getSubtype(categorySlug, subtypeSlug);
  if (!found) return {};
  return {
    title: `${found.subtype.name} — Wolf Casa`,
    description: found.subtype.description,
    alternates: { canonical: `/catalogue/${categorySlug}/${subtypeSlug}` },
  };
}

export default async function SubtypePage({ params }: Props) {
  const { category: categorySlug, subtype: subtypeSlug } = await params;
  const found = getSubtype(categorySlug, subtypeSlug);
  if (!found) notFound();
  const { category, subtype } = found;

  const pieces = piecesInSubtype(category.slug, subtype.slug);
  const rooms = subtype.rooms.map((slug) => ROOMS_BY_SLUG[slug]).filter(Boolean);

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link href="/catalogue">Catalogue</Link>
        <span>/</span>
        <Link href={`/catalogue/${category.slug}`}>{category.name}</Link>
        <span>/</span>
        <span>{subtype.name}</span>
      </nav>
      <section className={styles.hero}>
        <p className={styles.kicker}>{category.name}</p>
        <h1>{subtype.name}.</h1>
        <p>{subtype.description}</p>
      </section>

      {pieces.length > 0 ? (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Named Pieces</p>
          <h2>{pieces.length} piece{pieces.length === 1 ? "" : "s"} in this sub-type.</h2>
          <div className={styles.pieceGrid}>
            {pieces.map((p) => (
              <Link key={p.slug} href={`/pieces/${p.slug}`} className={styles.pieceCard}>
                <span>{ROOMS_BY_SLUG[p.roomSlug]?.name}</span>
                <h3>{p.name}</h3>
                <p>{p.materials.join(" · ")}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <p className={styles.empty}>No named piece from the 3D walkthrough is tagged in this sub-type yet — ask the Architect Hub directly.</p>
      )}

      {rooms.length > 0 && (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Composed Into</p>
          <h2>Rooms that draw on {subtype.name.toLowerCase()}.</h2>
          <nav className={styles.roomList}>
            {rooms.map((room) => (
              <Link key={room.slug} href={`/rooms/${room.slug}`}>{room.name}</Link>
            ))}
          </nav>
        </section>
      )}

      <section className={styles.note}>
        <p>Ready to specify {subtype.name.toLowerCase()} for your own room?</p>
        <Link href="/experiences/consultation">Begin a consultation</Link>
      </section>
    </main>
  );
}
