/** Canonical product names — keep in sync with i18n business.cardProtector.title / nav.psaProtector */
export const PRODUCT_NAME = {
  en: {
    full: 'Graded Slab Aluminum Protector',
    short: 'Graded Slab Protector',
    plural: 'Graded Slab Protectors',
    whatsappOrder: 'Hi! I\'m interested in ordering a Graded Slab Aluminum Protector.',
    seoH1: 'Appaw Store | Hong Kong Graded Slab Aluminum Protector',
    metaTitle: 'Graded Slab Aluminum Protector HK | 35PT Magnetic Slab Case – Appaw Store',
    metaDescription:
      '35PT magnetic aluminum slab case for PSA & CGC graded cards. >95% UV-blocking glass, N52 closure. Hong Kong designed for Pokémon PTCG, sports & MTG slabs. Ships worldwide.',
  },
  zh: {
    full: '磁吸鋁合金鑑定卡保護殼',
    short: '鑑定卡保護殼',
    whatsappOrder: '你好！我想訂購磁吸鋁合金鑑定卡保護殼。',
    seoH1: 'Appaw Store｜香港磁吸鋁合金鑑定卡保護殼專門店',
    metaTitle: '鑑定卡鋁合金保護殼｜35PT 磁吸 Slab 防褪色 - Appaw Store 香港',
    metaDescription:
      '專為標準 35PT PSA 及 CGC 鑑定卡磚打造的航空級鋁合金保護殼。具備 >95% 抗紫外線與 N52 磁吸設計，全面保護寶可夢 PTCG、運動卡珍藏。香港設計，全球付運。',
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
  '鰂魚涌',
  '萬利廣場',
  'Quarry Bay card shop',
] as const;

/** Homepage meta — keep in sync with i18n home.hero.h1Keyword */
export const HOME_SEO = {
  en: {
    title: 'Graded Slab Aluminum Protector & Trading Card Supplies HK – Appaw Store',
    description:
      'Premium graded slab aluminum protectors for 35PT PSA & CGC slabs, plus trusted graded card trading in Hong Kong. >95% UV-blocking glass, N52 magnetic closure. Ships worldwide.',
  },
  zh: {
    title: '鑑定卡鋁合金保護殼｜35PT 磁吸 Slab 防褪色 - Appaw Store 香港',
    description:
      '香港設計磁吸鋁合金鑑定卡保護殼，適用標準 35PT PSA 及 CGC 鑑定卡磚。>95% 抗紫外線、N52 磁吸。兼營 PTCG 及運動卡交易，全球付運。',
  },
} as const;
