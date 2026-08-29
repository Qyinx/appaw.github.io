/**
 * Canonical public URLs included in sitemap.xml (EN path + mirrored /zh/ route).
 * Excludes noindex, robots-disallowed, and auth/admin routes.
 */
import { SITEMAP_ICON_URLS } from '@/lib/seo/brand';

export { SITEMAP_ICON_URLS };
export const SITEMAP_PUBLIC_PATHS = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/about/', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/privacy/', changeFrequency: 'yearly' as const, priority: 0.2 },
  { path: '/terms/', changeFrequency: 'yearly' as const, priority: 0.2 },
  { path: '/products/psa-protectors/', changeFrequency: 'weekly' as const, priority: 0.95 },
  { path: '/business/', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/business/psa-grading/', changeFrequency: 'weekly' as const, priority: 0.85 },
  { path: '/business/psa-grading/track/', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/business/psa-grading/advisor/', changeFrequency: 'monthly' as const, priority: 0.65 },
  { path: '/collection/', changeFrequency: 'monthly' as const, priority: 0.75 },
  { path: '/tools/card-centering/', changeFrequency: 'weekly' as const, priority: 0.8 },
] as const;

export const SITEMAP_BASE_URL = 'https://appaw.store';

export function enUrl(path: string): string {
  return `${SITEMAP_BASE_URL}${path === '/' ? '/' : path}`;
}

export function zhUrl(path: string): string {
  return path === '/' ? `${SITEMAP_BASE_URL}/zh/` : `${SITEMAP_BASE_URL}/zh${path}`;
}
