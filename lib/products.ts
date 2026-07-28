// Real, currently-stocked accent pieces — sourced from Wolf Casa's own live
// storefront (wolfcasa.nowfloats.com), not the fictional named pieces in
// lib/pieces.ts. Kept as a separate, small list rather than merged into
// PIECES so the room-composition story and real day-to-day inventory never
// get conflated with each other.
//
// These display in-site only — no outbound links to the storefront. `desc`
// is shown directly on the card so a visitor never has to leave to learn
// what a piece is.
export type StockPiece = {
  name: string;
  desc: string;
  price: number;
  image: `/images/products/${string}`;
};

export const STOCK_PIECES: StockPiece[] = [
  { name: "Alpha", desc: "Two-tone accent chair, channel-tufted back.", price: 7899, image: "/images/products/alpha.webp" },
  { name: "Vitro", desc: "Boxy velvet pouf, tapered brass legs.", price: 8399, image: "/images/products/vitro.webp" },
  { name: "Drum", desc: "Cylindrical bouclé pouf, contrast base.", price: 14999, image: "/images/products/drum.webp" },
  { name: "Honda Ottoman", desc: "Oval bench ottoman, two-tone upholstery.", price: 12999, image: "/images/products/honda-ottoman.webp" },
  { name: "Majesty", desc: "Low bench seat, sculpted profile.", price: 16999, image: "/images/products/majesty.webp" },
  { name: "Zoya", desc: "Round pouf on a slim metal frame.", price: 7899, image: "/images/products/zoya.webp" },
  { name: "Messy", desc: "Slouched velvet pouf, casual form.", price: 6399, image: "/images/products/messy.webp" },
  { name: "Mushroom", desc: "Domed accent stool, contrast band.", price: 4899, image: "/images/products/mushroom.webp" },
  { name: "Moon", desc: "Rounded pouf, tonal upholstery.", price: 4999, image: "/images/products/moon.webp" },
  { name: "Flow", desc: "Low curved bench, single sweep form.", price: 5399, image: "/images/products/flow.webp" },
  { name: "Floss", desc: "Channel-stitched cylinder pouf.", price: 5899, image: "/images/products/floss.webp" },
  { name: "Honda", desc: "Compact cube stool, contrast trim.", price: 5899, image: "/images/products/honda-2.webp" },
];
