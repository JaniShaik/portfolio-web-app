import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow `.mdx` files to be used as routes or imported as components.
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Remark/rehype plugins must be referenced by string name to work with Turbopack.
const withMDX = createMDX({});

export default withMDX(nextConfig);
