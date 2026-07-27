// Widened from a closed 4-path union so new imagery (rooms, catalogue,
// journal) doesn't require touching this file — any path under /images/.
export type SiteImage = `/images/${string}`;

export type SiteCard = {
  title: string;
  eyebrow: string;
  body: string;
  href: string;
  signal: string;
  image: SiteImage;
};

export type SitePage = {
  title: string;
  eyebrow: string;
  description: string;
  image: SiteImage;
  imageAlt: string;
  intro: string;
  cards: SiteCard[];
  principles: string[];
  cta: { label: string; href: string };
  departments: { label: string; detail: string }[];
  palette: { name: string; material: string; value: string; note: string }[];
  metrics: { value: string; label: string }[];
};

const villa = "/images/editorial/villa-hero.png" as const;
const materials = "/images/editorial/materials.png" as const;
const sojourn = "/images/editorial/sojourn.png" as const;
const atrium = "/images/editorial/light-form-atrium.png" as const;

const mallDepartments = [
  { label: "Furniture", detail: "Named pieces, sofas, beds, dining, accents" },
  { label: "Materials", detail: "Wood, marble, stone, textile, metal, finish" },
  { label: "Rooms", detail: "Living, bedrooms, kitchens, baths, courtyards" },
  { label: "Services", detail: "Consultation, sourcing, trade, installation" },
];

const worldDepartments = [
  { label: "Heirloom", detail: "Modern heritage, permanence, inheritance." },
  { label: "Low House", detail: "Grounded living, horizontal calm, close to the earth." },
  { label: "Courtyard", detail: "Air, light, stone, water — the home breathes here." },
  { label: "Monastic", detail: "Restraint, silence, discipline, essential form." },
];

const ritualDepartments = [
  { label: "Consultation", detail: "A guided reading of the room you already have." },
  { label: "Casa Sojourn", detail: "A sourcing journey through makers and material." },
  { label: "Materials Library", detail: "Stone, wood, textile and metal, side by side." },
  { label: "Signature Evenings", detail: "Private previews of new compositions." },
];

const consultationDepartments = [
  { label: "Before", detail: "Plans, photographs, material samples, honest notes." },
  { label: "During", detail: "A sixty-minute reading of light, flow and habit." },
  { label: "After", detail: "A clear direction, not a generic mood board." },
  { label: "Next", detail: "A shortlist you can act on immediately." },
];

const sojournDepartments = [
  { label: "Day 01", detail: "Read the material before the finished object." },
  { label: "Day 02", detail: "Meet the makers behind scale and finish." },
  { label: "Day 03", detail: "Return with a smaller, stronger edit." },
  { label: "After", detail: "A shortlist carried into your consultation." },
];

const materialsDepartments = [
  { label: "Stone", detail: "Marble, granite and travertine, read by vein." },
  { label: "Timber", detail: "Walnut, oak and teak, read by grain." },
  { label: "Textile", detail: "Linen, leather and weave, read by hand." },
  { label: "Metal", detail: "Brass and blackened steel, used with restraint." },
];

const journalDepartments = [
  { label: "Way of Light", detail: "How the day itself becomes a material." },
  { label: "Material Intelligence", detail: "Reading stone, wood and leather as evidence." },
  { label: "Lived Emotion", detail: "The objects a room is built around." },
  { label: "Field Notes", detail: "Short dispatches from the workshop floor." },
];

const houseDepartments = [
  { label: "Since 2024", detail: "A working legacy built one home at a time." },
  { label: "110 hands", detail: "Designers, craftspeople and makers in-house." },
  { label: "40,000 sq ft", detail: "A production ecosystem built for care at scale." },
  { label: "Indore & Dewas", detail: "Both facilities, and every home built from here." },
];

const architectDepartments = [
  { label: "Access", detail: "Finishes, dimensions and material support on request." },
  { label: "Edit", detail: "A room-led composition built to your brief." },
  { label: "Timeline", detail: "Lead times and capacity, shared upfront." },
  { label: "Install", detail: "Support through to the final placement." },
];

const visitDepartments = [
  { label: "Showroom", detail: "Fully composed rooms, open in Indore." },
  { label: "By Appointment", detail: "Guided time with a curator, plans in hand." },
  { label: "Architect Hub", detail: "Samples, drawings and project support." },
  { label: "Directions", detail: "PU 4, Vijay Nagar, Indore — details on request." },
];

const defaultPalette = [
  { name: "Ivory", material: "Lime plaster", value: "#E8E1D3", note: "A quiet wall finish that lets sunlight draw the room." },
  { name: "Walnut", material: "Wood", value: "#5A3D2E", note: "Warm joinery and furniture forms with visible depth." },
  { name: "Sand", material: "Stone", value: "#C9BDA6", note: "A cool, permanent counterpoint to soft upholstery." },
  { name: "Brass", material: "Metal", value: "#A78657", note: "Small highlights used with restraint, never as noise." },
];

