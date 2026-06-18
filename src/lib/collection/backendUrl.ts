function readBackendUrl(): string {
  for (const candidate of [
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    'https://localhost:8787',
  ]) {
    if (candidate == null) continue;
    const trimmed = candidate.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return 'https://localhost:8787';
}

/** Base backend URL without trailing slash. Empty when configured as `/` only (same-origin). */
export function getBackendUrl(): string {
  const trimmed = readBackendUrl();
  if (trimmed === '/') return '';
  return trimmed.replace(/\/+$/, '');
}

/** Normalize an API path segment — collapse duplicate leading slashes. */
function normalizeApiPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '/';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const withoutLeadingSlashes = trimmed.replace(/^\/+/, '');
  const collapsed = withoutLeadingSlashes.replace(/\/{2,}/g, '/');
  return `/${collapsed}`;
}

/** Join base + API path (`/portfolios` or `portfolios`). Never produces `//` at the join. */
export function joinBackendUrl(path: string): string {
  const normalizedPath = normalizeApiPath(path);
  if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;

  const base = getBackendUrl();
  if (!base) return normalizedPath;
  return `${base}${normalizedPath}`;
}
