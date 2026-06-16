function readBackendUrl(): string {
  return (
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    'https://localhost:8787'
  );
}

/** Base backend URL without trailing slash. */
export function getBackendUrl(): string {
  return readBackendUrl().replace(/\/+$/, '');
}

/** Join base + API path (`/portfolios` or `portfolios`). */
export function joinBackendUrl(path: string): string {
  const segment = path.startsWith('/') ? path : `/${path}`;
  return `${getBackendUrl()}${segment}`;
}
