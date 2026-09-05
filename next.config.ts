import type { NextConfig } from "next";
import path from "node:path";
import manifest from "./src/generated/mambo/manifest";

const nextConfig: NextConfig = {
  output: "export",
  basePath: manifest.site.basePath,
  trailingSlash: manifest.site.trailingSlash,
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
