import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROOMS, getRoom } from "@/lib/rooms";
import { piecesInRoom } from "@/lib/pieces";
import { getSubtype } from "@/lib/catalogue";
import { ROOM_IMAGES } from "@/lib/library-images";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ROOMS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = getRoom((await params).slug);
  if (!room) return {};
  return {
    title: `${room.name} — Wolf Casa`,
    description: room.detail,
    alternates: { canonical: `/rooms/${room.slug}` },
  };
}

export default async function RoomPage({ params }: Props) {
  const room = getRoom((await params).slug);
  if (!room) notFound();

  const pieces = piecesInRoom(room.slug);
  const categories = Array.from(new Set(pieces.map((p) => `${p.categorySlug}/${p.subtypeSlug}`)))
    .map((key) => getSubtype(...(key.split("/") as [string, string])))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const heroImage = ROOM_IMAGES[room.slug] ?? "/images/editorial/villa-hero.webp";

  return (
    <main className={styles.page}>
      {/* Cinematic full-bleed hero */}
      <section className={styles.hero}>
        <Image src={heroImage} alt={room.detail} fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>{room.eyebrow}</p>
          <h1>{room.name}</h1>
          <p>{room.detail}</p>
          <nav className={styles.heroActions}>
            <Link href={`/?floor=${room.floorIndex}&room=${room.roomIndex}`} className={styles.ctaPrimary}>
              Enter in 3D Walkthrough →
            </Link>
            <Link href="/experiences/consultation" className={styles.ctaSecondary}>
              Compose this room
            </Link>
          </nav>
        </div>
      </section>

      {/* Materials strip */}
      <div className={styles.materialsStrip} aria-label={`${room.name} materials`}>
        <span className={styles.materialLabel}>Material palette</span>
        <div className={styles.materialChips}>
          {room.materials.map((m) => (
            <span key={m} className={styles.chip}>{m}</span>
          ))}
        </div>
      </div>

      {/* Named pieces masonry */}
      {pieces.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>§ What&rsquo;s Inside</span>
            <h2>{pieces.length} named piece{pieces.length === 1 ? "" : "s"}, composed here.</h2>
          </div>
          <div className={styles.pieceGrid}>
            {pieces.map((p, i) => (
              <Link key={p.slug} href={`/pieces/${p.slug}`} className={styles.pieceCard}>
                <span className={styles.pieceNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.name}</h3>
                <p className={styles.pieceMaterials}>{p.materials.join(" · ")}</p>
                <span className={styles.pieceArrow}>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>§ Categories Drawn On</span>
            <h2>What this room is built from.</h2>
          </div>
          <nav className={styles.catList}>
            {categories.map(({ category, subtype }) => (
              <Link key={subtype.slug} href={`/catalogue/${category.slug}/${subtype.slug}`} className={styles.catChip}>
                {subtype.name}
              </Link>
            ))}
          </nav>
        </section>
      )}

      <section className={styles.note}>
        <p>Bring this composition into your own home, adapted to your room&rsquo;s light and proportions.</p>
        <Link href="/experiences/consultation">Begin a consultation</Link>
      </section>
    </main>
  );
}
