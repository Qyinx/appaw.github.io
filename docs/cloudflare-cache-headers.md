# Cloudflare Cache Headers (static assets)

GitHub Pages ignores `public/_headers` and `next.config.js` `headers()`. Production caching for appaw.store must be set in **Cloudflare** (zone sits in front of GitHub Pages).

`public/_headers` documents the intended values for Cloudflare Pages / Netlify mirrors.

## Cache Rules (recommended)

Dashboard → **Caching** → **Cache Rules** → Create rule(s):

### 1. Optimized images

| Field | Value |
|-------|--------|
| **Name** | `Appaw images-optimized long cache` |
| **When** | `(http.host eq "appaw.store" and starts_with(http.request.uri.path, "/images-optimized/"))` |
| **Then** | Eligible for cache → Edge TTL: **1 year** (or Override → 31536000s) |
| **Browser TTL** | Override → **1 year** |
| **Response header** (optional Transform Rule) | `Cache-Control: public, max-age=31536000, immutable` |

### 2. Next.js hashed static chunks

| Field | Value |
|-------|--------|
| **Name** | `Appaw _next/static immutable` |
| **When** | `(http.host eq "appaw.store" and starts_with(http.request.uri.path, "/_next/static/"))` |
| **Then** | Same as above — long Edge + Browser TTL |
| **Response header** | `Cache-Control: public, max-age=31536000, immutable` |

Hashed filenames under `/_next/static/` are safe to mark immutable. Purge Cloudflare cache (or wait for TTL) after deploys if you change image bytes under the same path in `/images-optimized/` without renaming.

## Verify

```powershell
curl.exe -sI https://appaw.store/images-optimized/logo.webp | findstr /i cache
curl.exe -sI "https://appaw.store/_next/static/" 2>$null
```

Expect `cache-control` with a long `max-age` (and ideally `immutable`) on image and chunk responses.

## Related

- [Link response header](cloudflare-link-header.md)
- Image pipeline: `scripts/optimize-images.mjs` (emits WebP; runtime via `getImagePath()`)
