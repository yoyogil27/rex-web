// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'msntpwnoseenxweiayxr.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // React strict mode
  reactStrictMode: true,

  // Output standalone for Vercel deployment
  output: 'standalone',
};

export default nextConfig;