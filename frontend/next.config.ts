import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev uses webpack via `npm run dev` — avoids Turbopack HMR panics on Windows.
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
