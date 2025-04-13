import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'medimee.com', // 🔥 medimee.comを許可
      },
    ],
  },
};

export default nextConfig;
