import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Appaw Store – Premium PSA Card Protectors, Hong Kong',
  description:
    'Appaw Store is a Hong Kong-based brand specialising in PSA Card Aluminum Protectors and TCG graded card trading. Our UV-blocking, N52 magnetic cases ship to 100+ countries. Learn our story.',
  keywords: [
    'Appaw Store',
    'about Appaw Store',
    'Appaw Store Hong Kong',
    'PSA card protector brand',
    'card protection company',
    'TCG trading Hong Kong',
    'graded card broker',
    'trading card accessories brand',
    'Hong Kong card accessories',
    'card collector accessories',
  ],
  alternates: {
    canonical: '/about/',
  },
  openGraph: {
    title: 'About Appaw Store – Premium PSA Card Protectors, Hong Kong',
    description:
      'Hong Kong-based brand crafting premium PSA card aluminum protectors & offering trusted TCG trading services. UV-blocking glass, N52 magnets, ships to 100+ countries.',
    url: 'https://appaw.store/about/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About Appaw Store – Premium Card Protection & TCG Trading',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Appaw Store – Premium PSA Card Protectors, Hong Kong',
    description:
      'Hong Kong-based brand crafting premium PSA card aluminum protectors & offering trusted TCG graded card trading services.',
    images: ['/images/og-image.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://appaw.store/about/' },
  ],
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Appaw Store',
  legalName: 'Appaw Store',
  alternateName: 'APPAW',
  url: 'https://appaw.store',
  logo: 'https://appaw.store/images/logo.png',
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
};

const aboutFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Appaw Store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Appaw Store is a Hong Kong-based brand founded in 2024 by passionate card collectors. We design and sell premium PSA Card Aluminum Protectors — industrial-grade aluminum cases with UV-blocking glass and N52 magnetic closure for PSA graded cards. We also operate a trusted TCG brokerage and consignment service for buying and selling PSA and CGC graded trading cards.',
      },
    },
    {
      '@type': 'Question',
      name: 'When was Appaw Store founded and where is it based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Appaw Store was founded in 2024 and is based in Hong Kong. Our PSA Card Aluminum Protectors ship worldwide to the US, UK, Hong Kong, Singapore, and Taiwan. Our card trading and brokerage service operates exclusively face-to-face within Hong Kong.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I verify Appaw Store reviews and ratings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can verify independent customer reviews and ratings on our Etsy shop at appawstore.etsy.com and on Carousell Hong Kong at carousell.com.hk/u/appaw.store. Both platforms host verified buyer reviews for our PSA Card Aluminum Protectors and trading transactions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What languages does Appaw Store support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Appaw Store supports English and Traditional Chinese (Cantonese). Our team speaks English, Mandarin, and Cantonese.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I contact Appaw Store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contact Appaw Store via WhatsApp at +852-9285-1189, email at support@appaw.store, or through Instagram @appaw.store, Etsy (appawstore.etsy.com), or Carousell (carousell.com.hk/u/appaw.store).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is your card consignment and trading policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All card transactions are conducted face-to-face in Hong Kong. For consignment, there are no upfront listing fees — commission is charged only upon successful sale. We accept PSA and CGC graded cards. A quarterly stocktake is conducted every 3 months to confirm listing continuation. Full trading rules are published at appaw.store/business/card-trading.',
      },
    },
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqJsonLd) }} />
      {children}
    </>
  );
}
