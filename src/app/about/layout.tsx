import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Appaw Store – Our Story & Mission',
  description:
    'Learn about Appaw Store – founded in Hong Kong, we craft premium PSA Card Aluminum Protectors and offer trusted TCG trading & brokerage services. Serving 100+ countries with 500+ products and 99% customer satisfaction.',
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
    title: 'About Appaw Store – Our Story & Mission',
    description:
      'Hong Kong-based brand crafting premium PSA card protectors & offering trusted TCG trading services. 500+ products, 100+ countries, 99% satisfaction.',
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
    title: 'About Appaw Store – Our Story & Mission',
    description:
      'Hong Kong-based brand crafting premium PSA card protectors & offering trusted TCG trading services.',
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
  alternateName: 'APPAW',
  url: 'https://appaw.store',
  logo: 'https://appaw.store/images/logo.png',
  description: 'Premium PSA Card Aluminum Protector manufacturer and TCG trading & brokerage service in Hong Kong.',
  foundingDate: '2024',
  foundingLocation: { '@type': 'Place', name: 'Hong Kong' },
  areaServed: ['HK', 'US', 'GB', 'CN', 'TW', 'SG', 'JP', 'AU'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+852-9285-1189',
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
        text: 'Appaw Store is a Hong Kong-based brand founded in 2024. We design and sell premium PSA Card Aluminum Protectors — industrial-grade aluminum cases with UV-blocking glass and N52 magnetic closure for PSA graded cards. We also operate a trusted TCG trading and brokerage service for buying and selling PSA and CGC graded trading cards.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Appaw Store based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Appaw Store is based in Hong Kong. Our PSA Card Aluminum Protectors ship worldwide. Our card trading and brokerage service is exclusively face-to-face within Hong Kong.',
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
