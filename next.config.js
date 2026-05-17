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
  // Note: `/api/imgproxy` is now obsolete — images are fetched directly
  // from the backend URL and the backend must allow CORS for the site.
  // Custom domain (appaw.store) - no basePath needed
}

module.exports = nextConfig
