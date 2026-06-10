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
} as const;

/** Canonical product names — keep in sync with i18n business.cardProtector.title / nav.psaProtector */
export const PRODUCT_NAME = {
  en: {
    full: 'Graded Slab Aluminum Protector',
    short: 'Graded Slab Protector',
    plural: 'Graded Slab Protectors',
    whatsappOrder: 'Hi! I\'m interested in ordering a Graded Slab Aluminum Protector.',
    seoH1: '35PT Graded Card Protector — Magnetic Aluminum',
    metaTitle: '35PT Graded Card Protector | HK – Appaw Store',
    metaDescription:
      '35PT magnetic graded card protector. Aluminum case with >95% UV glass, N52 closure for PSA & CGC slabs. HK designed. Ships worldwide.',
  },
  zh: {
    full: '磁吸鋁合金鑑定卡保護殼',
    short: '鑑定卡保護殼',
    whatsappOrder: '你好！我想訂購磁吸鋁合金鑑定卡保護殼。',
    seoH1: '35PT 鑑定卡保護殼 — 磁吸鋁合金',
    metaTitle: '35PT 鑑定卡保護殼 | Appaw Store 香港',
    metaDescription:
      '35PT 磁吸鋁合金鑑定卡保護殼。>95% 抗UV、N52 磁吸，適用 PSA/CGC 鑑定卡磚。香港設計，全球付運。',
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
] as const;

/** Homepage meta — keep in sync with i18n home.hero.h1Keyword */
export const HOME_SEO = {
  en: {
    title: 'Graded Card Protectors, Hong Kong – Appaw Store',
    description:
      'Premium graded card protectors for 35PT PSA & CGC slabs, plus trusted graded card trading in Hong Kong. UV-blocking glass, N52 magnetic closure.',
  },
  zh: {
    title: 'Appaw Store 香港｜PSA卡殼・鑑定卡殼・PSA卡保護殼',
    description:
      '香港設計 PSA卡殼、鑑定卡殼及磁吸 PSA卡保護殼，適用 35PT PSA/CGC 鑑定卡磚。>95% 抗UV、N52 磁吸。兼營 PTCG 交易，全球付運。',
  },
} as const;

/** Card centering tool meta — keep in sync with `centeringPage.seo` / `content.h1` in i18n */
export const CENTERING_SEO = {
  en: {
    title: 'Free Card Centering Tool & PSA 10 Analyzer | Appaw Store',
    h1: 'Free Card Centering Tool & PSA 10 Analyzer',
    description:
      'Free card centering tool for Pokémon, sports, and TCG. Upload your card, align the guides, and get instant PSA 10 margin percentages — in your browser.',
    webAppName: 'Card Centering Tool & PSA 10 Analyzer',
    breadcrumb: 'Card Centering Tool',
  },
  zh: {
    title: '免費卡牌置中工具 & PSA 10 分析器 | Appaw Store',
    h1: '免費卡牌置中工具 & PSA 10 分析器',
    description:
      '免費卡牌置中工具，適用寶可夢 PTCG、運動卡及 TCG。上傳卡牌、對齊導線，即時取得 PSA 10 邊距百分比 — 瀏覽器即用。',
    webAppName: '卡牌置中工具 & PSA 10 分析器',
    breadcrumb: '卡牌置中工具',
  },
} as const;
