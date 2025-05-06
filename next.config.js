/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ck12-interactive-1',
  assetPrefix: '/ck12-interactive-1/',
}

module.exports = nextConfig
