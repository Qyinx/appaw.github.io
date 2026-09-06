import { CENTERING_SEO, HOME_SEO, PRODUCT_NAME } from '@/lib/product-names';
import type { ClientPageMeta } from '@/lib/seo/client-metadata';

type LocaleMeta = { en: ClientPageMeta; zh: ClientPageMeta };

/** Client-side title/description overrides keyed by English route path. */
export const PAGE_META: Record<string, LocaleMeta> = {
  '/': HOME_SEO,
  '/about': {
    en: {
      title: 'About Appaw Store – Hong Kong PSA Card Protectors & Trading',
      description:
        'Appaw Store is a Hong Kong-based brand specialising in PSA UV glass protectors and TCG graded card trading. Tempered UV-blocking glass, N52 magnetic cases ship to 100+ countries.',
    },
    zh: {
      title: '關於 Appaw Store – 香港鑑定卡保護殼及卡牌交易',
      description:
        'Appaw Store 是香港鑑定卡保護殼品牌，提供磁吸防UV Slab 保護殼及 TCG 鑑定卡交易服務。>95% 抗 UV 強化玻璃、N52 磁吸，全球付運。',
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
        'Explore Appaw Store services: premium graded slab UV glass protectors and trusted TCG trading for graded Pokémon, sports, and MTG cards.',
    },
    zh: {
      title: '服務 – 鑑定卡保護殼及卡牌交易 | Appaw Store',
      description: 'Appaw Store 服務：磁吸防UV鑑定卡保護殼及 TCG 鑑定卡交易、寄售服務。',
    },
  },
  '/business/card-trading': {
    en: {
      title: 'PSA Pokémon Cards Hong Kong | Buy Rare Graded Cards – Appaw Store',
      description:
        'Hong Kong marketplace for investment-grade PSA 10 Pokémon cards. Consignment at 138 Arena with a flat 5% commission covering listing and payment fees.',
    },
    zh: {
      title: '香港 PSA 寶可夢鑑定卡 | 購買稀有鑑定卡 – Appaw Store',
      description: '香港投資級 PSA 10 寶可夢鑑定卡市集。於 138 Arena 寄賣，佣金一律成交價 5%，已包括上架費及支付手續費。',
    },
  },
  '/tools/card-centering': {
    en: { title: CENTERING_SEO.en.title, description: CENTERING_SEO.en.description },
    zh: { title: CENTERING_SEO.zh.title, description: CENTERING_SEO.zh.description },
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
  '/terms': {
    en: {
      title: 'Terms of Service | Appaw Store',
      description:
        'Terms of service for Appaw Store covering PSA grading submission, payment at 138 Arena, storage and pickup, protectors, and consignment.',
    },
    zh: {
      title: '服務條款 | Appaw Store',
      description: 'Appaw Store 服務條款，說明 PSA評級代送鑑定、於 138 Arena 繳費、保管與取件、鑑定卡保護殼及卡牌寄賣。',
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
