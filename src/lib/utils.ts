// Utility to get the correct base path for assets
// Custom domain (appaw.store) - no basePath needed
export const basePath = '';

/**
 * Resolve a public image path to the optimized WebP asset.
 * Sources live under /images/; runtime serves /images-optimized/*.webp.
 * OG / social assets keep PNG/JPEG (crawlers); pass skipWebp for those.
 */
export function getImagePath(path: string, options?: { skipWebp?: boolean }): string {
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  let optimizedPath = normalizedPath.replace('/images/', '/images-optimized/');

  const isOg =
    optimizedPath.includes('/og/') ||
    /\/og-image\.(png|jpe?g|webp)$/i.test(optimizedPath);

  if (!options?.skipWebp && !isOg) {
    optimizedPath = optimizedPath.replace(/\.(png|jpe?g)$/i, '.webp');
  }

  return `${basePath}${optimizedPath}`;
}
