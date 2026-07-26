// Real article bodies for the 3 journal pieces that were previously
// linked from the homepage and /journal but resolved to duplicate index
// content (see app/[...slug]/page.tsx's old resolvePage fallbacks).
export type JournalArticle = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  image: string;
  imageAlt: string;
  published: string; // ISO date
  body: string[]; // paragraphs
};

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "why-light-is-the-material",
    category: "Way of Light",
    title: "Why light is the material you never pay for.",
    dek: "How to arrange a room around the changing day rather than against it.",
    image: "/images/journal/way-of-light.jpg",
    imageAlt: "Sunlight cutting across a composed interior of wood and stone",
    published: "2026-05-04",
    body: [
      "Most rooms are planned against the day: curtains to block a window, lamps to compensate for a room that faces the wrong way. A composed room is planned with it. Before any furniture is chosen, we read where the light enters, when, and what it does to the floor by four in the afternoon.",
      "This is why the same room, walked through at ten in the morning and again at seven in the evening, should feel like two different compositions built on the same frame. A stone floor that looks flat under office light will hold a visible grain the moment low sun crosses it. A wall that reads as plain plaster at noon will show every trowel mark at dusk.",
      "Furniture is placed into that light, not the other way round. A chair angled toward a window is a decision about a person's afternoon, not just about traffic flow. This is the first and most invisible material in every room we compose — and the one thing no catalogue photograph can show you, because a catalogue photograph is always taken in the best light of one single day.",
    ],
  },
  {
    slug: "reading-stone-wood-leather",
    category: "Material Intelligence",
    title: "Reading stone, wood and leather as evidence.",
    dek: "A guide to reading character, variation and permanence in natural materials.",
    image: "/images/journal/material-intelligence.jpg",
    imageAlt: "Close detail of marble veining, walnut grain and saddle leather",
    published: "2026-05-18",
    body: [
      "A slab of Calacatta marble is not a colour swatch. It is a record of pressure and mineral over geological time, and no two slabs — not even two cut from the same block — carry the same veining. When we book-match a run of marble across a kitchen island, we are choosing which record to hang on your wall for the next twenty years.",
      "Walnut behaves the same way. Grain runs differently through sapwood and heartwood; a plank cut near a knot will hold a darker figure than one cut from the centre of the trunk. A desk built from one continuous run of walnut reads as calmer than one assembled from mismatched offcuts, even if a visitor could never say exactly why.",
      "Leather is the most honest of the three, because it changes on purpose. Full-grain cognac leather — the hide used across our seating — is chosen specifically because it darkens and marks with use. A sofa that looks identical in year one and year five has not been lived in; it has been protected. We build for the former.",
    ],
  },
  {
    slug: "the-chair-you-return-to",
    category: "The Signature Reveal",
    title: "Inside a completed home, Indore, 2026.",
    dek: "Why the most personal rooms have a place for pause built into them.",
    image: "/images/journal/signature-reveal.jpg",
    imageAlt: "A finished living room composition with a low sofa and reading chair",
    published: "2026-06-02",
    body: [
      "Every composition we build ends with the same test: is there one place in the room a person would choose to sit and do nothing for twenty minutes? Not the sofa that faces the television, not the dining chair that faces the table — a chair that faces a window, a wall of books, or simply the light.",
      "In a recently completed Indore home, that place turned out to be a single reading chair set at an angle nobody expected: not toward the room's obvious focal point, but toward a narrow east-facing window that catches twenty minutes of direct sun each morning. The client had not asked for it. It emerged from watching how the room actually held the day before a single piece of furniture was chosen.",
      "This is the difference between furnishing and composing. A furnished room can be complete on delivery day and empty of feeling on every day after. A composed room is built around the one habit a person didn't know they were about to form.",
    ],
  },
];

export const JOURNAL_BY_SLUG: Record<string, JournalArticle> = Object.fromEntries(JOURNAL_ARTICLES.map((a) => [a.slug, a]));

export function getArticle(slug: string): JournalArticle | undefined {
  return JOURNAL_BY_SLUG[slug];
}
