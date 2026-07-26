// The 41 named pieces staged inside the 3D walkthrough
// (components/three/gallery/lib/furniture/*.js), promoted to a real,
// linkable product layer. Every `name`, `materials` and `description` below
// is copied VERBATIM from the corresponding `tagPiece()` call so that when
// Phase 2 repoints those call sites to `tagPieceById()`, the hover copy in
// the 3D scene is byte-identical to what shipped before.
//
// `categorySlug`/`subtypeSlug` are an editorial best-fit against the real
// Wolf Casa taxonomy (lib/catalogue.ts) — Wolf Casa doesn't expose SKU-level
// category codes for bespoke pieces, so this is Wolf Casa's own language
// applied to Wolf Casa's own pieces, not an invented system.
export type Piece = {
  id: string; // room-scoped, unique — "<roomSlug>/<slug>"
  slug: string; // globally unique — the URL
  name: string;
  materials: string[];
  description: string;
  roomSlug: string;
  categorySlug: string;
  subtypeSlug: string;
  featured?: boolean;
};

type PieceInput = Omit<Piece, "id"> & { roomSlug: string };

function piece(p: PieceInput): Piece {
  return { ...p, id: `${p.roomSlug}/${p.slug}` };
}

export const PIECES: Piece[] = [
  // Grand Foyer — hallFurniture.js
  piece({
    slug: "the-arrival-bench",
    name: "The Arrival Bench",
    materials: ["Forest cotton velvet", "Champagne brass"],
    description: "A channel-tufted bench in forest velvet on tapered brass legs — the first place the house asks you to pause.",
    roomSlug: "grand-foyer",
    categorySlug: "seating",
    subtypeSlug: "modular-seating",
  }),
  piece({
    slug: "the-marble-plinths",
    name: "The Marble Plinths",
    materials: ["Calacatta marble", "Champagne brass", "Glazed ceramic"],
    description: "A pair of square marble plinths flanking the entry, each carrying a single object rather than a display.",
    roomSlug: "grand-foyer",
    categorySlug: "decor-finishes",
    subtypeSlug: "artefacts-sculptures",
  }),
  piece({
    slug: "the-branch-vase",
    name: "The Branch Vase",
    materials: ["Glazed ceramic", "Dried walnut branch"],
    description: "A single glazed vessel holding bare walnut branches — the one note of the outdoors let inside the foyer.",
    roomSlug: "grand-foyer",
    categorySlug: "greenery-entertainment",
    subtypeSlug: "nature-greens",
    featured: true,
  }),

  // Courtyard Dining — diningFurniture.js
  piece({
    slug: "the-heirloom-table",
    name: "The Heirloom Table",
    materials: ["Calacatta marble", "Solid walnut"],
    description: "A softened-rectangle slab in honed Calacatta, seating eight. Cut, bevelled and polished by hand over eleven days.",
    roomSlug: "courtyard-dining",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "designer-tables",
    featured: true,
  }),
  piece({
    slug: "the-dining-chairs",
    name: "The Dining Chairs",
    materials: ["Bouclé", "Solid walnut", "Champagne brass"],
    description: "Six curved-back chairs in undyed bouclé on turned walnut legs with brass sabots, set three to a side.",
    roomSlug: "courtyard-dining",
    categorySlug: "seating",
    subtypeSlug: "accent-chairs",
  }),
  piece({
    slug: "the-ring-chandelier",
    name: "The Ring Chandelier",
    materials: ["Champagne brass", "Blown glass"],
    description: "A single brass ring set with six glass orbs, hung low enough to warm the table without blocking the view across it.",
    roomSlug: "courtyard-dining",
    categorySlug: "lighting-smart-living",
    subtypeSlug: "chandeliers",
    featured: true,
  }),

  // Spa Bath En-Suite — bathFurniture.js
  piece({
    slug: "the-still-bath",
    name: "The Still Bath",
    materials: ["Calacatta marble", "Polished brass"],
    description: "An oval bath carved from one block of Calacatta, walls honed to twenty millimetres so the stone warms with the water.",
    roomSlug: "spa-bath-en-suite",
    categorySlug: "kitchen-bath",
    subtypeSlug: "wellness-bath",
    featured: true,
  }),
  piece({
    slug: "the-floating-vanity",
    name: "The Floating Vanity",
    materials: ["Fluted walnut", "Calacatta marble", "Polished brass"],
    description: "A wall-hung walnut vanity with a marble top and a backlit arch mirror, floating clear of the floor so the stone reads uninterrupted.",
    roomSlug: "spa-bath-en-suite",
    categorySlug: "kitchen-bath",
    subtypeSlug: "sanitaryware",
  }),
  piece({
    slug: "the-rain-shower",
    name: "The Rain Shower",
    materials: ["Low-iron glass", "Polished brass"],
    description: "A frameless glass enclosure with a single overhead rain head — no curtain, no threshold, just a change in the floor.",
    roomSlug: "spa-bath-en-suite",
    categorySlug: "kitchen-bath",
    subtypeSlug: "wellness-bath",
  }),

  // Gourmet Kitchen — kitchenFurniture.js
  piece({
    slug: "the-working-kitchen",
    name: "The Working Kitchen",
    materials: ["Book-matched marble", "Walnut cabinetry", "Integrated steel"],
    description: "A complete working run: concealed refrigeration, induction cooking, an integrated oven and a deep stone preparation counter.",
    roomSlug: "gourmet-kitchen",
    categorySlug: "kitchen-bath",
    subtypeSlug: "modular-kitchens",
    featured: true,
  }),
  piece({
    slug: "the-hearth-island",
    name: "The Hearth Island",
    materials: ["Nero Marquina marble", "Champagne brass"],
    description: "A single 3.6-metre block of Nero Marquina with a mitred waterfall edge, the veining book-matched across every face.",
    roomSlug: "gourmet-kitchen",
    categorySlug: "kitchen-bath",
    subtypeSlug: "kitchen-furniture",
    featured: true,
  }),
  piece({
    slug: "the-counter-stools",
    name: "The Counter Stools",
    materials: ["Cognac saddle leather", "Champagne brass"],
    description: "Three backless stools in the same hide as the sofa, so the kitchen and the living room share one leather.",
    roomSlug: "gourmet-kitchen",
    categorySlug: "seating",
    subtypeSlug: "accent-chairs",
  }),
  piece({
    slug: "the-linear-pendant",
    name: "The Linear Pendant",
    materials: ["Champagne brass", "Blown glass"],
    description: "A single brass bar carrying three drop bulbs at even spacing over the island — no shade, so the filament is the fixture.",
    roomSlug: "gourmet-kitchen",
    categorySlug: "lighting-smart-living",
    subtypeSlug: "architectural-lighting",
  }),

  // Executive Study — studyFurniture.js
  piece({
    slug: "the-writing-desk",
    name: "The Writing Desk",
    materials: ["Caramel walnut", "Cognac saddle leather", "Champagne brass"],
    description: "A walnut desk with a hand-skived saddle-leather inlay and a brass edge trim, the grain running unbroken across the full span.",
    roomSlug: "executive-study",
    categorySlug: "office-outdoor",
    subtypeSlug: "desks-workstations",
    featured: true,
  }),
  piece({
    slug: "the-reading-chair",
    name: "The Reading Chair",
    materials: ["Cognac saddle leather", "Solid walnut"],
    description: "A high-backed armchair and ottoman in the study's own reading nook, angled toward the window rather than the desk.",
    roomSlug: "executive-study",
    categorySlug: "seating",
    subtypeSlug: "accent-chairs",
  }),
  piece({
    slug: "the-study-side-table",
    name: "The Side Table",
    materials: ["Nero Marquina marble"],
    description: "A single turned drum in Nero Marquina, kept low and close to the reading chair for a cup or a closed book.",
    roomSlug: "executive-study",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "designer-tables",
  }),
  piece({
    slug: "the-reading-lamp",
    name: "The Reading Lamp",
    materials: ["Blackened brass"],
    description: "A slim arcing floor lamp, its shade angled low over the reading chair so the light falls on the page and nowhere else.",
    roomSlug: "executive-study",
    categorySlug: "lighting-smart-living",
    subtypeSlug: "architectural-lighting",
  }),

  // Atrium Living — livingFurniture.js
  piece({
    slug: "the-low-sofa",
    name: "The Low Sofa",
    materials: ["Cognac saddle leather", "Kiln-dried ash frame", "Champagne brass"],
    description: "A tailored three-seat sectional in full-grain cognac leather that darkens with use. Track arms, feather-wrapped cushions, tapered brass feet.",
    roomSlug: "atrium-living",
    categorySlug: "seating",
    subtypeSlug: "sofas",
    featured: true,
  }),
  piece({
    slug: "the-stone-table",
    name: "The Stone Table",
    materials: ["Calacatta marble", "Nero Marquina", "Champagne brass"],
    description: "A fluted drum turned from a single block of Calacatta, capped with a honed Nero Marquina top and a hand-set brass lip.",
    roomSlug: "atrium-living",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "designer-tables",
  }),
  piece({
    slug: "the-side-table",
    name: "The Side Table",
    materials: ["Calacatta marble", "Nero Marquina", "Champagne brass"],
    description: "A short marble drum with a dark cap and a hand-spun brass bowl for keys, rings, whatever the day leaves behind.",
    roomSlug: "atrium-living",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "designer-tables",
  }),
  piece({
    slug: "the-coffee-table-still-life",
    name: "The Coffee Table Still Life",
    materials: ["Smoked glass", "Champagne brass", "Cloth-bound books"],
    description: "A stack of cloth-bound editions, a smoked-glass vessel and three brass candle holders — styled, not collected.",
    roomSlug: "atrium-living",
    categorySlug: "decor-finishes",
    subtypeSlug: "artefacts-sculptures",
  }),
  piece({
    slug: "the-still-chair",
    name: "The Still Chair",
    materials: ["Cognac saddle leather", "Champagne brass"],
    description: "A single-seat lounge chair on a slim brass frame, its saddle-leather sling cut from one hide and stitched at the edge.",
    roomSlug: "atrium-living",
    categorySlug: "seating",
    subtypeSlug: "accent-chairs",
  }),

  // Master Suite — bedroomFurniture.js (addBedroomFurniture)
  piece({
    slug: "the-monastic-bed",
    name: "The Monastic Bed",
    materials: ["Terracotta cotton velvet", "Solid walnut", "Washed linen"],
    description: "A channel-tufted headboard in terracotta velvet on a low walnut platform — six hand-run channels, each stuffed and closed by one maker.",
    roomSlug: "master-suite",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "signature-beds",
    featured: true,
  }),
  piece({
    slug: "the-marble-nightstand",
    name: "The Marble Nightstand",
    materials: ["Calacatta marble", "Solid walnut", "Champagne brass"],
    description: "A marble-faced nightstand with a single walnut drawer, its brass pull the only bright note in the room.",
    roomSlug: "master-suite",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "custom-storage",
  }),

  // Skyline Salon — galleryFurniture.js (pavilion/skyline branch)
  piece({
    slug: "the-horizon-sofa",
    name: "The Horizon Sofa",
    materials: ["Ivory bouclé", "Kiln-dried ash frame"],
    description: "An L-shaped sectional in heavy ivory bouclé, kept low so nothing interrupts the line of the horizon behind it.",
    roomSlug: "skyline-salon",
    categorySlug: "seating",
    subtypeSlug: "sofas",
    featured: true,
  }),

  // Penthouse Terrace — galleryFurniture.js (else / terrace branch)
  piece({
    slug: "the-sun-lounger",
    name: "The Sun Lounger",
    materials: ["Burmese teak", "Outdoor linen", "Terracotta velvet"],
    description: "A slatted teak lounger left unfinished so it silvers in the weather, dressed with a linen cushion and a rolled bolster.",
    roomSlug: "penthouse-terrace",
    categorySlug: "office-outdoor",
    subtypeSlug: "outdoor-lounges",
  }),
  piece({
    slug: "the-terrace-table",
    name: "The Terrace Table",
    materials: ["Weathered marble", "Blackened steel"],
    description: "A marble-topped side table between the loungers, its steel stem left to weather rather than sealed against it.",
    roomSlug: "penthouse-terrace",
    categorySlug: "office-outdoor",
    subtypeSlug: "outdoor-furniture",
  }),
  piece({
    slug: "the-fire-table",
    name: "The Fire Table",
    materials: ["Nero Marquina", "Champagne brass", "Lava stone"],
    description: "A linear gas hearth set into a Nero Marquina block, its burner bedded in lava pebbles so the flame reads as a low line of light.",
    roomSlug: "penthouse-terrace",
    categorySlug: "office-outdoor",
    subtypeSlug: "outdoor-furniture",
    featured: true,
  }),
  piece({
    slug: "the-olive-tree",
    name: "The Olive Tree",
    materials: ["Fluted marble", "Mature olive"],
    description: "A single olive tree, decades old, in a fluted marble planter sized to hold it for another decade.",
    roomSlug: "penthouse-terrace",
    categorySlug: "greenery-entertainment",
    subtypeSlug: "nature-greens",
  }),

  // Wine Cellar — undergroundFurniture.js (addWineCellarFurniture)
  piece({
    slug: "the-tasting-table",
    name: "The Tasting Table",
    materials: ["Solid walnut", "Blackened steel"],
    description: "A single walnut slab on blackened steel legs, sized for a bottle, two glasses and nothing else.",
    roomSlug: "wine-cellar",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "designer-tables",
  }),
  piece({
    slug: "the-tasting-stools",
    name: "The Tasting Stools",
    materials: ["Cognac saddle leather", "Blackened steel"],
    description: "A pair of backless stools in the same cognac hide as the house leather, kept low so the wine wall stays the view.",
    roomSlug: "wine-cellar",
    categorySlug: "seating",
    subtypeSlug: "accent-chairs",
  }),
  piece({
    slug: "the-wine-wall",
    name: "The Wine Wall",
    materials: ["Solid walnut", "Blown glass", "Champagne brass"],
    description: "A full-height cellar wall of hand-fitted walnut cubbies, backlit so the glass holds the light. Ninety-eight bottles, laid neck-out at a constant twelve degrees.",
    roomSlug: "wine-cellar",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "custom-storage",
    featured: true,
  }),
  piece({
    slug: "the-wine-shelf",
    name: "The Wine Shelf",
    materials: ["Solid walnut", "Bottle glass", "Antiqued brass"],
    description: "An open walnut shelf for the bottles being poured now, set apart from the cellar archive behind it.",
    roomSlug: "wine-cellar",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "custom-storage",
  }),
  piece({
    slug: "the-aging-barrels",
    name: "The Aging Barrels",
    materials: ["French oak", "Blackened steel bands"],
    description: "Three coopered oak barrels stacked in the corner — retired from the estate's own reserve after a full ageing cycle.",
    roomSlug: "wine-cellar",
    categorySlug: "decor-finishes",
    subtypeSlug: "artefacts-sculptures",
  }),
  piece({
    slug: "the-vintage-crates",
    name: "The Vintage Crates",
    materials: ["Stamped pine", "Iron corner brackets"],
    description: "Original shipping crates, kept as found — stencilled vintages still legible under the dust.",
    roomSlug: "wine-cellar",
    categorySlug: "decor-finishes",
    subtypeSlug: "artefacts-sculptures",
  }),

  // Material Vault — undergroundFurniture.js (addMaterialVaultFurniture)
  piece({
    slug: "the-design-workbench",
    name: "The Design Workbench",
    materials: ["Nero Marquina marble", "Champagne brass"],
    description: "A Nero Marquina slab on a brass-trimmed base — every material specification for the house is signed off at this table.",
    roomSlug: "material-vault",
    categorySlug: "office-outdoor",
    subtypeSlug: "desks-workstations",
  }),
  piece({
    slug: "the-sample-racks",
    name: "The Sample Racks",
    materials: ["Dark oak", "Bolt-end fabrics"],
    description: "Every fabric under consideration for the house lives here on the bolt, sorted so a whole season's palette reads in one glance.",
    roomSlug: "material-vault",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "custom-storage",
  }),

  // Archive — undergroundFurniture.js (addArchiveFurniture)
  piece({
    slug: "the-bankers-lamp",
    name: "The Banker's Lamp",
    materials: ["Green cased glass", "Antiqued brass"],
    description: "A classic green-glass banker's lamp, kept for the one task this room is built for: reading drawings by hand.",
    roomSlug: "archive",
    categorySlug: "lighting-smart-living",
    subtypeSlug: "architectural-lighting",
  }),
  piece({
    slug: "the-drafting-table",
    name: "The Drafting Table",
    materials: ["Dark oak", "Linen", "Blackened steel"],
    description: "An inclined drafting table holding the house's working drawings — the same table every floor plan in this archive was first drawn on.",
    roomSlug: "archive",
    categorySlug: "office-outdoor",
    subtypeSlug: "desks-workstations",
  }),
  piece({
    slug: "the-archive-reading-chair",
    name: "The Reading Chair",
    materials: ["Cognac saddle leather", "Solid walnut"],
    description: "A deep leather chair and ottoman angled toward the drafting table — the only concession to comfort in a working room.",
    roomSlug: "archive",
    categorySlug: "seating",
    subtypeSlug: "accent-chairs",
  }),
  piece({
    slug: "the-archive-cabinets",
    name: "The Archive Cabinets",
    materials: ["Dark oak", "Cognac leather bindings"],
    description: "Floor-to-ceiling cabinets holding every drawing, invoice and correspondence the house has produced since the first stone was laid.",
    roomSlug: "archive",
    categorySlug: "bespoke-interiors",
    subtypeSlug: "custom-storage",
  }),
];

