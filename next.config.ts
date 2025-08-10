import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slm.kr',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
