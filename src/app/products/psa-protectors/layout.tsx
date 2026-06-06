import { en, zh } from '@/i18n';
import { PRODUCT_NAME } from '@/lib/product-names';
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
    name: PRODUCT_NAME.en.full,
    alternateName: [
      PRODUCT_NAME.zh.full,
      PRODUCT_NAME.zh.short,
      'PSA卡鋁合金保護殼',
      '磁吸鑑定卡磚',
      'PSA Card Case',
      'Aluminum Graded Slab Protector',
    ],
    description:
      'Industrial-grade aluminum protector with >95% UV-blocking glass and N52 magnetic closure for PSA and CGC graded cards. Fits standard 35PT PSA and CGC slabs including Pokemon, sports cards, and MTG.',
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
        name: 'Graded Slab Protector — Gradient finish',
        price: '80',
        priceCurrency: 'HKD',
        priceValidUntil: PRICE_VALID_UNTIL,
        availability: 'https://schema.org/InStock',
        url: 'https://appaw.store/products/psa-protectors/',
        seller: { '@type': 'Organization', name: 'Appaw Store' },
      },
      {
        '@type': 'Offer',
        name: 'Graded Slab Protector — Single colour finish',
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
      { '@type': 'PropertyValue', name: 'Compatibility', value: 'Standard 35PT PSA & CGC Slabs' },
      { '@type': 'PropertyValue', name: 'Closure Type', value: 'Magnetic (no screws)' },
    ],
  };

  const breadcrumb = breadcrumbFactory([
    { position: 1, name: 'Home', item: 'https://appaw.store/' },
    { position: 2, name: PRODUCT_NAME.en.full, item: 'https://appaw.store/products/psa-protectors/' },
  ]);

  const psaFaq = faqFactory(en.psaProtectorPage.faq.items);

  return (
    <>
      <StructuredData data={[productJsonLdFactory(product), breadcrumb, psaFaq]} />
      {/* Server-rendered static copy for search engine crawlers */}
      <div className="sr-only">
        <h2>{PRODUCT_NAME.zh.seoH1}</h2>
        <p>Museum‑Grade {PRODUCT_NAME.en.full} — &gt;95% UV Glass, N52 Magnetic Closure for PSA 10 &amp; Investment‑Grade Cards</p>
        <p>
          Appaw Store Museum‑Grade {PRODUCT_NAME.zh.full}：精密 CNC 鋁合金 + &gt;95% 防UV 玻璃與 N52 磁吸設計，專為標準 35PT PSA 及 CGC 鑑定卡磚提供防刮耐曬保護。香港設計，全球付運。
        </p>
        {zh.psaProtectorPage.overview.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        {zh.psaProtectorPage.hkGuide.body.map((para, i) => (
          <p key={`guide-${i}`}>{para}</p>
        ))}
        <p>{PRODUCT_NAME.zh.metaDescription}</p>
        <p>門市地址：{PRODUCT_NAME.shop.zh}（{PRODUCT_NAME.shop.en}）</p>
        <p>
          技術規格：尺寸 8.7 × 14.2 × 0.98 cm，重量 74 g，材質航空級鋁合金及防紫外線玻璃，N52 釹磁鐵磁吸閉合，兼容寶可夢、運動卡及 MTG 鑑定卡磚。
        </p>
      </div>
      {children}
    </>
  );
}
