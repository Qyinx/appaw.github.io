import type { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import { organizationJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { brandLogoImageObject } from '@/lib/seo/brand';
import { aboutMetadata } from '@/lib/seo/metadata';

export const metadata = aboutMetadata;

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'About', item: 'https://appaw.store/about/' },
]);

const org = organizationJsonLd({
  name: 'Appaw Store',
  legalName: 'Appaw Store',
  alternateName: 'APPAW',
  url: 'https://appaw.store',
  logo: brandLogoImageObject,
  description: 'Hong Kong-based brand founded in 2024 by passionate collectors. We manufacture premium PSA Card Aluminum Protectors and operate a trusted TCG brokerage and consignment service for PSA and CGC graded Pokémon, sports, and MTG cards.',
  slogan: 'Protect What Matters. Display What You Love.',
  foundingDate: '2024',
  foundingLocation: { '@type': 'Place', name: 'Hong Kong' },
  areaServed: ['HK', 'US', 'GB', 'CN', 'TW', 'SG', 'JP', 'AU'],
  knowsAbout: [
    'PSA graded trading cards',
    'CGC graded trading cards',
    'Pokémon TCG card preservation',
    'TCG card valuation and brokerage',
    'Aluminum card case manufacturing',
    'UV protection for trading cards',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+852-9285-1189',
    email: 'support@appaw.store',
    contactType: 'customer service',
    availableLanguage: ['English', 'Chinese', 'Cantonese'],
  },
  sameAs: [
    'https://www.instagram.com/appaw.store/',
    'https://www.threads.net/@appaw.store',
    'https://appawstore.etsy.com/',
    'https://www.carousell.com.hk/u/appaw.store/',
  ],
});

const aboutFaqJsonLd = faqJsonLd([
  {
    q: 'What is Appaw Store?',
    a: 'Appaw Store is a Hong Kong-based brand founded in 2024 by passionate card collectors. We design and sell premium PSA Card Aluminum Protectors — industrial-grade aluminum cases with UV-blocking glass and N52 magnetic closure for PSA graded cards. We also operate a trusted TCG brokerage and consignment service for buying and selling PSA and CGC graded trading cards.',
  },
  {
    q: 'When was Appaw Store founded and where is it based?',
    a: 'Appaw Store was founded in 2024 and is based in Hong Kong. Our PSA Card Aluminum Protectors ship worldwide to the US, UK, Hong Kong, Singapore, and Taiwan. Our card trading and brokerage service operates exclusively face-to-face within Hong Kong.',
  },
  {
    q: 'Where can I verify Appaw Store reviews and ratings?',
    a: 'You can verify independent customer reviews and ratings on our Etsy shop at appawstore.etsy.com and on Carousell Hong Kong at carousell.com.hk/u/appaw.store. Both platforms host verified buyer reviews for our PSA Card Aluminum Protectors and trading transactions.',
  },
  {
    q: 'What languages does Appaw Store support?',
    a: 'Appaw Store supports English and Traditional Chinese (Cantonese). Our team speaks English, Mandarin, and Cantonese.',
  },
  {
    q: 'How do I contact Appaw Store?',
    a: 'Contact Appaw Store via WhatsApp at +852-9285-1189, email at support@appaw.store, or through Instagram @appaw.store, Etsy (appawstore.etsy.com), or Carousell (carousell.com.hk/u/appaw.store).',
  },
  {
    q: 'What is your card consignment and trading policy?',
    a: 'All card transactions are conducted face-to-face in Hong Kong. For consignment, there are no upfront listing fees — commission is charged only upon successful sale. We accept PSA and CGC graded cards. A quarterly stocktake is conducted every 3 months to confirm listing continuation. Full trading rules are published at appaw.store/business/card-trading.',
  },
]);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData data={[org, breadcrumb, aboutFaqJsonLd]} />
      {children}
    </>
  );
}
