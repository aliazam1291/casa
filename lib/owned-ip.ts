// THE IP SYSTEM — Brand Book §10, "Language we own, not rent", plus §02's
// "Words we own". Both pages name the same five things, with the book's own
// role labels and definitions. Quoted rather than paraphrased: these are the
// terms Wolf Casa owns, and rewording them is how owned language stops being
// owned.
export type OwnedIP = {
  slug: string;
  /** The book's role label — CATEGORY, METHOD, PHILOSOPHY, PROMISE, TRUTH. */
  role: string;
  name: string;
  /** The book's definition, near-verbatim. */
  meaning: string;
  href?: string;
};

export const OWNED_IP: OwnedIP[] = [
  {
    slug: "composed-living",
    role: "Philosophy",
    name: "Composed Living",
    meaning: "Rooms resolved, not rooms filled. The belief under everything.",
    href: "/way-of-light-form",
  },
  {
    slug: "the-interio-mall",
    role: "Category",
    name: "The Interio Mall",
    meaning: "Our name for the format — every category of the room, under one roof.",
  },
  {
    slug: "the-wolf-way",
    role: "Method",
    name: "The Wolf Way",
    meaning: "How we compose, sell and explain a room — the operating system.",
    href: "/the-wolf-way",
  },
  {
    slug: "under-one-roof",
    role: "Promise",
    name: "Under One Roof",
    meaning: "The whole decision, in one place.",
    href: "/visit",
  },
  {
    slug: "the-room-is-the-product",
    role: "Truth",
    name: "The room is the product",
    meaning: "We sell the outcome, never the object.",
    href: "/the-house-and-rooms#the-rooms",
  },
];
