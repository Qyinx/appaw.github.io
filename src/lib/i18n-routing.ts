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

/** Build a locale-prefixed href (trailing slash per site config). */
export function localizedHref(href: string, language: Language): string {
  const clean = normalizePath(href);
  if (language === 'zh') {
    return clean === '/' ? '/zh/' : `/zh${clean}/`;
  }
  return clean === '/' ? '/' : `${clean}/`;
}

/** Switch locale while preserving the current page path. */
export function toggleLocalePath(pathname: string, targetLang: Language): string {
  return localizedHref(stripZhPrefix(pathname), targetLang);
}

export function routeLanguage(pathname: string | null): Language {
  if (!pathname) return 'en';
  return isZhPath(pathname) ? 'zh' : 'en';
}
