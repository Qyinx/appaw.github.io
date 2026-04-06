# Appaw Store

A modern e-commerce web store for Appaw Store - featuring PSA card aluminum protectors and graded Pokémon cards collection.

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

- Node.js 18+
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
│   │   ├── graded-cards/   # Graded cards collection
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
- `/products/graded-cards` - Graded Pokémon cards collection
- `/products/psa-protectors` - PSA Card Aluminum Protector details
- `/business` - Business overview with services
- `/business/card-trading` - TCG card marketplace
- `/business/card-trading/[id]` - Individual card detail page (shareable URL)
- `/about` - About Us page
- `/style-guide` - Design system and component library

## Card Trading Marketplace

Cards are managed in [`public/data/trade-card.json`](public/data/trade-card.json). Each entry generates a static detail page at `/business/card-trading/[id]/` at build time.

### Adding / Editing a Card

1. Edit `public/data/trade-card.json`
2. Run `npm run build` — static pages are regenerated automatically
3. The sitemap and all JSON-LD structured data update along with the pages

### Card Fields (`TradingCard`)

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` (UUID) | ✅ | Unique identifier — used as the URL slug. Generate with `crypto.randomUUID()` |
| `name` | `string` | ✅ | Card name displayed in the listing and detail page |
| `year` | `number` | ✅ | Year the card was printed / released |
| `company` | `"PSA" \| "BGS" \| "CGC"` | ✅ | Grading company |
| `grade` | `number` | ✅ | Numeric grade (e.g. `10`, `9.5`, `8`) |
| `isBlackLabel` | `boolean` | — | `true` for PSA Black Label (perfect 10 sub-grades). Adds a gold **BL** indicator |
| `image` | `string` | — | Path to front image relative to `/public` (e.g. `/images/cards/mycard.png`) |
| `imageBack` | `string` | — | Path to back image. When present, enables the 3D flip toggle and magnifier |
| `set` | `string` | — | Set name (e.g. `"Obsidian Flames"`) |
| `number` | `string` | — | Card number within the set (e.g. `"211/197"`) |
| `certNumber` | `string` | — | Grading certificate / slab serial number |
| `price` | `number` | ✅ | Listing price (numeric, no symbol) |
| `currency` | `string` | ✅ | ISO currency code (e.g. `"HKD"`, `"USD"`) |
| `language` | `string` | — | Card language (e.g. `"Japanese"`, `"English"`) |
| `description` | `string` | — | Long-form description shown on the detail page and used for SEO meta |
| `sold` | `boolean` | — | `true` marks the card as sold — shows a SOLD ribbon on the image, strikethrough price, and replaces the WhatsApp CTA with a "sold" notice. Defaults to `false` |
| `bundleCards` | `BundleCard[]` | — | Present when listing a **set / bundle** — see below |

### Bundle / Set Fields (`BundleCard`)

Use `bundleCards` to list a complete set where all cards are sold together. The parent card's `price` is the total set price.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Individual card name |
| `image` | `string` | ✅ | Front image path |
| `imageBack` | `string` | — | Back image path |
| `company` | `"PSA" \| "BGS" \| "CGC"` | ✅ | Grading company for this card |
| `grade` | `number` | ✅ | Grade for this card |
| `isBlackLabel` | `boolean` | — | PSA Black Label for this card |
| `certNumber` | `string` | — | Certificate number for this card |

### Minimal Example (single card)

```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "Pikachu VMAX",
  "year": 2020,
  "company": "PSA",
  "grade": 10,
  "image": "/images/cards/pikachu-vmax.png",
  "imageBack": "/images/cards/pikachu-vmax-back.png",
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
      "image": "/images/cards/jolteon-vmax.png",
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

## License

MIT
