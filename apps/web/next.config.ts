import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Media lives in the CMS, so next/image needs the CMS host allow-listed.
    // The production host is added through an environment variable at deploy
    // time rather than hardcoded here.
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "1337" },
      { protocol: "http", hostname: "localhost", port: "1337" },
      ...(process.env.CMS_IMAGE_HOSTNAME
        ? ([
            {
              protocol: "https" as const,
              hostname: process.env.CMS_IMAGE_HOSTNAME,
            },
          ])
        : []),
    ],
  },
};

export default nextConfig;
