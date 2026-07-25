export const FLOORS = [
  {
    name: 'Underground',
    level: '-1',
    rooms: [
      { name: 'Wine Cellar', wallColor: 0x2a2218, floorColor: 0x3a3025, panelColor: 0x4a3828, accent: 0x8a6a40 },
      { name: 'Material Vault', wallColor: 0x28231c, floorColor: 0x383028, panelColor: 0x483a2a, accent: 0x9a7a50 },
      { name: 'Archive', wallColor: 0x302820, floorColor: 0x3e3428, panelColor: 0x504030, accent: 0x887050 },
    ],
  },
  {
    name: 'Ground Floor',
    level: '0',
    rooms: [
      {
        name: 'Hall', wallColor: 0xede5d5, floorColor: 0xd9cdb8, panelColor: 0x8b7355, accent: 0xc8aa78,
        models: [
          { url: '/models/GlamVelvetSofa.glb', x: -1.2, z: -2.3, ry: 0, w: 3.4 },
          { url: '/models/SheenChair.glb', x: 2.6, z: 0.2, ry: -0.5, w: 1.2 },
          { url: '/models/Lantern.glb', x: -3.9, z: -2.6, ry: 0, h: 2.2 },
        ],
      },
      { name: 'Kitchen', wallColor: 0xe8dfd0, floorColor: 0xddd2be, panelColor: 0x7a6348, accent: 0xb8975a },
      {
        name: 'Living', wallColor: 0xeae2d2, floorColor: 0xd4c8b0, panelColor: 0x9a8060, accent: 0xd4b87a,
        models: [
          { url: '/models/GlamVelvetSofa.glb', x: 1.2, z: -2.3, ry: 0, w: 3.4 },
          { url: '/models/SheenChair.glb', x: -2.6, z: 0.2, ry: 0.5, w: 1.2 },
          { url: '/models/Lantern.glb', x: 3.9, z: -2.6, ry: 0, h: 2.2 },
        ],
      },
      { name: 'Dining', wallColor: 0xe5dcc8, floorColor: 0xd8ccb5, panelColor: 0x8a7050, accent: 0xc09060 },
    ],
  },
  {
    name: 'First Floor',
    level: '+1',
    rooms: [
      { name: 'Master Suite', wallColor: 0xf0e8da, floorColor: 0xddd0ba, panelColor: 0x9a8568, accent: 0xd4b87a },
      { name: 'Bath', wallColor: 0xeee8de, floorColor: 0xe0d8ca, panelColor: 0xa08a70, accent: 0xb8a888 },
      {
        name: 'Study', wallColor: 0xe8e0d0, floorColor: 0xd5c8b0, panelColor: 0x7a6545, accent: 0xc8a870,
        models: [
          { url: '/models/SheenChair.glb', x: 1.2, z: 0.2, ry: 0.3, w: 1.3 },
          { url: '/models/Lantern.glb', x: -3, z: -2.5, ry: 0, h: 2.2 },
        ],
      },
    ],
  },
  {
    name: 'Pop-Up Window',
    level: '+2',
    rooms: [
      { name: 'Gallery', wallColor: 0xf5f0e8, floorColor: 0xe8e0d0, panelColor: 0xb8a888, accent: 0xd4c0a0 },
      { name: 'Terrace', wallColor: 0xf0ece4, floorColor: 0xe0d8cc, panelColor: 0xa89878, accent: 0xc8b898 },
    ],
  },
];

export const ROOM_SPACING = 16;
