import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.newhomeinc.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
