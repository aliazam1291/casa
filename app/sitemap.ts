import type { MetadataRoute } from "next";
import { SITE_PAGES } from "@/lib/site-content";
import { ROOMS } from "@/lib/rooms";
import { PIECES } from "@/lib/pieces";
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
  const pieces = PIECES.map((p) => ({ url: `${base}/pieces/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 }));
  // /catalogue and its fifty-one subtype URLs are retired and 301 to /shop, so
  // none of them belong here — a sitemap must not advertise a redirect.
  const catalogue = [
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
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
