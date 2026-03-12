import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services – PSA Card Protector & Grid Store Rental',
  description:
    'Explore Appaw Store services: premium PSA Card Aluminum Protectors with UV-blocking glass & N52 magnetic closure, and Grid Store (格仔鋪) display space rental in Hong Kong for collectors and small businesses.',
  keywords: [
    // PSA Protector
    'PSA card protector',
    'PSA slab protector',
    'aluminum card case',
    'UV protection card case',
    'graded card protection',
    // Grid Store
    'grid store Hong Kong',
    '格仔鋪',
    '格仔鋪香港',
    '格仔鋪租',
    'grid store rental',
    'consignment store Hong Kong',
    'retail space rental HK',
    'display grid rental',
    'small business Hong Kong',
    // Intent
    'buy PSA card protector',
    'rent grid store space',
    'Hong Kong collectibles store',
    'card protection accessories',
    // Bilingual
    'PSA卡保護殼',
    '格仔鋪租賃',
    '香港格仔鋪',
    '小型零售出租',
  ],
  alternates: {
    canonical: '/business/',
  },
  openGraph: {
    title: 'Our Services – PSA Card Protector & Grid Store (格仔鋪) | Appaw Store',
    description:
      'Premium PSA card protectors and Grid Store display space rental in Hong Kong. Protect your graded cards or start selling with zero overhead.',
    url: 'https://appaw.store/business/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – PSA Card Protector & Grid Store Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services – PSA Card Protector & Grid Store Rental',
    description:
      'PSA aluminum protectors with UV-blocking glass. Grid Store rental in Hong Kong for collectors & small businesses.',
    images: ['/images/og-image.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://appaw.store/business/' },
  ],
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
