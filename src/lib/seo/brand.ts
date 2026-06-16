/** Canonical brand assets for metadata, JSON-LD, and web manifests. */
export const SITE_ORIGIN = 'https://appaw.store';

export const BRAND_LOGO_PATH = '/images/logo.png';
export const BRAND_LOGO_URL = `${SITE_ORIGIN}${BRAND_LOGO_PATH}`;

/** Logo dimensions — keep in sync with public/images/logo.png. */
export const BRAND_LOGO_WIDTH = 617;
export const BRAND_LOGO_HEIGHT = 617;

export const brandLogoImageObject = {
  '@type': 'ImageObject' as const,
  url: BRAND_LOGO_URL,
  width: BRAND_LOGO_WIDTH,
  height: BRAND_LOGO_HEIGHT,
};

/** Favicon assets at site root — Bing/Edge crawl /favicon.ico and declared PNG sizes. */
export const SITE_ICONS = {
  icon: [
    { url: '/favicon.ico', sizes: '48x48' },
    { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
  ],
  shortcut: '/favicon.ico',
  apple: '/apple-touch-icon.png',
};

/** Static assets Bing recommends listing in sitemap.xml for favicon discovery. */
export const SITEMAP_ICON_URLS = [
  `${SITE_ORIGIN}/favicon.ico`,
  `${SITE_ORIGIN}/favicon-32x32.png`,
  `${SITE_ORIGIN}/apple-touch-icon.png`,
  BRAND_LOGO_URL,
] as const;
