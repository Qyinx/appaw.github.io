import { en } from '@/i18n';
import StructuredData from '@/components/StructuredData';
import { productJsonLd as productJsonLdFactory, breadcrumbJsonLd as breadcrumbFactory, faqJsonLd as faqFactory } from '@/lib/seo';
import { psaProtectorsMetadata } from '@/lib/seo/metadata';

const PRICE_VALID_UNTIL = `${new Date().getFullYear()}-12-31`;

export const metadata = psaProtectorsMetadata;

// (Per-page product data is defined below in `product` and passed to the centralized factory.)

// BreadcrumbList for search result appearance
// BreadcrumbList for search result appearance (built via factory below)

// FAQ is generated via the centralized factory below

export default function PSAProtectorLayout({ children }: { children: React.ReactNode }) {
  const product = {
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
    offers: [
      {
        '@type': 'Offer',
        name: 'PSA Protector — Gradient finish',
        price: '80',
        priceCurrency: 'HKD',
        priceValidUntil: PRICE_VALID_UNTIL,
        availability: 'https://schema.org/InStock',
        url: 'https://appaw.store/products/psa-protectors/',
        seller: { '@type': 'Organization', name: 'Appaw Store' },
      },
      {
        '@type': 'Offer',
        name: 'PSA Protector — Single colour finish',
        price: '72',
        priceCurrency: 'HKD',
        priceValidUntil: PRICE_VALID_UNTIL,
        availability: 'https://schema.org/InStock',
        url: 'https://appaw.store/products/psa-protectors/',
        seller: { '@type': 'Organization', name: 'Appaw Store' },
      },
    ],
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'UV Protection', value: '>95%' },
      { '@type': 'PropertyValue', name: 'Magnet Grade', value: 'N52 Neodymium' },
      { '@type': 'PropertyValue', name: 'Compatibility', value: 'Standard 35PT PSA Slabs' },
      { '@type': 'PropertyValue', name: 'Closure Type', value: 'Magnetic (no screws)' },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '127', bestRating: '5' },
  };

  const breadcrumb = breadcrumbFactory([
    { position: 1, name: 'Home', item: 'https://appaw.store/' },
    { position: 2, name: 'Products', item: 'https://appaw.store/products/' },
    { position: 3, name: 'PSA Card Aluminum Protector', item: 'https://appaw.store/products/psa-protectors/' },
  ]);

  const psaFaq = faqFactory(en.psaProtectorPage.faq.items);

  return (
    <>
      <StructuredData data={[productJsonLdFactory(product), breadcrumb, psaFaq]} />
      {/* Server-rendered static copy for search engine crawlers */}
      <div className="sr-only">
        <h1>PSA 鋁合金保護殼｜Museum‑Grade PSA 磁吸卡磚 — 收藏家首選</h1>
        <h2>Museum‑Grade PSA Aluminum Protector — &gt;95% UV Glass, N52 Magnetic Closure for PSA 10 &amp; Investment‑Grade Cards</h2>
        <p>
          Appaw Store Museum‑Grade PSA 鋁合金保護殼：精密 CNC 鋁合金 + &gt;95% 防UV 玻璃與 N52 磁吸設計，專為評級保護殼提供防刮耐曬保護。
        </p>
      </div>
      {children}
    </>
  );
}
