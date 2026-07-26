import type { MetadataRoute } from "next";
import { SITE_PAGES } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wolfcasa.in";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...Object.keys(SITE_PAGES).map((path) => ({ url: `${base}/${path}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
