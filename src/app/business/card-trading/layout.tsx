import type { Metadata } from 'next';

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

export default function CardTradingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
