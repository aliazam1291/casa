// Per-room cameras. Two rules, both of which the old data broke:
//
// 1. INSIDE the room. Every camera sat at pz 6.5 with the room only 10 deep, so
//    the eye was 1.5 units PAST the front edge — looking into a box from
//    outside it. Nothing framed that way can feel like standing in a house.
//    These all sit at pz 2.9-3.9, within the room.
//
// 2. OFF the centre line. Twelve of thirteen rooms used px: 0 at the same
//    height and distance, which framed every one as a flat, symmetrical
//    elevation — the reason the rooms read as interchangeable. Each is now a
//    three-quarter view so two walls are visible, the offset alternates side
//    room to room so consecutive rooms never repeat a framing, and the eye
//    height suits the room: standing in the foyer (1.62), seated in the living
//    room and study (1.20ish), lower in the bedrooms, higher over the dining
//    table to show its surface.
//
// tx/tz aim at each room's actual subject — the wine wall, the kitchen island,
// the bed — not at the geometric centre.

const FLOOR_DATA = [
  {
    name: 'Underground',
    level: '-1',
    rooms: [
      {
        name: 'Wine Cellar',
        eyebrow: 'Basement / 01',
        detail: 'A private tasting room with archive bottles, aged oak and a low-lit walnut table.',
        materials: ['Smoked oak', 'Blackened brass', 'Bottle glass'],
        wallColor: 0x1c1713, floorColor: 0x2b2520, panelColor: 0x382c22, accent: 0x9a7440,
        cam: { px: 2.4,  py: 1.42, pz: 3.4, tx: -1.6, ty: 1.30, tz: -4.2 },
      },
      {
        name: 'Material Vault',
        eyebrow: 'Basement / 02',
        detail: 'A working library of stone, timber and textile samples—the house starts here.',
        materials: ['Nero marble', 'Walnut', 'Hand-loomed textile'],
        wallColor: 0x221d18, floorColor: 0x322822, panelColor: 0x403226, accent: 0xab8854,
        cam: { px: -2.6, py: 1.55, pz: 3.2, tx: 1.4,  ty: 1.35, tz: -4.0 },
      },
      {
        name: 'Archive',
        eyebrow: 'Basement / 03',
        detail: 'A quiet room for drawings, provenance and the stories behind each chosen object.',
        materials: ['Leather', 'Linen paper', 'Dark timber'],
        wallColor: 0x28201a, floorColor: 0x382d24, panelColor: 0x48382b, accent: 0x987b55,
        cam: { px: 2.2,  py: 1.18, pz: 2.9, tx: -1.2, ty: 1.05, tz: -3.6 },
      },
    ],
  },
  {
    name: 'Ground Floor',
    level: '0',
    rooms: [
      {
        name: 'Grand Foyer',
        eyebrow: 'Ground floor / 01', detail: 'A measured arrival: stone, art and one gesture of light.', materials: ['Travertine', 'Walnut', 'Brass'],
        wallColor: 0xede6da, floorColor: 0xd6c8b4, panelColor: 0x6e523c, accent: 0xcbb082,
        cam: { px: -1.4, py: 1.62, pz: 3.9, tx: 1.0,  ty: 1.30, tz: -4.2 },
      },
      {
        name: 'Gourmet Kitchen',
        eyebrow: 'Ground floor / 02', detail: 'A sociable kitchen designed around preparation, gathering and the long evening after.', materials: ['Calacatta', 'Dark walnut', 'Brushed metal'],
        wallColor: 0xe6decb, floorColor: 0xddd2c0, panelColor: 0x3a3028, accent: 0xd4af37,
        cam: { px: 2.9,  py: 1.50, pz: 3.3, tx: -1.8, ty: 1.10, tz: -3.4 },
      },
      {
        name: 'Atrium Living',
        eyebrow: 'Ground floor / 03', detail: 'A gathering room that holds daylight, conversation and the objects that matter.', materials: ['Linen', 'Terracotta velvet', 'Stone'],
        wallColor: 0xebe3d5, floorColor: 0xcfc0aa, panelColor: 0x5c4332, accent: 0xb85d43,
        cam: { px: -2.8, py: 1.22, pz: 3.6, tx: 1.2,  ty: 0.95, tz: -3.0 },
      },
      {
        name: 'Courtyard Dining',
        eyebrow: 'Ground floor / 04', detail: 'A hosted table placed between interior calm and the courtyard air.', materials: ['Oak', 'Hand-finished stone', 'Bronze'],
        wallColor: 0xe5dbc8, floorColor: 0xd8caa9, panelColor: 0x5c3d28, accent: 0xc48b4b,
        cam: { px: 2.3,  py: 1.72, pz: 3.5, tx: -1.0, ty: 1.05, tz: -3.4 },
      },
    ],
  },
  {
    name: 'First Floor',
    level: '+1',
    rooms: [
      {
        name: 'Master Suite',
        eyebrow: 'First floor / 01',
        detail: 'A deeply layered retreat: a sculptural bed, dressing wall and a fireside reading place.',
        materials: ['Terracotta velvet', 'Nero marble', 'Dark walnut'],
        wallColor: 0xf5efe4, floorColor: 0xd8c5ae, panelColor: 0x7c6048, accent: 0xc8aa74,
        cam: { px: -2.7, py: 1.28, pz: 3.4, tx: 1.1,  ty: 0.90, tz: -3.6 },
      },
      {
        name: 'Spa Bath En-Suite',
        eyebrow: 'First floor / 02', detail: 'A morning ritual in tactile stone, softened by reflected light.', materials: ['Veined stone', 'Brushed brass', 'Fluted glass'],
        wallColor: 0xece4d8, floorColor: 0xd6c5b0, panelColor: 0x8a7868, accent: 0xb8a288,
        cam: { px: 2.1,  py: 1.46, pz: 3.1, tx: -1.5, ty: 1.10, tz: -3.8 },
      },
      {
        name: 'Executive Study',
        eyebrow: 'First floor / 03', detail: 'A private working room with a generous desk, collected books and material samples.', materials: ['Cognac leather', 'Walnut', 'Linen'],
        wallColor: 0xe4dacb, floorColor: 0xc8b69e, panelColor: 0x3a281c, accent: 0x8a4b28,
        cam: { px: -2.4, py: 1.20, pz: 3.0, tx: 1.3,  ty: 1.00, tz: -3.7 },
      },
      {
        name: 'Guest Bedroom',
        eyebrow: 'First floor / 04',
        detail: 'A lighter, more welcoming room with a writing desk, reading corner and travel-ready storage.',
        materials: ['Caramel velvet', 'Pale oak', 'Bouclé'],
        wallColor: 0xeae6df, floorColor: 0xd2c5b8, panelColor: 0x5c4a3c, accent: 0x986a3b,
        cam: { px: 2.6,  py: 1.34, pz: 3.5, tx: -1.2, ty: 0.95, tz: -3.6 },
      },
    ],
  },
  {
    name: 'Sky Pavilion',
    level: '+2',
    rooms: [
      {
        name: 'Skyline Salon',
        eyebrow: 'Sky Pavilion / 01',
        detail: 'A glass-edged salon for late light, conversation and an uninterrupted horizon.',
        materials: ['Bouclé', 'Honed marble', 'Champagne brass'],
        wallColor: 0xf5f0e8, floorColor: 0xe2d6c4, panelColor: 0x8a7660, accent: 0xd4c0a0,
        cam: { px: -2.2, py: 1.16, pz: 3.8, tx: 1.6,  ty: 1.25, tz: -4.4 },
      },
      {
        name: 'Penthouse Terrace',
        eyebrow: 'Sky Pavilion / 02',
        detail: 'An outdoor room designed for slow evenings: firelight, linen and the city beyond.',
        materials: ['Teak', 'Linen', 'Black stone'],
        wallColor: 0xf0ece4, floorColor: 0xdcd0c0, panelColor: 0x7a6854, accent: 0xc8b898,
        cam: { px: 2.0,  py: 1.30, pz: 3.4, tx: -1.4, ty: 1.05, tz: -4.0 },
      },
    ],
  },
];

