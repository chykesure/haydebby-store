import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,        // ← Changed: Better to see real errors
  },

  reactStrictMode: false,

  // Remove this if it causes issues — it's not standard
  // allowedDevOrigins: ["*"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Remove experimental cpus/workerThreads — Render already limits resources
  // experimental: {
  //   workerThreads: false,
  //   cpus: 1,
  // },

  // Optional: Improve Prisma tracing on serverless/low-resource platforms
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/.prisma/client/**/*"],
  },

  // Optional but recommended for stability on Render
  eslint: {
    ignoreDuringBuilds: true,        // Temporarily allow if lint is noisy
  },
};

export default nextConfig;