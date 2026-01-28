import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.65",
        port: "5010",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ismail4001.binarybards.online",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.optimushs.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