export const PIECES_BY_ID: Record<string, Piece> = Object.fromEntries(PIECES.map((p) => [p.id, p]));
export const PIECES_BY_SLUG: Record<string, Piece> = Object.fromEntries(PIECES.map((p) => [p.slug, p]));

export function getPiece(slug: string): Piece | undefined {
  return PIECES_BY_SLUG[slug];
}

/** Returns exactly the {name, materials, description} shape tagPiece() has
 * always received — this is what makes Phase 2's tagPieceById() a no-op
 * for the 3D scene's hover copy. */
export function pieceInfo(id: string): { name: string; materials: string[]; description: string } {
  const p = PIECES_BY_ID[id];
  if (!p) throw new Error(`lib/pieces.ts: unknown piece id "${id}"`);
  return { name: p.name, materials: p.materials, description: p.description };
}

export function piecesInRoom(roomSlug: string): Piece[] {
  return PIECES.filter((p) => p.roomSlug === roomSlug);
}

export function piecesInSubtype(categorySlug: string, subtypeSlug: string): Piece[] {
  return PIECES.filter((p) => p.categorySlug === categorySlug && p.subtypeSlug === subtypeSlug);
}

export function piecesInCategory(categorySlug: string): Piece[] {
  return PIECES.filter((p) => p.categorySlug === categorySlug);
}

export const FEATURED_PIECES: Piece[] = PIECES.filter((p) => p.featured);

// Module-load integrity checks — fail fast rather than ship a silent
// duplicate slug or an empty catalogue.
if (process.env.NODE_ENV !== "production") {
  const slugSet = new Set(PIECES.map((p) => p.slug));
  if (slugSet.size !== PIECES.length) {
    console.warn("lib/pieces.ts: duplicate piece slugs detected.");
  }
  if (PIECES.length !== 41) {
    console.warn(`lib/pieces.ts: expected 41 pieces (verified tagPiece() call-site count), found ${PIECES.length}.`);
  }
}
