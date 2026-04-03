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
- `/about` - About Us page
- `/style-guide` - Design system and component library

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