export const SITE_PAGES: Record<string, SitePage> = {
  "way-of-light-form": {
    eyebrow: "Design philosophy · Internal",
    title: "Way of Light & Form",
    description: "Light decides what the eye remembers. More is not the answer — resolved is. Our internal philosophy for illumination, proportion and material.",
    image: atrium,
    imageAlt: "A composed home interior where sunlight casts long shadows across wood and marble",
    intro:
      "Wolf Casa is a home interior mall for composed living. We bring furniture, materials, room planning and sourcing into one considered experience, so a home can be selected with feeling and built with clarity.",
    cards: [
      { eyebrow: "01 / Light", title: "Shadows compose the empty space", body: "We treat sunlight, shade and pause as real design materials. The empty parts of a room should feel intentional, not unfinished.", href: "/journal/why-light-is-the-material", signal: "Shadow, proportion, silence", image: atrium },
      { eyebrow: "02 / Form", title: "Material gives the room its body", body: "Wood, marble, stone, metal and textile are selected for temperature, grain, reflection and how they age inside daily life.", href: "/experiences/materials-library", signal: "Wood, marble, texture", image: materials },
      { eyebrow: "03 / Mall", title: "Everything for the home under one roof", body: "Explore furniture, finishes, floor plans, styling, consultation and sourcing as one connected composition rather than scattered shopping.", href: "/experiences", signal: "Furniture, rooms, sourcing", image: sojourn },
    ],
    principles: ["Empty space must feel designed.", "Material should be touched before it is chosen.", "A home works best when every room belongs to the same story."],
    cta: { label: "Begin your home composition", href: "/experiences/consultation" },
    departments: mallDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "40k", label: "sq ft interior experience" },
      { value: "2024", label: "founded, in Indore" },
      { value: "1", label: "home destination" },
    ],
  },
  "the-wolf-way": {
    eyebrow: "The method",
    title: "The Wolf Way",
    description: "Ten principles for selling, styling and explaining complete rooms instead of isolated products. The wolf does not decorate — it marks territory.",
    image: villa,
    imageAlt: "Layered contemporary living room in a modern Indian home",
    intro: "The Wolf Way is not a catalogue. It is a set of atmospheres, each one a starting point for a home with its own rhythm.",
    cards: [
      { eyebrow: "01 / Heirloom", title: "The Heirloom Way", body: "Modern heritage for rooms that collect meaning over time.", href: "/the-wolf-way/heirloom", signal: "Memory, permanence", image: villa },
      { eyebrow: "02 / Courtyard", title: "The Courtyard Way", body: "Stone, air and a quieter relationship with the day outside.", href: "/the-wolf-way/courtyard", signal: "Air, stone, water", image: atrium },
      { eyebrow: "03 / Monastic", title: "The Monastic Way", body: "Essential forms and generous negative space for deep rest.", href: "/the-wolf-way/monastic", signal: "Restraint, silence", image: materials },
    ],
    principles: ["Composition before collection.", "Named objects before anonymous products.", "A room should become more itself with time."],
    cta: { label: "Explore named objects", href: "/the-wolf-way/object/the-low-sofa" },
    departments: worldDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "05", label: "interior worlds" },
      { value: "100+", label: "objects to compose with" },
      { value: "360", label: "degree room thinking" },
    ],
  },
  experiences: {
    eyebrow: "The rituals",
    title: "Experiences",
    description: "Not a warehouse — a sequence of composed territories. Seven showroom stages, named compositions, and the rituals of consultation and sourcing.",
    image: sojourn,
    imageAlt: "Refined furniture sourcing atelier with samples and prototypes",
    intro: "The work of composing a home deserves its own rituals: looking closely, travelling well and making decisions with material in hand.",
    cards: [
      { eyebrow: "01 / Consultation", title: "Signature Consultation", body: "A thoughtful diagnosis of the room you have and the life you want it to hold.", href: "/experiences/consultation", signal: "Room audit", image: atrium },
      { eyebrow: "02 / Sojourn", title: "Casa Sojourn", body: "Travel through the worlds of making, sourcing and selecting with our curators.", href: "/experiences/furniture-tourism", signal: "Sourcing journey", image: sojourn },
      { eyebrow: "03 / Library", title: "Materials Library", body: "A tactile table of stone, timber, textile and finish made for comparison.", href: "/experiences/materials-library", signal: "Touch and compare", image: materials },
    ],
    principles: ["See before you select.", "Touch before you decide.", "Every process should make the home more personal."],
    cta: { label: "Book a consultation", href: "/experiences/consultation" },
    departments: ritualDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "03", label: "ways to begin" },
      { value: "1:1", label: "guided consultation" },
      { value: "End", label: "to end sourcing" },
    ],
  },
  "experiences/consultation": {
    eyebrow: "Signature consultation",
    title: "The room audit",
    description: "A guided conversation to find the missing composition in your home.",
    image: atrium,
    imageAlt: "A refined home interior with shadows, wood and marble",
    intro: "Bring photographs, dimensions and the stories of how you live. We identify the room's problem, its potential and the composition that answers it.",
    cards: [
      { eyebrow: "Before", title: "Bring the evidence", body: "Plans, pictures, material samples and honest notes about what is not working.", href: "/visit", signal: "Photos, plans, doubts", image: materials },
      { eyebrow: "During", title: "Read the proportions", body: "We map light, circulation, rituals and the objects already worth keeping.", href: "/way-of-light-form", signal: "Light and movement", image: atrium },
      { eyebrow: "After", title: "Receive a direction", body: "Leave with a clear next step, material direction and a considered shortlist.", href: "/experiences/materials-library", signal: "Plan and shortlist", image: sojourn },
    ],
    principles: ["There are no generic solutions.", "We start with what already matters.", "Good decisions make a room feel quieter."],
    cta: { label: "Plan your visit", href: "/visit" },
    departments: consultationDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "60", label: "minute room reading" },
      { value: "04", label: "focus areas" },
      { value: "01", label: "clear direction" },
    ],
  },
  "experiences/furniture-tourism": {
    eyebrow: "Casa Sojourn",
    title: "Go where the objects begin",
    description: "A curated sourcing journey through furniture, craft and material culture.",
    image: sojourn,
    imageAlt: "Design workshop with furniture prototypes and material samples",
    intro: "Casa Sojourn turns furniture sourcing into an informed, intimate journey, revealing the making behind the objects you choose.",
    cards: [
      { eyebrow: "Day 01", title: "Read the material", body: "Start with timber, stone and textile before looking at a finished object.", href: "/experiences/materials-library", signal: "Material origin", image: materials },
      { eyebrow: "Day 02", title: "Meet the maker", body: "Visit the workshops and factories where scale, finish and care become visible.", href: "/the-house", signal: "Craft and capacity", image: sojourn },
      { eyebrow: "Day 03", title: "Make the edit", body: "Return with a smaller, stronger set of objects for your home.", href: "/experiences/consultation", signal: "Final selection", image: atrium },
    ],
    principles: ["Sourcing is a form of seeing.", "The best objects carry provenance.", "A journey changes the way you choose."],
    cta: { label: "Enquire about Casa Sojourn", href: "/visit" },
    departments: sojournDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "03", label: "day sourcing ritual" },
      { value: "Maker", label: "led discovery" },
      { value: "Edit", label: "before purchase" },
    ],
  },
  "experiences/materials-library": {
    eyebrow: "Materials library",
    title: "Touch changes the decision",
    description: "Stone, wood, marble, textile and metal collected for a more informed way of composing interiors.",
    image: materials,
    imageAlt: "Curated interior material samples and objects",
    intro: "The materials library makes a home feel tangible before it is built. Compare temperature, grain, patina and scale in one calm place.",
    cards: [
      { eyebrow: "Stone", title: "Read the veins", body: "Every slab carries a different movement, temperature and degree of reflection.", href: "/journal", signal: "Marble and stone", image: materials },
      { eyebrow: "Timber", title: "Learn the grain", body: "The right wood gives a room depth long before it gives it colour.", href: "/way-of-light-form", signal: "Walnut and oak", image: atrium },
      { eyebrow: "Textile", title: "Feel the finish", body: "Textile is the difference between a room that photographs well and a room that lives well.", href: "/experiences/consultation", signal: "Linen, leather, weave", image: sojourn },
    ],
    principles: ["Material choices should age well.", "Contrast is more useful than matching.", "The hand knows what the eye cannot."],
    cta: { label: "Visit the library", href: "/visit" },
    departments: materialsDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "Wood", label: "warmth and grain" },
      { value: "Marble", label: "light and permanence" },
      { value: "Textile", label: "comfort and touch" },
    ],
  },
  journal: {
    eyebrow: "The journal",
    title: "Teach taste before selling product",
    description: "Wolf Casa's journal on light, material intelligence, craft and composed living.",
    image: materials,
    imageAlt: "A curated still life of stone, textile and wood samples",
    intro: "The Journal is an ongoing record of useful attention: how to choose, what to notice and why the most lasting rooms rarely arrive all at once.",
    cards: [
      { eyebrow: "Way of light", title: "The material you never pay for", body: "How to arrange a room around the changing day rather than against it.", href: "/journal/why-light-is-the-material", signal: "Light as material", image: atrium },
      { eyebrow: "Material intelligence", title: "What stone remembers", body: "A guide to reading character, variation and permanence in natural materials.", href: "/journal/reading-stone-wood-leather", signal: "Stone, wood, leather", image: materials },
      { eyebrow: "Lived emotion", title: "The chair you return to", body: "Why the most personal rooms have a place for pause built into them.", href: "/journal/the-chair-you-return-to", signal: "Ritual object", image: sojourn },
    ],
    principles: ["Notice before you acquire.", "Taste is a practice.", "A home can be edited slowly."],
    cta: { label: "Read the latest story", href: "/journal/why-light-is-the-material" },
    departments: journalDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "Read", label: "before you buy" },
      { value: "Taste", label: "as daily practice" },
      { value: "Slow", label: "home editing" },
    ],
  },
  "the-house": {
    eyebrow: "The house",
    title: "Modern Indian living, carefully composed",
    description: "Meet the people, craft and legacy behind Wolf Casa.",
    image: villa,
    imageAlt: "A warm contemporary Indian residence with crafted materials",
    intro: "Established 2024, Wolf Casa makes homes through a close relationship with craft, international sourcing and the people who live in the rooms — from Indore and, since expanding, Dewas.",
    cards: [
      { eyebrow: "Since 2024", title: "A working legacy", body: "Built through long relationships with makers, materials and homes across India.", href: "/visit", signal: "Experience", image: villa },
      { eyebrow: "110 hands", title: "A house of specialists", body: "Designers, craftspeople and makers who understand the value of a considered finish.", href: "/architects", signal: "Craft network", image: sojourn },
      { eyebrow: "40,000 sq ft", title: "Made with capacity", body: "A production ecosystem across Indore and Dewas that lets care survive at scale.", href: "/experiences/furniture-tourism", signal: "Scale and care", image: materials },
    ],
    principles: ["Legacy is built through care.", "Craft belongs in contemporary life.", "The people behind the object matter."],
    cta: { label: "Visit Wolf Casa", href: "/visit" },
    departments: houseDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "2024", label: "founded, in Indore" },
      { value: "110", label: "specialist hands" },
      { value: "40k", label: "sq ft across Indore & Dewas" },
    ],
  },
  architects: {
    eyebrow: "Architect hub",
    title: "For architects of atmosphere",
    description: "A dedicated Wolf Casa partnership for architects, designers and builders.",
    image: materials,
    imageAlt: "Material samples and interior finishes curated for a project",
    intro: "The Architect Hub is a practical door into our materials, named pieces, technical information and project support.",
    cards: [
      { eyebrow: "01", title: "Access the materials", body: "Request finishes, dimensions and curated material support for your project.", href: "/experiences/materials-library", signal: "Samples and specs", image: materials },
      { eyebrow: "02", title: "Build a project edit", body: "Work with our team to create a composition that fits the brief and the room.", href: "/experiences/consultation", signal: "Room-led edit", image: atrium },
      { eyebrow: "03", title: "Source with confidence", body: "Get visibility into lead times, craft, scale and installation considerations.", href: "/experiences/furniture-tourism", signal: "Project support", image: sojourn },
    ],
    principles: ["Technical detail without catalogue language.", "A clear route from concept to installation.", "Made for ambitious rooms."],
    cta: { label: "Request project access", href: "/visit" },
    departments: architectDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "Specs", label: "for professionals" },
      { value: "Lead", label: "time visibility" },
      { value: "Install", label: "support" },
    ],
  },
  visit: {
    eyebrow: "Visit the house",
    title: "Start in the room",
    description: "Visit the Wolf Casa showroom in Indore and bring your home into the conversation.",
    image: atrium,
    imageAlt: "Warmly lit residence with stone, wood and crafted interiors",
    intro: "The showroom is designed for lingering. Come with a plan, a question, a room that is not yet right, or simply a curiosity about material.",
    cards: [
      { eyebrow: "Indore", title: "The experience showroom", body: "Walk through fully composed rooms and see how materials change with the light.", href: "/the-wolf-way", signal: "Walk the worlds", image: villa },
      { eyebrow: "By appointment", title: "Bring your plans", body: "Book time with a curator to talk through a room, a renovation or a whole house.", href: "/experiences/consultation", signal: "Plan in hand", image: atrium },
      { eyebrow: "For professionals", title: "Visit the Architect Hub", body: "Arrange samples, drawings and project support in one conversation.", href: "/architects", signal: "Architect hub", image: materials },
    ],
    principles: ["A room is easier to understand in person.", "Bring the questions that matter.", "Leave with a clearer direction."],
    cta: { label: "Arrange a showroom visit", href: "/experiences/consultation" },
    departments: visitDepartments,
    palette: defaultPalette,
    metrics: [
      { value: "Indore", label: "experience showroom" },
      { value: "By appt", label: "guided visit" },
      { value: "Plans", label: "welcome" },
    ],
  },
};

export const DEFAULT_PAGE = SITE_PAGES["way-of-light-form"];
