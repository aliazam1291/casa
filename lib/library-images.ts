// Curated photography sourced for the brand, matched to the Brand Book's
// photography direction (natural light first, the whole room never an
// isolated product, deep tone, black as the ground) and the eight named
// Signature Compositions. Local files under public/images/library — no
// remote hotlinks.

const LIB = "/images/library";

export const ROOM_IMAGES: Record<string, string> = {
  "wine-cellar": `${LIB}/2389034a9605fe7f782440079387f554.jpg`,
  "material-vault": `${LIB}/mahwishz-ai-generated-8932545_1920.jpg`,
  archive: `${LIB}/949615897138f6d73e09843ae48f3519.jpg`,
  "grand-foyer": `${LIB}/pexels-artbovich-6315802.jpg`,
  "gourmet-kitchen": `${LIB}/mostafhsaid474-home-7290692_1920.jpg`,
  "atrium-living": `${LIB}/907b2059801f80acad604dc4703980a4.jpg`,
  "courtyard-dining": `${LIB}/pexels-capturavisualmoment-34951761.jpg`,
  "master-suite": `${LIB}/a77e0c7d5a9077455d84fe5ffcd2845d.jpg`,
  "spa-bath-en-suite": `${LIB}/pexels-ela-de-pure-1402904686-33599113.jpg`,
  "executive-study": `${LIB}/c7d828f894647c9b3037b4fe5c6b4baf.jpg`,
  "guest-bedroom": `${LIB}/357f7ab3f02786cc8c3feef9aaee4ab6.jpg`,
  "skyline-salon": `${LIB}/38ee265dd4fe6adf558468c5196c5496.jpg`,
  "penthouse-terrace": `${LIB}/pexels-jeske-jovan-346901043-14406022.jpg`,
};

export const MATERIAL_IMAGES = {
  marble: `${LIB}/pexels-321168087-29923543.jpg`,
  wood: `${LIB}/6719005-room-4768554_1920.jpg`,
  stone: `${LIB}/pexels-artbovich-6969865.jpg`,
  textile: `${LIB}/d6ec9e3597ea9ef9f0a3226babdd680b.jpg`,
} as const;

// Seating, chairs, chaises, sofas — living-room compositions.
export const SEATING_IMAGES = [
  `${LIB}/2ef6cb5f0c615944bd2983d1de57ba21.jpg`,
  `${LIB}/907b2059801f80acad604dc4703980a4.jpg`,
  `${LIB}/homeographer-couch-8390089_1920.jpg`,
  `${LIB}/ade5fb17034c8aa53ff6bf399de53a1d.jpg`,
  `${LIB}/81aa7c71d8867a889158ad8de6988d8a.jpg`,
  `${LIB}/pexels-artbovich-6265943.jpg`,
  `${LIB}/cb97cd08d209b3fb39c823fb28d83edc.jpg`,
  `${LIB}/c7d828f894647c9b3037b4fe5c6b4baf.jpg`,
  `${LIB}/d6ec9e3597ea9ef9f0a3226babdd680b.jpg`,
];

// Tables — centre, side, dining, tasting, drafting.
export const TABLE_IMAGES = [
  `${LIB}/pexels-321168087-29923543.jpg`,
  `${LIB}/9f798e50bcb52ce27e934ee2d4e0be38.jpg`,
  `${LIB}/mahwishz-ai-generated-8932545_1920.jpg`,
  `${LIB}/pexels-billy-9938940.jpg`,
  `${LIB}/23555986-living-space-8539223_1920.jpg`,
];

// Lighting — pendants, chandeliers, lamps.
export const LIGHTING_IMAGES = [
  `${LIB}/ab9d49cfad93b834831772451041e2fa.jpg`,
  `${LIB}/pexels-houzlook-3356416.jpg`,
  `${LIB}/homeographer-room-8407976_1920.jpg`,
];

