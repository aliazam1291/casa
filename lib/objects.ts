/**
 * The Named Objects gallery — lifted verbatim from
 * wolf-casa-homepage-v3.html's OBJECTS array (~line 863).
 * URL slugs follow Website_IA.md §4's `/the-wolf-way/object/[slug]`.
 */
export type NamedObject = {
  n: string;
  t: string;
  slug: string;
  img: string;
};

export const OBJECTS: NamedObject[] = [
  {
    n: "01",
    t: "The Low Sofa",
    slug: "the-low-sofa",
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    n: "02",
    t: "The Heirloom Table",
    slug: "the-heirloom-table",
    img: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85",
  },
  {
    n: "03",
    t: "The Shadow Lamp",
    slug: "the-shadow-lamp",
    img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
  },
  {
    n: "04",
    t: "The Monastic Bed",
    slug: "the-monastic-bed",
    img: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1200&q=85",
  },
  {
    n: "05",
    t: "The Quiet Wardrobe",
    slug: "the-quiet-wardrobe",
    img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    n: "06",
    t: "The Hearth Kitchen",
    slug: "the-hearth-kitchen",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85",
  },
];
