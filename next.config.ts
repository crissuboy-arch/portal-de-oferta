import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    // Server-side only environment variables (not exposed to client)
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NVIDIA_API_KEY: process.env.NVIDIA_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  },
  // A página pública do portal é o ficheiro estático public/portal.html.
  // "/" passa a mostrá-la (rewrite: o URL continua a ser "/"); o resto da app Next.js fica igual.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/portal.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;