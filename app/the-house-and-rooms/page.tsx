import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FLOORS } from "@/lib/rooms";
import { ROOM_IMAGES } from "@/lib/library-images";
import { HouseStats, HouseFramework, HouseStandard } from "@/components/editorial/HouseDoctrine";
import { HouseSketch } from "@/components/editorial/HouseSketch";
import { VillaSection } from "@/components/three/villa-section/VillaSection";
import { MaterialsBoard } from "@/components/sections/MaterialsBoard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The House & Rooms — Wolf Casa",
  description:
    "Who Wolf Casa is and what it makes, in one place — the standard we work to, the villa that holds it, and the thirteen composed rooms across four floors.",
  alternates: { canonical: "/the-house-and-rooms" },
};

// Vary aspect ratio per room to create a genuine Pinterest board feel
const RATIOS = ["4/3", "1/1", "4/5", "16/9", "3/4", "4/3"] as const;

/**
 * The House and Rooms, merged — previously /the-house (brand, positioning, the
 * ten rules) and /rooms (the villa, the floors, the thirteen rooms). Both
 * redirect here; see next.config.ts.
 *
 * The order is an argument rather than a concatenation: who we are, then what
 * we believe, then the house that holds it, then the rooms as the proof, then
 * what they are made of. The doctrine deliberately precedes the rooms so the
 * thirteen plates read as evidence for the ten rules instead of a gallery.
 *
 * The dome gallery that used to sit near the top of /rooms now lives on
 * /products, which is a more natural home for it and keeps this page — already
 * long by design — from carrying a heavy drag-interaction set-piece as well.
 */
export default function TheHouseAndRoomsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/villa-hero.webp"
          alt="A warm contemporary Indian residence with crafted materials"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>§ The House &amp; Its Rooms</p>
          <h1>The house, and the thirteen rooms inside it.</h1>
          <p>
            Established 2024, Wolf Casa makes homes through a close relationship with craft, international
            sourcing and the people who live in the rooms. A room is not furnished — it is composed, and
            these are the rooms we have already made.
          </p>
        </div>
      </section>

      <HouseStats />
      <HouseFramework />
      <HouseStandard />

      <HouseSketch />
      {/* The floor plans live inside VillaSection, beside the drawing — the
          standalone <FloorPlans /> repeated the same four plans a screen
          further down. That component is kept for reuse elsewhere. */}
      <VillaSection />

      <section className={styles.roomsIntro}>
        <p className={styles.sectionLabel}>The Thirteen</p>
        <h2>Every rule above, resolved as a room.</h2>
        <p className={styles.roomsIntroBody}>
          Four floors, thirteen compositions. Seating, joinery, lighting, stone and greenery settled as one
          decision rather than assembled from a shelf.
        </p>
      </section>

      {FLOORS.map((floor, floorIdx) => {
        const priorRooms = FLOORS.slice(0, floorIdx).reduce((n, f) => n + f.rooms.length, 0);
        return (
          <section key={floor.name} className={styles.floor}>
            {/* Floor header set as a drawing title block — the same register
                as the FloorPlans blueprint, not a generic heading */}
            <div className={styles.floorHead}>
              <div className={styles.floorTitleBlock}>
                <span className={styles.floorMark}>Wolf Casa · Villa</span>
                <h2>{floor.label}</h2>
                <span className={styles.floorDrawing}>
                  Level {floor.level} · Sheet {String(floorIdx + 1).padStart(2, "0")}/
                  {String(FLOORS.length).padStart(2, "0")}
                </span>
              </div>
              <span className={styles.floorNote}>{floor.note}</span>
            </div>
            <div className={styles.grid}>
              {floor.rooms.map((room, i) => {
                const img = ROOM_IMAGES[room.slug] ?? "/images/editorial/villa-hero.webp";
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
                      {/* Registration ticks — the drawing-plate motif, echoed
                          from every room rectangle on the floor plan */}
                      <svg className={styles.ticks} viewBox="0 0 100 100" aria-hidden preserveAspectRatio="none">
                        <path d="M4 14V4h10 M86 4h10v10 M96 86v10H86 M14 96H4V86" />
                      </svg>
                      <span className={styles.plate}>Plate {String(priorRooms + i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <span>{room.eyebrow}</span>
                      <h3>{room.name}</h3>
                      <p>{room.detail}</p>
                      <div className={styles.chips}>
                        {room.materials.slice(0, 3).map((m) => (
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
        );
      })}

      <MaterialsBoard />

      <section className={styles.note}>
        <p>Legacy is built through care. The people behind the object matter.</p>
        <div className={styles.noteActions}>
          <Link href="/products">See every piece</Link>
          <Link href="/visit">Visit Wolf Casa</Link>
        </div>
      </section>
    </main>
  );
}
