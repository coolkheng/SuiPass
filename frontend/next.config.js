/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
    reactStrictMode: true,
    // Ensure Walrus packages are not bundled by Next.js (they will load WASM at runtime)
    experimental: {
        serverActions: true
    },
    serverExternalPackages: ['@mysten/walrus', '@mysten/walrus-wasm'],
  };
  
  module.exports = nextConfig;
  