import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROOMS, getRoom } from "@/lib/rooms";
import { piecesInRoom } from "@/lib/pieces";
import { getSubtype } from "@/lib/catalogue";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

const HERO_IMAGES = [
  "/images/editorial/light-form-atrium.png",
  "/images/editorial/villa-hero.png",
  "/images/editorial/materials.png",
  "/images/editorial/sojourn.png",
] as const;

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
  const heroImage = HERO_IMAGES[room.floorIndex % HERO_IMAGES.length];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src={heroImage} alt={room.detail} fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>{room.eyebrow}</p>
          <h1>{room.name}</h1>
          <p>{room.detail}</p>
          <nav className={styles.heroActions}>
            <Link href={`/?floor=${room.floorIndex}&room=${room.roomIndex}`}>Step inside in 3D</Link>
            <Link href="/experiences/consultation">Compose this room</Link>
          </nav>
        </div>
      </section>

      <div className={styles.materials} aria-label={`${room.name} materials`}>
        {room.materials.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      {pieces.length > 0 && (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>What&rsquo;s Inside</p>
          <h2>{pieces.length} named piece{pieces.length === 1 ? "" : "s"}, composed here.</h2>
          <div className={styles.pieceGrid}>
            {pieces.map((p) => (
              <Link key={p.slug} href={`/pieces/${p.slug}`} className={styles.pieceCard}>
                <h3>{p.name}</h3>
                <p>{p.materials.join(" · ")}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className={styles.section}>
          <p className={styles.sectionLabel}>Categories Drawn On</p>
          <h2>What this room is built from.</h2>
          <nav className={styles.catList}>
            {categories.map(({ category, subtype }) => (
              <Link key={subtype.slug} href={`/catalogue/${category.slug}/${subtype.slug}`}>
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
