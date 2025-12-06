# Appaw Store

A web store page for Appaw Store - selling PSA card protectors and consignment services.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## Features

- 🌐 Bilingual support (English/Chinese)
- 🎨 Design style guide page
- 📱 Responsive design
- 🚀 Static site export for GitHub Pages

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

This project is configured for GitHub Pages deployment. The build will automatically export static files.

### Manual Deployment

1. Run `npm run build`
2. Deploy the `out` folder to your hosting service

### GitHub Actions (Automatic)

Push to the `main` branch to trigger automatic deployment to GitHub Pages.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # Reusable components
│   ├── layout/          # Layout components (Header, Footer)
│   └── ui/              # UI components (Button, Card)
├── context/             # React context (Language)
├── i18n/                # Translation files
└── styles/              # Global styles
```

## Pages

- `/` - Home page with hero section
- `/about` - About Us page
- `/business` - Business services page
- `/style-guide` - Design system and style guide

## License

MIT
