/**
 * The five Worlds — lifted verbatim from wolf-casa-homepage-v3.html's
 * WORLDS array (~line 629). Accent/emissive hexes match Design_System_v3.md §2.
 */
export type World = {
  name: string;
  desc: string;
  img: string;
  accent: number;
  emissive: number;
};

export const WORLDS: World[] = [
  {
    name: "The Heirloom Way",
    desc: "Modern heritage, permanence, inheritance.",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=85",
    accent: 0xc9963f,
    emissive: 0x3a2410,
  },
  {
    name: "The Low House Way",
    desc: "Grounded living, horizontal calm, close to the earth.",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2400&q=85",
    accent: 0x8b4a34,
    emissive: 0x2c1610,
  },
  {
    name: "The Courtyard Way",
    desc: "Air, light, stone, water. The home breathes here.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85",
    accent: 0x6e7a5c,
    emissive: 0x1e2418,
  },
  {
    name: "The Monastic Way",
    desc: "Restraint, silence, discipline. Essential form.",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=85",
    accent: 0xd8d2c4,
    emissive: 0x1a1815,
  },
  {
    name: "The Ritual Way",
    desc: "Daily use, lived rhythm, quiet purpose.",
    img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=2400&q=85",
    accent: 0xb8813c,
    emissive: 0x33220f,
  },
];
