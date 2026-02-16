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
        hostname: "10.10.7.104",
        port: "4001",
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
