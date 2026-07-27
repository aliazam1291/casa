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
  const rooms = [
    { url: `${base}/rooms`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    ...ROOMS.map((r) => ({ url: `${base}/rooms/${r.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
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
    ...pieces,
    ...catalogue,
    ...journal,
  ];
}
