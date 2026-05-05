import type { Metadata } from 'next';
import { en } from '@/i18n';

const PRICE_VALID_UNTIL = `${new Date().getFullYear()}-12-31`;

export const metadata: Metadata = {
  title: 'Museum-Grade PSA Card Aluminum Protector – N52 Magnetic, UV-Blocking',
  description:
    'Investment-grade aluminum enclosure for PSA graded slabs. Museum-grade UV filtration >95%, N52 neodymium closure, precision CNC frame. For high-value Pokémon, sports & MTG cards.',
  // NOTE: keep description ≤160 chars.
  keywords: [
    // Core product
    'PSA card protector',
    'PSA slab protector',
    'PSA card aluminum case',
    'PSA graded card case',
    'aluminum card protector',
    'aluminum slab case',
    'PSA card enclosure',
    'PSA precision encapsulation',
    // Investment & asset-grade
    'investment-grade card protection',
    'high-value card protection',
    'portfolio-grade slab case',
    'alternative asset card storage',
    'blue-chip card preservation',
    'grail card protector',
    'high-net-worth collector case',
    // Museum & archival
    'museum-grade UV filtration',
    'archival-standard aluminum housing',
    'gallery-worthy slab display',
    'conservation-level TCG storage',
    'inert material card protection',
    'archival card case',
    // Technical & industrial
    'industrial-grade PSA shell',
    'N52 neodymium magnetic closure',
    'precision-milled TCG case',
    'CNC aluminum card case',
    'anti-tamper card protection',
    // UV features
    'UV protection card case',
    'UV blocking card protector',
    'anti-fade card protector',
    // Card types
    'Pokemon card protector',
    'Pokemon PSA slab case',
    'sports card protector',
    'baseball card case',
    'basketball card protector',
    'MTG card protector',
    'trading card display case',
    'PSA 10 protector',
    'PSA 10 display case',
    // Intent / long-tail
    'best PSA card protector',
    'PSA slab scratch protection',
    'aluminum vs acrylic card case',
    'vault-ready PSA protector',
    'stackable card shell',
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
    priceValidUntil: PRICE_VALID_UNTIL,
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

const psaFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  datePublished: '2024-01-15',
  dateModified: '2026-04-17',
  mainEntity: en.psaProtectorPage.faq.items.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function PSAProtectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(psaFaqJsonLd) }} />
      {/* Server-rendered static copy for search engine crawlers */}
      <div className="sr-only">
        <h1>Museum-Grade PSA Card Aluminum Protector – Investment-Grade Slab Enclosure</h1>
        <p>
          The Appaw Store PSA Card Aluminum Protector is an investment-grade, museum-grade slab enclosure
          engineered for high-value PSA graded trading cards. The precision-milled CNC aluminum housing delivers
          archival-standard protection with &gt;95% UV-blocking glass and an N52 neodymium magnetic closure —
          no screws, no acrylic, no compromise. Designed for portfolio-grade card preservation of Pokémon,
          sports cards, baseball cards, basketball cards, football cards, and Magic: The Gathering (MTG) singles.
          Weighs 74 g. Fits standard 35PT PSA slabs. Available in 7 anodized finishes. Ships worldwide from Hong Kong.
        </p>
        <p>
          Unlike consumer-grade TPU bumpers or acrylic cases, the Appaw Store protector uses inert aluminum
          alloy construction — the same material class used in archival housing and industrial-grade storage.
          The N52 neodymium magnetic closure provides anti-tamper security without damaging the slab surface.
          Museum-grade UV filtration blocks &gt;95% of UV-C and UV-A radiation, preventing colour fade and
          surface degradation on high-value collectibles and blue-chip graded cards.
        </p>
        <p>
          Whether you&apos;re vaulting a PSA 10 Charizard, protecting a grail sports card, or building a
          gallery-worthy display, this is the conservation-level TCG storage solution built for serious
          collectors and alternative asset investors.
        </p>
      </div>
      {children}
    </>
  );
}
