import { HOME_SEO, PRODUCT_NAME } from '@/lib/product-names';
import type { ClientPageMeta } from '@/lib/seo/client-metadata';

type LocaleMeta = { en: ClientPageMeta; zh: ClientPageMeta };

/** Client-side title/description overrides keyed by English route path. */
export const PAGE_META: Record<string, LocaleMeta> = {
  '/': HOME_SEO,
  '/about': {
    en: {
      title: 'About Appaw Store – Hong Kong PSA Card Protectors & Trading',
      description:
        'Appaw Store is a Hong Kong-based brand specialising in PSA Card Aluminum Protectors and TCG graded card trading. Our UV-blocking, N52 magnetic cases ship to 100+ countries.',
    },
    zh: {
      title: '關於 Appaw Store – 香港鑑定卡保護殼及卡牌交易',
      description:
        'Appaw Store 是香港鑑定卡保護殼品牌，提供磁吸鋁合金 Slab 保護殼及 TCG 鑑定卡交易服務。>95% 抗 UV、N52 磁吸，全球付運。',
    },
  },
  '/products/psa-protectors': {
    en: { title: PRODUCT_NAME.en.metaTitle, description: PRODUCT_NAME.en.metaDescription },
    zh: { title: PRODUCT_NAME.zh.metaTitle, description: PRODUCT_NAME.zh.metaDescription },
  },
  '/business': {
    en: {
      title: 'Services – Graded Slab Protector & TCG Trading',
      description:
        'Explore Appaw Store services: premium graded slab aluminum protectors and trusted TCG trading for graded Pokémon, sports, and MTG cards.',
    },
    zh: {
      title: '服務 – 鑑定卡保護殼及卡牌交易 | Appaw Store',
      description: 'Appaw Store 服務：磁吸鋁合金鑑定卡保護殼及 TCG 鑑定卡交易、寄售服務。',
    },
  },
  '/business/card-trading': {
    en: {
      title: 'PSA Pokémon Cards Hong Kong | Buy Rare Graded Cards – Appaw Store',
      description:
        'The premier Hong Kong destination for investment-grade PSA 10 Pokémon cards. Zero-fee consignment and verified transactions.',
    },
    zh: {
      title: '香港 PSA 寶可夢鑑定卡 | 購買稀有鑑定卡 – Appaw Store',
      description: '香港投資級 PSA 10 寶可夢鑑定卡平台。零上架費寄售及面交驗證交易。',
    },
  },
  '/tools/card-centering': {
    en: {
      title: 'Free Card Centering Calculator & PSA 10 Analyzer | Appaw Store',
      description:
        'Check if your Pokémon, sports, or TCG cards meet PSA 10 centering standards. Upload your card and get instant margin percentages — free.',
    },
    zh: {
      title: '免費卡牌置中量度工具 & PSA 10 分析器 | Appaw Store',
      description: '上傳卡牌即可量度前後邊距，對照 PSA 10 置中標準 — 完全免費。',
    },
  },
  '/privacy': {
    en: {
      title: 'Privacy Policy | Appaw Store',
      description: 'Learn how Appaw Store collects, uses, and protects your data.',
    },
    zh: {
      title: '私隱政策 | Appaw Store',
      description: '了解 Appaw Store 如何收集、使用及保護您的資料。',
    },
  },
  '/collection': {
    en: {
      title: 'My Collection — Track Graded Cards & Portfolios | Appaw Store',
      description: 'Add, organize and value your graded card collection. Track buy prices, grades, and cert numbers.',
    },
    zh: {
      title: '我的收藏 — 鑑定卡管理工具 | Appaw Store',
      description: '整理及追蹤鑑定卡收藏。記錄買入價、評級、證書編號及投資組合。',
    },
  },
};
