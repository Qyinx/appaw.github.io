/** @type {import('next').NextConfig} */
const AGENT_LINK_HEADER =
  '<https://appaw.store/.well-known/api-catalog>; rel="api-catalog", <https://appaw.store/llms.txt>; rel="describedby"; type="text/plain", <https://appaw.store/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json", </sitemap.xml>; rel="sitemap"';

const nextConfig = {
  // Static export for production deploy only. Dev needs API routes (/api/admin/*).
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
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
          { key: 'Link', value: AGENT_LINK_HEADER },
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
        {
          source: '/admin/psa-grading/orders/:orderId((?!view)[^/]+)/',
          destination: '/admin/psa-grading/orders/view/',
        },
        {
          source: '/zh/admin/psa-grading/orders/:orderId((?!view)[^/]+)/',
          destination: '/zh/admin/psa-grading/orders/view/',
        },
        {
          source: '/admin/psa-grading/batches/:referenceCode((?!view|new)[^/]+)/',
          destination: '/admin/psa-grading/batches/view/',
        },
        {
          source: '/zh/admin/psa-grading/batches/:referenceCode((?!view|new)[^/]+)/',
          destination: '/zh/admin/psa-grading/batches/view/',
        },
      ],
    };
  },
}

module.exports = nextConfig
