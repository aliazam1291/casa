import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FLOORS } from "@/lib/rooms";
import { ROOM_IMAGES } from "@/lib/library-images";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Rooms — Wolf Casa",
  description: "Thirteen composed rooms across four floors — the product Wolf Casa actually sells, not isolated furniture.",
  alternates: { canonical: "/rooms" },
};

// Vary aspect ratio per room to create a genuine Pinterest board feel
const RATIOS = ["4/3", "1/1", "4/5", "16/9", "3/4", "4/3"] as const;

export default function RoomsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/library/907b2059801f80acad604dc4703980a4.jpg"
          alt="A layered contemporary living room, composed as one decision"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>§ The Product</p>
          <h1>Thirteen composed rooms.</h1>
          <p>A room is not furnished. It is composed — seating, joinery, lighting, stone and greenery resolved as one decision. These are the rooms Wolf Casa has already made.</p>
        </div>
      </section>

      {FLOORS.map((floor) => (
        <section key={floor.name} className={styles.floor}>
          <div className={styles.floorHead}>
            <h2>{floor.label}</h2>
            <span>{floor.level} · {floor.note}</span>
          </div>
          <div className={styles.grid}>
            {floor.rooms.map((room, i) => {
              const img = ROOM_IMAGES[room.slug] ?? "/images/editorial/villa-hero.png";
              const ratio = RATIOS[i % RATIOS.length];
              return (
                <Link key={room.slug} href={`/rooms/${room.slug}`} className={styles.card}>
                  <div className={styles.cardThumb} style={{ aspectRatio: ratio }}>
                    <Image
                      src={img}
                      alt={room.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 720px) 96vw, (max-width: 1100px) 48vw, 30vw"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <span>{room.eyebrow}</span>
                    <h3>{room.name}</h3>
                    <p>{room.detail}</p>
                    <div className={styles.chips}>
                      {room.materials.slice(0, 3).map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className={styles.note}>
        <p>Every room draws on the same eight categories — seating, kitchen &amp; bath, lighting, doors, décor, office &amp; outdoor, greenery, bespoke interiors.</p>
        <Link href="/catalogue">Browse the catalogue</Link>
      </section>
    </main>
  );
}
