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

const servicesCatalogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Appaw Store Services',
  description: 'Premium PSA card protection products and trusted TCG trading & brokerage services based in Hong Kong.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        name: 'PSA Card Aluminum Protector',
        description: 'Premium aluminum protective case for PSA graded card slabs. Features >95% UV-blocking glass, N52 magnetic closure, and a precision aluminum frame. Fits standard 35PT PSA slabs including Pokémon, sports cards, and MTG.',
        provider: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
        serviceType: 'Card Protection Product',
        areaServed: [
          { '@type': 'Country', name: 'Hong Kong' },
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'Singapore' },
          { '@type': 'Country', name: 'Taiwan' },
        ],
        url: 'https://appaw.store/products/psa-protectors/',
        offers: {
          '@type': 'Offer',
          price: '17.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://appawstore.etsy.com/',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        name: 'TCG Trading & Brokerage',
        description: 'Trusted buy, sell, and consignment service for PSA and CGC graded trading cards in Hong Kong. Specialising in Pokémon, sports cards, and MTG. Face-to-face transactions only. Commission charged on successful sale only.',
        provider: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
        serviceType: 'Trading Card Brokerage',
        areaServed: { '@type': 'City', name: 'Hong Kong' },
        url: 'https://appaw.store/business/card-trading/',
        termsOfService: 'Face-to-face delivery in Hong Kong only. No upfront listing fee. Commission charged on successful sale. Quarterly stocktake every 3 months.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://appaw.store/business/' },
  ],
};

const businessFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What services does Appaw Store offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Appaw Store offers two services: (1) PSA Card Aluminum Protectors — premium aluminum cases with >95% UV-blocking glass and N52 magnetic closure for PSA graded slabs, shipping worldwide; (2) TCG Trading & Brokerage — a trusted buy, sell, and consignment service for PSA and CGC graded trading cards, conducted face-to-face in Hong Kong.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Appaw Store ship internationally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — PSA Card Aluminum Protectors ship worldwide, including the USA, UK, Hong Kong, Singapore, and Taiwan. Card trading transactions are Hong Kong in-person only.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I consign my graded cards with Appaw Store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Appaw Store accepts PSA and CGC graded cards for consignment. There is no upfront listing fee — commission is charged only upon successful sale. Contact us via WhatsApp at +852-9285-1189 to begin.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of graded cards does Appaw Store trade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Appaw Store specialises in PSA and CGC graded Pokémon cards, sports cards (basketball, baseball, football), and Magic: The Gathering (MTG) cards. We also consider other trading card games on a case-by-case basis.',
      },
    },
  ],
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesCatalogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessFaqJsonLd) }} />
      {children}
    </>
  );
}
