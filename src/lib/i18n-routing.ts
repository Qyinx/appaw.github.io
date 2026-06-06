import type { Language } from '@/context/language-context';

/** Normalize pathname (trailing slash optional). */
export function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, '') || '/';
}

export function isZhPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return path === '/zh' || path.startsWith('/zh/');
}

/** Strip `/zh` prefix and return the English route path. */
export function stripZhPrefix(pathname: string): string {
  const path = normalizePath(pathname);
  if (path === '/zh') return '/';
  if (path.startsWith('/zh/')) return path.slice(3) || '/';
  return path;
}

/** Split pathname from query/hash suffix. */
function splitHref(href: string): { pathname: string; suffix: string } {
  const q = href.indexOf('?');
  const h = href.indexOf('#');
  const cut = q === -1 ? h : h === -1 ? q : Math.min(q, h);
  if (cut === -1) return { pathname: href, suffix: '' };
  return { pathname: href.slice(0, cut), suffix: href.slice(cut) };
}

/** Build a locale-prefixed href (trailing slash per site config). */
export function localizedHref(href: string, language: Language): string {
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return href;
  }
  if (href.startsWith('#')) return href;

  const { pathname, suffix } = splitHref(href);
  const clean = normalizePath(pathname);
  if (language === 'zh') {
    return clean === '/' ? `/zh/${suffix}` : `/zh${clean}/${suffix}`;
  }
  return clean === '/' ? `/${suffix}` : `${clean}/${suffix}`;
}

/** Switch locale while preserving the current page path. */
export function toggleLocalePath(pathname: string, targetLang: Language): string {
  return localizedHref(stripZhPrefix(pathname), targetLang);
}

export function routeLanguage(pathname: string | null): Language {
  if (!pathname) return 'en';
  return isZhPath(pathname) ? 'zh' : 'en';
}
