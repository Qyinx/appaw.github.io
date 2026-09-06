import type { Metadata } from 'next';
import { CENTERING_OG_IMAGE, CENTERING_SEO, HK_SEO_KEYWORDS, HOME_SEO, PRODUCT_NAME, PSA_GRADING_ADVISOR_SEO, PSA_GRADING_SEO } from '@/lib/product-names';
import type { PublicPortfolio } from '@/lib/collection/publicPortfolio';
import { SITE_ICONS } from '@/lib/seo/brand';
import { withLocaleAlternates, zhRouteMetadata } from '@/lib/seo/locale-metadata';

const homeHreflang = { en: '/', 'zh-HK': '/zh/' } as const;

const psaProtectorsMetadataBase: Metadata = {
  title: { absolute: PRODUCT_NAME.en.metaTitle },
  description: PRODUCT_NAME.en.metaDescription,
  // NOTE: keep description ≤160 chars.
  keywords: [
    'PSA slab case',
    'graded card case',
    'PSA card protector',
    'graded card display case',
    'PSA slab protector',
    'PSA UV glass case',
    'PSA graded card case',
    'tempered glass card protector',
    'UV glass slab case',
    'magnetic UV glass slab',
    'PSA magnetic case',
    'magnetic PSA slab case',
    'PSA magnetic slab case',
    'PSA卡殼',
    '鑑定卡殼',
    'PSA卡保護殼',
    'PSA card enclosure',
    'PSA precision encapsulation',
    'investment-grade card protection',
    'high-value card protection',
    'museum-grade UV filtration',
    'graded slab protector',
    'graded slab UV glass case',
    '鑑定卡保護殼',
    '磁吸卡磚',
    '防UV玻璃',
    '強化玻璃卡殼',
    '35PT 鑑定卡',
    ...HK_SEO_KEYWORDS,
    PRODUCT_NAME.zh.metaTitle,
  ],
  alternates: { canonical: '/products/psa-protectors/' },
  openGraph: {
    title: PRODUCT_NAME.en.metaTitle,
    description: PRODUCT_NAME.en.metaDescription,
    url: 'https://appaw.store/products/psa-protectors/',
    type: 'website',
    images: [
      {
        url: '/images-optimized/describe/sell%205.png',
        width: 1200,
        height: 630,
        alt: `${PRODUCT_NAME.en.full} with UV-Blocking Glass and N52 Magnetic Closure`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PRODUCT_NAME.en.metaTitle,
    description: PRODUCT_NAME.en.metaDescription,
    images: ['/images-optimized/describe/sell%205.png'],
  },
};

export const psaProtectorsMetadata = withLocaleAlternates(psaProtectorsMetadataBase, '/products/psa-protectors/');
export const zhPsaProtectorsMetadata = zhRouteMetadata(psaProtectorsMetadataBase, '/products/psa-protectors/', {
  title: { absolute: PRODUCT_NAME.zh.metaTitle },
  description: PRODUCT_NAME.zh.metaDescription,
});

export default {
  psaProtectorsMetadata,
};

export const homeMetadata: Metadata = {
  title: { absolute: HOME_SEO.en.title },
  description: HOME_SEO.en.description,
  alternates: { canonical: '/', languages: homeHreflang },
  openGraph: {
    title: HOME_SEO.en.title,
    description: HOME_SEO.en.description,
    url: 'https://appaw.store/',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_HK'],
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – Graded Card Protectors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO.en.title,
    description: HOME_SEO.en.description,
    images: ['/images/og-image.png'],
  },
};

export const zhHomeMetadata: Metadata = {
  title: { absolute: HOME_SEO.zh.title },
  description: HOME_SEO.zh.description,
  alternates: { canonical: '/zh/', languages: homeHreflang },
  openGraph: {
    title: HOME_SEO.zh.title,
    description: HOME_SEO.zh.description,
    url: 'https://appaw.store/zh/',
    type: 'website',
    locale: 'zh_HK',
    alternateLocale: ['en_US'],
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – PSA卡殼・鑑定卡殼・PSA卡保護殼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO.zh.title,
    description: HOME_SEO.zh.description,
    images: ['/images/og-image.png'],
  },
};

export const rootMetadata: Metadata = {
  title: {
    default: HOME_SEO.en.title,
    template: '%s | Appaw Store',
  },
  description: HOME_SEO.en.description,
  keywords: [
    'PSA slab case',
    'graded card case',
    'PSA card protector',
    'graded slab protector',
    'PSA slab protector',
    'UV glass slab case',
    'tempered glass card protector',
    'PSA卡殼',
    '鑑定卡殼',
    'PSA卡保護殼',
    'UV protection card case',
    'N52 magnetic card case',
    'PSA magnetic case',
    'magnetic PSA slab case',
    'PSA magnetic slab case',
    '鑑定卡保護殼',
    '磁吸卡磚',
    ...HK_SEO_KEYWORDS,
  ],
  authors: [{ name: 'Appaw Store' }],
  creator: 'Appaw Store',
  publisher: 'Appaw Store',
  icons: SITE_ICONS,
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://appaw.store'),
  alternates: { canonical: '/', languages: homeHreflang },
  openGraph: {
    title: HOME_SEO.en.title,
    description: HOME_SEO.en.description,
    url: 'https://appaw.store',
    siteName: 'Appaw Store',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_HK'],
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Appaw Store – Graded Slab UV Glass Protector' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO.en.title,
    description: HOME_SEO.en.description,
    images: ['/images/og-image.png'],
    creator: '@appaw.store',
  },
  robots: { index: true, follow: true },
};

const centeringMetadataBase: Metadata = {
  title: { absolute: CENTERING_SEO.en.title },
  description: CENTERING_SEO.en.description,
  // NOTE: keep description ≤160 chars where possible for SERP display.
  keywords: [
    'card centering tool',
    'card centering calculator',
    'PSA 10 centering',
    'PSA centering calculator',
    '寶可夢卡牌置中工具',
    '卡牌置中工具',
    'PTCG 置中',
    '免費置中計算器',
    'centering analyzer',
    'how to check card centering',
    'Pokemon card centering',
    'pokemon card centering tool',
    'sports card centering tool',
    'TCG centering grader',
    'BGS centering',
    'card centering percentage',
    'pre-grade centering tool',
    'PSA regrade',
    'PSA reholder',
    'regrade downgrade risk',
    'graded slab centering',
    'check centering before regrading',
    'regrade or reholder',
    'PSA重新評級',
    'PSA換殼',
    '重新評級降級',
    '鑑定卡置中檢查',
  ],
  alternates: { canonical: '/tools/card-centering/' },
  openGraph: {
    title: CENTERING_SEO.en.title,
    description: CENTERING_SEO.en.description,
    url: 'https://appaw.store/tools/card-centering/',
    type: 'website',
    images: [{ url: CENTERING_OG_IMAGE, width: 1200, height: 630, alt: `${CENTERING_SEO.en.h1} — Appaw Store` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: CENTERING_SEO.en.title,
    description: CENTERING_SEO.en.description,
    images: [CENTERING_OG_IMAGE],
  },
};

export const centeringMetadata = withLocaleAlternates(centeringMetadataBase, '/tools/card-centering/');
export const zhCenteringMetadata = zhRouteMetadata(centeringMetadataBase, '/tools/card-centering/', {
  title: { absolute: CENTERING_SEO.zh.title },
  description: CENTERING_SEO.zh.description,
});

const privacyMetadataBase: Metadata = {
  title: { absolute: 'Privacy Policy | Appaw Store' },
  description: 'Learn how Appaw Store collects, uses, and protects your data. We use Google Analytics 4 for site analytics. Purchases are handled securely through Etsy and Carousell.',
  alternates: { canonical: '/privacy/' },
  robots: { index: true, follow: true },
};

export const privacyMetadata = withLocaleAlternates(privacyMetadataBase, '/privacy/');
export const zhPrivacyMetadata = zhRouteMetadata(privacyMetadataBase, '/privacy/', {
  title: '私隱政策 | Appaw Store',
  description: '了解 Appaw Store 如何收集、使用及保護您的資料。網站分析使用 Google Analytics 4；購買透過 Etsy 及 Carousell 安全處理。',
});

const termsMetadataBase: Metadata = {
  title: { absolute: 'Terms of Service | Appaw Store' },
  description:
    'Terms of service for Appaw Store covering PSA grading submission, payment collected at 138 Arena, storage and pickup, protectors, and card consignment.',
  alternates: { canonical: '/terms/' },
  robots: { index: true, follow: true },
};

export const termsMetadata = withLocaleAlternates(termsMetadataBase, '/terms/');
export const zhTermsMetadata = zhRouteMetadata(termsMetadataBase, '/terms/', {
  title: '服務條款 | Appaw Store',
  description:
    'Appaw Store 服務條款，說明 PSA評級代送鑑定、於 138 Arena 繳費、保管與取件、鑑定卡保護殼及卡牌寄賣安排。',
});

const aboutMetadataBase: Metadata = {
  title: 'About Appaw Store – Hong Kong PSA Card Protectors & Trading',
  description:
    'Appaw Store is a Hong Kong-based brand specialising in PSA UV glass protectors and TCG graded card trading. Tempered UV-blocking glass, N52 magnetic cases ship to 100+ countries. Learn our story.',
  keywords: ['Appaw Store', 'about Appaw Store', 'Appaw Store Hong Kong'],
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About Appaw Store – Hong Kong PSA Card Protectors & Trading',
    description: 'Hong Kong-based brand crafting premium PSA UV glass protectors & offering trusted TCG trading services. Tempered UV-blocking glass, N52 magnets, ships to 100+ countries.',
    url: 'https://appaw.store/about/',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'About Appaw Store – Premium Card Protection & TCG Trading' }],
  },
  twitter: { card: 'summary_large_image', title: 'About Appaw Store – Hong Kong PSA Card Protectors & Trading', description: 'Hong Kong-based brand crafting premium PSA UV glass protectors & offering trusted TCG graded card trading services.', images: ['/images/og-image.png'] },
};

export const aboutMetadata = withLocaleAlternates(aboutMetadataBase, '/about/');
export const zhAboutMetadata = zhRouteMetadata(aboutMetadataBase, '/about/', {
  title: '關於 Appaw Store – 香港鑑定卡保護殼及卡牌交易',
  description:
    'Appaw Store 是香港鑑定卡保護殼品牌，提供磁吸防UV Slab 保護殼及 TCG 鑑定卡交易服務。>95% 抗 UV 強化玻璃、N52 磁吸，全球付運。',
});

const collectionMetadataBase: Metadata = {
  title: { absolute: 'My Collection — Track Graded Cards & Portfolios | Appaw Store' },
  description:
    'Add, organize and value your graded card collection. Track buy prices, PSA/BGC grades, cert numbers, and listing prices in portfolios — free private dashboard.',
  keywords: [
    'card collection manager',
    'manage trading card collection',
    'card collection app',
    'track card values',
    'organize PSA cards',
    'graded card inventory',
    '鑑定卡收藏管理',
    '卡牌收藏工具',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'My Collection — Track Graded Cards & Portfolios | Appaw Store',
    description:
      'Catalogue PSA, BGS, and CGC slabs with buy prices, cert numbers, and portfolios. Free private collection dashboard.',
    url: 'https://appaw.store/collection/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store My Collection — graded card inventory dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Collection — Track Graded Cards & Portfolios | Appaw Store',
    description:
      'Track buy prices, grades, and cert numbers for your PSA, BGS, and CGC slabs in one private dashboard.',
    images: ['/images/og-image.png'],
  },
};

export const collectionMetadata = withLocaleAlternates(collectionMetadataBase, '/collection/');


const collectionListMetadataBase: Metadata = {
  title: 'My Collection | Appaw Store',
  description: 'Manage your personal graded card collection — track buy prices, grades, cert numbers, and more.',
  robots: { index: false, follow: false },
};

export const collectionListMetadata = withLocaleAlternates(collectionListMetadataBase, '/collection/list/');

/** Neutral layout shell — each child route sets its own robots/title. */
export const collectionLayoutMetadata: Metadata = {};

const collectionAuthMetadataBase: Metadata = {
  title: 'Sign In | My Collection | Appaw Store',
  robots: { index: false, follow: false },
};

export const collectionAuthMetadata = withLocaleAlternates(collectionAuthMetadataBase, '/collection/auth/');

const newCardMetadataBase: Metadata = {
  title: 'Add Card | Appaw Store',
  robots: { index: false, follow: false },
};

export const newCardMetadata = withLocaleAlternates(newCardMetadataBase, '/collection/card/new/');

const editCardMetadataBase: Metadata = {
  title: 'Edit Card | Appaw Store',
  robots: { index: false, follow: false },
};

export const editCardMetadata = withLocaleAlternates(editCardMetadataBase, '/collection/card/edit/');

const collectionSettingsMetadataBase: Metadata = {
  title: 'Account Settings | Appaw Store',
  description: 'Update your display name, email, preferred currency, and buyer contact methods.',
  robots: { index: false, follow: false },
};

export const collectionSettingsMetadata = withLocaleAlternates(collectionSettingsMetadataBase, '/collection/settings/');

const businessMetadataBase: Metadata = {
  title: 'Services – Graded Slab Protector, PSA Submission & TCG Trading',
  description:
    'Explore Appaw Store services: graded slab UV glass protectors, PSA submission at 138 Arena Causeway Bay, and trusted TCG trading for graded Pokémon, sports, and MTG cards.',
};

export const businessMetadata = withLocaleAlternates(businessMetadataBase, '/business/');
export const zhBusinessMetadata = zhRouteMetadata(businessMetadataBase, '/business/', {
  title: { absolute: '服務 – 鑑定卡保護殼及卡牌交易 | Appaw Store' },
  description:
    'Appaw Store 服務：磁吸防UV鑑定卡保護殼、銅鑼灣 138 Arena PSA 代送鑑定，以及 TCG 鑑定卡交易、寄售服務。',
});

const cardTradingMetadataBase: Metadata = {
  title: 'PSA Pokémon Cards Hong Kong | Buy Rare Graded Cards – Appaw Store',
  description:
    'Hong Kong marketplace for investment-grade PSA 10 Pokémon cards. Consignment at 138 Arena with a flat 5% commission covering listing and payment fees. Face-to-face verified transactions.',
  robots: { index: true, follow: true },
};

export const cardTradingMetadata = withLocaleAlternates(cardTradingMetadataBase, '/business/card-trading/');
export const zhCardTradingMetadata = zhRouteMetadata(cardTradingMetadataBase, '/business/card-trading/', {
  title: '香港 PSA 寶可夢鑑定卡 | 購買稀有鑑定卡 – Appaw Store',
  description:
    '香港投資級 PSA 10 寶可夢鑑定卡市集。於 138 Arena 寄賣，佣金一律成交價 5%，已包括上架費及支付手續費。面交驗證交易。',
});

const cardTradingSellMetadataBase: Metadata = {
  title: 'List a Card | Appaw Store',
  robots: { index: false, follow: false },
};

export const cardTradingSellMetadata = withLocaleAlternates(
  cardTradingSellMetadataBase,
  '/business/card-trading/sell/',
);

const psaGradingMetadataBase: Metadata = {
  title: { absolute: PSA_GRADING_SEO.en.title },
  description: PSA_GRADING_SEO.en.description,
  keywords: [
    'PSA submission Hong Kong',
    'PSA grading service HK',
    '138 Arena Causeway Bay',
    'PSA card submission',
    'HK TCG grading',
    'Hong Kong TCG grading',
    'Pokémon TCG grading HK',
    'PSA代送鑑定',
    '香港PSA代送',
    '收藏卡送鑑',
    '138 Arena',
    '銅鑼灣',
    ...HK_SEO_KEYWORDS,
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: PSA_GRADING_SEO.en.title,
    description: PSA_GRADING_SEO.en.description,
    url: 'https://appaw.store/business/psa-grading/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PSA collectibles submission at 138 Arena Causeway Bay — Appaw Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PSA_GRADING_SEO.en.title,
    description: PSA_GRADING_SEO.en.description,
    images: ['/images/og-image.png'],
  },
};

export const psaGradingMetadata = withLocaleAlternates(psaGradingMetadataBase, '/business/psa-grading/');
export const zhPsaGradingMetadata = zhRouteMetadata(psaGradingMetadataBase, '/business/psa-grading/', {
  title: { absolute: PSA_GRADING_SEO.zh.title },
  description: PSA_GRADING_SEO.zh.description,
});

const psaGradingTrackMetadataBase: Metadata = {
  title: { absolute: PSA_GRADING_SEO.en.trackTitle },
  description: PSA_GRADING_SEO.en.trackDescription,
  keywords: [
    'track PSA submission',
    'PSA submission status',
    'PSA batch status',
    'reference code',
    '138 Arena PSA track',
    'PSA代送進度',
    '查詢PSA批次',
    '參考編號',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: PSA_GRADING_SEO.en.trackTitle,
    description: PSA_GRADING_SEO.en.trackDescription,
    url: 'https://appaw.store/business/psa-grading/track/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Look up PSA batch status with phone and reference code — Appaw Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PSA_GRADING_SEO.en.trackTitle,
    description: PSA_GRADING_SEO.en.trackDescription,
    images: ['/images/og-image.png'],
  },
};

export const psaGradingTrackMetadata = withLocaleAlternates(psaGradingTrackMetadataBase, '/business/psa-grading/track/');
export const zhPsaGradingTrackMetadata = zhRouteMetadata(psaGradingTrackMetadataBase, '/business/psa-grading/track/', {
  title: { absolute: PSA_GRADING_SEO.zh.trackTitle },
  description: PSA_GRADING_SEO.zh.trackDescription,
});

const psaGradingAdvisorMetadataBase: Metadata = {
  title: { absolute: PSA_GRADING_ADVISOR_SEO.en.title },
  description: PSA_GRADING_ADVISOR_SEO.en.description,
  keywords: [
    'PSA grading advisor Hong Kong',
    'PSA submission condition advice',
    'high value card grading advice',
    '138 Arena PSA',
    'PSA鑑定顧問',
    '香港PSA代送卡況',
    '提交鑑定建議',
    ...HK_SEO_KEYWORDS,
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: PSA_GRADING_ADVISOR_SEO.en.title,
    description: PSA_GRADING_ADVISOR_SEO.en.description,
    url: 'https://appaw.store/business/psa-grading/advisor/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PSA grading advisor positioning — Appaw Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PSA_GRADING_ADVISOR_SEO.en.title,
    description: PSA_GRADING_ADVISOR_SEO.en.description,
    images: ['/images/og-image.png'],
  },
};

export const psaGradingAdvisorMetadata = withLocaleAlternates(
  psaGradingAdvisorMetadataBase,
  '/business/psa-grading/advisor/',
);
export const zhPsaGradingAdvisorMetadata = zhRouteMetadata(
  psaGradingAdvisorMetadataBase,
  '/business/psa-grading/advisor/',
  {
    title: { absolute: PSA_GRADING_ADVISOR_SEO.zh.title },
    description: PSA_GRADING_ADVISOR_SEO.zh.description,
  },
);

export const zhCollectionMetadata = zhRouteMetadata(collectionMetadataBase, '/collection/', {
  title: { absolute: '我的收藏 — 鑑定卡管理工具 | Appaw Store' },
  description:
    '整理及追蹤鑑定卡收藏。記錄買入價、PSA/BGS 評級、證書編號及掛牌價，並以投資組合分類管理——免費私人儀表板。',
});

export const zhCollectionAuthMetadata = zhRouteMetadata(collectionAuthMetadataBase, '/collection/auth/', {
  title: '登入 | 我的收藏 | Appaw Store',
});

export const zhCollectionListMetadata = zhRouteMetadata(collectionListMetadataBase, '/collection/list/', {
  title: '我的收藏 | Appaw Store',
  description: '管理您的個人鑑定卡收藏。',
});

export const zhNewCardMetadata = zhRouteMetadata(newCardMetadataBase, '/collection/card/new/', {
  title: '新增卡牌 | Appaw Store',
});

export const zhEditCardMetadata = zhRouteMetadata(editCardMetadataBase, '/collection/card/edit/', {
  title: '編輯卡牌 | Appaw Store',
});

export const zhCollectionSettingsMetadata = zhRouteMetadata(collectionSettingsMetadataBase, '/collection/settings/', {
  title: '帳戶設定 | Appaw Store',
  description: '更新顯示名稱、電郵、偏好貨幣及買家聯絡方式。',
});


export const zhCardTradingSellMetadata = zhRouteMetadata(
  cardTradingSellMetadataBase,
  '/business/card-trading/sell/',
  {
    title: '上架卡牌 | Appaw Store',
  },
);

const styleGuideMetadataBase: Metadata = {
  title: { absolute: 'Style Guide | Appaw Store' },
  robots: { index: false, follow: false },
};

export const styleGuideMetadata = withLocaleAlternates(styleGuideMetadataBase, '/style-guide/');
export const zhStyleGuideMetadata = zhRouteMetadata(styleGuideMetadataBase, '/style-guide/', {
  title: { absolute: 'Style Guide | Appaw Store' },
});

export {
  guidesIndexMetadata,
  zhGuidesIndexMetadata,
  guideMetadataForSlug,
  zhGuideMetadataForSlug,
} from '@/lib/guides/metadata';

function publicPortfolioOgImage(portfolio: PublicPortfolio): string {
  const first = portfolio.cards.find(c => c.frontImage)?.frontImage;
  return first ?? '/images/og-image.png';
}

/** Dynamic metadata for `/collection/p/[id]/` (indexable public portfolios). */
export function buildPublicPortfolioMetadata(
  portfolio: PublicPortfolio,
  id: string,
  locale: 'en' | 'zh',
): Metadata {
  const enPath = `/collection/p/${id}/`;
  const count = portfolio.cards.length;
  const owner = portfolio.ownerDisplayName;
  const ogImage = publicPortfolioOgImage(portfolio);

  const enTitle = `${portfolio.name}${owner ? ` by ${owner}` : ''} — Graded Card Portfolio | Appaw Store`;
  const enDescription =
    `Browse ${count} graded card${count === 1 ? '' : 's'} in ${portfolio.name}${owner ? `, shared by ${owner}` : ''}. PSA, BGS, and CGC slabs with grades and listing prices.`;

  const zhTitle = `${portfolio.name}${owner ? ` — ${owner}` : ''} — 鑑定卡公開組合 | Appaw Store`;
  const zhDescription =
    `瀏覽「${portfolio.name}」中的 ${count} 張鑑定卡${owner ? `（由 ${owner} 分享）` : ''}。含 PSA、BGS、CGC 評級及掛牌價。`;

  const title = locale === 'zh' ? zhTitle : enTitle;
  const description = locale === 'zh' ? zhDescription : enDescription;

  const base: Metadata = {
    title: { absolute: title },
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `https://appaw.store${locale === 'zh' ? `/zh${enPath}` : enPath}`,
      type: 'website',
      locale: locale === 'zh' ? 'zh_HK' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_HK'],
      images: [
        {
          url: ogImage,
          width: 600,
          height: 800,
          alt: portfolio.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };

  return locale === 'zh'
    ? zhRouteMetadata(base, enPath, { title: { absolute: zhTitle }, description: zhDescription })
    : withLocaleAlternates(base, enPath);
}
