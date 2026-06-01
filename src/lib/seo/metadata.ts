import type { Metadata } from 'next';

export const psaProtectorsMetadata: Metadata = {
  title: 'Museum-Grade PSA Card Aluminum Protector – N52 Magnetic, UV-Blocking',
  description:
    'Investment-grade aluminum enclosure for PSA graded slabs. Museum-grade UV filtration >95%, N52 neodymium closure, precision CNC frame. For high-value Pokémon, sports & MTG cards.',
  // NOTE: keep description ≤160 chars.
  keywords: [
    'PSA card protector',
    'PSA slab protector',
    'PSA card aluminum case',
    'PSA graded card case',
    'aluminum card protector',
    'aluminum slab case',
    'PSA card enclosure',
    'PSA precision encapsulation',
    'investment-grade card protection',
    'high-value card protection',
    'museum-grade UV filtration',
  ],
  alternates: { canonical: '/products/psa-protectors/' },
  openGraph: {
    title: 'Museum-Grade PSA Card Aluminum Protector – N52 Magnetic, UV-Blocking | Appaw Store',
    description:
      'Investment-grade aluminum enclosure for PSA slabs. Museum-grade UV filtration, N52 neodymium closure, CNC precision frame. For high-value Pokémon, sports & MTG graded cards.',
    url: 'https://appaw.store/products/psa-protectors/',
    type: 'website',
    images: [
      {
        url: '/images-optimized/describe/sell%205.png',
        width: 1200,
        height: 630,
        alt: 'PSA Card Aluminum Protector with UV-Blocking Glass and N52 Magnetic Closure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Museum-Grade PSA Card Aluminum Protector – Investment-Grade Slab Case',
    description:
      'Investment-grade aluminum enclosure for PSA graded cards. Museum-grade UV filtration, N52 neodymium magnets, CNC precision frame. Ships worldwide.',
    images: ['/images-optimized/describe/sell%205.png'],
  },
};

export default {
  psaProtectorsMetadata,
};

export const homeMetadata: Metadata = {
  title: 'PSA Card Aluminum Protector & Graded Card Trading – Appaw Store',
  description:
    'Hong Kong-based Appaw Store crafts premium PSA Card Aluminum Protectors with >95% UV-blocking glass and N52 magnetic closure. Browse our graded Pokémon, sports & MTG card marketplace. Ships worldwide.',
  alternates: { canonical: '/' },
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

export const rootMetadata: Metadata = {
  title: {
    default: 'Appaw Store - PSA Card Aluminum Protector & TCG Trading',
    template: '%s | Appaw Store',
  },
  description: 'Premium PSA Card Aluminum Protector with >95% UV-blocking glass, N52 magnetic closure, and precision aluminum frame. Trusted TCG trading & brokerage for graded Pokémon, sports, and MTG cards.',
  keywords: [
    'PSA card protector',
    'PSA card aluminum case',
    'PSA slab protector',
    'aluminum card case',
    'UV protection card case',
    'N52 magnetic card case',
  ],
  authors: [{ name: 'Appaw Store' }],
  creator: 'Appaw Store',
  publisher: 'Appaw Store',
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/apple-touch-icon.png' },
  metadataBase: new URL('https://appaw.store'),
  alternates: { canonical: '/', languages: { en: '/', 'zh-HK': '/' } },
  openGraph: {
    title: 'Appaw Store – PSA Card Aluminum Protector & TCG Trading',
    description: 'Premium PSA Card Aluminum Protector with >95% UV-blocking glass and N52 magnetic closure. Trusted TCG trading & brokerage for graded cards.',
    url: 'https://appaw.store',
    siteName: 'Appaw Store',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_HK', 'zh_CN'],
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Appaw Store - PSA Card Aluminum Protector' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appaw Store - PSA Card Aluminum Protector & TCG Trading',
    description: 'Premium aluminum protector with >95% UV protection for PSA graded cards. Trusted TCG trading & brokerage.',
    images: ['/images/og-image.png'],
    creator: '@appaw.store',
  },
  robots: { index: true, follow: true },
};

export const centeringMetadata: Metadata = {
  title: 'Free Card Centering Calculator & PSA 10 Analyzer | Appaw Store',
  description:
    'Quickly check if your Pokémon, sports, or TCG cards meet PSA 10 centering standards. Upload your card, adjust the alignment lines, and get instant margin percentages — free.',
  // NOTE: keep description ≤160 chars where possible for SERP display.
  keywords: [
    'card centering calculator',
    'card centering tool',
    'PSA 10 centering',
    'PSA centering calculator',
    'centering analyzer',
    'how to check card centering',
    'Pokemon card centering',
    'sports card centering tool',
    'TCG centering grader',
    'BGS centering',
    'card centering percentage',
    'pre-grade centering tool',
  ],
  alternates: { canonical: '/tools/card-centering/' },
  openGraph: {
    title: 'Free Card Centering Calculator & PSA 10 Analyzer | Appaw Store',
    description:
      'Check if your Pokémon, sports, or TCG cards meet PSA 10 centering standards. Upload a card, align the guides, and get instant front & back margin percentages. Free.',
    url: 'https://appaw.store/tools/card-centering/',
    type: 'website',
    images: [{ url: '/images/og-centering.png', width: 1200, height: 630, alt: 'Free Card Centering Calculator & PSA 10 Analyzer — Appaw Store' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Card Centering Calculator & PSA 10 Analyzer | Appaw Store',
    description: 'Check if your cards meet PSA 10 centering standards. Upload, align the guides, and get instant margin percentages. Free tool from Appaw Store.',
    images: ['/images/og-centering.png'],
  },
};

export const privacyMetadata: Metadata = {
  title: 'Privacy Policy | Appaw Store',
  description: 'Learn how Appaw Store collects, uses, and protects your data. We use Google Analytics 4 for site analytics. Purchases are handled securely through Etsy and Carousell.',
  alternates: { canonical: '/privacy/' },
  robots: { index: true, follow: true },
};

export const aboutMetadata: Metadata = {
  title: 'About Appaw Store – Premium PSA Card Protectors, Hong Kong',
  description:
    'Appaw Store is a Hong Kong-based brand specialising in PSA Card Aluminum Protectors and TCG graded card trading. Our UV-blocking, N52 magnetic cases ship to 100+ countries. Learn our story.',
  keywords: ['Appaw Store', 'about Appaw Store', 'Appaw Store Hong Kong'],
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About Appaw Store – Premium PSA Card Protectors, Hong Kong',
    description: 'Hong Kong-based brand crafting premium PSA card aluminum protectors & offering trusted TCG trading services. UV-blocking glass, N52 magnets, ships to 100+ countries.',
    url: 'https://appaw.store/about/',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'About Appaw Store – Premium Card Protection & TCG Trading' }],
  },
  twitter: { card: 'summary_large_image', title: 'About Appaw Store – Premium PSA Card Protectors, Hong Kong', description: 'Hong Kong-based brand crafting premium PSA card aluminum protectors & offering trusted TCG graded card trading services.', images: ['/images/og-image.png'] },
};

export const collectionMetadata: Metadata = {
  title: 'My Collection | Appaw Store',
  description: 'Track your personal graded card collection — log buy prices, grades, cert numbers, and listing prices in one private dashboard.',
  robots: { index: false, follow: false },
};

export const adminTradeMetadata: Metadata = {
  title: 'Card Admin | Appaw Store',
  robots: { index: false, follow: false },
};

export const collectionListMetadata: Metadata = {
  title: 'My Collection | Appaw Store',
  description: 'Manage your personal graded card collection — track buy prices, grades, cert numbers, and more.',
  robots: { index: false, follow: false },
};

export const collectionLayoutMetadata: Metadata = collectionListMetadata;

export const newCardMetadata: Metadata = {
  title: 'Add Card | Appaw Store',
  robots: { index: false, follow: false },
};

export const editCardMetadata: Metadata = {
  title: 'Edit Card | Appaw Store',
  robots: { index: false, follow: false },
};

export const businessMetadata: Metadata = {
  title: 'Our Services – PSA Card Protector & TCG Trading',
  description:
    'Explore Appaw Store services: premium PSA Card Aluminum Protectors with UV-blocking glass & N52 magnetic closure, and trusted TCG trading & brokerage for graded Pokémon, sports, and MTG cards.',
  alternates: { canonical: '/business/' },
};

export const cardTradingMetadata: Metadata = {
  title: 'PSA Pokémon Cards Hong Kong | Buy Rare Graded Cards – Appaw Store',
  description:
    'The premier Hong Kong destination for investment-grade PSA 10 Pokémon cards. Zero-fee consignment, museum-quality verified transactions & private acquisition of blue-chip graded assets.',
  alternates: { canonical: '/business/card-trading/' },
  robots: { index: false, follow: false },
};
