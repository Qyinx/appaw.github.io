import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services – PSA Card Protector & TCG Trading',
  description:
    'Explore Appaw Store services: premium PSA Card Aluminum Protectors with UV-blocking glass & N52 magnetic closure, and trusted TCG trading & brokerage for graded Pokémon, sports, and MTG cards.',
  keywords: [
    // PSA Protector
    'PSA card protector',
    'PSA slab protector',
    'aluminum card case',
    'UV protection card case',
    'graded card protection',
    // Card Trading
    'buy graded cards',
    'sell PSA cards',
    'TCG trading',
    'Pokemon card trading',
    'sports card broker',
    'card consignment',
    'graded card marketplace',
    // Intent
    'buy PSA card protector',
    'card protection accessories',
    'sell graded cards Hong Kong',
    // Bilingual
    'PSA卡保護殼',
    '評級卡牌買賣',
    '寶可夢卡牌交易',
  ],
  alternates: {
    canonical: '/business/',
  },
  openGraph: {
    title: 'Our Services – PSA Card Protector & TCG Trading | Appaw Store',
    description:
      'Premium PSA card protectors and trusted TCG trading & brokerage. Protect your graded cards or buy and sell premium collectibles.',
    url: 'https://appaw.store/business/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – PSA Card Protector & TCG Trading',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services – PSA Card Protector & TCG Trading',
    description:
      'PSA aluminum protectors with UV-blocking glass, and trusted TCG trading & brokerage for collectors.',
    images: ['/images/og-image.png'],
  },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
