import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Type safety is enforced by the explicit `npm run typecheck` build step.
  // Skipping Next's duplicate checker also avoids an unnecessary worker process.
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: true,
  },
};

export default nextConfig;
