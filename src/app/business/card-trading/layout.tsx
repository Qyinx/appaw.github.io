import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import type { TradingCard } from '@/types/trading-card';

export const metadata: Metadata = {
  title: 'Trading Card Showcase – Buy Graded Cards | Appaw Store',
  description:
    'Browse PSA, BGS, and CGC graded trading cards for sale. Filter by grading company, grade score, and card name. Trusted TCG marketplace in Hong Kong.',
  keywords: [
    'buy graded cards',
    'PSA graded cards for sale',
    'BGS graded cards',
    'CGC graded cards',
    'Pokemon card marketplace',
    'graded card shop Hong Kong',
    'PSA 10 Pokemon cards',
    'trading card marketplace',
    'TCG trading Hong Kong',
    // Bilingual
    '評級卡牌買賣',
    '寶可夢卡牌',
    'PSA 評級卡',
  ],
  alternates: {
    canonical: '/business/card-trading/',
  },
  openGraph: {
    title: 'Trading Card Showcase – Browse & Buy Graded Cards | Appaw Store',
    description:
      'Explore our curated inventory of PSA, BGS, and CGC graded trading cards. Filter by grade, company, and more.',
    url: 'https://appaw.store/business/card-trading/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – Trading Card Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Card Showcase | Appaw Store',
    description:
      'Browse PSA, BGS, and CGC graded cards for sale. Trusted TCG marketplace in Hong Kong.',
    images: ['/images/og-image.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://appaw.store/business/' },
    { '@type': 'ListItem', position: 3, name: 'Card Trading', item: 'https://appaw.store/business/card-trading/' },
  ],
};

function buildProductJsonLd(cards: TradingCard[]) {
  const BASE = 'https://appaw.store';

  const items = cards.map((card, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: `${card.name} — ${card.company} ${Number.isInteger(card.grade) ? card.grade : card.grade.toFixed(1)}${card.isBlackLabel ? ' Black Label' : ''}`,
      description: `${card.company} ${Number.isInteger(card.grade) ? card.grade : card.grade.toFixed(1)} graded ${card.name}${card.set ? ` from ${card.set}` : ''}${card.language ? `, ${card.language} edition` : ''}`,
      image: card.image
        ? `${BASE}${card.image}`
        : card.bundleCards?.[0]?.image
          ? `${BASE}${card.bundleCards[0].image}`
          : undefined,
      brand: { '@type': 'Brand', name: card.company },
      category: 'Graded Trading Cards',
      offers: {
        '@type': 'Offer',
        price: card.price,
        priceCurrency: card.currency,
        availability: card.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        url: `${BASE}/business/card-trading/${card.id}/`,
        seller: { '@type': 'Organization', name: 'Appaw Store' },
      },
      ...(card.certNumber ? { gtin: card.certNumber } : {}),
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Graded Trading Cards for Sale',
    numberOfItems: items.length,
    itemListElement: items,
  };
}

async function getCards(): Promise<TradingCard[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'trade-card.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as TradingCard[];
}

export default async function CardTradingLayout({ children }: { children: React.ReactNode }) {
  const cards = await getCards();
  const productJsonLd = buildProductJsonLd(cards);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      {children}
    </>
  );
}
