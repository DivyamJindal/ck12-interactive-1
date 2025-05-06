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
}

module.exports = nextConfig
