// Utility to get the correct base path for assets
// Custom domain (appaw.store) - no basePath needed
export const basePath = '';

export function getImagePath(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Point to optimized images folder
  const optimizedPath = normalizedPath.replace('/images/', '/images-optimized/');
  return `${basePath}${optimizedPath}`;
}
