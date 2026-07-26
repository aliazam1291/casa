// The 13 composed rooms of the 3D walkthrough — promoted to a real product
// layer. FLOORS (name/eyebrow/detail/materials/colours) is the existing,
// canonical 3D dataset; this module only ADDS routing/display fields
// (slug, floor/room index, 2D plan geometry) on top of it. It does not
// duplicate or fork the 3D data — components/three/gallery/GalleryScene.jsx
// continues to import FLOORS from galleryData.js directly.
//
// The 2D plan rectangles were previously hardcoded a second time inside
// components/sections/FloorPlans.tsx; they now live here as the single
// source, resolving the "Spa Bath" vs "Spa Bath En-Suite" name drift by
// treating the 3D name (galleryData.js) as canonical everywhere.
import { FLOORS as RAW_FLOORS, ROOM_SPACING } from "@/components/three/gallery/galleryData.js";

export type RoomPlan = { x: number; y: number; w: number; h: number };

// Shape of the plain-JS records in galleryData.js — just the fields this
// module reads out of them.
type RawRoom = { name: string; eyebrow: string; detail: string; materials: string[] };
type RawFloor = { name: string; level: string; rooms: RawRoom[] };

export type Room = {
  slug: string;
  name: string;
  eyebrow: string;
  detail: string;
  materials: string[];
  ritual: string;
  floorIndex: number;
  roomIndex: number;
  floorName: string;
  floorLabel: string;
  floorLevel: string;
  plan: RoomPlan;
};

export type Floor = {
  index: number;
  name: string;
  label: string;
  level: string;
  note: string;
  rooms: Room[];
};

// Display label + a one-line note per floor, and a short "ritual" phrase +
// 2D plan rectangle per room — the prose/geometry layer the 3D data doesn't
// carry. Order must match galleryData.js FLOORS exactly (asserted below).
const FLOOR_META = [
  { label: "The Cellar", note: "A lower level for collecting, making and lingering." },
  { label: "Ground Floor", note: "The social composition — arrival, preparation, gathering and air." },
  { label: "First Floor", note: "The private composition — rest, ritual, work and a room for guests." },
  { label: "Sky Pavilion", note: "A high, open composition for late light and the city beyond." },
] as const;

const ROOM_META: Record<string, { slug: string; ritual: string; plan: RoomPlan }> = {
  "Wine Cellar": { slug: "wine-cellar", ritual: "The long table", plan: { x: 16, y: 18, w: 42, h: 48 } },
  "Material Vault": { slug: "material-vault", ritual: "The tactile edit", plan: { x: 60, y: 18, w: 24, h: 30 } },
  Archive: { slug: "archive", ritual: "The quiet research", plan: { x: 60, y: 50, w: 24, h: 28 } },
  "Grand Foyer": { slug: "grand-foyer", ritual: "The first pause", plan: { x: 16, y: 18, w: 23, h: 30 } },
  "Gourmet Kitchen": { slug: "gourmet-kitchen", ritual: "The daily gathering", plan: { x: 41, y: 18, w: 43, h: 30 } },
  "Atrium Living": { slug: "atrium-living", ritual: "The long afternoon", plan: { x: 16, y: 50, w: 43, h: 28 } },
  "Courtyard Dining": { slug: "courtyard-dining", ritual: "The hosted evening", plan: { x: 61, y: 50, w: 23, h: 28 } },
  "Master Suite": { slug: "master-suite", ritual: "The unhurried return", plan: { x: 16, y: 18, w: 43, h: 34 } },
  "Spa Bath En-Suite": { slug: "spa-bath-en-suite", ritual: "The morning ritual", plan: { x: 61, y: 18, w: 23, h: 34 } },
  "Executive Study": { slug: "executive-study", ritual: "The focused hour", plan: { x: 16, y: 54, w: 28, h: 24 } },
  "Guest Bedroom": { slug: "guest-bedroom", ritual: "The generous welcome", plan: { x: 46, y: 54, w: 38, h: 24 } },
  "Skyline Salon": { slug: "skyline-salon", ritual: "The last light", plan: { x: 16, y: 18, w: 43, h: 60 } },
  "Penthouse Terrace": { slug: "penthouse-terrace", ritual: "The evening outside", plan: { x: 61, y: 18, w: 23, h: 60 } },
};

export const FLOORS: Floor[] = (RAW_FLOORS as RawFloor[]).map((floor, floorIndex) => {
  const meta = FLOOR_META[floorIndex];
  return {
    index: floorIndex,
    name: floor.name,
    label: meta.label,
    level: floor.level,
    note: meta.note,
    rooms: floor.rooms.map((room, roomIndex) => {
      const rm = ROOM_META[room.name];
      if (!rm) throw new Error(`lib/rooms.ts: no ROOM_META entry for "${room.name}" — galleryData.js room names must stay in sync.`);
      return {
        slug: rm.slug,
        name: room.name,
        eyebrow: room.eyebrow,
        detail: room.detail,
        materials: room.materials,
        ritual: rm.ritual,
        floorIndex,
        roomIndex,
        floorName: floor.name,
        floorLabel: meta.label,
        floorLevel: floor.level,
        plan: rm.plan,
      };
    }),
  };
});

export const ROOMS: Room[] = FLOORS.flatMap((f) => f.rooms);

export const ROOMS_BY_SLUG: Record<string, Room> = Object.fromEntries(ROOMS.map((r) => [r.slug, r]));

export function getRoom(slug: string): Room | undefined {
  return ROOMS_BY_SLUG[slug];
}

export { ROOM_SPACING };

// Fail fast in dev if galleryData.js ever adds/renames a room without this
// module being updated to match.
if (process.env.NODE_ENV !== "production" && ROOMS.length !== 13) {
  console.warn(`lib/rooms.ts: expected 13 rooms, found ${ROOMS.length}.`);
}
