import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-10-centering-requirements',
  title: 'PSA 10 置中標準詳解',
  description:
    'PSA Gem Mint 10 要求正面 55/45、背面 75/25 置中。用於購買鑑定卡前核對賣家照片，或送評裸卡前量度。',
  badge: '鑑定規格',
  lead:
    '置中是桌上最快可做的檢查。PSA 10 掛牌價異常低時，或送評裸卡前，都應先跑一輪。PSA 在 2025 年初收緊正面標準。若仍按舊 60/40 正面去估，退回 PSA 9 的機會會更高。',
  published: '2026-06-07',
  updated: '2026-06-07',
  readTime: '6 分鐘',
  heroSpecs: [
    { label: 'PSA 10 正面', value: '55/45 或更佳' },
    { label: 'PSA 10 背面', value: '75/25 或更佳' },
    { label: 'PSA 9 正面', value: '60/40 或更佳' },
    { label: 'PSA 9 背面', value: '90/10 或更佳' },
  ],
  sections: [
    {
      id: 'read-the-ratio',
      title: '如何讀置中比例',
      paragraphs: [
        '正面 55/45 指同一軸上（左右或上下）較闊邊距最多佔該軸總邊距的 55%。由卡邊量至印刷框，比較兩側，以較大比例寫在前。',
        '例：左 2.2 mm、右 1.8 mm，合計 4.0 mm。較闊 2.2 ÷ 4.0 = 55%，該軸符合 PSA 10。另一軸亦需通過。',
        '無邊框 full-art 寶可夢及現代運動卡，外框不明時改量內部印刷元素。可對照已知 PSA 10 掃描圖。',
      ],
    },
    {
      id: 'front-vs-back',
      title: '正面 vs 背面容差',
      paragraphs: [
        'PSA 對背面較寬鬆：Gem Mint 10 為 75/25 或更佳。出廠背面常比正面差，正面完美、背面略偏仍可能 gem，只要在 75/25 內。',
        '實務上正面是瓶頸。正面 65/35 即使背面完美亦難 gem。付送評費或相信 PSA 10 叫價前，請影相並量度兩面。',
      ],
      specs: [
        { label: 'PSA 10 正面（2025+）', value: '≤ 55/45' },
        { label: 'PSA 10 背面', value: '≤ 75/25' },
        { label: '2025 前 PSA 10 正面', value: '曾為 60/40' },
      ],
    },
    {
      id: '2025-change',
      title: '2025 年初的變更',
      paragraphs: [
        'PSA 將 Gem Mint 正面由 60/40 改為 55/45，更接近 SGC 及市場預期；背面仍為 75/25。舊標準下邊緣可 gem 的卡，若置中為唯一問題，現多數為 PSA 9。',
        '證書編號本身不顯示適用哪版標準。高價送評或購買鑑定卡時仍應量度。今日 58/42 正面是 9，不是「或許 10」。',
      ],
    },
    {
      id: 'measure-first',
      title: '何時量度',
      paragraphs: [
        '線上購買鑑定卡：要求賣家提供平整、高解像度正背面掃描。付 PSA 10 價錢前，用置中工具核對邊界掛牌。斜角磚照片會隱藏偏位，實際可能是 PSA 9。',
        '送評裸卡前：用游標卡尺或置中工具在平面掃描上拖曳參考線。斜角手機相會扭曲數個百分點，足以誤判邊界卡。',
        '若正面任一軸劣於 55/45，bulk 送評或溢價買磚前，先計算 PSA 9 是否仍具經濟意義。表面和角位仍重要，但置中是最快篩選。',
        'Appaw Store 免費置中計算器可對照 PSA、BGS、SGC 各級門檻，無需手算。',
      ],
    },
  ],
  cta: {
    title: '數分鐘檢查邊距',
    body: '上傳掃描或賣家照片、對齊參考線，比較正背面百分比與 PSA 10、9、8 門檻。',
    primary: { label: '免費置中計算器', href: '/tools/card-centering/' },
    secondary: { label: '保護退回的磚', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['grade-or-protect-first', 'choose-35pt-slab-protector'],
  sources: [
    {
      label: 'PSA 鑑定標準 — Gem Mint 10 置中',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'SGC 鑑定等級 — Pristine 10 置中',
      href: 'https://www.gosgc.com/card-grading/scale',
    },
    {
      label: 'CGC Cards — 鑑定等級（各級置中要求）',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
