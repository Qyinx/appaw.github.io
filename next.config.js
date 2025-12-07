/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [75, 85, 100],
  },
  // Custom domain (appaw.store) - no basePath needed
}

module.exports = nextConfig
