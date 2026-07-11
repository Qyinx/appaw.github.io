'use client';

import { useSyncExternalStore } from 'react';

function getPathname() {
  return window.location.pathname;
}

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

/** Real browser path. Use on static-export view shells where pretty URLs differ from the built /view/ route. */
export function useBrowserPathname(): string {
  return useSyncExternalStore(subscribe, getPathname, () => '');
}
