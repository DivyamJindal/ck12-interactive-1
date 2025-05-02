/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server components since we're using client-side only features
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