// EXACTLY the room width from buildRoom.js (W = 12), which is what makes a
// floor read as one building. Rooms butt up wall-to-wall, so floors, ceilings
// and back walls run continuously from one end of the floor to the other, and
// each room's open side becomes a threshold into its neighbour.
//
// This is not a spacing preference — buildRoom() is built on the assumption.
// It gives a room a LEFT wall only at roomIndex 0 and a RIGHT wall only at the
// last index; every interior room is deliberately open-sided. Any spacing
// other than W leaves those openings looking into empty space, which is why
// the floors used to read as detached dioramas rather than a house. If W ever
// changes in buildRoom.js, this has to change with it.
export const ROOM_SPACING = 12;

/**
 * Room positions are DERIVED from index, not hand-authored, so that
 * "index order == left-to-right on screen" is an invariant the data cannot
 * drift away from.
 *
 * It had drifted badly: the old hand-written positions put index 1 at x=+15 and
 * index 2 at x=-15, scattering rooms around a centre point. Two things broke.
 * Pressing the RIGHT arrow to go from room 2 to room 3 swung the camera 30
 * units LEFT — the arrows contradicted the motion for most of every floor. And
 * the 3-unit gaps between shells exposed the open sides, so a floor looked like
 * separate boxes floating in the dark instead of one continuous house.
 *
 * A single straight run, no bow and no yaw: a bowed or angled row cannot butt
 * wall-to-wall, and the moment there is a seam the illusion of one building is
 * gone.
 *
 * The real floor plans are unaffected: those live in lib/rooms.ts as RoomPlan
 * rectangles and are what FloorPlans/VillaSection draw. `pos` here is only
 * where each room's 3D shell is staged in world space.
 */
export const FLOORS = FLOOR_DATA.map((floor) => ({
  ...floor,
  rooms: floor.rooms.map((room, i) => {
    const offset = i - (floor.rooms.length - 1) / 2;
    return {
      ...room,
      pos: { x: offset * ROOM_SPACING, y: 0, z: 0, ry: 0 },
    };
  }),
}));
