/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configure for GitHub Pages
  basePath: '',
  assetPrefix: '',
  // Disable server-side features
  experimental: {
    appDir: true,
  },
  // Ensure output is static
  distDir: 'dist',
  trailingSlash: true,
}

module.exports = nextConfig
