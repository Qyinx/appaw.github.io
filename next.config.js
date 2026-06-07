/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [75, 85, 100],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  // Proxy image requests through Next.js in dev to avoid CORS issues.
  // (rewrites are ignored in static export builds — in production the backend
  //  must have CORS configured for the deployed origin)
  // Note: `/api/imgproxy` is now obsolete — images are fetched directly
  // from the backend URL and the backend must allow CORS for the site.
  // Custom domain (appaw.store) - no basePath needed
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/collection/p/:id((?!view|_)[^/]+)/',
          destination: '/collection/p/view/',
        },
        {
          source: '/zh/collection/p/:id((?!view|_)[^/]+)/',
          destination: '/zh/collection/p/view/',
        },
      ],
    };
  },
}

module.exports = nextConfig
