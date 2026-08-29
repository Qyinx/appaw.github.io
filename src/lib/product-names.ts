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
  'PSA regrade': 'PSA重新評級',
  'PSA reholder': 'PSA換殼',
  'regrade downgrade risk': '重新評級降級風險',
  'graded slab centering': '鑑定卡置中',
  'check centering before regrading': '重新評級前置中檢查',
  'UV glass slab case': '防UV玻璃鑑定卡殼',
  'tempered glass card protector': '強化玻璃卡殼',
  'PSA magnetic case': '磁吸PSA卡殼',
  'magnetic PSA slab case': '磁吸PSA卡殼',
  'PSA grading submission Hong Kong': '香港PSA評級代送',
  'PSA grading submission HK': '香港PSA評級代送',
  'Hong Kong PSA grading submission': '香港 PSA 評級代送',
  'PSA card submission': '收藏卡送鑑',
  'HK TCG grading': '香港 TCG 鑑定',
  'Hong Kong TCG card grading': '香港卡牌鑑定',
  'TCG grading submission HK': 'TCG 提交鑑定',
  '138 Arena PSA grading submission': '138 Arena PSA 評級代送',
  'PSA grading submission process HK': '香港 PSA 評級代送流程',
  'PSA grading fees HK': 'PSA 鑑定費用',
  'PSA grading standards': 'PSA 10 評級標準',
  'PSA slab damage': 'PSA殼損',
  'Pokémon TCG grading HK': '寶可夢 TCG 提交鑑定',
} as const;

/** Canonical product names — keep in sync with i18n business.cardProtector.title / nav.psaProtector */
export const PRODUCT_NAME = {
  en: {
    full: 'Graded Slab UV Glass Protector',
    short: 'Graded Slab Protector',
    plural: 'Graded Slab Protectors',
    whatsappOrder: 'Hi! I\'m interested in ordering a Graded Slab UV Glass Protector.',
    seoH1: '35PT Graded Card Protector — UV Glass, Hong Kong',
    metaTitle: '35PT PSA Card Protector Hong Kong | UV Glass | Appaw',
    metaDescription:
      '35PT PSA & CGC slab protector in Hong Kong. UV glass, metal frame, N52 magnets. HK$60 / HK$80. Collect at 138 Arena, Causeway Bay (partner venue).',
  },
  zh: {
    full: '磁吸防UV鑑定卡保護殼',
    short: '鑑定卡保護殼',
    whatsappOrder: '你好！我想訂購磁吸防UV鑑定卡保護殼。',
    seoH1: '35PT 鑑定卡保護殼｜香港 PSA卡殼',
    metaTitle: '香港 PSA卡殼｜35PT 鑑定卡保護殼 | Appaw Store',
    metaDescription:
      '香港 PSA卡殼／鑑定卡保護殼，夾標準 35PT PSA 與 CGC 鑑定卡。防UV玻璃、N52 磁吸。單色 HK$60，漸層 HK$80。銅鑼灣 138 Arena（合作場地）取貨。',
  },
  shop: {
    en: '138 Arena, 1/F, 522 Jaffe Road, Causeway Bay, Hong Kong',
    zh: '銅鑼灣謝斐道522號1/F（138 Arena）',
    mapsUrl: 'https://maps.app.goo.gl/Gybs958UrANZSM3Z7',
  },
} as const;

