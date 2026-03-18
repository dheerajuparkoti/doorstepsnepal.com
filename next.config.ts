import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

   images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'doorstep-images.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
