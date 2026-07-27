import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
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
      { source: "/the-wolf-way/heirloom", destination: "/the-wolf-way#heirloom", permanent: true },
      { source: "/the-wolf-way/low-house", destination: "/the-wolf-way#low-house", permanent: true },
      { source: "/the-wolf-way/courtyard", destination: "/the-wolf-way#courtyard", permanent: true },
      { source: "/the-wolf-way/monastic", destination: "/the-wolf-way#monastic", permanent: true },
      { source: "/the-wolf-way/ritual", destination: "/the-wolf-way#ritual", permanent: true },
    ];
  },
};

export default nextConfig;
