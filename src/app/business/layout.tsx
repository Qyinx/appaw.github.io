import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services – PSA Card Aluminum Protector',
  description:
    'Explore Appaw Store services: premium PSA Card Aluminum Protectors with UV-blocking glass & N52 magnetic closure for collectors.',
  keywords: [
    // PSA Protector
    'PSA card protector',
    'PSA slab protector',
    'aluminum card case',
    'UV protection card case',
    'graded card protection',
    // Intent
    'buy PSA card protector',
    'card protection accessories',
    // Bilingual
    'PSA卡保護殼',
  ],
  alternates: {
    canonical: '/business/',
  },
  openGraph: {
    title: 'Our Services – PSA Card Aluminum Protector | Appaw Store',
    description:
      'Premium PSA card protectors for collectors. Protect your graded cards with industrial-grade aluminum and UV-blocking glass.',
    url: 'https://appaw.store/business/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – PSA Card Protector',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services – PSA Card Aluminum Protector',
    description:
      'PSA aluminum protectors with UV-blocking glass for collectors.',
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
