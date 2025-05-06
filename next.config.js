/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configure for GitHub Pages
  basePath: process.env.GITHUB_ACTIONS ? '/ck12-interactive-1' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/ck12-interactive-1/' : '',
  // Disable server-side features
  experimental: {
    appDir: true,
  },
  // Ensure output is static
  distDir: 'out',
  trailingSlash: true,
}

module.exports = nextConfig
