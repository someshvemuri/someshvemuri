/** @type {import('next').NextConfig} */

const { generateVaultManifest } = require('./scripts/generate-vault-manifest');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Generate vault manifest before build
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Only run on server build to avoid duplicates
      generateVaultManifest();
    }
    return config;
  },
}

module.exports = nextConfig
