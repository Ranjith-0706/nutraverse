import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Category links from earlier builds now live on the catalogue filter.
  async redirects() {
    return ["sports-nutrition", "vitamins-supplements", "natural-wellness"].map((slug) => ({
      source: `/products/${slug}`,
      destination: `/products?category=${slug}`,
      permanent: false,
    }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
