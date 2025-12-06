// Utility to get the correct base path for assets
// Custom domain (appaw.store) - no basePath needed
export const basePath = '';

export function getImagePath(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
