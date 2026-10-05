import { en, zh } from '@/i18n';
import { PRODUCT_NAME } from '@/lib/product-names';
import { PROTECTOR_PRICING, protectorPriceValidUntil } from '@/lib/products/protector-pricing';
import { SITE_ORIGIN } from '@/lib/seo/brand';
import { breadcrumbJsonLd, faqJsonLd, productJsonLd } from '@/lib/seo';

export type PsaProtectorsLocale = 'en' | 'zh';

/** Current catalog SKU after UV-glass rename. */
export const PROTECTOR_SKU = 'APPAW-PSA-UV-001';
/** Retired aluminum-era SKU — kept as identifier so old feeds still match. */
export const PROTECTOR_SKU_LEGACY = 'APPAW-PSA-ALU-001';

function productUrl(locale: PsaProtectorsLocale): string {
  return locale === 'zh'
    ? `${SITE_ORIGIN}/zh/products/psa-protectors/`
    : `${SITE_ORIGIN}/products/psa-protectors/`;
}

function homeUrl(locale: PsaProtectorsLocale): string {
  return locale === 'zh' ? `${SITE_ORIGIN}/zh/` : `${SITE_ORIGIN}/`;
}

export function buildPsaProtectorsStructuredData(locale: PsaProtectorsLocale) {
  const copy = locale === 'zh' ? zh.psaProtectorPage : en.psaProtectorPage;
  const names = PRODUCT_NAME[locale];
  const url = productUrl(locale);
  const inLanguage = locale === 'zh' ? 'zh-HK' : 'en';

  const product = productJsonLd({
    name: names.full,
    inLanguage,
    alternateName: [
      PRODUCT_NAME.en.full,
      PRODUCT_NAME.zh.full,
      PRODUCT_NAME.zh.short,
      'PSA Slab Case',
      'Graded Card Case',
      'PSA Card Protector',
      'PSA卡殼',
      '鑑定卡殼',
      'PSA卡保護殼',
      '磁吸鑑定卡',
      'PSA Card Case',
      'PSA Magnetic Case',
      'Magnetic PSA Slab Case',
      'UV Glass Slab Protector',
      'Graded Slab UV Glass Protector',
    ],
    description:
      locale === 'zh'
        ? PRODUCT_NAME.zh.metaDescription
        : '35PT magnetic graded card protector with tempered UV-blocking glass and N52 closure for PSA and CGC graded cards. Fits standard 35PT slabs including Pokemon, sports cards, and MTG.',
    image: [
      `${SITE_ORIGIN}/images-optimized/describe/sell%205.png`,
      `${SITE_ORIGIN}/images-optimized/describe/sell%201.png`,
      `${SITE_ORIGIN}/images-optimized/describe/sell%202.png`,
    ],
    brand: { '@type': 'Brand', name: 'Appaw Store' },
    sku: PROTECTOR_SKU,
    identifier: PROTECTOR_SKU,
    material:
      locale === 'zh'
        ? ['防UV強化玻璃', '金屬邊框']
        : ['Tempered UV-Blocking Glass', 'Metal Frame'],
    weight: { '@type': 'QuantitativeValue', value: '74', unitCode: 'GRM' },
    width: { '@type': 'QuantitativeValue', value: '8.7', unitCode: 'CMT' },
    height: { '@type': 'QuantitativeValue', value: '14.2', unitCode: 'CMT' },
    depth: { '@type': 'QuantitativeValue', value: '0.98', unitCode: 'CMT' },
    category: 'Trading Card Accessories > Card Protectors',
    url,
    offers: [
      {
        '@type': 'Offer',
        name:
          locale === 'zh'
            ? `${PRODUCT_NAME.zh.short} — 漸層`
            : 'Graded Slab Protector — Gradient finish',
        price: String(PROTECTOR_PRICING.gradient),
        priceCurrency: PROTECTOR_PRICING.currency,
        priceValidUntil: protectorPriceValidUntil(),
        availability: 'https://schema.org/InStock',
        url,
        seller: { '@type': 'Organization', name: 'Appaw Store' },
      },
      {
        '@type': 'Offer',
        name:
          locale === 'zh'
            ? `${PRODUCT_NAME.zh.short} — 單色`
            : 'Graded Slab Protector — Single colour finish',
        price: String(PROTECTOR_PRICING.single),
        priceCurrency: PROTECTOR_PRICING.currency,
        priceValidUntil: protectorPriceValidUntil(),
        availability: 'https://schema.org/InStock',
        url,
        seller: { '@type': 'Organization', name: 'Appaw Store' },
      },
    ],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: locale === 'zh' ? '舊版 SKU' : 'Legacy SKU',
        value: PROTECTOR_SKU_LEGACY,
      },
      {
        '@type': 'PropertyValue',
        name: locale === 'zh' ? 'UV 防護' : 'UV Protection',
        value: '>95%',
      },
      {
        '@type': 'PropertyValue',
        name: locale === 'zh' ? '磁鐵等級' : 'Magnet Grade',
        value: locale === 'zh' ? 'N52 釹磁鐵' : 'N52 Neodymium',
      },
      {
        '@type': 'PropertyValue',
        name: locale === 'zh' ? '兼容' : 'Compatibility',
        value: locale === 'zh' ? '標準 35PT PSA 及 CGC 鑑定卡' : 'Standard 35PT PSA & CGC Slabs',
      },
      {
        '@type': 'PropertyValue',
        name: locale === 'zh' ? '閉合方式' : 'Closure Type',
        value: locale === 'zh' ? '磁吸（無螺絲）' : 'Magnetic (no screws)',
      },
    ],
  });

  const breadcrumb = breadcrumbJsonLd([
    {
      position: 1,
      name: locale === 'zh' ? '首頁' : 'Home',
      item: homeUrl(locale),
    },
    { position: 2, name: names.full, item: url },
  ]);

  const faq = faqJsonLd(copy.faq.items);

  return [product, breadcrumb, faq];
}
