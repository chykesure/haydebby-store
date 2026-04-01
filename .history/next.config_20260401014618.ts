import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,        // Changed back — better to catch real TS errors
  },

  reactStrictMode: false,

  // allowedDevOrigins is not a standard Next.js option — remove it
  // allowedDevOrigins: ["*"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Clean up experimental options (these were causing issues or are no longer needed)
  experimental: {
    // workerThreads and cpus are no longer recommended here
    // Remove them unless you have a specific reason
  },

  // Helpful for Prisma on low-resource platforms like Render
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/.prisma/client/**/*"],
  },
};

export default nextConfig;