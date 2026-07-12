'use client';

import { useSyncExternalStore } from 'react';

function getSearch() {
  return window.location.search;
}

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

/** Real browser query string. Pair with useBrowserPathname on static-export view shells. */
export function useBrowserSearch(): string {
  return useSyncExternalStore(subscribe, getSearch, () => '');
}

/** Update query string on static-export view pages (preserves pathname). */
export function replaceBrowserSearchParams(
  patch: Record<string, string | null>,
  baseSearch?: string,
): void {
  if (typeof window === 'undefined') return;

  const next = new URLSearchParams(baseSearch ?? window.location.search);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
  }

  const qs = next.toString();
  const url = new URL(window.location.href);
  url.search = qs ? `?${qs}` : '';
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
