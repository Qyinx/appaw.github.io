import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'PSA Card Aluminum Protector & Graded Card Trading – Appaw Store',
  description:
    'Hong Kong-based Appaw Store crafts premium PSA Card Aluminum Protectors with >95% UV-blocking glass and N52 magnetic closure. Browse our graded Pokémon, sports & MTG card marketplace. Ships worldwide.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PSA Card Aluminum Protector & Graded Card Trading – Appaw Store',
    description:
      'Premium PSA Card Aluminum Protectors with UV-blocking glass and N52 magnets. Browse our graded Pokémon, sports & MTG card marketplace. Based in Hong Kong, ships worldwide.',
    url: 'https://appaw.store/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – PSA Card Aluminum Protector & Graded Card Trading',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSA Card Aluminum Protector & Graded Card Trading – Appaw Store',
    description:
      'Premium PSA Card Protectors with >95% UV-blocking glass + N52 magnets. Graded card marketplace based in Hong Kong.',
    images: ['/images/og-image.png'],
  },
};

export default function Page() {
  return <HomeClient />;
}
