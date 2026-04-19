import type { Metadata } from 'next';

export const metadata: Metadata = {
  // 52 chars — clear brokerage/consignment angle for high-intent sellers
  title: 'Pokémon TCG Brokerage & Consignment | Sell PSA Cards',
  // 153 chars — under the 160-char limit, conversion-optimised for sellers
  description:
    'Trusted Pokémon TCG broker in Hong Kong. Sell your PSA 10 collection via secure consignment — expert valuation, global buyer network, zero upfront fees.',
  keywords: [
    // Brokerage / consignment — high-intent
    'Pokemon TCG broker',
    'trusted Pokemon card broker',
    'PSA card consignment',
    'sell PSA cards Hong Kong',
    'TCG consignment service',
    'sell PSA 10 cards',
    'graded card brokerage',
    'Pokemon card valuation',
    'sell graded cards',
    'PSA 10 consignment',
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
    // Bilingual
    '評級卡牌買賣',
    '寶可夢卡牌',
    'PSA 評級卡',
    '評級卡寄售',
    '寶可夢卡牌經紀',
  ],
  alternates: {
    canonical: '/business/card-trading/',
  },
  openGraph: {
    title: 'Pokémon TCG Brokerage & Consignment – Sell Your PSA 10s | Appaw Store',
    description:
      'Trusted TCG broker & consignment service in Hong Kong. Expert valuation, global buyers, zero upfront fees. PSA & CGC graded Pokémon, sports & MTG cards.',
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
    title: 'Pokémon TCG Brokerage & Consignment | Appaw Store',
    description:
      'Sell your PSA 10 collection via trusted consignment in Hong Kong. Expert valuation, global buyer network, zero upfront fees.',
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
    '寶可夢卡牌經紀及寄售',
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
