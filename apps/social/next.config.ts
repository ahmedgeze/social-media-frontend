import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui", "@repo/types", "@repo/api-client", "@repo/auth-lib"],
};

export default nextConfig;
