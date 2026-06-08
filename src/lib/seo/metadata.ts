import type { Metadata } from 'next';
import { HK_SEO_KEYWORDS, HOME_SEO, PRODUCT_NAME } from '@/lib/product-names';
import type { PublicPortfolio } from '@/lib/collection/publicPortfolio';
import { withLocaleAlternates, zhRouteMetadata } from '@/lib/seo/locale-metadata';

const homeHreflang = { en: '/', 'zh-HK': '/zh/' } as const;

const psaProtectorsMetadataBase: Metadata = {
  title: { absolute: PRODUCT_NAME.en.metaTitle },
  description: PRODUCT_NAME.en.metaDescription,
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
    'graded slab protector',
    'graded slab aluminum case',
    '鑑定卡保護殼',
    '磁吸卡磚',
    '鋁合金保護殼',
    '35PT 鑑定卡磚',
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
        alt: 'Appaw Store – Graded Slab Aluminum Protector & Trading Card Supplies',
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
        alt: 'Appaw Store – 鑑定卡保護殼・磁吸 Slab・PTCG 卡牌用品',
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
    'graded slab protector',
    'PSA slab protector',
    'aluminum card case',
    'UV protection card case',
    'N52 magnetic card case',
    '鑑定卡保護殼',
    '磁吸卡磚',
    ...HK_SEO_KEYWORDS,
  ],
  authors: [{ name: 'Appaw Store' }],
  creator: 'Appaw Store',
  publisher: 'Appaw Store',
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/apple-touch-icon.png' },
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
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Appaw Store – Graded Slab Aluminum Protector' }],
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
  title: { absolute: 'Free Card Centering Calculator & PSA 10 Analyzer | Appaw Store' },
  description:
    'Quickly check if your Pokémon, sports, or TCG cards meet PSA 10 centering standards. Upload your card, adjust the alignment lines, and get instant margin percentages — free.',
  // NOTE: keep description ≤160 chars where possible for SERP display.
  keywords: [
    'card centering calculator',
    'card centering tool',
    'PSA 10 centering',
    'PSA centering calculator',
    '寶可夢置中量度',
    '卡牌置中工具',
    'PTCG 置中',
    '免費置中計算器',
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

export const centeringMetadata = withLocaleAlternates(centeringMetadataBase, '/tools/card-centering/');
export const zhCenteringMetadata = zhRouteMetadata(centeringMetadataBase, '/tools/card-centering/', {
  title: { absolute: '免費卡牌置中量度工具 & PSA 10 分析器 | Appaw Store' },
  description:
    '上傳卡牌即可量度前後邊距，對照 PSA 10 置中標準。適用寶可夢 PTCG、運動卡及 TCG — 完全免費。',
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

const aboutMetadataBase: Metadata = {
  title: 'About Appaw Store – Hong Kong PSA Card Protectors & Trading',
  description:
    'Appaw Store is a Hong Kong-based brand specialising in PSA Card Aluminum Protectors and TCG graded card trading. Our UV-blocking, N52 magnetic cases ship to 100+ countries. Learn our story.',
  keywords: ['Appaw Store', 'about Appaw Store', 'Appaw Store Hong Kong'],
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About Appaw Store – Hong Kong PSA Card Protectors & Trading',
    description: 'Hong Kong-based brand crafting premium PSA card aluminum protectors & offering trusted TCG trading services. UV-blocking glass, N52 magnets, ships to 100+ countries.',
    url: 'https://appaw.store/about/',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'About Appaw Store – Premium Card Protection & TCG Trading' }],
  },
  twitter: { card: 'summary_large_image', title: 'About Appaw Store – Hong Kong PSA Card Protectors & Trading', description: 'Hong Kong-based brand crafting premium PSA card aluminum protectors & offering trusted TCG graded card trading services.', images: ['/images/og-image.png'] },
};

export const aboutMetadata = withLocaleAlternates(aboutMetadataBase, '/about/');
export const zhAboutMetadata = zhRouteMetadata(aboutMetadataBase, '/about/', {
  title: '關於 Appaw Store – 香港鑑定卡保護殼及卡牌交易',
  description:
    'Appaw Store 是香港鑑定卡保護殼品牌，提供磁吸鋁合金 Slab 保護殼及 TCG 鑑定卡交易服務。>95% 抗 UV、N52 磁吸，全球付運。',
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

const adminTradeMetadataBase: Metadata = {
  title: 'Card Admin | Appaw Store',
  robots: { index: false, follow: false },
};

export const adminTradeMetadata = withLocaleAlternates(adminTradeMetadataBase, '/admin/trade-cards/');

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

const businessMetadataBase: Metadata = {
  title: 'Services – Graded Slab Protector & TCG Trading',
  description:
    'Explore Appaw Store services: premium graded slab aluminum protectors with UV-blocking glass & N52 magnetic closure, and trusted TCG trading for graded Pokémon, sports, and MTG cards.',
};

export const businessMetadata = withLocaleAlternates(businessMetadataBase, '/business/');
export const zhBusinessMetadata = zhRouteMetadata(businessMetadataBase, '/business/', {
  title: { absolute: '服務 – 鑑定卡保護殼及卡牌交易 | Appaw Store' },
  description:
    'Appaw Store 服務：磁吸鋁合金鑑定卡保護殼（>95% 抗 UV、N52 磁吸）及 TCG 鑑定卡交易、寄售服務。',
});

const cardTradingMetadataBase: Metadata = {
  title: 'PSA Pokémon Cards Hong Kong | Buy Rare Graded Cards – Appaw Store',
  description:
    'The premier Hong Kong destination for investment-grade PSA 10 Pokémon cards. Zero-fee consignment, museum-quality verified transactions & private acquisition of blue-chip graded assets.',
  robots: { index: false, follow: false },
};

export const cardTradingMetadata = withLocaleAlternates(cardTradingMetadataBase, '/business/card-trading/');
export const zhCardTradingMetadata = zhRouteMetadata(cardTradingMetadataBase, '/business/card-trading/', {
  title: '香港 PSA 寶可夢鑑定卡 | 購買稀有鑑定卡 – Appaw Store',
  description:
    '香港投資級 PSA 10 寶可夢鑑定卡平台。零上架費寄售、面交驗證交易及高價值鑑定卡收購服務。',
});

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

export const zhAdminTradeMetadata = zhRouteMetadata(adminTradeMetadataBase, '/admin/trade-cards/', {
  title: '卡牌管理 | Appaw Store',
});

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
