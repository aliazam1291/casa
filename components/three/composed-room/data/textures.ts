import type { TextureKey } from "./types";

const BASE = "https://images.unsplash.com/";
const Q = "?w=800&auto=format&fit=crop&q=80";

export const TEXTURE_URLS: Record<TextureKey, string> = {
  marble: `${BASE}photo-1608537928567-b95e60d7e2be${Q}`,
  marble2: `${BASE}photo-1595521969473-4d1b48fdedca${Q}`,
  travertine: `${BASE}photo-1615873968403-89e068629265${Q}`,
  portrait: `${BASE}photo-1578321272176-b7bbc0679853${Q}`,
};
