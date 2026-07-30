import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_UNIVERSE, UNIVERSE_ITEMS } from "@/lib/product-universe";
import { STOCK_PIECES } from "@/lib/products";
import { getRoom } from "@/lib/rooms";
import { MATERIAL_IMAGES } from "@/lib/library-images";
import Image from "next/image";
import { DomeGallery } from "@/components/sections/DomeGallery";
import { GalleryWall } from "@/components/sections/GalleryWall";
import { MaterialIndex } from "@/components/sections/MaterialIndex";
import { OwnedIPBand } from "@/components/sections/OwnedIPBand";
import { MoodBoard, type MoodTile } from "@/components/sections/MoodBoard";
import styles from "./page.module.css";

// Hand-placed, overlapping, tilted — the opposite of the card grids elsewhere.
//
// GREW FROM FOUR TO ELEVEN. The old note here said the board was stuck at four
// tiles because only four photographs were "unclaimed" by another page. That
// was the one-photograph-one-owner rule read too literally — see the revised
// note in lib/library-images.ts. What it produced was a studio board with four
// things pinned to it, which is not a board.
//
// The eleven are the showroom, catalogue and editorial sets plus the one
// material close-up (textile) that belongs to no piece pool — i.e. every
// photograph the site owns that the rotunda and the wall further up THIS page
// do not already hang. Cross-page reuse is fine (see library-images.ts); the
// same picture twice on one page is not, and that constraint is what picked
// this set rather than the obvious composition shots.
//
// POSITIONS ARE CHECKED, NOT GUESSED. On a 16/9 board a tile's height as a
// percentage of board height is w × (ratioH / ratioW) × 16/9 — so the 19%-wide
// 3/4 print below is 45% tall, and its y must stay under ~50 to sit on the
// board. Every y + height here lands under 95.
const MOOD_TILES: MoodTile[] = [
  // Upper run
  { src: MATERIAL_IMAGES.textile, alt: "Woven textile at close range", label: "Cloth", x: 1, y: 5, w: 19, rotate: -3.5, ratio: "4 / 5" },
  { src: "/images/showroom/dining-marble-mirror.webp", alt: "Marble dining surface against a mirrored wall", label: "Marble", x: 19, y: 2, w: 16, rotate: 2.4, ratio: "1 / 1" },
  { src: "/images/editorial/materials.webp", alt: "Curated material samples laid out together", label: "Swatches", x: 34, y: 7, w: 20, rotate: -1.6, ratio: "3 / 4" },
  { src: "/images/showroom/living-lounge-brass.webp", alt: "A lounge composition with brass detailing", label: "Brass", x: 53, y: 3, w: 17, rotate: 3.2, ratio: "4 / 5" },
  { src: "/images/catalogue/seating-sofas.webp", alt: "A tailored sofa in a composed living room", label: "Seating", x: 69, y: 7, w: 18, rotate: -2.6, ratio: "1 / 1" },
  { src: "/images/catalogue/bespoke-interiors-beds.webp", alt: "An upholstered platform bed", label: "Joinery", x: 84, y: 2, w: 14, rotate: 2.9, ratio: "4 / 5" },
  // Lower run
  { src: "/images/showroom/dining-room-mirrorwall.webp", alt: "A composed dining room with a mirrored feature wall", label: "Reflection", x: 5, y: 47, w: 17, rotate: 3.6, ratio: "1 / 1" },
  { src: "/images/showroom/living-room-sectional.webp", alt: "A deep sectional anchoring a living room", label: "Volume", x: 22, y: 53, w: 16, rotate: -2.2, ratio: "4 / 5" },
  { src: "/images/showroom/dining-set-black-gold.webp", alt: "A dining set in black and gold under low light", label: "Dusk", x: 38, y: 49, w: 19, rotate: 2.1, ratio: "3 / 4" },
  { src: "/images/editorial/sojourn.webp", alt: "A sourcing journey through makers and material", label: "Sourcing", x: 57, y: 44, w: 17, rotate: -3.1, ratio: "4 / 5" },
  { src: "/images/showroom/bedroom-suite-warm.webp", alt: "A warm bedroom suite with layered textiles", label: "Warmth", x: 75, y: 48, w: 20, rotate: 1.9, ratio: "1 / 1" },
];

export const metadata: Metadata = {
  title: "The Interio Mall — Wolf Casa",
  description:
    "The shop as a gallery: every Wolf Casa piece hung, lit and turned — plus the twenty parts a room is composed from, and what is on the Indore floor this week.",
  alternates: { canonical: "/shop" },
};

