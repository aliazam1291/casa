import type { MetadataRoute } from "next";
import { SITE_PAGES } from "@/lib/site-content";
import { ROOMS } from "@/lib/rooms";
import { PIECES } from "@/lib/pieces";
import { CATALOGUE } from "@/lib/catalogue";
import { JOURNAL_ARTICLES } from "@/lib/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wolfcasa.in";
  const now = new Date();

  const pages = Object.keys(SITE_PAGES).map((path) => ({ url: `${base}/${path}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }));
  // /rooms and /the-house both 301 to /the-house-and-rooms, so only the merged
  // page is listed — a sitemap should never advertise a redirecting URL. The
  // thirteen /rooms/[slug] detail pages are unaffected and stay.
  const rooms = [
    { url: `${base}/the-house-and-rooms`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    ...ROOMS.map((r) => ({ url: `${base}/rooms/${r.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
  const products = [{ url: `${base}/products`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 }];
  const pieces = PIECES.map((p) => ({ url: `${base}/pieces/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 }));
  const catalogue = [
    { url: `${base}/catalogue`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    ...CATALOGUE.flatMap((c) => [
      { url: `${base}/catalogue/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
      ...c.subtypes.map((s) => ({ url: `${base}/catalogue/${c.slug}/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
    ]),
  ];
  const journal = JOURNAL_ARTICLES.map((a) => ({ url: `${base}/journal/${a.slug}`, lastModified: new Date(a.published), changeFrequency: "yearly" as const, priority: 0.6 }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...pages,
    ...rooms,
    ...products,
    ...pieces,
    ...catalogue,
    ...journal,
  ];
}
