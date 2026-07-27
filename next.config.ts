import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Pin the workspace root — C:\Users\GT2448 has a stray package-lock.json
  // from an unrelated repo that otherwise confuses Turbopack's inference.
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // These used to silently render the parent page's content under a
      // duplicate, self-referencing canonical (see app/[...slug]/page.tsx).
      // The named objects never had real detail pages; /rooms is the closest
      // real destination for a visitor following an old link here.
      { source: "/the-wolf-way/object/:slug*", destination: "/rooms", permanent: true },
      // The 5 invented "Worlds" are retired in favour of the Brand Book's 8
      // Signature Compositions — old slugs fall back to the section itself
      // rather than 404ing, since none maps cleanly 1:1 to a new slug.
      { source: "/the-wolf-way/heirloom", destination: "/the-wolf-way", permanent: true },
      { source: "/the-wolf-way/low-house", destination: "/the-wolf-way", permanent: true },
      { source: "/the-wolf-way/courtyard", destination: "/the-wolf-way", permanent: true },
      { source: "/the-wolf-way/monastic", destination: "/the-wolf-way", permanent: true },
      { source: "/the-wolf-way/ritual", destination: "/the-wolf-way", permanent: true },
      { source: "/the-wolf-way/nocturne", destination: "/the-wolf-way#nocturne", permanent: true },
      { source: "/the-wolf-way/terra-form", destination: "/the-wolf-way#terra-form", permanent: true },
      { source: "/the-wolf-way/luxe-minimal", destination: "/the-wolf-way#luxe-minimal", permanent: true },
      { source: "/the-wolf-way/urban-oasis", destination: "/the-wolf-way#urban-oasis", permanent: true },
      { source: "/the-wolf-way/monochrome", destination: "/the-wolf-way#monochrome", permanent: true },
      { source: "/the-wolf-way/golden-hour", destination: "/the-wolf-way#golden-hour", permanent: true },
      { source: "/the-wolf-way/artisan-layer", destination: "/the-wolf-way#artisan-layer", permanent: true },
      { source: "/the-wolf-way/forest-silence", destination: "/the-wolf-way#forest-silence", permanent: true },
      { source: "/trade", destination: "/architects", permanent: true },
    ];
  },
};

export default nextConfig;
