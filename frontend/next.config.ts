import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev uses webpack via `npm run dev` — avoids Turbopack HMR panics on Windows.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
