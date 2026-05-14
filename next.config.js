/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [75, 85, 100],
  },
  // Proxy image requests through Next.js in dev to avoid CORS issues.
  // (rewrites are ignored in static export builds — in production the backend
  //  must have CORS configured for the deployed origin)
  async rewrites() {
    return [
      {
        source: '/api/imgproxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'}/:path*`,
      },
    ];
  },
  // Custom domain (appaw.store) - no basePath needed
}

module.exports = nextConfig
