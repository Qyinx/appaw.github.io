import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import type { TradingCard } from '@/types/trading-card';
import CardDetailClient from './CardDetailClient';

/* ──────────────────────────────────────────
   Individual Card Page — Server Component
   ──────────────────────────────────────────
   Generates a static page for each card at
   build time with full SEO metadata, Product
   JSON-LD and a shareable URL.

   e.g. /business/card-trading/001/
   ────────────────────────────────────────── */

async function getCards(): Promise<TradingCard[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'trade-card.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as TradingCard[];
}

export async function generateStaticParams() {
  const cards = await getCards();
  return cards.map(card => ({ id: card.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const cards = await getCards();
  const card = cards.find(c => c.id === id);
  if (!card) return { title: 'Card Not Found | Appaw Store' };

  const grade = Number.isInteger(card.grade) ? String(card.grade) : card.grade.toFixed(1);
  const bl = card.isBlackLabel ? ' Black Label' : '';
  const title = `${card.name} — ${card.company} ${grade}${bl} | Appaw Store`;
  const description = card.description
    || `${card.company} ${grade}${bl} graded ${card.name}${card.set ? ` from ${card.set}` : ''}. Buy now from Appaw Store.`;
  const image = card.image || card.bundleCards?.[0]?.image || '/images/og-image.png';

  return {
    title,
    description,
    alternates: { canonical: `/business/card-trading/${id}/` },
    openGraph: {
      title,
      description,
      url: `https://appaw.store/business/card-trading/${id}/`,
      type: 'website',
      images: [{ url: image, width: 600, height: 800, alt: card.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${card.name} — ${card.company} ${grade}${bl}`,
      description,
      images: [image],
    },
  };
}

export default async function CardDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cards = await getCards();
  const card = cards.find(c => c.id === id);

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090f] text-white">
        <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
        <a href="/business/card-trading/" className="text-[#d4a843] hover:underline">← Back to Marketplace</a>
      </div>
    );
  }

  // Product JSON-LD
  const grade = Number.isInteger(card.grade) ? String(card.grade) : card.grade.toFixed(1);
  const bl = card.isBlackLabel ? ' Black Label' : '';
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${card.name} — ${card.company} ${grade}${bl}`,
    description: card.description || `${card.company} ${grade}${bl} graded ${card.name}`,
    image: `https://appaw.store${card.image || card.bundleCards?.[0]?.image || ''}`,
    brand: { '@type': 'Brand', name: card.company },
    category: 'Graded Trading Cards',
    offers: {
      '@type': 'Offer',
      price: card.price,
      priceCurrency: card.currency,
      availability: 'https://schema.org/InStock',
      url: `https://appaw.store/business/card-trading/${id}/`,
      seller: { '@type': 'Organization', name: 'Appaw Store' },
    },
    ...(card.certNumber ? { gtin: card.certNumber } : {}),
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://appaw.store/business/' },
      { '@type': 'ListItem', position: 3, name: 'Card Trading', item: 'https://appaw.store/business/card-trading/' },
      { '@type': 'ListItem', position: 4, name: card.name, item: `https://appaw.store/business/card-trading/${id}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CardDetailClient card={card} />
    </>
  );
}
