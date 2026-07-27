// Real, currently-stocked accent pieces — sourced from Wolf Casa's own live
// storefront (wolfcasa.nowfloats.com), not the fictional named pieces in
// lib/pieces.ts. Kept as a separate, small list rather than merged into
// PIECES so the room-composition story and real day-to-day inventory never
// get conflated with each other.
export type StockPiece = {
  name: string;
  price: number;
  image: `/images/products/${string}`;
  href: string;
};

export const STOCK_PIECES: StockPiece[] = [
  { name: "Alpha", price: 7899, image: "/images/products/alpha.webp", href: "https://wolfcasa.nowfloats.com/products/alpha/79" },
  { name: "Vitro", price: 8399, image: "/images/products/vitro.webp", href: "https://wolfcasa.nowfloats.com/products/vitro/78" },
  { name: "Drum", price: 14999, image: "/images/products/drum.webp", href: "https://wolfcasa.nowfloats.com/products/drum/87" },
  { name: "Honda Ottoman", price: 12999, image: "/images/products/honda-ottoman.webp", href: "https://wolfcasa.nowfloats.com/products/honda-ottoman/86" },
  { name: "Majesty", price: 16999, image: "/images/products/majesty.webp", href: "https://wolfcasa.nowfloats.com/products/majesty/85" },
  { name: "Zoya", price: 7899, image: "/images/products/zoya.webp", href: "https://wolfcasa.nowfloats.com/products/zoya/84" },
  { name: "Messy", price: 6399, image: "/images/products/messy.webp", href: "https://wolfcasa.nowfloats.com/products/messy/83" },
  { name: "Mushroom", price: 4899, image: "/images/products/mushroom.webp", href: "https://wolfcasa.nowfloats.com/products/mushroom/82" },
  { name: "Moon", price: 4999, image: "/images/products/moon.webp", href: "https://wolfcasa.nowfloats.com/products/moon/81" },
  { name: "Flow", price: 5399, image: "/images/products/flow.webp", href: "https://wolfcasa.nowfloats.com/products/flow/80" },
  { name: "Floss", price: 5899, image: "/images/products/floss.webp", href: "https://wolfcasa.nowfloats.com/products/floss/77" },
  { name: "Honda", price: 5899, image: "/images/products/honda-2.webp", href: "https://wolfcasa.nowfloats.com/products/honda/76" },
];
