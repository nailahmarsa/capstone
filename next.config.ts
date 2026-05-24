import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint tidak memblokir build di production
    // Jalankan 'npm run lint' secara terpisah untuk cek error
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mencegah TypeScript error memblokir build
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;