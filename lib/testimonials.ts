// PLACEHOLDER COPY — these are written to the brand's voice so the section can
// be designed and reviewed, but they are NOT real client quotes. Replace every
// entry with an attributable, permission-granted testimonial before this goes
// anywhere public; do not publish invented reviews as genuine ones.

export type Testimonial = {
  quote: string;
  name: string;
  place: string;
  /** What Wolf Casa actually did for them — sets the quote in context. */
  scope: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We came in expecting to choose a sofa and left having chosen a way of living. The team held the whole room in their head — light, stone, joinery, the walk from the door to the window — and every piece arrived already belonging to it.",
    name: "Ananya Rao",
    place: "Indore, Madhya Pradesh",
    scope: "Atrium living & courtyard dining",
  },
  {
    quote:
      "What convinced me was the restraint. They talked us out of two pieces we had our hearts set on because the room did not need them. A year on, the house still feels considered rather than decorated.",
    name: "Vikram Shethia",
    place: "Mumbai, Maharashtra",
    scope: "Master suite & executive study",
  },
  {
    quote:
      "As an architect I am difficult to work with on interiors, and I will say this plainly: the detailing held up to scrutiny. Reveals, shadow gaps, the way the timber met the stone. Nothing was hidden behind styling.",
    name: "Meera Krishnan",
    place: "Bengaluru, Karnataka",
    scope: "Full residence, four floors",
  },
  {
    quote:
      "The consultation alone changed the brief. We had been thinking room by room; they showed us the house as one composition and the plan simplified enormously from there.",
    name: "Devendra & Sunita Patel",
    place: "Dewas, Madhya Pradesh",
    scope: "Grand foyer & skyline salon",
  },
];
