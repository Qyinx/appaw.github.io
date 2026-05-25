import type { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { cardTradingMetadata } from '@/lib/seo/metadata';

export const metadata = cardTradingMetadata;

const service = serviceJsonLd({
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
});

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'Business', item: 'https://appaw.store/business/' },
  { position: 3, name: 'TCG Brokerage & Consignment', item: 'https://appaw.store/business/card-trading/' },
]);

export default function CardTradingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData data={[service, breadcrumb]} />
      {children}
    </>
  );
}
