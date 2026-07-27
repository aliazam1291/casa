import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FLOORS } from "@/lib/rooms";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Rooms — Wolf Casa",
  description: "Thirteen composed rooms across four floors — the product Wolf Casa actually sells, not isolated furniture.",
  alternates: { canonical: "/rooms" },
};

export default function RoomsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/villa-hero.png"
          alt="A layered contemporary living room in a modern Indian home"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>The Product</p>
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
            {floor.rooms.map((room) => (
              <Link key={room.slug} href={`/rooms/${room.slug}`} className={styles.card}>
                <span>{room.eyebrow}</span>
                <h3>{room.name}</h3>
                <p>{room.detail}</p>
                <div className={styles.chips}>
                  {room.materials.slice(0, 3).map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </Link>
            ))}
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