/**
 * THE INTERIO MALL — the book's own name for the format: "every category of the
 * room, under one roof" (§10, The IP System).
 *
 * This replaces BOTH /products and /catalogue, which is the fix for the real
 * complaint: Rooms, All Pieces and By Category were three different taxonomies
 * (13 rooms / 43 pieces / 8 invented categories) all drawing on the same pool
 * of 38 library photographs and all rendered as the same image-card grid, so
 * they were indistinguishable. STOCK_PIECES was literally rendered on two of
 * them.
 *
 * NOW LED BY IMAGERY, AND STAGED AS A GALLERY. The first cut of this page was a
 * purely typographic index, on the reasoning that a third grid of the same
 * photographs is what made the site repetitive. That reasoning was right about
 * the *grid* and wrong about the *photographs*: the fix for three identical
 * card grids is one gallery, not zero images. So the page now opens on the
 * rotunda and the wall — two image-led rooms that share nothing with any other
 * page's visual language — and the twenty-part index follows as the catalogue
 * you consult after walking the show, not the thing you are handed at the door.
 *
 * Three pages, three visual languages, one photograph in one place:
 *   /the-house-and-rooms — the thirteen room plates
 *   /the-wolf-way        — the eight compositions, full bleed
 *   /shop                — the twenty-five piece photographs, hung and turned
 *
 * The hero is deliberately still typographic. A gallery's entrance wall carries
 * the title of the show and nothing else; putting a photograph there would also
 * mean claiming a twenty-sixth image this page does not have.
 */
export default function ShopPage() {
  return (
    <main className={`${styles.page} territory-saddle`}>
      <section className={styles.hero}>
        <span className={styles.accentRule} aria-hidden />
        <p className={styles.kicker}>The Interio Mall</p>
        <h1>
          Every category of the room,
          <em> under one roof.</em>
        </h1>
        <p className={styles.heroBody}>
          A sofa alone is inventory. So this is hung as a gallery, not stacked as a shelf — turn the
          rotunda, walk the wall, and the index is at the back when you want the parts list.
        </p>
        <div className={styles.heroMeta}>
          <span>{UNIVERSE_ITEMS.length} parts</span>
          <span>{PRODUCT_UNIVERSE.length} stages</span>
          <span>One decision</span>
        </div>
        <div className={styles.heroJump}>
          <Link href="#dome-gallery">The rotunda</Link>
          <Link href="#the-wall">The wall</Link>
          <Link href="#materials">The materials</Link>
          <Link href="#the-index">The index</Link>
        </div>
      </section>

      {/* The rotunda — the piece photographs, turned. This is the page's one
          heavy interaction, and it is first because it is the reason to be here. */}
      <DomeGallery
        kicker="Room one — the rotunda"
        heading={
          <>
            Fourteen pieces, <em>turned into the light.</em>
          </>
        }
        sub="Drag the ring, or walk it with the arrow keys. Every plate takes its moment at the front, and colours the room while it is there."
      />

      {/* The wall — the same pool, hung flat. Two ways of looking at one body of
          work, which is what a gallery does with a collection. */}
      <GalleryWall />

      {/* The material library — every material the house specifies, and the
          pieces made of each. See components/sections/MaterialIndex.tsx for why
          this is breadth where /the-house-and-rooms' MaterialsBoard is depth. */}
      <MaterialIndex />

      <OwnedIPBand />

      {/* ── The index ────────────────────────────────────────────────────────
          The twenty parts, as a ledger rather than a fourth photo grid. It was
          five stacked full-height sections; it is now one section with five
          movements inside it, so consulting the parts list does not cost more
          scroll than the gallery it belongs to. */}
      <section className={styles.indexSection} id="the-index">
        <div className={styles.indexHead}>
          <span className={styles.kicker}>The index</span>
          <h2>
            Twenty parts, <em>in the order they get decided.</em>
          </h2>
          <p>The last one is the only thing we actually sell.</p>
        </div>

        {PRODUCT_UNIVERSE.map((group, gi) => (
          <div key={group.slug} className={styles.group}>
            <div className={styles.groupHead}>
              <span className={styles.groupNum}>{String(gi + 1).padStart(2, "0")}</span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.note}</p>
              </div>
            </div>

            <ol className={styles.index}>
              {group.items.map((item) => {
                const isTheRoom = item.slug === "the-room";
                return (
                  <li key={item.slug} className={isTheRoom ? styles.rowFinal : styles.row}>
                    <span className={styles.rowName}>{item.name}</span>
                    <span className={styles.rowRole}>{item.role}</span>
                    <span className={styles.rowRooms}>
                      {isTheRoom ? (
                        <Link href="/the-house-and-rooms#the-rooms" className={styles.rowLink}>
                          See all thirteen &rarr;
                        </Link>
                      ) : (
                        item.rooms.slice(0, 2).map((slug) => {
                          const room = getRoom(slug);
                          if (!room) return null;
                          return (
                            <Link key={slug} href={`/rooms/${slug}`} className={styles.rowLink}>
                              {room.name}
                            </Link>
                          );
                        })
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </section>

      <section className={styles.stock} aria-label="Currently in stock">
        <div className={styles.stockHead}>
          <span className={styles.kicker}>On the floor now</span>
          <h2>The part you can take home today.</h2>
          <p>
            Accent seating on the Indore floor this week — priced, in stock, and the one place on this site
            with a number attached.
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

      <MoodBoard
        tiles={MOOD_TILES}
        label="The board"
        heading={<>Not a catalogue. <em>A board.</em></>}
        body="How a room gets decided — swatches, joinery, a corner of stone, pinned up and argued over. Pick one up to bring it to the front."
      />

      <section className={styles.note}>
        <p>A sofa alone is inventory. A composed room is desire.</p>
        <div className={styles.noteActions}>
          <Link href="/the-wolf-way">The eight compositions</Link>
          <Link href="/the-house-and-rooms">The thirteen rooms</Link>
        </div>
      </section>
    </main>
  );
}
