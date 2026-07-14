# Appaw Store

A modern e-commerce and collector platform for Appaw Store — featuring PSA card aluminium protectors, a graded Pokémon card marketplace, and an authenticated personal card collection manager.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Language**: TypeScript 5.8
- **Auth**: Auth0 (`@auth0/auth0-react`)
- **Icons**: Lucide React + Font Awesome
- **Analytics**: Google Analytics 4 (GA4)
- **i18n**: Custom React Context (EN / 繁體中文)

## Features

- 🌐 **Bilingual Support** — Full English / Chinese (繁體中文) translations
- 🛍️ **Products Section** — Graded cards marketplace and PSA aluminium protectors
- 🗂️ **Collection Manager** — Auth0-protected personal card vault with portfolio grouping, QR/barcode scanning, and image management
- 📊 **Portfolios** — Create named portfolios to organise collection cards; displayed with live card counts
- 🔍 **Card Scanner** — Camera-based scan that auto-fills card details via backend AI
- 🎨 **Modern UI** — Glassmorphism, 3D flip effects, smooth animations
- 📱 **Fully Responsive** — Mobile-first design with sidebar/tab adaptive layout
- 🔍 **SEO Optimised** — Structured data (Store + FAQ schemas), dynamic sitemap, Open Graph / Twitter Cards
- 🤖 **AEO Ready** — FAQ schema for AI / GEO search engines
- 🍪 **GDPR Compliant** — Cookie consent with GA4 consent API
- 🚀 **Static Export** — Deployed to GitHub Pages via GitHub Actions



## Getting Started



### Prerequisites

- Node.js 24+
- npm



### Installation

```bash
npm install
```



### Development

```bash
npm run dev
```

