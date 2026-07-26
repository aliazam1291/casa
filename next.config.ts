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
};

export default nextConfig;
