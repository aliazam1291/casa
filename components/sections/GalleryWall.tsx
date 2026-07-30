"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { PIECES } from "@/lib/pieces";
import { FLOORS, getRoom } from "@/lib/rooms";
import { COMPOSITIONS } from "@/lib/compositions";
import { getPieceImage, ROOM_IMAGES } from "@/lib/library-images";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./GalleryWall.module.css";

/**
 * Brand Book §08 — the wall walks Brass / Walnut / Green / Saddle / Sand
 * rather than lighting every plate the same brass. The hue only ever appears
 * as the hairline under a lit plate and the label rule; the photograph itself
 * is never tinted.
 */
const TONES = ["#a78657", "#c9a87e", "#7d9682", "#c98a5e", "#c9bda6"] as const;

/**
 * A salon hang is uneven by definition — a wall of identical rectangles is a
 * product grid, which is exactly what the book says this is not. The sequence
 * is deliberately not periodic against the three-column layout so no two
 * columns align into a stripe.
 */
const RATIOS = ["4/5", "1/1", "3/4", "4/3", "5/7", "1/1", "4/5", "16/11", "3/4"] as const;

type Room = "all" | "compositions" | "pieces" | "rooms";

type Plate = {
  key: string;
  href: string;
  src: string;
  /** The name as hung — Italian/German for a piece, the book's name otherwise. */
  name: string;
  lang?: "it" | "de";
  /** English gloss / where it sits. Also the image's alt text. */
  sub: string;
  room: Exclude<Room, "all">;
  cursor: string;
};

/**
 * EVERYTHING THE HOUSE HAS PHOTOGRAPHED, on one wall.
 *
 * The first cut hung only the piece pool — 22 plates — and that was the wrong
 * read of the "one photograph, one owner" rule in lib/library-images.ts. That
 * rule exists because /rooms, /pieces and /catalogue were three near-identical
 * CARD GRIDS built from one pool, so the three pages were indistinguishable.
 * It was never about a photograph appearing twice on the site; it was about two
 * pages looking the same.
 *
 * This wall is not a card grid — dimmed until hovered, salon-hung, uneven,
 * label-on-light-only — and it shares its visual language with nothing else.
 * So it can hang all three pools, which is the only way "the shop is a gallery"
 * is true rather than decorative:
 *
 *   8 compositions — the named moods, at full bleed
 *   22 pieces      — the objects, one photograph each
 *   13 rooms       — the villa the method has already built
 *
 * The four showroom/catalogue photographs are deliberately NOT here: the mood
 * board further down this same page pins those, and duplicating a photograph
 * within one page is the failure the rule was actually about.
 */
function hangTheWall(): Plate[] {
  const plates: Plate[] = [];

  for (const c of COMPOSITIONS) {
    plates.push({
      key: `c-${c.slug}`,
      href: `/the-wolf-way#${c.slug}`,
      src: c.img,
      name: c.name,
      sub: c.materials.join(" · "),
      room: "compositions",
      cursor: "Read",
    });
  }

  // One photograph, one plate. lib/library-images.ts maps many pieces onto the
  // same pool, so walking PIECES naively hangs the same picture five times;
  // the first piece to claim a photograph keeps it.
  const seen = new Set<string>();
  PIECES.forEach((piece, i) => {
    const src = getPieceImage(piece.slug, i);
    if (seen.has(src)) return;
    seen.add(src);
    plates.push({
      key: `p-${piece.slug}`,
      href: `/pieces/${piece.slug}`,
      src,
      name: piece.name,
      lang: piece.lang,
      sub: `${piece.subtitle} · ${getRoom(piece.roomSlug)?.name ?? ""}`,
      room: "pieces",
      cursor: "View",
    });
  });

  for (const floor of FLOORS) {
    for (const room of floor.rooms) {
      const src = ROOM_IMAGES[room.slug];
      if (!src) continue;
      plates.push({
        key: `r-${room.slug}`,
        href: `/rooms/${room.slug}`,
        src,
        name: room.name,
        sub: `${room.eyebrow} · ${floor.label}`,
        room: "rooms",
        cursor: "Enter",
      });
    }
  }

  return plates;
}

const ROOMS: { id: Room; label: string }[] = [
  { id: "all", label: "The whole wall" },
  { id: "compositions", label: "Compositions" },
  { id: "pieces", label: "Pieces" },
  { id: "rooms", label: "Rooms" },
];

/**
 * THE WALL — the shop as a modern-art gallery: photographs hung, nothing else.
 * No price, no spec, no card chrome. Plates sit dimmed and desaturated at rest
 * so the wall reads as one composed surface; the one under the cursor comes up
 * to full light and takes its label, and everything else drops further back.
 *
 * That last part is the whole interaction and it is why the section tracks a
 * `hovered` key rather than doing this in pure CSS: `:hover` can light the
 * plate you are on, but it cannot dim its forty neighbours.
 */
export function GalleryWall() {
  const plates = useMemo(() => hangTheWall(), []);
  const [room, setRoom] = useState<Room>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();

  const shown = useMemo(
    () => (room === "all" ? plates : plates.filter((p) => p.room === room)),
    [plates, room]
  );

  const count = (id: Room) => (id === "all" ? plates.length : plates.filter((p) => p.room === id).length);

  return (
    <section className={styles.wall} id="the-wall" aria-label="The wall — everything the house has photographed">
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.label}>The wall</span>
        <h2>
          No shelves. <em>A hang.</em>
        </h2>
        <p>
          {plates.length} plates — every composition, every piece and every room the house has
          photographed, lit one at a time. Look at whichever one holds you; the rest steps back while you
          do.
        </p>
      </div>

      {/* Rooms of the show. A wall this size needs a way to walk one wing of it
          — and the counts are the honest answer to "how much is here". */}
      <Tabs.Root
        value={room}
        onValueChange={(v) => setRoom(v as Room)}
        activationMode="automatic"
        className={styles.rooms}
      >
        <Tabs.List className={styles.roomsList} aria-label="Filter the wall">
          {ROOMS.map((r) => (
            <Tabs.Trigger
              key={r.id}
              value={r.id}
              className={styles.roomsTab}
              onMouseEnter={() => setCursor("hover", r.label)}
              onMouseLeave={resetCursor}
            >
              {r.label}
              <i>{count(r.id)}</i>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <div
        className={`${styles.hang} ${hovered !== null ? styles.hangFocused : ""}`}
        onMouseLeave={() => setHovered(null)}
      >
        {shown.map((plate, i) => (
          <Link
            key={plate.key}
            href={plate.href}
            className={`${styles.plate} ${hovered === plate.key ? styles.plateLit : ""}`}
            style={
              {
                "--ratio": RATIOS[i % RATIOS.length],
                "--tone": TONES[i % TONES.length],
              } as React.CSSProperties
            }
            onMouseEnter={() => {
              setHovered(plate.key);
              setCursor("hover", plate.cursor);
            }}
            onMouseLeave={resetCursor}
            onFocus={() => setHovered(plate.key)}
            onBlur={() => setHovered(null)}
          >
            <div className={styles.plateImage}>
              <Image
                src={plate.src}
                alt={plate.sub}
                fill
                loading="lazy"
                sizes="(max-width: 720px) 92vw, (max-width: 1180px) 46vw, 30vw"
              />
            </div>
            <span className={styles.plateLabel}>
              <i aria-hidden>{String(i + 1).padStart(2, "0")}</i>
              <strong lang={plate.lang}>{plate.name}</strong>
              <em>{plate.sub}</em>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
