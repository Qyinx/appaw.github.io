/**
 * EN search query → ZH equivalent for titles, meta, and on-page copy.
 * @see docs/seo-pillars.md — Keyword mapping (EN ↔ ZH)
 */
export const SEO_KEYWORD_MAP = {
  'PSA slab case': 'PSA卡殼',
  'graded card case': '鑑定卡殼',
  'PSA card protector': 'PSA卡保護殼',
  'slab case': '卡殼',
  'graded card display case': '鑑定卡展示殼',
  'PSA regrade': 'PSA重評',
  'PSA reholder': 'PSA換殼',
  'regrade downgrade risk': '重評降級風險',
  'graded slab centering': '鑑定卡置中',
  'check centering before regrading': '重評前置中檢查',
  'UV glass slab case': '防UV玻璃鑑定卡殼',
  'tempered glass card protector': '強化玻璃卡殼',
} as const;

/** Canonical product names — keep in sync with i18n business.cardProtector.title / nav.psaProtector */
export const PRODUCT_NAME = {
  en: {
    full: 'Graded Slab UV Glass Protector',
    short: 'Graded Slab Protector',
    plural: 'Graded Slab Protectors',
    whatsappOrder: 'Hi! I\'m interested in ordering a Graded Slab UV Glass Protector.',
    seoH1: '35PT Graded Card Protector — UV Tempered Glass',
    metaTitle: '35PT UV Glass Graded Card Protector | HK – Appaw Store',
    metaDescription:
      '35PT magnetic graded card protector. Tempered UV-blocking glass, metal frame, N52 closure for PSA & CGC slabs. HK designed. Ships worldwide.',
  },
  zh: {
    full: '磁吸防UV鑑定卡保護殼',
    short: '鑑定卡保護殼',
    whatsappOrder: '你好！我想訂購磁吸防UV鑑定卡保護殼。',
    seoH1: '35PT 鑑定卡保護殼 — 防UV強化玻璃',
    metaTitle: '35PT 防UV鑑定卡保護殼 | Appaw Store 香港',
    metaDescription:
      '35PT 磁吸防UV鑑定卡保護殼。>95% 抗UV強化玻璃、金屬邊框、N52 磁吸，適用 PSA/CGC 鑑定卡磚。香港設計，全球付運。',
  },
  shop: {
    en: 'Shop No. 9, Basement, Manly Plaza, 995-997 King\'s Road, Quarry Bay, Hong Kong',
    zh: '香港鰂魚涌英皇道995-997號萬利廣場地庫9號舖',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Shop+9+Basement+Manly+Plaza+995-997+King%27s+Road+Quarry+Bay+Hong+Kong',
  },
} as const;

/** HK / TCG long-tail keywords for meta keywords arrays (use 鑑定卡, not 評級卡) */
export const HK_SEO_KEYWORDS = [
  'PTCG',
  '寶可夢卡牌保護磚',
  'Slab 保護殼',
  '磁吸鑑定卡夾',
  '香港卡牌用品',
  '35PT 鑑定卡磚',
  '鑑定卡保護殼',
  'PSA卡殼',
  '鑑定卡殼',
  'PSA卡保護殼',
  '鰂魚涌',
  '萬利廣場',
  'Quarry Bay card shop',
  'PSA重評',
  'PSA換殼',
  '重評降級',
  '鑑定卡置中檢查',
] as const;

/** Homepage meta — keep in sync with i18n home.hero.h1Keyword */
export const HOME_SEO = {
  en: {
    title: 'Graded Card Protectors, Hong Kong – Appaw Store',
    description:
      'Premium UV glass graded card protectors for 35PT PSA & CGC slabs, plus trusted graded card trading in Hong Kong. Tempered UV-blocking glass, N52 magnetic closure.',
  },
  zh: {
    title: 'Appaw Store 香港｜PSA卡殼・鑑定卡殼・PSA卡保護殼',
    description:
      '香港設計 PSA卡殼、鑑定卡殼及磁吸防UV PSA卡保護殼，適用 35PT PSA/CGC 鑑定卡磚。>95% 抗UV強化玻璃、N52 磁吸。兼營 PTCG 交易，全球付運。',
  },
} as const;

/** OG social preview — source: `public/images/og/og-centering.png` → `npm run optimize-images` */
export const CENTERING_OG_IMAGE = '/images-optimized/og/og-centering.png';

/** Card centering tool meta — keep in sync with `centeringPage.seo` / `content.h1` in i18n */
export const CENTERING_SEO = {
  en: {
    title: 'Free Card Centering Tool & PSA 10 Analyzer | Appaw Store',
    h1: 'Free Card Centering Tool & PSA 10 Analyzer',
    description:
      'Free card centering tool for Pokémon, sports & TCG. Measure raw or slab photos, check PSA 10 margins & regrade risk — in your browser.',
    webAppName: 'Card Centering Tool & PSA 10 Analyzer',
    featureList: [
      'PSA 10 centering calculator',
      'Slab photo perspective correction (tilt, zoom, corner loupe)',
      'Regrade vs reholder centering screen for graded slabs',
    ],
    breadcrumb: 'Card Centering Tool',
  },
  zh: {
    title: '免費卡牌置中工具 & PSA 10 分析器 | Appaw Store',
    h1: '免費卡牌置中工具 & PSA 10 分析器',
    description:
      '免費卡牌置中工具，適用 PTCG、運動卡及 TCG。量度裸卡或鑑定卡照片，檢查 PSA 10 邊距及重評風險 — 瀏覽器即用。',
    webAppName: '卡牌置中工具 & PSA 10 分析器',
    featureList: [
      'PSA 10 置中計算器',
      '鑑定卡照片透視校正（傾斜、縮放、角落放大鏡）',
      '重評 vs 換殼置中篩選',
    ],
    breadcrumb: '卡牌置中工具',
  },
} as const;
