import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // POI/media assets are served from the CDN in production; local /public/media in dev.
    remotePatterns: [
      { protocol: "https", hostname: "media.apolloadventurepark.example" },
    ],
  },
};

export default nextConfig;
