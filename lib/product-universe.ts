// THE PRODUCT UNIVERSE — Brand Book §06, "From SKU to Room".
//
// These twenty names, and their order, are taken verbatim from the book. They
// replace lib/catalogue.ts, whose eight categories and fifty-one subtypes
// ("bespoke-interiors", "lighting-smart-living", "greenery-entertainment"…)
// were invented and appear nowhere in the brand system.
//
// The book is explicit that this is NOT a shop menu: "Wolf Casa does not sell
// products. It sells named rooms — eight sellable moods." So this list is the
// ingredient list of a room, and it ends where the book ends it — on THE ROOM.
// That last entry is the point of the whole page, not a category.
//
// GROUPING is ours, not the book's: twenty flat entries is a wall of text, and
// the book's own sequence already moves from the largest pieces through to the
// intangibles. The four groups just name that movement.

export type UniverseGroup = {
  slug: string;
  /** The book's own framing of what this group of the room does. */
  title: string;
  note: string;
  items: UniverseItem[];
};

export type UniverseItem = {
  /** Verbatim from the book, including its capitalisation of DÉCOR. */
  name: string;
  slug: string;
  /** What it does in a composition — not a product description. */
  role: string;
  /** Rooms in the villa where this reads most clearly. */
  rooms: string[];
};

export const PRODUCT_UNIVERSE: UniverseGroup[] = [
  {
    slug: "the-large-forms",
    title: "The large forms",
    note: "What the room is built around. One of these is always the anchor — the book's second principle.",
    items: [
      { name: "Sofas", slug: "sofas", role: "The anchor in most living compositions. Everything else is placed in relation to it.", rooms: ["atrium-living", "skyline-salon"] },
      { name: "Accent Chairs", slug: "accent-chairs", role: "The second seat — where the room stops being a set and starts being a conversation.", rooms: ["atrium-living", "executive-study", "archive"] },
      { name: "Dining", slug: "dining", role: "A table and its chairs read as one piece, or the room never settles.", rooms: ["courtyard-dining", "wine-cellar"] },
      { name: "Beds", slug: "beds", role: "Headboard, base and surround composed together rather than assembled.", rooms: ["master-suite", "guest-bedroom"] },
    ],
  },
  {
    slug: "the-surfaces",
    title: "The surfaces",
    note: "The working height of a room. These decide whether it can actually be lived in.",
    items: [
      { name: "Centre Tables", slug: "centre-tables", role: "Sets the distance between the seats, which is what makes a room sociable or formal.", rooms: ["atrium-living", "skyline-salon"] },
      { name: "Side Tables", slug: "side-tables", role: "Somewhere to put a glass down. The absence of one is felt immediately.", rooms: ["atrium-living", "executive-study", "master-suite"] },
      { name: "TV Units", slug: "tv-units", role: "The hardest thing to place well. Usually the piece that decides the wall.", rooms: ["atrium-living"] },
      { name: "Surfaces", slug: "surfaces", role: "Stone, timber and composite worktops — cut and finished for one room, not stocked by the metre.", rooms: ["gourmet-kitchen", "spa-bath-en-suite"] },
    ],
  },
  {
    slug: "the-soft-layer",
    title: "The soft layer",
    note: "Texture as memory — the book's seventh principle. This is the layer the hand confirms.",
    items: [
      { name: "Rugs", slug: "rugs", role: "Draws the territory. A rug the seating floats around is the commonest mistake in a room.", rooms: ["atrium-living", "master-suite", "executive-study"] },
      { name: "Curtains", slug: "curtains", role: "Controls the light before any lamp does. Hung high and wide, or not at all.", rooms: ["master-suite", "guest-bedroom", "skyline-salon"] },
      { name: "Throws", slug: "throws", role: "The one deliberately casual thing. A room with none reads as a showroom.", rooms: ["atrium-living", "guest-bedroom"] },
      { name: "Cushions", slug: "cushions", role: "Three materials, not eight. This is where restraint shows or fails.", rooms: ["atrium-living", "skyline-salon", "guest-bedroom"] },
    ],
  },
  {
    slug: "the-light-and-the-air",
    title: "The light, and the air",
    note: "Light first — the book's opening principle. Mood is set before a single object lands.",
    items: [
      { name: "Lighting", slug: "lighting", role: "The decorative fittings you see: pendants, chandeliers, lamps.", rooms: ["courtyard-dining", "gourmet-kitchen", "executive-study"] },
      { name: "Ambient Light", slug: "ambient-light", role: "The light you do not see the source of. This is what stops a room going flat after dark.", rooms: ["wine-cellar", "spa-bath-en-suite", "atrium-living"] },
      { name: "Wall Panels", slug: "wall-panels", role: "Gives a wall grain to catch the light, and softens the echo in the room.", rooms: ["atrium-living", "master-suite", "archive"] },
      { name: "Plants", slug: "plants", role: "The only part of the composition that changes on its own. Placed for shape, not for greenery.", rooms: ["penthouse-terrace", "atrium-living", "courtyard-dining"] },
    ],
  },
  {
    slug: "the-finishing",
    title: "The finishing",
    note: "The last five per cent that the rest of the room is judged on.",
    items: [
      { name: "Décor", slug: "decor", role: "Objects with a reason to be there. Nothing chosen to fill a gap.", rooms: ["grand-foyer", "archive", "material-vault"] },
      { name: "Materials", slug: "materials", role: "The palette itself — stone, timber, leather, brass — sampled before anything is ordered.", rooms: ["material-vault", "spa-bath-en-suite"] },
      { name: "Styling", slug: "styling", role: "The composition of the objects, done in the room and not from a plan.", rooms: ["grand-foyer", "atrium-living"] },
      { name: "The Room", slug: "the-room", role: "All nineteen above, resolved into one decision. This is what Wolf Casa actually sells.", rooms: [] },
    ],
  },
];

export const UNIVERSE_ITEMS: UniverseItem[] = PRODUCT_UNIVERSE.flatMap((g) => g.items);

export function getUniverseItem(slug: string): UniverseItem | undefined {
  return UNIVERSE_ITEMS.find((i) => i.slug === slug);
}

// ── Bridge from the retired taxonomy ──────────────────────────────────────────
// lib/pieces.ts tags each of its 43 named pieces with a `categorySlug` from the
// invented eight-category tree. Rather than rewrite 43 records (and lose the
// subtype detail those tags still carry for the 3D scene), each old category is
// mapped onto the closest name the book actually uses, so a piece page can
// state its category in Wolf Casa's own language and link somewhere real.
const LEGACY_CATEGORY_TO_UNIVERSE: Record<string, string> = {
  seating: "sofas",
  "bespoke-interiors": "surfaces",
  "kitchen-bath": "surfaces",
  "lighting-smart-living": "lighting",
  "decor-finishes": "decor",
  "greenery-entertainment": "plants",
  "office-outdoor": "side-tables",
  "doors-windows": "wall-panels",
};

/** The book-correct Product Universe entry for a piece's legacy category tag. */
export function universeForLegacyCategory(categorySlug: string): UniverseItem | undefined {
  const slug = LEGACY_CATEGORY_TO_UNIVERSE[categorySlug];
  return slug ? getUniverseItem(slug) : undefined;
}
