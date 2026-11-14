import { joinBackendUrl } from '@/lib/collection/backendUrl';

function isLoopbackHost(hostname: string): boolean {
  return hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '[::1]';
}

/**
 * A path-only URL is resolved against the current page. On
 * /business/psa-grading/track/ that becomes
 * /business/psa-grading/track/grading/items/... and Next returns 404.
 * Pin same-origin grading paths to the site origin.
 */
function pinToSiteOrigin(pathWithQuery: string): string {
  const path = pathWithQuery.startsWith('/')
    ? pathWithQuery
    : `/${pathWithQuery.replace(/^\.\//, '')}`;
  if (typeof window === 'undefined') return path;
  return new URL(path, window.location.origin).href;
}

/**
 * Turn an API image URL into one the browser can load.
 * Graded and raw stay on different paths (`/images/` vs `/raw-images/`).
 * A loopback worker URL (`http://127.0.0.1:8787/...`) is rewritten onto this
 * site so the dev proxy can serve it. Production API hosts are kept.
 */
export function gradingImageUrlForBrowser(url: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) return trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (isLoopbackHost(parsed.hostname) && parsed.pathname.startsWith('/grading/')) {
        return pinToSiteOrigin(`${parsed.pathname}${parsed.search}`);
      }
    } catch {
      return trimmed;
    }
    return trimmed;
  }

  const joined = joinBackendUrl(trimmed);
  if (/^https?:\/\//i.test(joined)) return joined;
  return pinToSiteOrigin(joined);
}
