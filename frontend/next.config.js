/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Increase timeout for file system operations (helps with iCloud Drive)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Increase timeout for server-side file reads
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 300,
        poll: 1000,
      };
    }
    return config;
  },
  // Disable static optimization for pages that might have issues
  experimental: {
    // This helps with file system timeouts
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig

