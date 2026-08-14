/**
 * EN search query → ZH equivalent for titles, meta, and on-page copy.
 * @see docs/seo-pillars.md — Keyword mapping (EN ↔ ZH)
 */
import { getPsaLowestDisplayFee } from '@/lib/grading/psa-pricing';

const psaLowestDisplayFee = getPsaLowestDisplayFee();
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
  'PSA submission Hong Kong': 'PSA代送鑑定',
  'PSA grading service HK': '香港PSA代送',
  'PSA card submission': '收藏卡送鑑',
  'HK TCG grading': '香港 TCG 鑑定',
  'Hong Kong TCG card grading': '香港卡牌鑑定',
  'TCG grading submission HK': 'TCG 提交鑑定',
  '138 Arena PSA submission': '138 Arena PSA 代送',
  'PSA submission process HK': 'PSA 鑑定香港流程',
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
    seoH1: '35PT Graded Card Protector — UV Tempered Glass',
    metaTitle: '35PT UV Glass Graded Card Protector | HK – Appaw Store',
    metaDescription:
      'Magnetic graded card case for 35PT PSA & CGC slabs. Tempered UV-blocking glass, N52 closure. HK designed. Ships worldwide.',
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
  'PSA重新評級',
  'PSA換殼',
  '重新評級降級',
  '鑑定卡置中檢查',
  '磁吸PSA卡殼',
  'PSA代送鑑定',
  '香港 TCG 鑑定',
  'TCG 提交鑑定',
  '香港卡牌提交鑑定',
  '寶可夢 TCG 提交鑑定',
  'HK TCG grading',
  '138 Arena',
  '銅鑼灣',
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
      '香港設計 PSA卡殼、鑑定卡殼及 PSA卡保護殼，以磁吸防UV鑑定卡保護殼守護 PSA 與 CGC 鑑定卡，採用抗UV強化玻璃與 N52 磁吸閉合。另提供鑑定卡交易與免費卡牌置中工具；香港藏家可於銅鑼灣 138 Arena 交收，由 Appaw 提供 PSA 代送鑑定。',
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

/** PSA submission hub + track — keep in sync with i18n psaGradingPage / psaGradingTrack */
export const PSA_GRADING_SEO = {
  en: {
    title: 'Hong Kong PSA Submission | 138 Arena Drop-off & Batch Tracking | Appaw Store',
    description:
      `Face-to-face PSA submission at 138 Arena, Causeway Bay. Pokémon, One Piece, MTG, sports cards. On-site preliminary condition check & basic cleaning included. Track batches with phone & reference code. From HKD ${psaLowestDisplayFee}.`,
    h1Keyword: 'PSA submission in Hong Kong',
    webAppName: 'PSA Submission Tracker',
    trackTitle: 'Track PSA Submission | Appaw Store',
    trackDescription:
      'Look up your PSA batch with the phone number and reference code on your 138 Arena receipt.',
    featureList: [
      'Status lookup by phone and reference code',
      'Timeline from 138 Arena intake through PSA grading',
      'Other batches from the same drop-off visit',
    ],
    breadcrumb: 'PSA Submission',
    trackBreadcrumb: 'Track',
    lastUpdated: '2026-08-08',
  },
  zh: {
    title: '香港 PSA 代送鑑定｜138 Arena 門市面交・線上進度查詢 | Appaw Store',
    description:
      `香港 PSA 代送鑑定服務。銅鑼灣 138 Arena 門市面交，提供現場卡況初步評估與基本清潔保養，降低扣分風險。寶可夢、One Piece、MTG、運動卡服務費由 HKD ${psaLowestDisplayFee} 起；憑收據電話及參考編號全程線上追蹤進度。`,
    h1Keyword: '香港 PSA 代送鑑定',
    webAppName: 'PSA 代送進度查詢',
    trackTitle: '查詢 PSA 代送進度｜線上追蹤 | Appaw Store',
    trackDescription:
      '輸入 138 Arena 門市收據上的電話號碼及參考編號，實時查詢 PSA 代送鑑定批次現有進度。',
    featureList: [
      '憑電話及參考編號查批次狀態',
      '由 138 Arena 收件至 PSA 鑑定各階段時間軸',
      '同一次交卡的其他批次',
    ],
    breadcrumb: 'PSA 代送鑑定',
    trackBreadcrumb: '查詢進度',
    lastUpdated: '2026-08-08',
  },
} as const;

/** Advisor positioning page under PSA hub */
export const PSA_GRADING_ADVISOR_SEO = {
  en: {
    title: 'Why Appaw Is a PSA Grading Advisor | Appaw Store',
    description:
      'High-value PSA submission advice at 138 Arena: condition-first screening mindset, honest pause recommendations, tier guidance, transparent tracking, and post-grade trading options.',
    h1Keyword: 'High-value grading advisor, not a logistics handoff',
    breadcrumb: 'Grading advisor',
    lastUpdated: '2026-08-05',
  },
  zh: {
    title: '高價值鑑定顧問定位｜PSA 代送鑑定 | Appaw Store',
    description:
      '說明 Appaw 如何以卡況為先協助判斷是否值得提交鑑定：暫緩建議、服務等級討論、透明進度追蹤，以及鑑定卡磚返港後的交易與寄售選項。',
    h1Keyword: '高價值鑑定顧問，而非單純的物流中介',
    breadcrumb: '鑑定顧問',
    lastUpdated: '2026-08-05',
  },
} as const;
