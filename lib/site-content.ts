export type SiteCard = {
  title: string;
  eyebrow: string;
  body: string;
  href: string;
};

export type SitePage = {
  title: string;
  eyebrow: string;
  description: string;
  image: "/images/editorial/villa-hero.png" | "/images/editorial/materials.png" | "/images/editorial/sojourn.png";
  imageAlt: string;
  intro: string;
  cards: SiteCard[];
  principles: string[];
  cta: { label: string; href: string };
};

const villa = "/images/editorial/villa-hero.png" as const;
const materials = "/images/editorial/materials.png" as const;
const sojourn = "/images/editorial/sojourn.png" as const;

export const SITE_PAGES: Record<string, SitePage> = {
  "way-of-light-form": {
    eyebrow: "The philosophy",
    title: "Way of Light & Form",
    description: "Wolf Casa composes modern Indian homes through proportion, material and lived ritual.",
    image: villa,
    imageAlt: "A contemporary Indian residence at dusk",
    intro: "A home should hold the life inside it. We begin with light, then listen for the objects and materials that make a room feel inevitable.",
    cards: [
      { eyebrow: "01 / Light", title: "Begin with the day", body: "Observe how a room receives morning, afternoon and evening before deciding what belongs there.", href: "/the-wolf-way" },
      { eyebrow: "02 / Form", title: "Choose the lasting shape", body: "A well-proportioned object earns its place through use, not novelty.", href: "/the-wolf-way/object/the-low-sofa" },
      { eyebrow: "03 / Ritual", title: "Leave room for life", body: "Every composition is built around how people gather, rest, work and return home.", href: "/experiences/consultation" },
    ],
    principles: ["No object without a reason.", "Material is memory made tactile.", "Luxury is the ease of a room that knows you."],
    cta: { label: "Begin with a room audit", href: "/experiences/consultation" },
  },
  "the-wolf-way": {
    eyebrow: "Five worlds",
    title: "Find your Wolf Way",
    description: "Explore five distinct interior worlds, composed for how you want to live.",
    image: villa,
    imageAlt: "Layered contemporary living room in a modern Indian home",
    intro: "The Wolf Way is not a catalogue. It is a set of atmospheres—each one a starting point for a home with its own rhythm.",
    cards: [
      { eyebrow: "01 / Heirloom", title: "The Heirloom Way", body: "Modern heritage for rooms that collect meaning over time.", href: "/the-wolf-way/heirloom" },
      { eyebrow: "02 / Courtyard", title: "The Courtyard Way", body: "Stone, air and a quieter relationship with the day outside.", href: "/the-wolf-way/courtyard" },
      { eyebrow: "03 / Monastic", title: "The Monastic Way", body: "Essential forms and generous negative space for deep rest.", href: "/the-wolf-way/monastic" },
    ],
    principles: ["Composition before collection.", "Named objects before anonymous products.", "A room should become more itself with time."],
    cta: { label: "Explore named objects", href: "/the-wolf-way/object/the-low-sofa" },
  },
  experiences: {
    eyebrow: "The rituals",
    title: "Experiences that stay with you",
    description: "From the first room audit to international sourcing, Wolf Casa makes the process as considered as the home.",
    image: sojourn,
    imageAlt: "Refined furniture sourcing atelier with samples and prototypes",
    intro: "The work of composing a home deserves its own rituals: looking closely, travelling well, and making decisions with material in hand.",
    cards: [
      { eyebrow: "01 / Consultation", title: "Signature Consultation", body: "A thoughtful diagnosis of the room you have, and the life you want it to hold.", href: "/experiences/consultation" },
      { eyebrow: "02 / Sojourn", title: "Casa Sojourn", body: "Travel through the worlds of making, sourcing and selecting with our curators.", href: "/experiences/furniture-tourism" },
      { eyebrow: "03 / Library", title: "Materials Library", body: "A tactile table of stone, timber, textile and finish—made for comparison.", href: "/experiences/materials-library" },
    ],
    principles: ["See before you select.", "Touch before you decide.", "Every process should make the home more personal."],
    cta: { label: "Book a consultation", href: "/experiences/consultation" },
  },
  "experiences/consultation": {
    eyebrow: "Signature consultation",
    title: "The room audit",
    description: "A guided conversation to find the missing piece in your home.",
    image: materials,
    imageAlt: "Interior materials gathered on a design table",
    intro: "Bring photographs, dimensions and the stories of how you live. We will identify the room's problem, its potential, and the composition that answers it.",
    cards: [
      { eyebrow: "Before we meet", title: "Bring the evidence", body: "Plans, pictures, material samples and honest notes about what is not working.", href: "/visit" },
      { eyebrow: "In the room", title: "Read the proportions", body: "We map light, circulation, rituals and the objects already worth keeping.", href: "/the-wolf-way" },
      { eyebrow: "After", title: "Receive a direction", body: "Leave with a clear next step, material direction and a considered shortlist.", href: "/experiences/materials-library" },
    ],
    principles: ["There are no generic solutions.", "We start with what already matters.", "Good decisions make a room feel quieter."],
    cta: { label: "Plan your visit", href: "/visit" },
  },
  "experiences/furniture-tourism": {
    eyebrow: "Casa Sojourn",
    title: "Go where the objects begin",
    description: "A curated sourcing journey through furniture, craft and material culture.",
    image: sojourn,
    imageAlt: "Design workshop with furniture prototypes and material samples",
    intro: "Casa Sojourn turns furniture sourcing into an informed, intimate journey—one that reveals the making behind the objects you choose.",
    cards: [
      { eyebrow: "Day 01", title: "Read the material", body: "Start with timber, stone and textile before looking at a finished object.", href: "/experiences/materials-library" },
      { eyebrow: "Day 02", title: "Meet the maker", body: "Visit the workshops and factories where scale, finish and care become visible.", href: "/the-house" },
      { eyebrow: "Day 03", title: "Make the edit", body: "Return with a smaller, stronger set of objects for your home.", href: "/experiences/consultation" },
    ],
    principles: ["Sourcing is a form of seeing.", "The best objects carry provenance.", "A journey changes the way you choose."],
    cta: { label: "Enquire about Casa Sojourn", href: "/visit" },
  },
  "experiences/materials-library": {
    eyebrow: "Materials library",
    title: "Touch changes the decision",
    description: "Stone, wood, textile and metal collected for a more informed way of composing interiors.",
    image: materials,
    imageAlt: "Curated interior material samples and objects",
    intro: "The materials library makes a home feel tangible before it is built. Compare temperature, grain, patina and scale in one calm place.",
    cards: [
      { eyebrow: "Stone", title: "Read the veins", body: "Every slab carries a different movement, temperature and degree of reflection.", href: "/journal" },
      { eyebrow: "Timber", title: "Learn the grain", body: "The right wood gives a room depth long before it gives it colour.", href: "/the-wolf-way" },
      { eyebrow: "Textile", title: "Feel the finish", body: "Textile is the difference between a room that photographs well and a room that lives well.", href: "/experiences/consultation" },
    ],
    principles: ["Material choices should age well.", "Contrast is more useful than matching.", "The hand knows what the eye cannot."],
    cta: { label: "Visit the library", href: "/visit" },
  },
  journal: {
    eyebrow: "The journal",
    title: "Teach taste before selling product",
    description: "Wolf Casa's journal on light, material intelligence, craft and composed living.",
    image: materials,
    imageAlt: "A curated still life of stone, textile and wood samples",
    intro: "The Journal is an ongoing record of useful attention: how to choose, what to notice and why the most lasting rooms rarely arrive all at once.",
    cards: [
      { eyebrow: "Way of light", title: "The material you never pay for", body: "How to arrange a room around the changing day rather than against it.", href: "/journal/why-light-is-the-material" },
      { eyebrow: "Material intelligence", title: "What stone remembers", body: "A guide to reading character, variation and permanence in natural materials.", href: "/journal/reading-stone-wood-leather" },
      { eyebrow: "Lived emotion", title: "The chair you return to", body: "Why the most personal rooms have a place for pause built into them.", href: "/journal/the-chair-you-return-to" },
    ],
    principles: ["Notice before you acquire.", "Taste is a practice.", "A home can be edited slowly."],
    cta: { label: "Read the latest story", href: "/journal/why-light-is-the-material" },
  },
  "the-house": {
    eyebrow: "The house",
    title: "Modern Indian living, carefully composed",
    description: "Meet the people, craft and legacy behind Wolf Casa.",
    image: villa,
    imageAlt: "A warm contemporary Indian residence with crafted materials",
    intro: "For over fifteen years, Wolf Casa has made homes through a close relationship with craft, international sourcing and the people who live in the rooms.",
    cards: [
      { eyebrow: "15 years", title: "A working legacy", body: "Built through long relationships with makers, materials and homes across India.", href: "/visit" },
      { eyebrow: "110 hands", title: "A house of specialists", body: "Designers, craftspeople and makers who understand the value of a considered finish.", href: "/trade" },
      { eyebrow: "40,000 sq ft", title: "Made with capacity", body: "A production ecosystem that lets care survive at scale.", href: "/experiences/furniture-tourism" },
    ],
    principles: ["Legacy is built through care.", "Craft belongs in contemporary life.", "The people behind the object matter."],
    cta: { label: "Visit Wolf Casa", href: "/visit" },
  },
  trade: {
    eyebrow: "Specifier desk",
    title: "For architects of atmosphere",
    description: "A dedicated Wolf Casa partnership for architects, designers and builders.",
    image: materials,
    imageAlt: "Material samples and interior finishes curated for a project",
    intro: "The Specifier Desk is a practical door into our materials, named objects, technical information and project support.",
    cards: [
      { eyebrow: "01", title: "Access the materials", body: "Request finishes, dimensions and curated material support for your project.", href: "/experiences/materials-library" },
      { eyebrow: "02", title: "Build a project edit", body: "Work with our team to create a composition that fits the brief and the room.", href: "/experiences/consultation" },
      { eyebrow: "03", title: "Source with confidence", body: "Get visibility into lead times, craft, scale and installation considerations.", href: "/experiences/furniture-tourism" },
    ],
    principles: ["Technical detail without the catalogue language.", "A clear route from concept to installation.", "Made for ambitious rooms."],
    cta: { label: "Request trade access", href: "/visit" },
  },
  visit: {
    eyebrow: "Visit the house",
    title: "Start in the room",
    description: "Visit the Wolf Casa showroom in Indore and bring your home into the conversation.",
    image: villa,
    imageAlt: "Warmly lit residence with stone, wood and crafted interiors",
    intro: "The showroom is designed for lingering. Come with a plan, a question, a room that is not yet right—or simply a curiosity about material.",
    cards: [
      { eyebrow: "Indore", title: "The experience showroom", body: "Walk through fully composed rooms and see how materials change with the light.", href: "/the-wolf-way" },
      { eyebrow: "By appointment", title: "Bring your plans", body: "Book time with a curator to talk through a room, a renovation or a whole house.", href: "/experiences/consultation" },
      { eyebrow: "For professionals", title: "Visit the Specifier Desk", body: "Arrange samples, drawings and project support in one conversation.", href: "/trade" },
    ],
    principles: ["A room is easier to understand in person.", "Bring the questions that matter.", "Leave with a clearer direction."],
    cta: { label: "Arrange a showroom visit", href: "/experiences/consultation" },
  },
};

export const DEFAULT_PAGE = SITE_PAGES["way-of-light-form"];