Opens [https://localhost:3000](https://localhost:3000) (HTTPS via `--experimental-https`).

### Build for Production

```bash
npm run build
```

Static files are generated in the `out/` folder.

### Image Optimisation (optional pre-build step)

```bash
npm run optimize-images        # Windows
npm run optimize-images-linux  # Linux / macOS
npm run optimize-and-build     # Optimise then build in one step
```



## Deployment

Configured for GitHub Pages with the custom domain `appaw.store`.

- **Manual**: Run `npm run build`, then deploy the `out/` folder.
- **Automatic**: Push to `main` — GitHub Actions builds and deploys automatically.



## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home
│   ├── about/                  # About page
│   ├── privacy/                # Privacy policy
│   ├── style-guide/            # Design system (dev only)
│   ├── products/
│   │   └── psa-protectors/     # PSA Aluminium Protector product page
│   ├── business/
│   │   ├── page.tsx            # Business overview
│   │   ├── card-trading/       # Public card marketplace
│   │   │   └── [id]/           # Individual card detail page
│   │   └── psa-protector/      # Redirect → /products/psa-protectors
│   ├── collection/             # 🔒 Auth-protected collection manager
│   │   ├── page.tsx            # Landing / sign-in prompt
│   │   ├── list/               # Card list view
│   │   ├── auth/               # Auth0 callback handler
│   │   ├── card/
│   │   │   ├── new/            # Add card form
│   │   │   └── edit/           # Edit card form
│   │   ├── CardFormClient.tsx  # Shared add/edit form logic
│   │   ├── CollectionClient.tsx
│   │   ├── types.ts            # Shared types & normalise helpers
│   │   ├── components/         # CollectionListView, CardFormView, shared…
│   │   └── lib/                # apiCache
│   ├── admin/
│   │   └── trade-cards/        # 🔒 Admin card management
│   ├── api/
│   │   ├── admin/              # Admin API routes
│   │   └── graphql/            # GraphQL proxy
│   ├── graphql/                # GraphQL page
│   └── sitemap.ts              # Dynamic sitemap generator
├── components/                 # Shared UI components
│   ├── layout/                 # Header, Footer
│   ├── ui/                     # Buttons, Cards, etc.
│   ├── CookieConsent.tsx
│   ├── RetailPartners.tsx
│   ├── ScrollProgressBar.tsx
│   └── PageTransition.tsx
├── context/                    # LanguageContext
├── hooks/                      # useCards
├── i18n/                       # en.ts, zh.ts, index.ts
├── lib/                        # card-helpers, cards-api, graphql, utils
├── providers/                  # Auth0Provider
└── styles/                     # globals.css (Tailwind v4)
```



## Pages


| Route                          | Access   | Description                             |
| ------------------------------ | -------- | --------------------------------------- |
| `/`                            | Public   | Home — hero, features, product showcase |
| `/about/`                      | Public   | About Us                                |
| `/privacy/`                    | Public   | Privacy policy                          |
| `/products/psa-protectors/`    | Public   | PSA Aluminium Protector product page    |
| `/business/`                   | Public   | Business services overview              |
| `/business/card-trading/`      | Public   | TCG card marketplace listing            |
| `/business/card-trading/[id]/` | Public   | Individual card detail (shareable URL)  |
| `/collection/`                 | 🔒 Auth  | Collection manager landing              |
| `/collection/list`             | 🔒 Auth  | Card list with portfolio tabs           |
| `/collection/card/new`         | 🔒 Auth  | Add a new card                          |
| `/collection/card/edit?id=`    | 🔒 Auth  | Edit an existing card                   |
| `/admin/trade-cards/`          | 🔒 Admin | Admin card management                   |
| `/style-guide/`                | Dev      | Design system reference                 |




## Collection Manager

The `/collection` section is an Auth0-protected app that connects to a separate backend API (`NEXT_PUBLIC_BACKEND_URL`).

### Key capabilities

- **Card CRUD** — Create, edit, delete graded cards with front/back image upload
- **Scanner** — Camera scan auto-fills card name, year, grade, set, language, and cert number via backend AI
- **Portfolio grouping** — Create named portfolios (public or private) and add/remove cards; counts fetched from `GET /portfolios`, card IDs loaded lazily on selection via `GET /portfolios/:id`
- **Paginated API** — `GET /cards` is fetched with `limit=100` and all pages are loaded in parallel on mount
- **Optimistic UI** — Local state updated immediately on card add/remove/toggle-sold; cache invalidated after mutations



### Environment variables


| Variable                         | Description                            |
| -------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_BACKEND_URL`        | Base URL of the collection backend API |
| `NEXT_PUBLIC_AUTH0_DOMAIN`       | Auth0 domain                           |
| `NEXT_PUBLIC_AUTH0_CLIENT_ID`    | Auth0 SPA client ID                    |
| `NEXT_PUBLIC_AUTH0_REDIRECT_URI` | Callback URL after login               |
| `NEXT_PUBLIC_AUTH0_AUDIENCE`     | Auth0 API audience (for access tokens) |




## Card Trading Marketplace

Public cards are managed in `[public/data/trade-card.json](public/data/trade-card.json)`. Each entry generates a static detail page at `/business/card-trading/[id]/` at build time.

### Adding / Editing a Card

1. Edit `public/data/trade-card.json`
2. Run `npm run build` — static pages are regenerated automatically
3. The sitemap and all JSON-LD structured data update alongside



### Card Fields (`TradingCard`)


| Field          | Type                    | Required | Description                                   |
| -------------- | ----------------------- | -------- | --------------------------------------------- |
| `id`           | `string` (UUID)         | ✅        | Unique identifier — used as the URL slug      |
| `name`         | `string`                | ✅        | Card name                                     |
| `year`         | `number`                | ✅        | Print year                                    |
| `company`      | `"PSA" | "BGS" | "CGC"` | ✅        | Grading company                               |
| `grade`        | `number`                | ✅        | Numeric grade (e.g. `10`, `9.5`)              |
| `isBlackLabel` | `boolean`               | —        | PSA Black Label — adds a gold **BL** badge    |
| `image`        | `string`                | —        | Front image path (relative to `/public`)      |
| `imageBack`    | `string`                | —        | Back image path — enables 3D flip & magnifier |
| `set`          | `string`                | —        | Set name                                      |
| `number`       | `string`                | —        | Card number within the set                    |
| `certNumber`   | `string`                | —        | Grading certificate serial number             |
| `price`        | `number`                | ✅        | Listing price                                 |
| `currency`     | `string`                | ✅        | ISO currency code (e.g. `"HKD"`)              |
| `language`     | `string`                | —        | Card language                                 |
| `description`  | `string`                | —        | Long-form description for detail page & SEO   |
| `sold`         | `boolean`               | —        | `true` shows SOLD ribbon and removes CTA      |
| `bundleCards`  | `BundleCard[]`          | —        | Cards sold as a complete set                  |




### Bundle Fields (`BundleCard`)


| Field          | Type                    | Required | Description        |
| -------------- | ----------------------- | -------- | ------------------ |
| `name`         | `string`                | ✅        | Card name          |
| `image`        | `string`                | ✅        | Front image path   |
| `imageBack`    | `string`                | —        | Back image path    |
| `company`      | `"PSA" | "BGS" | "CGC"` | ✅        | Grading company    |
| `grade`        | `number`                | ✅        | Grade              |
| `isBlackLabel` | `boolean`               | —        | PSA Black Label    |
| `certNumber`   | `string`                | —        | Certificate number |




## SEO & Analytics

- Google Analytics 4 with Consent API (GDPR)
- Cookie consent banner
- JSON-LD structured data (Store + FAQ schemas)
- Dynamic sitemap (`/sitemap.xml`) — active card listings at priority 0.7, sold listings at 0.4
- Open Graph & Twitter Cards
- `robots.txt` — blocks `/admin/`, `/api/`, `/graphql/`, `/style-guide/`, and filter query params; allows `/collection/` and `/business/card-trading/`



## Colour Palette

- **Primary**: Orange (`#ec7d1f`) — PSA protectors
- **Secondary**: Sky Blue (`#0ea5e9`) — Accents
- **Accent**: Fuchsia (`#d946ef`) — Highlights
- **Collection UI**: Purple (`#9B7EBF`) — Collection manager chrome
- **Dark**: `#1e1e2e` (collection) / Slate (`#1e293b`) (marketing)



## PSA Card Aluminium Protector Specs

- **Size**: 8.7 × 14.2 × 0.98 cm
- **Weight**: 74 g
- **Materials**: Aluminium Alloy + UV-Blocking Glass
- **UV Protection**: > 95%
- **Closure**: N52 Magnets

## Tech Stack

- **Framework**: Next.js 15.5.7 (App Router, Static Export)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Language**: TypeScript 5.8.3
- **Icons**: Lucide React + Font Awesome
- **Analytics**: Google Analytics 4 (GA4)
- **i18n**: Custom React Context



## Features

- 🌐 **Bilingual Support** - Full English/Chinese (繁體中文) translations
- 🛍️ **Products Section** - Graded cards collection and PSA protectors
- 🎨 **Modern UI** - Glassmorphism, 3D effects, smooth animations
- 📱 **Fully Responsive** - Mobile-first design
- 🔍 **SEO Optimized** - Structured data, sitemap, metadata
- 🤖 **AEO Ready** - FAQ schema for AI search engines
- 🍪 **GDPR Compliant** - Cookie consent with analytics controls
- 🎠 **Interactive Carousel** - Modern product showcase with zoom effects
- 🚀 **Static Export** - Optimized for GitHub Pages



## Getting Started



### Prerequisites

- Node.js 24+
- npm or yarn



### Installation

```bash
npm install
```



### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The static files will be generated in the `out` folder.

## Deployment

This project is configured for GitHub Pages deployment with custom domain (appaw.store).

### Manual Deployment

1. Run `npm run build`
2. Deploy the `out` folder to your hosting service



### GitHub Actions (Automatic)

Push to the `main` branch to trigger automatic deployment to GitHub Pages.

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── products/           # Product pages
│   │   └── psa-protectors/ # PSA protector product page
│   ├── business/           # Business services
│   │   └── psa-protector/  # Redirect to products
│   ├── about/              # About page
│   └── style-guide/        # Design system
├── components/             # Reusable components
│   ├── layout/            # Layout components (Header, Footer)
│   ├── ui/                # UI components (Button, Card)
│   └── CookieConsent.tsx  # GDPR cookie banner
├── context/               # React context (Language)
├── i18n/                  # Translation files (en.ts, zh.ts)
├── lib/                   # Utilities
└── styles/                # Global styles (Tailwind v4)
```



## Pages

- `/` - Home page with hero, features, and product showcase
- `/products/psa-protectors` - PSA Card Aluminum Protector details
- `/business` - Business overview with services
- `/business/card-trading` - TCG card marketplace
- `/business/card-trading/[id]` - Individual card detail page (shareable URL)
- `/about` - About Us page
- `/style-guide` - Design system and component library



## Card Trading Marketplace

Cards are managed in `[public/data/trade-card.json](public/data/trade-card.json)`. Each entry generates a static detail page at `/business/card-trading/[id]/` at build time.

### Adding / Editing a Card

1. Edit `public/data/trade-card.json`
2. Run `npm run build` — static pages are regenerated automatically
3. The sitemap and all JSON-LD structured data update along with the pages



### Card Fields (`TradingCard`)


| Field          | Type                    | Required | Description                                                                                                                                                    |
| -------------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`           | `string` (UUID)         | ✅        | Unique identifier — used as the URL slug. Generate with `crypto.randomUUID()`                                                                                  |
| `name`         | `string`                | ✅        | Card name displayed in the listing and detail page                                                                                                             |
| `year`         | `number`                | ✅        | Year the card was printed / released                                                                                                                           |
| `company`      | `"PSA" | "BGS" | "CGC"` | ✅        | Grading company                                                                                                                                                |
| `grade`        | `number`                | ✅        | Numeric grade (e.g. `10`, `9.5`, `8`)                                                                                                                          |
| `isBlackLabel` | `boolean`               | —        | `true` for PSA Black Label (perfect 10 sub-grades). Adds a gold **BL** indicator                                                                               |
| `image`        | `string`                | —        | Path to front image relative to `/public` (e.g. `/images/trade/{cardId}/front.jpg`)                                                                            |
| `imageBack`    | `string`                | —        | Path to back image (e.g. `/images/trade/{cardId}/back.jpg`). When present, enables the 3D flip toggle and magnifier                                            |
| `set`          | `string`                | —        | Set name (e.g. `"Obsidian Flames"`)                                                                                                                            |
| `number`       | `string`                | —        | Card number within the set (e.g. `"211/197"`)                                                                                                                  |
| `certNumber`   | `string`                | —        | Grading certificate / slab serial number                                                                                                                       |
| `price`        | `number`                | ✅        | Listing price (numeric, no symbol)                                                                                                                             |
| `currency`     | `string`                | ✅        | ISO currency code (e.g. `"HKD"`, `"USD"`)                                                                                                                      |
| `language`     | `string`                | —        | Card language (e.g. `"Japanese"`, `"English"`)                                                                                                                 |
| `description`  | `string`                | —        | Long-form description shown on the detail page and used for SEO meta                                                                                           |
| `sold`         | `boolean`               | —        | `true` marks the card as sold — shows a SOLD ribbon on the image, strikethrough price, and replaces the WhatsApp CTA with a "sold" notice. Defaults to `false` |
| `bundleCards`  | `BundleCard[]`          | —        | Present when listing a **set / bundle** — see below                                                                                                            |




### Bundle / Set Fields (`BundleCard`)

Use `bundleCards` to list a complete set where all cards are sold together. The parent card's `price` is the total set price.


| Field          | Type                    | Required | Description                      |
| -------------- | ----------------------- | -------- | -------------------------------- |
| `name`         | `string`                | ✅        | Individual card name             |
| `image`        | `string`                | ✅        | Front image path                 |
| `imageBack`    | `string`                | —        | Back image path                  |
| `company`      | `"PSA" | "BGS" | "CGC"` | ✅        | Grading company for this card    |
| `grade`        | `number`                | ✅        | Grade for this card              |
| `isBlackLabel` | `boolean`               | —        | PSA Black Label for this card    |
| `certNumber`   | `string`                | —        | Certificate number for this card |




### Minimal Example (single card)

```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "Pikachu VMAX",
  "year": 2020,
  "company": "PSA",
  "grade": 10,
  "image": "/images/trade/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/front.jpg",
  "imageBack": "/images/trade/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/back.jpg",
  "set": "Vivid Voltage",
  "number": "044/185",
  "certNumber": "78912345",
  "price": 2500,
  "currency": "HKD",
  "language": "Japanese",
  "description": "Rainbow rare Pikachu VMAX in perfect PSA 10 condition.",
  "sold": false
}
```



### Bundle Example (full set)

```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "Eeveelution VMAX Complete Set",
  "year": 2021,
  "company": "PSA",
  "grade": 10,
  "set": "Eevee Heroes",
  "price": 45000,
  "currency": "HKD",
  "language": "Japanese",
  "description": "Complete set of all Eeveelution VMAX alternate arts.",
  "sold": false,
  "bundleCards": [
    {
      "name": "Jolteon VMAX",
      "image": "/images/trade/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/bundle-0-front.jpg",
      "imageBack": "/images/trade/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/bundle-0-back.jpg",
      "company": "PSA",
      "grade": 10,
      "certNumber": "11111111"
    }
  ]
}
```



## Key Features



### Modern Carousel

- Dark glassmorphism design
- Smooth zoom & fade transitions (1200ms)
- Circular progress ring indicator
- Full-width progress bars
- Auto-advance with manual control
- Hover effects and animations



### Animations

- Text shine gradient effect
- Floating 3D elements
- Scale-in effects
- Shimmer overlays
- Gradient shifts
- Smooth transitions (500-1200ms)



### SEO & Analytics

- Google Analytics 4 with consent API
- Cookie consent banner (GDPR compliant)
- Structured data (Store + FAQ schemas)
- Comprehensive metadata
- Dynamic sitemap
- Open Graph & Twitter Cards



## Color Palette

- **Primary**: Orange (#ec7d1f) - PSA protectors
- **Secondary**: Sky Blue (#0ea5e9) - Accents
- **Accent**: Fuchsia (#d946ef) - Highlights
- **Dark**: Slate (#1e293b) - Backgrounds
- **Neutral**: Gray scale - Text & UI



## Technical Specifications



### PSA Card Aluminum Protector

- **Size**: 8.7 × 14.2 × 0.98 cm
- **Weight**: 74g
- **Materials**: Aluminum Alloy + UV-Blocking Glass
- **UV Protection**: >95%
- **Closure**: N52 Magnets

