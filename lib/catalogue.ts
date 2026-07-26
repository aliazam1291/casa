// The real Wolf Casa product taxonomy — 8 categories × 5 sub-types, sourced
// from the live business site (wolfcasa.in). This is deliberately an INDEX
// over the same 13 rooms and 41 named pieces (lib/rooms.ts, lib/pieces.ts),
// not a parallel catalogue — every leaf links back to the rooms that draw
// on it, so "we sell rooms, not SKUs" is structural rather than a slogan.
export type Subtype = {
  slug: string;
  name: string;
  description: string;
  // Rooms (by slug, from lib/rooms.ts) that draw on this sub-type. Left
  // empty where the 3D walkthrough doesn't yet stage a piece in this
  // sub-type — honest rather than inventing coverage.
  rooms: string[];
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  subtypes: Subtype[];
};

export const CATALOGUE: Category[] = [
  {
    slug: "bespoke-interiors",
    name: "Bespoke Interiors",
    description: "Furniture, wardrobes, beds, tables and storage made to the room, not the catalogue page.",
    subtypes: [
      { slug: "handcrafted-furniture", name: "Handcrafted Furniture", description: "Pieces built by hand in the Indore and Dewas workshops.", rooms: ["wine-cellar", "material-vault", "archive"] },
      { slug: "bespoke-wardrobes", name: "Bespoke Wardrobes", description: "Full-height dressing walls fitted to the room's own proportions.", rooms: ["master-suite"] },
      { slug: "signature-beds", name: "Signature Beds", description: "Upholstered platform beds, headboard and base composed as one piece.", rooms: ["master-suite"] },
      { slug: "designer-tables", name: "Designer Tables", description: "Stone, walnut and marble tables, each cut and finished for one room.", rooms: ["courtyard-dining", "atrium-living", "executive-study", "wine-cellar"] },
      { slug: "custom-storage", name: "Custom Storage", description: "Cabinets, cellars and archives built into the architecture itself.", rooms: ["master-suite", "wine-cellar", "material-vault", "archive"] },
    ],
  },
  {
    slug: "seating",
    name: "Seating",
    description: "Sofas, chairs and stools composed for how a room is actually used.",
    subtypes: [
      { slug: "sofas", name: "Sofas", description: "Tailored sectionals and sofas in leather, bouclé and velvet.", rooms: ["atrium-living", "skyline-salon"] },
      { slug: "recliners", name: "Recliners", description: "Considered seating for the rooms built around rest.", rooms: [] },
      { slug: "accent-chairs", name: "Accent Chairs", description: "Single-seat pieces that anchor a corner or a conversation.", rooms: ["atrium-living", "executive-study", "wine-cellar", "archive"] },
      { slug: "modular-seating", name: "Modular Seating", description: "Benches and low seating that hold a room without crowding it.", rooms: ["grand-foyer"] },
      { slug: "chaise-daybeds", name: "Chaise & Daybeds", description: "Loungers and daybeds for the slower hours.", rooms: ["penthouse-terrace"] },
    ],
  },
  {
    slug: "kitchen-bath",
    name: "Kitchen & Bath",
    description: "Modular kitchens, sanitaryware and wellness bath fittings, composed as one working room.",
    subtypes: [
      { slug: "modular-kitchens", name: "Imported Modular Kitchens", description: "Full kitchen runs with integrated refrigeration and cooking.", rooms: ["gourmet-kitchen"] },
      { slug: "kitchen-furniture", name: "Kitchen Furniture", description: "Islands, counter seating and the pieces that make a kitchen sociable.", rooms: ["gourmet-kitchen"] },
      { slug: "sinks-faucets", name: "Sinks & Faucets", description: "Brass and steel tapware, undermount sinks.", rooms: ["gourmet-kitchen", "spa-bath-en-suite"] },
      { slug: "sanitaryware", name: "Sanitaryware", description: "Vanities, basins and fittings finished in marble and brass.", rooms: ["spa-bath-en-suite"] },
      { slug: "wellness-bath", name: "Wellness Bath", description: "Soaking tubs and rain showers built for a morning ritual.", rooms: ["spa-bath-en-suite"] },
    ],
  },
  {
    slug: "lighting-smart-living",
    name: "Lighting & Smart Living",
    description: "Chandeliers, architectural lighting and the smart systems that run a composed home.",
    subtypes: [
      { slug: "chandeliers", name: "Chandeliers", description: "Sculptural brass and glass fittings sized to the table below them.", rooms: ["courtyard-dining", "wine-cellar"] },
      { slug: "smart-panels", name: "Smart Panels & Controllers", description: "Whole-home control for light, climate and access.", rooms: [] },
      { slug: "lighting-control", name: "Lighting Control Systems", description: "Scene-based lighting tuned per room and time of day.", rooms: [] },
      { slug: "architectural-lighting", name: "Architectural Lighting", description: "Pendants, sconces and task lighting built into the joinery.", rooms: ["gourmet-kitchen", "executive-study", "master-suite", "archive"] },
      { slug: "outdoor-lighting", name: "Outdoor Lighting", description: "Low, warm lighting for terraces and gardens.", rooms: ["penthouse-terrace"] },
    ],
  },
  {
    slug: "doors-windows",
    name: "Doors & Windows",
    description: "Designer doors, glazing systems and the hardware that finishes an opening.",
    subtypes: [
      { slug: "designer-doors", name: "Designer Doors", description: "Statement entries in timber, glass and metal.", rooms: [] },
      { slug: "upvc-systems", name: "UPVC Systems", description: "Weathertight glazing for terraces and façades.", rooms: [] },
      { slug: "aluminum-systems", name: "Aluminum Systems", description: "Slim-profile framing for full-height glazing.", rooms: ["skyline-salon"] },
      { slug: "architectural-hardware", name: "Architectural Hardware", description: "Handles, hinges and the small fittings a door is judged by.", rooms: [] },
      { slug: "door-fittings", name: "Luxury Door Fittings", description: "Brass and steel fittings finished to match the room.", rooms: [] },
    ],
  },
  {
    slug: "office-outdoor",
    name: "Office & Outdoor",
    description: "Working furniture for the study, and living furniture for outside it.",
    subtypes: [
      { slug: "executive-office", name: "Executive Office Furniture", description: "Desks and seating for a private working room.", rooms: ["executive-study", "material-vault", "archive"] },
      { slug: "outdoor-seating", name: "Luxury Outdoor Seating", description: "Weather-ready seating that still reads as furniture.", rooms: ["penthouse-terrace"] },
      { slug: "outdoor-furniture", name: "Premium Outdoor Furniture", description: "Tables and fire features built for the terrace.", rooms: ["penthouse-terrace"] },
      { slug: "desks-workstations", name: "Desks & Workstations", description: "Writing desks and drafting tables for focused work.", rooms: ["executive-study", "material-vault", "archive"] },
      { slug: "outdoor-lounges", name: "Outdoor Lounges & Sets", description: "Loungers and low tables for a slow evening outside.", rooms: ["penthouse-terrace"] },
    ],
  },
  {
    slug: "decor-finishes",
    name: "Décor & Finishes",
    description: "The surfaces, stones and objects that give a composed room its texture.",
    subtypes: [
      { slug: "veneers", name: "Premium Veneers", description: "Book-matched timber veneers for cabinetry and panelling.", rooms: [] },
      { slug: "artefacts-sculptures", name: "Artefacts & Sculptures", description: "Objects chosen to complete a room, not fill it.", rooms: ["grand-foyer", "atrium-living", "wine-cellar"] },
      { slug: "designer-glass", name: "Designer Glass", description: "Blown and cast glass for lighting, vessels and mirrors.", rooms: ["wine-cellar", "spa-bath-en-suite"] },
      { slug: "stones", name: "Luxury Stones", description: "Calacatta, Nero Marquina and travertine, sourced by the slab.", rooms: ["grand-foyer", "atrium-living", "gourmet-kitchen"] },
      { slug: "paints-textures", name: "Paints & Textures", description: "Plaster and paint finishes chosen for how light moves across them.", rooms: [] },
    ],
  },
  {
    slug: "greenery-entertainment",
    name: "Greenery & Entertainment",
    description: "Landscaping, planting and the systems that make a home comfortable after dark.",
    subtypes: [
      { slug: "landscaping", name: "Luxury Landscaping", description: "Planting plans that extend the composition outdoors.", rooms: ["penthouse-terrace"] },
      { slug: "nature-greens", name: "Nature & Greens", description: "Mature trees and planting chosen for scale, not just colour.", rooms: ["penthouse-terrace", "grand-foyer"] },
      { slug: "immersive-theatre", name: "Luxury Immersive Theatre", description: "Home cinema rooms built around acoustics and seating.", rooms: [] },
      { slug: "audio-visual", name: "Audio-Visual Suite", description: "Integrated sound and screens that stay out of sight until used.", rooms: [] },
      { slug: "elite-landscapes", name: "Elite Landscapes", description: "Full outdoor compositions — paving, planting, water and light.", rooms: ["penthouse-terrace"] },
    ],
  },
];

export const CATALOGUE_BY_SLUG: Record<string, Category> = Object.fromEntries(CATALOGUE.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return CATALOGUE_BY_SLUG[slug];
}

export function getSubtype(categorySlug: string, subtypeSlug: string): { category: Category; subtype: Subtype } | undefined {
  const category = CATALOGUE_BY_SLUG[categorySlug];
  const subtype = category?.subtypes.find((s) => s.slug === subtypeSlug);
  if (!category || !subtype) return undefined;
  return { category, subtype };
}
