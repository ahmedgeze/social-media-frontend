import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui", "@repo/types", "@repo/api-client", "@repo/auth-lib"],
  basePath: "",
};

export default nextConfig;
