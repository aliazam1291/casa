// The eight Signature Compositions — sellable "moods" the Brand Book calls
// out explicitly as owned IP ("Eight named compositions... are IP too —
// sellable moods a customer can ask for by name"). Replaces the earlier,
// invented "Five Worlds" taxonomy, which had no basis in the client's brand
// system. Name/blurb/pullQuote are verbatim from the book.
//
// IMAGERY: the per-composition photographs in /public/images/compositions
// are Pexels stock, chosen to match each mood's tone and time of day. The
// Pexels License permits commercial use without attribution; source photo
// IDs are recorded on each entry below so they can be traced or replaced.
// These are ATMOSPHERE, not provenance — never caption one as a Wolf Casa
// project or a Wolf Casa product. Swap them for real project photography
// as it becomes available.
export type TimeOfDay = "dawn" | "midday" | "golden" | "dusk" | "night";

export type Composition = {
  slug: string;
  name: string;
  blurb: string;
  pullQuote: string;
  img: string;
  accent: number;
  emissive: number;
  // Not in the book — added so each composition can carry the "when" of its
  // light (rendered as a small sun-arc sketch) alongside its "what" (materials).
  materials: string[];
  timeOfDay: TimeOfDay;
};

export const COMPOSITIONS: Composition[] = [
  {
    slug: "nocturne",
    name: "Nocturne",
    blurb: "Evening calm in deep tones — low light, soft shadow and a single warm source. The room at its most timeless.",
    pullQuote: "The lamp gives the sofa memory. The rug gives it territory.",
    img: "/images/compositions/nocturne.webp", // pexels 12155604
    accent: 0xb8975a,
    emissive: 0x2a1c10,
    materials: ["Walnut", "Boucle", "Blackened brass"],
    timeOfDay: "night",
  },
  {
    slug: "terra-form",
    name: "Terra Form",
    blurb: "Earthy and raw — stone, oiled wood and unbleached cloth. The room that feels grown, not built.",
    pullQuote: "Texture is proof — it tells the hand what the eye believes.",
    img: "/images/compositions/terra-form.webp", // pexels 17084964
    accent: 0x8a7560,
    emissive: 0x2c2418,
    materials: ["Honed stone", "Oiled oak", "Raw linen"],
    timeOfDay: "midday",
  },
  {
    slug: "luxe-minimal",
    name: "Luxe Minimal",
    blurb: "Clean line and quiet luxury — one anchor, generous air, nothing that competes for attention.",
    pullQuote: "Premium is not more. Premium is resolved.",
    img: "/images/compositions/luxe-minimal.webp", // pexels 27059631
    accent: 0xa78657,
    emissive: 0x1a1815,
    materials: ["Bouclé", "Brass", "Honed marble"],
    timeOfDay: "dawn",
  },
  {
    slug: "urban-oasis",
    name: "Urban Oasis",
    blurb: "Nature meets structure — foliage, light and stone framed by the window. Calm at the centre of the city.",
    pullQuote: "Let the room breathe, and it will hold you.",
    img: "/images/compositions/urban-oasis.webp", // pexels 16846487
    accent: 0x6e7a5c,
    emissive: 0x1e2418,
    materials: ["Stone", "Greenery", "Raw concrete"],
    timeOfDay: "midday",
  },
  {
    slug: "monochrome",
    name: "Monochrome",
    blurb: "Bold contrast, sleek and deliberate — deep wood, low light and a single sculptural gesture.",
    pullQuote: "A room should feel ordered before it is understood.",
    img: "/images/compositions/monochrome.webp", // pexels 13722888
    accent: 0x5a3d2e,
    emissive: 0x141311,
    materials: ["Dark wood", "Blackened steel", "Glass"],
    timeOfDay: "dusk",
  },
  {
    slug: "golden-hour",
    name: "Golden Hour",
    blurb: "Warmth that glows — late light across grain and stone, the kitchen as the heart of the house.",
    pullQuote: "Light decides what the eye remembers.",
    img: "/images/compositions/golden-hour.webp", // pexels 18186514
    accent: 0xd4b87a,
    emissive: 0x3a2410,
    materials: ["Brass", "Warm oak", "Terracotta"],
    timeOfDay: "golden",
  },
  {
    slug: "artisan-layer",
    name: "Artisan Layer",
    blurb: "Crafted and cultural — layered surface, handmade object and quiet ceremony on the table.",
    pullQuote: "Every corner must earn its silence.",
    img: "/images/compositions/artisan-layer.webp", // pexels 23656954
    accent: 0x8a5938,
    emissive: 0x2a1c12,
    materials: ["Saddle leather", "Hand-loomed textile", "Mirror"],
    timeOfDay: "golden",
  },
  {
    slug: "forest-silence",
    name: "Forest Silence",
    // The book reuses this exact pull-quote for both Nocturne and Forest
    // Silence — that's the book's own text, not a transcription error.
    blurb: "Deep greens and soft texture — the reading corner where the day finally slows.",
    pullQuote: "The room at its most timeless.",
    img: "/images/compositions/forest-silence.webp", // pexels 27459712
    accent: 0x253528,
    emissive: 0x151d16,
    materials: ["Deep green velvet", "Walnut", "Wool"],
    timeOfDay: "dusk",
  },
];
