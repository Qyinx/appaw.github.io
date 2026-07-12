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
