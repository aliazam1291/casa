export const FLOORS = [
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
        pos: { x: 0, y: 0, z: 0, ry: 0 },
        cam: { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.35, tz: -1.5 },
      },
      {
        name: 'Material Vault',
        eyebrow: 'Basement / 02',
        detail: 'A working library of stone, timber and textile samples—the house starts here.',
        materials: ['Nero marble', 'Walnut', 'Hand-loomed textile'],
        wallColor: 0x221d18, floorColor: 0x322822, panelColor: 0x403226, accent: 0xab8854,
        pos: { x: 15, y: 0, z: -4, ry: -0.4 },
        cam: { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.35, tz: -1.5 },
      },
      {
        name: 'Archive',
        eyebrow: 'Basement / 03',
        detail: 'A quiet room for drawings, provenance and the stories behind each chosen object.',
        materials: ['Leather', 'Linen paper', 'Dark timber'],
        wallColor: 0x28201a, floorColor: 0x382d24, panelColor: 0x48382b, accent: 0x987b55,
        pos: { x: -15, y: 0, z: -4, ry: 0.4 },
        cam: { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.35, tz: -1.5 },
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
        pos: { x: 0, y: 0, z: 0, ry: 0 },
        cam: { px: 0, py: 1.65, pz: 6.8, tx: 0, ty: 1.3, tz: -1.5 },
      },
      {
        name: 'Gourmet Kitchen',
        eyebrow: 'Ground floor / 02', detail: 'A sociable kitchen designed around preparation, gathering and the long evening after.', materials: ['Calacatta', 'Dark walnut', 'Brushed metal'],
        wallColor: 0xe6decb, floorColor: 0xddd2c0, panelColor: 0x3a3028, accent: 0xd4af37,
        pos: { x: 15, y: 0, z: -4, ry: -0.4 },
        cam: { px: 0, py: 1.65, pz: 6.8, tx: 0, ty: 1.3, tz: -1.5 },
      },
      {
        name: 'Atrium Living',
        eyebrow: 'Ground floor / 03', detail: 'A gathering room that holds daylight, conversation and the objects that matter.', materials: ['Linen', 'Terracotta velvet', 'Stone'],
        wallColor: 0xebe3d5, floorColor: 0xcfc0aa, panelColor: 0x5c4332, accent: 0xb85d43,
        pos: { x: 0, y: 0, z: -16, ry: 0 },
        cam: { px: 0, py: 1.65, pz: 6.8, tx: 0, ty: 1.3, tz: -1.5 },
      },
      {
        name: 'Courtyard Dining',
        eyebrow: 'Ground floor / 04', detail: 'A hosted table placed between interior calm and the courtyard air.', materials: ['Oak', 'Hand-finished stone', 'Bronze'],
        wallColor: 0xe5dbc8, floorColor: 0xd8caa9, panelColor: 0x5c3d28, accent: 0xc48b4b,
        pos: { x: -15, y: 0, z: -4, ry: 0.4 },
        cam: { px: 0, py: 1.65, pz: 6.8, tx: 0, ty: 1.3, tz: -1.5 },
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
        pos: { x: 0, y: 0, z: 0, ry: 0 },
        cam: { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.3, tz: -1.5 },
      },
      {
        name: 'Spa Bath En-Suite',
        eyebrow: 'First floor / 02', detail: 'A morning ritual in tactile stone, softened by reflected light.', materials: ['Veined stone', 'Brushed brass', 'Fluted glass'],
        wallColor: 0xece4d8, floorColor: 0xd6c5b0, panelColor: 0x8a7868, accent: 0xb8a288,
        pos: { x: 15, y: 0, z: -4, ry: -0.4 },
        cam: { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.3, tz: -1.5 },
      },
      {
        name: 'Executive Study',
        eyebrow: 'First floor / 03', detail: 'A private working room with a generous desk, collected books and material samples.', materials: ['Cognac leather', 'Walnut', 'Linen'],
        wallColor: 0xe4dacb, floorColor: 0xc8b69e, panelColor: 0x3a281c, accent: 0x8a4b28,
        pos: { x: -15, y: 0, z: -4, ry: 0.4 },
        cam: { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.3, tz: -1.5 },
      },
      {
        name: 'Guest Bedroom',
        eyebrow: 'First floor / 04',
        detail: 'A lighter, more welcoming room with a writing desk, reading corner and travel-ready storage.',
        materials: ['Caramel velvet', 'Pale oak', 'Bouclé'],
        wallColor: 0xeae6df, floorColor: 0xd2c5b8, panelColor: 0x5c4a3c, accent: 0x986a3b,
        pos: { x: 0, y: 0, z: -16, ry: 0 },
        cam: { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.3, tz: -1.5 },
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
        pos: { x: 0, y: 0, z: 0, ry: 0 },
        cam: { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.3, tz: -1.5 },
      },
      {
        name: 'Penthouse Terrace',
        eyebrow: 'Sky Pavilion / 02',
        detail: 'An outdoor room designed for slow evenings: firelight, linen and the city beyond.',
        materials: ['Teak', 'Linen', 'Black stone'],
        wallColor: 0xf0ece4, floorColor: 0xdcd0c0, panelColor: 0x7a6854, accent: 0xc8b898,
        pos: { x: 15, y: 0, z: -4, ry: -0.4 },
        // Lower, closer eye-line so the terrace reads across the loungers and
        // fire table to the balustrade and horizon, not down at the paving.
        cam: { px: 0.2, py: 1.32, pz: 5.4, tx: 0, ty: 1.05, tz: -2.0 },
      },
    ],
  },
];


export const ROOM_SPACING = 12;

