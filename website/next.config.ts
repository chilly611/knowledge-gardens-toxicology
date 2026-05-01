import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Lock Turbopack's workspace root to THIS directory.
  // Without this, Next.js finds the parent's package-lock.json (a sibling
  // project at "TheKnowledgeGardens PC 1/") and resolves routes from there,
  // which yields a blank page on /.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
