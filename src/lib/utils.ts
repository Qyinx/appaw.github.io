// Utility to get the correct base path for assets
// No basePath needed for custom domain (appaw.store)
export const basePath = '';

export function getImagePath(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
