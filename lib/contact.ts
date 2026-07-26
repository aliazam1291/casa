// Single source of truth for factual claims about the business — consumed
// by the footer, /visit, /the-house and the JSON-LD in app/layout.tsx.
//
// Address is sourced from public directory listings for Wolf Casa's Indore
// showroom. Phone and email are NOT included: no verified number or address
// could be confirmed from available sources, and inventing one would be
// worse than omitting it. Replace CONTACT.phone / CONTACT.email once you
// have the real values — every consumer of this file already handles the
// empty-string case by omitting that row rather than rendering it blank.
export const CONTACT = {
  brand: "Wolf Casa",
  founded: 2007,
  city: "Indore",
  region: "Madhya Pradesh, India",
  facilities: "A combined 40,000 sq ft across Indore and Dewas",
  staff: "110+ specialists in-house",
  showroom: {
    name: "Wolf Casa Showroom",
    line1: "PU 4, Vijay Nagar",
    line2: "Indore, Madhya Pradesh",
    size: "3,000 sq ft",
    mapQuery: "Wolf Casa, PU 4, Vijay Nagar, Indore",
  },
  phone: "", // TODO: confirm and add — see note above
  email: "", // TODO: confirm and add — see note above
  hours: "By appointment, Tuesday–Sunday",
} as const;

export function contactMapUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.showroom.mapQuery)}`;
}
