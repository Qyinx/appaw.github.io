import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grid Store Hong Kong – Rent Display Space (格仔鋪租)',
  description:
    'Rent affordable display grid space in Hong Kong. Grid Store (格仔鋪) lets collectors and small businesses showcase & sell products without running a physical store. We handle transactions, you collect earnings.',
  keywords: [
    // Core
    'grid store Hong Kong',
    'grid store rental',
    '格仔鋪',
    '格仔鋪香港',
    '格仔鋪租',
    '格仔鋪出租',
    // Features
    'consignment store Hong Kong',
    'retail space rental HK',
    'display grid rental',
    'rent display space HK',
    'small business retail Hong Kong',
    'collectibles store Hong Kong',
    'pop-up shop Hong Kong',
    // Long-tail / Intent
    'how to rent grid store Hong Kong',
    'affordable retail space Hong Kong',
    'sell products without a store',
    'Hong Kong grid store for collectors',
    'best grid store Hong Kong',
    'cheap retail rental HK',
    // Bilingual
    '香港格仔鋪租賃',
    '格仔鋪邊間好',
    '格仔鋪價錢',
    '小型零售出租',
    '格仔鋪寄賣',
  ],
  alternates: {
    canonical: '/business/grid-store/',
  },
  openGraph: {
    title: 'Grid Store Hong Kong – Rent Display Space (格仔鋪) | Appaw Store',
    description:
      'Affordable grid display rental in Hong Kong. Perfect for collectors and small businesses. Zero overhead – we handle everything.',
    url: 'https://appaw.store/business/grid-store/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Grid Store (格仔鋪) Display Rental in Hong Kong – Appaw Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grid Store Hong Kong – Rent Display Space (格仔鋪)',
    description:
      'Affordable grid display rental for collectors & small businesses in Hong Kong. We handle transactions, you collect earnings.',
    images: ['/images/og-image.png'],
  },
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Grid Store Rental (格仔鋪)',
  alternateName: ['格仔鋪租賃', 'Grid Store Hong Kong', 'Display Grid Rental'],
  description:
    'Display grid space rental for small businesses and collectors in Hong Kong. Rent a retail display grid to showcase and sell your products. We handle all customer transactions.',
  serviceType: 'Retail Space Rental',
  provider: {
    '@type': 'Organization',
    name: 'Appaw Store',
    url: 'https://appaw.store',
  },
  areaServed: {
    '@type': 'City',
    name: 'Hong Kong',
    containedInPlace: { '@type': 'Country', name: 'Hong Kong SAR' },
  },
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    url: 'https://appaw.store/business/grid-store/',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://appaw.store/business/' },
    { '@type': 'ListItem', position: 3, name: 'Grid Store', item: 'https://appaw.store/business/grid-store/' },
  ],
};

export default function GridStoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
