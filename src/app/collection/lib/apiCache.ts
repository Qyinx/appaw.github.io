/**
 * Simple localStorage cache for API list responses.
 * TTL defaults to 5 minutes. Stored as { data, expiry } JSON.
 */

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

function key(path: string) {
  return `api_cache:${path}`;
}

export function cacheGet<T>(path: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key(path));
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(key(path));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(path: string, data: T, ttlMs = DEFAULT_TTL_MS) {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, expiry: Date.now() + ttlMs };
    localStorage.setItem(key(path), JSON.stringify(entry));
  } catch { /* localStorage full — silently skip */ }
}

export function cacheInvalidate(...paths: string[]) {
  if (typeof window === 'undefined') return;
  for (const p of paths) localStorage.removeItem(key(p));
}
