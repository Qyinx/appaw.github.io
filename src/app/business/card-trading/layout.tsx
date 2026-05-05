import type { Metadata } from 'next';

export const metadata: Metadata = {
  // 65 chars — leads with top keyword, differentiates with brand and HK
  title: 'PSA Pokémon Cards Hong Kong | Buy Rare Graded Cards – Appaw Store',
  // 159 chars — investment-grade positioning, local SEO, collector trust
  description:
    'The premier Hong Kong destination for investment-grade PSA 10 Pokémon cards. Zero-fee consignment, museum-quality verified transactions & private acquisition of blue-chip graded assets.',
  keywords: [
    // Brokerage / consignment — high-intent
    'PSA',
    'PSA卡',
    'CGC',
    'BGS',
    'CGC卡',
    'BGS卡',
    'Pokemon TCG',
    'trusted Pokemon card',
    'PSA card consignment',
    'sell PSA cards Hong Kong',
    'TCG service',
    'sell PSA 10 cards',
    'graded card brokerage',
    'Pokemon card valuation',
    'sell graded cards',
    'PSA 10',
    // Buy side
    'buy graded cards',
    'PSA graded cards for sale',
    'BGS graded cards',
    'CGC graded cards',
    'Pokemon card marketplace',
    'graded card shop Hong Kong',
    'PSA 10 Pokemon cards',
    'trading card marketplace',
    'TCG trading Hong Kong',
    // Investment & high-value
    'investment-grade graded cards',
    'high-value Pokemon cards',
    'grail card for sale',
    'blue-chip sports cards',
    'alternative asset collectibles',
    'rare graded card marketplace',
    // Bilingual
    '評級卡牌買賣',
    '寶可夢卡牌',
    'PSA 評級卡',
    '評級卡寄售'
  ],
  alternates: {
    canonical: '/business/card-trading/',
  },
  openGraph: {
    title: 'PSA Pokémon Cards Hong Kong | Rare Graded Cards & Consignment – Appaw Store',
    description:
      'The premier Hong Kong destination for investment-grade PSA graded Pokémon & sports cards. Zero-fee consignment, museum-quality verified transactions, and private acquisition of blue-chip assets.',
    url: 'https://appaw.store/business/card-trading/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – Pokémon TCG Brokerage & Card Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSA Pokémon Cards Hong Kong | Buy Rare Graded Cards – Appaw Store',
    description:
      'Premier HK destination for investment-grade PSA graded cards. Zero-fee consignment, face-to-face verified transactions & private acquisition of blue-chip Pokémon and sports assets.',
    images: ['/images/og-image.png'],
  },
};

// Service schema — enables rich results for the brokerage/consignment service
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Pokémon TCG Brokerage & Consignment',
  alternateName: [
    'TCG Card Brokerage',
    'Pokémon Card Consignment',
    'Graded Card Brokerage Hong Kong',
    '寶可夢卡牌寄售',
  ],
  description:
    'Professional Pokémon TCG brokerage and consignment service in Hong Kong. We sell your PSA or CGC graded cards on your behalf — expert valuation, global buyer network, commission on sale only, zero upfront fees.',
  serviceType: 'Financial/Trading – Trading Card Brokerage & Consignment',
  url: 'https://appaw.store/business/card-trading/',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Appaw Store',
    url: 'https://appaw.store',
    telephone: '+852-9285-1189',
    email: 'support@appaw.store',
    image: 'https://appaw.store/images/og-image.png',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hong Kong',
      addressCountry: 'HK',
    },
    sameAs: [
      'https://appawstore.etsy.com/',
      'https://www.carousell.com.hk/u/appaw.store/',
      'https://www.instagram.com/appaw.store/',
    ],
  },
  areaServed: {
    '@type': 'City',
    name: 'Hong Kong',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'TCG Trading Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Card Consignment',
          description:
            'We list and sell your PSA/CGC graded Pokémon, sports, and MTG cards. Commission charged on sale only — no upfront listing fees.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Card Valuation',
          description:
            'Professional price appraisal based on real-time market data for PSA and CGC graded trading cards.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Card Brokerage',
          description:
            'We connect buyers and sellers of high-value PSA 10 Pokémon cards, sports cards, and MTG cards with full buyer and seller protection.',
        },
      },
    ],
  },
  termsOfService: 'https://appaw.store/business/card-trading/',
};

// BreadcrumbList for this page's search result appearance
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'Business', item: 'https://appaw.store/business/' },
    { '@type': 'ListItem', position: 3, name: 'TCG Brokerage & Consignment', item: 'https://appaw.store/business/card-trading/' },
  ],
};

export default function CardTradingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