// Kitchen & bath.
export const KITCHEN_BATH_IMAGES = [
  `${LIB}/mostafhsaid474-home-7290692_1920.jpg`,
  `${LIB}/pexels-ela-de-pure-1402904686-33599113.jpg`,
  `${LIB}/pexels-artbovich-6969865.jpg`,
];

// Beds — signature, monastic, guest.
export const BED_IMAGES = [
  `${LIB}/1802a14bf7bf36581b873e4949ab6509.jpg`,
  `${LIB}/357f7ab3f02786cc8c3feef9aaee4ab6.jpg`,
  `${LIB}/6719005-room-4768554_1920.jpg`,
  `${LIB}/a77e0c7d5a9077455d84fe5ffcd2845d.jpg`,
  `${LIB}/b8170b417aa95029b383db51479587c1.jpg`,
  `${LIB}/fd1607ee5737fd4e7e5442e29da17978.jpg`,
];

// Décor, greenery, wardrobes, objects — the finishing gestures.
export const DECOR_IMAGES = [
  `${LIB}/504b1bc3b76a0f3eb01d11ba2cb35a69.jpg`,
  `${LIB}/2389034a9605fe7f782440079387f554.jpg`,
  `${LIB}/949615897138f6d73e09843ae48f3519.jpg`,
  `${LIB}/fabien_raquidel-ai-generated-8111336_1920.jpg`,
  `${LIB}/pexels-jeske-jovan-346901043-14406022.jpg`,
  `${LIB}/pexels-artbovich-6315802.jpg`,
  `${LIB}/pexels-capturavisualmoment-34951761.jpg`,
  `${LIB}/interiorlens-interior-8504195_1920.jpg`,
  `${LIB}/248fa27927f9a69703d48d50b9299b8a.jpg`,
  `${LIB}/5ce3e0c08d05ddaa0377dd66d1d7ba94.jpg`,
];

// Piece → category → image pool. Shared by the home Gallery masonry and the
// DomeGallery so a piece's photo stays consistent wherever it appears.
const CATEGORY_IMAGES = {
  seating: SEATING_IMAGES,
  tables: TABLE_IMAGES,
  lighting: LIGHTING_IMAGES,
  "kitchen-bath": KITCHEN_BATH_IMAGES,
  beds: BED_IMAGES,
  decor: DECOR_IMAGES,
} as const;

const PIECE_CATEGORY: Record<string, keyof typeof CATEGORY_IMAGES> = {
  "the-arrival-bench": "seating",
  "the-dining-chairs": "seating",
  "the-counter-stools": "seating",
  "the-reading-chair": "seating",
  "the-low-sofa": "seating",
  "the-still-chair": "seating",
  "the-horizon-sofa": "seating",
  "the-sun-lounger": "seating",
  "the-tasting-stools": "seating",
  "the-archive-reading-chair": "seating",
  "the-marble-plinths": "tables",
  "the-heirloom-table": "tables",
  "the-study-side-table": "tables",
  "the-stone-table": "tables",
  "the-side-table": "tables",
  "the-coffee-table-still-life": "tables",
  "the-terrace-table": "tables",
  "the-fire-table": "tables",
  "the-tasting-table": "tables",
  "the-drafting-table": "tables",
  "the-ring-chandelier": "lighting",
  "the-linear-pendant": "lighting",
  "the-reading-lamp": "lighting",
  "the-bankers-lamp": "lighting",
  "the-still-bath": "kitchen-bath",
  "the-floating-vanity": "kitchen-bath",
  "the-rain-shower": "kitchen-bath",
  "the-working-kitchen": "kitchen-bath",
  "the-hearth-island": "kitchen-bath",
  "the-monastic-bed": "beds",
  "the-marble-nightstand": "beds",
};

export function getPieceImage(slug: string, index: number): string {
  const category = PIECE_CATEGORY[slug] ?? "decor";
  const pool = CATEGORY_IMAGES[category];
  return pool[index % pool.length];
}
