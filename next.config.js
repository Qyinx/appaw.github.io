/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // No basePath needed for custom domain (appaw.store)
  // basePath and assetPrefix are only needed for github.io subpath deployments
}

module.exports = nextConfig
