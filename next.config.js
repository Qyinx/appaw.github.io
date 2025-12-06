/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/appaw.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/appaw.github.io/' : '',
}

module.exports = nextConfig
