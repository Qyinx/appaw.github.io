# Appaw Store

Next.js storefront for Appaw Store (PSA protectors, card marketplace, collection manager). Static export → GitHub Pages (`appaw.store`).

## Stack

- Next.js 16 (App Router, static export)
- TypeScript, Tailwind CSS v4
- Auth0, GA4 + Clarity (after cookie consent)
- i18n: EN / 繁體中文

## Prerequisites

- Node.js 24+
- npm

## Setup

```bash
npm install
```

Copy secrets into `.env.local` (see table below).

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Collection / API backend |
| `NEXT_PUBLIC_AUTH0_DOMAIN` | Auth0 domain |
| `NEXT_PUBLIC_AUTH0_CLIENT_ID` | Auth0 SPA client |
| `NEXT_PUBLIC_AUTH0_REDIRECT_URI` | Auth callback URL |
| `NEXT_PUBLIC_AUTH0_AUDIENCE` | Auth0 API audience |

## Commands

```bash
npm run dev                  # https://localhost:3000
npm run build                # static site → out/
npm run optimize-images      # Windows image pipeline
npm run optimize-images-linux
npm run optimize-and-build   # optimise then build
```

## Images

1. Put sources in `public/images/` (not `images-optimized/`).
2. Run `npm run optimize-images` (CI runs this on deploy too).
3. In code use `getImagePath('/images/…/file.png')` → serves WebP from `public/images-optimized/`.
4. In CSS use `/images-optimized/…/file.webp`.

| Folder | Max | Notes |
|--------|-----|--------|
| `describe/color/` | 480px | Hero colours |
| `background/` | 1600×900 | Atmosphere |
| `og/` | 1200×630 | Keeps PNG |
| `logo.png` | WebP 96px | PNG kept for PDF |
| other | 1000×1000 | Default |

Formats: `.png` `.jpg` `.jpeg` `.webp`.

## Deploy

- Push `main` → GitHub Actions builds and deploys Pages.
- Manual: `npm run build`, publish `out/`.

Cloudflare sits in front of Pages. Cache rules for `/images-optimized/*` and `/_next/static/*`: see `docs/cloudflare-cache-headers.md`.
