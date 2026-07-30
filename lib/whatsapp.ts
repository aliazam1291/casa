import { CONTACT } from "./contact";

/**
 * WhatsApp enquiry links.
 *
 * WHY THIS EXISTS: Wolf Casa sells from Indore, and in India WhatsApp — not
 * email and not a web form — is where a furniture enquiry actually happens.
 * The consultation form still exists for the considered, "bring the evidence"
 * enquiry with photographs; this is the low-friction path for someone looking
 * at one piece on a phone who wants to ask about it now.
 *
 * The number is derived from CONTACT.phone rather than duplicated, so there is
 * still one source of truth for it. wa.me wants digits only — no +, spaces or
 * dashes — which is exactly what the strip below produces from the formatted
 * display number.
 */

/** CONTACT.phone reduced to the digits-only form wa.me requires. */
export const WHATSAPP_NUMBER = CONTACT.phone.replace(/\D/g, "");

/** False when no phone is configured, so callers can omit the CTA entirely. */
export const WHATSAPP_AVAILABLE = WHATSAPP_NUMBER.length >= 10;

/**
 * Build a wa.me link with the message pre-filled.
 *
 * The prefilled text names the exact thing being looked at. That is the whole
 * value: the showroom receives "I'm interested in Il Divano Lungo (Atrium
 * Living)" instead of "hi", so the first reply can be useful rather than
 * spent working out what the customer is looking at.
 */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Enquiry about one named piece, optionally naming the room it lives in. */
export function pieceEnquiryUrl(name: string, subtitle: string, roomName?: string): string {
  const where = roomName ? ` in the ${roomName}` : "";
  return whatsappUrl(
    `Hello ${CONTACT.brand}, I'd like to know more about ${name} (${subtitle})${where}.`,
  );
}

/** Enquiry about a whole room. */
export function roomEnquiryUrl(roomName: string): string {
  return whatsappUrl(`Hello ${CONTACT.brand}, I'd like to know more about the ${roomName}.`);
}

/** A saved composition — the board from components/composition. */
export function compositionEnquiryUrl(names: string[]): string {
  if (names.length === 0) return whatsappUrl(`Hello ${CONTACT.brand}, I'd like to compose a room.`);
  const list = names.map((n, i) => `${i + 1}. ${n}`).join("\n");
  return whatsappUrl(
    `Hello ${CONTACT.brand}, I've composed a room and I'd like to talk about it:\n\n${list}`,
  );
}
