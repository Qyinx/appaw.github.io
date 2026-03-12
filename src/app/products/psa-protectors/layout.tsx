import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PSA Card Aluminum Protector – UV-Blocking Magnetic Case',
  description:
    'Premium aluminum protector for PSA graded card slabs. Features >95% UV-blocking glass, N52 magnetic closure, precision aluminum frame. Fits standard 35PT PSA slabs – Pokemon, sports cards, MTG. Free worldwide shipping.',
  keywords: [
    // Core product
    'PSA card protector',
    'PSA slab protector',
    'PSA card aluminum case',
    'PSA graded card case',
    'aluminum card protector',
    // Features
    'UV protection card case',
    'UV blocking card protector',
    'N52 magnetic card case',
    'magnetic card display',
    'anti-fade card protector',
    // Card types
    'Pokemon card protector',
    'Pokemon PSA slab case',
    'sports card protector',
    'baseball card case',
    'basketball card protector',
    'football card protector',
    'MTG card protector',
    'trading card display case',
    'graded card protection',
    'PSA 10 protector',
    'PSA 10 display case',
    // Long-tail / intent
    'best PSA card protector',
    'how to protect PSA graded cards',
    'PSA slab scratch protection',
    'card collection display case',
    'premium card case aluminum',
    'PSA card case with magnets',
    'card protector UV glass',
    // Competitor comparison
    'PSA card protector alternative',
    'aluminum vs acrylic card case',
    // Bilingual
    'PSA卡鋁合金保護殼',
    'PSA卡保護套',
    '鋁合金卡片保護殼',
    'PSA評級卡保護',
    'PSA卡片展示盒',
  ],
  alternates: {
    canonical: '/products/psa-protectors/',
  },
  openGraph: {
    title: 'PSA Card Aluminum Protector – UV-Blocking Magnetic Case | Appaw Store',
    description:
      'Industrial-grade aluminum protector with >95% UV-blocking glass & N52 magnetic closure. Fits standard 35PT PSA slabs. Protect your Pokemon, sports & MTG graded cards.',
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
    title: 'PSA Card Aluminum Protector – UV-Blocking Magnetic Case',
    description:
      'Premium aluminum protector for PSA graded cards. >95% UV protection, N52 magnets, precision frame. Ships worldwide.',
    images: ['/images-optimized/describe/sell%205.png'],
  },
};

// Per-page Product structured data
const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'PSA Card Aluminum Protector',
  alternateName: ['PSA卡鋁合金保護殼', 'PSA Card Case', 'Aluminum PSA Slab Protector'],
  description:
    'Industrial-grade aluminum protector with >95% UV-blocking glass and N52 magnetic closure for PSA graded cards. Fits standard 35PT PSA slabs including Pokemon, sports cards, and MTG.',
  image: [
    'https://appaw.store/images-optimized/describe/sell%205.png',
    'https://appaw.store/images-optimized/describe/sell%201.png',
    'https://appaw.store/images-optimized/describe/sell%202.png',
  ],
  brand: { '@type': 'Brand', name: 'Appaw Store' },
  sku: 'APPAW-PSA-ALU-001',
  material: ['Aluminum', 'UV-Blocking Glass'],
  weight: { '@type': 'QuantitativeValue', value: '74', unitCode: 'GRM' },
  width: { '@type': 'QuantitativeValue', value: '8.7', unitCode: 'CMT' },
  height: { '@type': 'QuantitativeValue', value: '14.2', unitCode: 'CMT' },
  depth: { '@type': 'QuantitativeValue', value: '0.98', unitCode: 'CMT' },
  category: 'Trading Card Accessories > Card Protectors',
  offers: {
    '@type': 'Offer',
    price: '17.99',
    priceCurrency: 'USD',
    priceValidUntil: '2026-12-31',
    availability: 'https://schema.org/InStock',
    url: 'https://appawstore.etsy.com/',
    seller: { '@type': 'Organization', name: 'Appaw Store' },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: ['US', 'GB', 'HK', 'SG', 'TW'] },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitText: 'Day' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 14, unitText: 'Day' },
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'HK',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 15,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'UV Protection', value: '>95%' },
    { '@type': 'PropertyValue', name: 'Magnet Grade', value: 'N52 Neodymium' },
    { '@type': 'PropertyValue', name: 'Compatibility', value: 'Standard 35PT PSA Slabs' },
    { '@type': 'PropertyValue', name: 'Closure Type', value: 'Magnetic (no screws)' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
    bestRating: '5',
  },
};

// BreadcrumbList for search result appearance
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://appaw.store/products/' },
    { '@type': 'ListItem', position: 3, name: 'PSA Card Aluminum Protector', item: 'https://appaw.store/products/psa-protectors/' },
  ],
};

export default function PSAProtectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
