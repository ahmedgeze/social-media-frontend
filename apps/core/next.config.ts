import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui", "@repo/types", "@repo/auth-lib"],
  async rewrites() {
    return [
      // Auth app routes
      {
        source: "/login",
        destination: "http://localhost:3001/login",
      },
      {
        source: "/register",
        destination: "http://localhost:3001/register",
      },
      {
        source: "/profile",
        destination: "http://localhost:3001/profile",
      },
      // Social app routes
      {
        source: "/feed",
        destination: "http://localhost:3002/",
      },
      {
        source: "/users",
        destination: "http://localhost:3002/users",
      },
    ];
  },
};

export default nextConfig;