/** HK / TCG long-tail keywords for meta keywords arrays (use 鑑定卡, not 評級卡) */
export const HK_SEO_KEYWORDS = [
  'PTCG',
  '寶可夢卡牌保護磚',
  'Slab 保護殼',
  '磁吸鑑定卡夾',
  '香港卡牌用品',
  '35PT 鑑定卡',
  '鑑定卡保護殼',
  'PSA卡殼',
  '香港PSA卡殼',
  'PSA保護套',
  '鑑定卡殼',
  'PSA卡保護殼',
  '銅鑼灣',
  '138 Arena',
  'PSA重新評級',
  'PSA換殼',
  '重新評級降級',
  '鑑定卡置中檢查',
  '磁吸PSA卡殼',
  '香港PSA評級代送',
  '香港 PSA 評級代送',
  '香港 TCG 鑑定',
  'TCG 提交鑑定',
  '香港卡牌提交鑑定',
  '寶可夢 TCG 提交鑑定',
  'HK TCG grading',
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
      '香港設計 PSA卡殼、鑑定卡殼及 PSA卡保護殼，以磁吸防UV鑑定卡保護殼守護 PSA 與 CGC 鑑定卡，採用抗UV強化玻璃與 N52 磁吸閉合。另提供鑑定卡交易與免費卡牌置中工具；香港藏家可於銅鑼灣 138 Arena（合作場地）交收。評級代送由 Appaw 負責服務及跟進，138 Arena 負責場務及收費。',
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
      'Free card centering tool for Pokémon, sports, and TCG. Measure raw or slab photos against PSA 10 margins (55/45 front). Regrade screening in browser. No upload.',
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
      '免費卡牌置中工具，適用 PTCG、運動卡及 TCG。量度裸卡或鑑定卡照片，對照 PSA 10 邊距（正面 55/45）。瀏覽器即用，無需上傳。',
    webAppName: '卡牌置中工具 & PSA 10 分析器',
    featureList: [
      'PSA 10 置中計算器',
      '鑑定卡照片透視校正（傾斜、縮放、角落放大鏡）',
      '重新評級 vs 換殼置中篩選',
    ],
    breadcrumb: '卡牌置中工具',
  },
} as const;

/** PSA grading submission hub + track — keep in sync with i18n psaGradingPage / psaGradingTrack */
export const PSA_GRADING_SEO = {
  en: {
    title: 'Hong Kong PSA Grading Submission | 138 Arena (Partner Venue) | Appaw Store',
    description:
      'PSA grading submission with Appaw at 138 Arena, Causeway Bay (partner venue). 138 Arena: venue and payment. Appaw: service and follow-up. Regular from HK$790; Reholder HK$550.',
    h1Keyword: 'PSA grading submission in Hong Kong',
    webAppName: 'PSA Grading Submission Tracker',
    trackTitle: 'Track PSA Grading Submission | Appaw Store',
    trackDescription:
      'Look up your batch with the phone and reference code on the 138 Arena receipt. Appaw follows up; 138 Arena handles venue and payment.',
    featureList: [
      'Status lookup by phone and reference code',
      'Timeline from 138 Arena intake through PSA grading',
      'Other batches from the same drop-off visit',
    ],
    breadcrumb: 'PSA Grading Submission',
    trackBreadcrumb: 'Track',
    lastUpdated: '2026-08-08',
  },
  zh: {
    title: '香港 PSA 評級代送｜138 Arena 合作場地面交 | Appaw Store',
    description:
      '香港 PSA 評級代送。於銅鑼灣 138 Arena（合作場地）面交：138 Arena 負責場務及收費，Appaw 負責服務及跟進。Regular 由 HK$790 起；Reholder HK$550。',
    h1Keyword: '香港 PSA 評級代送',
    webAppName: 'PSA 評級代送進度查詢',
    trackTitle: '查詢 PSA 評級代送進度｜線上追蹤 | Appaw Store',
    trackDescription:
      '輸入 138 Arena 收據上的電話號碼及參考編號，查詢 PSA 評級代送進度。',
    featureList: [
      '憑電話及參考編號查批次狀態',
      '由 138 Arena 收件至 PSA 評級各階段時間軸',
      '同一次交卡的其他批次',
    ],
    breadcrumb: 'PSA 評級代送',
    trackBreadcrumb: '查詢進度',
    lastUpdated: '2026-08-08',
  },
} as const;

/** Advisor positioning page under PSA hub */
export const PSA_GRADING_ADVISOR_SEO = {
  en: {
    title: 'Why Appaw Is a PSA Grading Advisor | Appaw Store',
    description:
      'High-value PSA grading submission advice at 138 Arena: condition-first screening mindset, honest pause recommendations, tier guidance, transparent tracking, and post-grade trading options.',
    h1Keyword: 'High-value grading advisor, not a logistics handoff',
    breadcrumb: 'Grading advisor',
    lastUpdated: '2026-08-05',
  },
  zh: {
    title: '高價值鑑定顧問定位｜PSA 評級代送 | Appaw Store',
    description:
      '說明 Appaw 如何以卡況為先協助判斷是否值得提交鑑定：暫緩建議、服務等級討論、透明進度追蹤，以及鑑定卡返港後的交易與寄售選項。',
    h1Keyword: '高價值鑑定顧問，而非單純的物流中介',
    breadcrumb: '鑑定顧問',
    lastUpdated: '2026-08-05',
  },
} as const;
