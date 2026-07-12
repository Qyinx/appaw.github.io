import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-10-centering-requirements',
  title: 'PSA 10 置中要求說明',
  badge: '鑑定規格',
  lead:
    'PSA 9 是最代價高昂的等級之一。並非卡片品相差，而是置中僅差幾個百分點，送鑑費卻照常支付。付費前先量邊距。',
  published: '2026-06-07',
  updated: '2026-07-12',
  readTime: '10 分鐘',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'PSA 10 正面', value: '55/45 或更佳' },
    { label: 'PSA 10 背面', value: '75/25 或更佳' },
    { label: 'PSA 9 正面', value: '60/40 或更佳' },
    { label: '2025+ 變化', value: '正面由 60/40 收緊至 55/45' },
  ],
  sections: [
    {
      id: 'psa-10-standard',
      title: 'PSA 10 置中標準是什麼？',
      paragraphs: [
        '根據 PSA 官方評級標準（[psacard.com/gradingstandards](https://www.psacard.com/gradingstandards)），Gem Mint 10 置中要求如下：',
        '正面：必須達 55/45 或更佳，左右、上下兩軸皆須達標。55/45 表示較寬邊框不得超過該軸總邊框寬度的 55%（另一側 45%）。完美置中為 50/50；55/45 已非常接近肉眼難辨的完美狀態。',
        '背面：容忍度較寬，需達 75/25 或更佳。工廠印刷背面常比正面差，只要仍在 75/25 內，正面達標的卡仍可能達 PSA 10。',
        'PSA 於 2025 年初將 Gem Mint 正面由 60/40 收緊至 55/45。偏差達 60/40 通常只能拿 PSA 9，即使邊角、表面極佳。評級員有最終裁量權，眼感（Eye Appeal）出色時可能對微小偏差網開一面，但熱門新秀卡或高價卡通常執行更嚴。',
        '置中本身不保證 PSA 10，角位、邊緣、表面仍計分，但它是送鑑或購買 PSA 10 前，最快可從照片完成的檢查。',
      ],
      specs: [
        { label: 'PSA 10 正面（2025+）', value: '≤ 55/45' },
        { label: 'PSA 10 背面', value: '≤ 75/25' },
        { label: '2025 前 PSA 10 正面', value: '曾為 60/40' },
      ],
      bridge: '門檻清楚了。接下來看置中如何影響市場溢價。',
    },
    {
      id: 'why-centering-matters',
      title: '為什麼置中如此重要',
      paragraphs: [
        '置中直接影響視覺平衡與市場價值。PSA 10 溢價極高，置中完美的 PSA 10 往往比 PSA 9 貴出數倍。',
        '現代印刷雖進步，裸卡切割仍易偏移，TCG 卡（如寶可夢）邊框較窄，置中問題比傳統運動卡更常見。置中不良是裸卡送鑑後掉到 PSA 9 的最常見原因之一。',
        '實務上，正面是等級限制因素。收藏家很少見到 65/35 正面仍達 PSA 10 的案例，購買或送鑑前，務必拍攝並量度正反面。',
      ],
    },
    {
      id: 'how-to-measure',
      title: '如何準確測量置中',
      paragraphs: [
        '推薦工具：數位卡尺（最精準）；放大鏡或寶石放大鏡；手機微距模式配合 [免費置中計算器](/tools/card-centering/)，上傳掃描或賣家照片，對齊導線，自動比對 PSA、BGS、SGC 各級門檻。',
        '測量步驟：分別量正面與背面。水平：測左、右邊框寬度，較寬側 ÷（左+右）×100。垂直：測上、下邊框。正面兩軸皆需 ≤55/45，背面 ≤75/25。',
        '實例：左 2.2 mm、右 1.8 mm → 2.2÷4.0=55% → 55/45，該軸可接受。左 2.5 mm、右 1.5 mm → 62.5/37.5，很可能無法 PSA 10。',
        '無外邊框的全圖 TCG 或運動卡，對內部印刷元素用相同算法。邊框模糊時，參考已知 PSA 10 掃描圖。斜角手機照會扭曲比例數個百分點，足以誤判邊界卡；請用平整掃描或正上方拍攝。',
      ],
    },
    {
      id: 'grade-comparison',
      title: 'PSA 10 置中與其他等級對比',
      paragraphs: [
        '各等級置中門檻與市場影響對照如下。送鑑前先對照目標等級，避免為 PSA 10 價格付給 PSA 9 品相。',
      ],
      table: {
        headers: ['等級', '正面置中', '背面置中', '通過難度', '市場影響'],
        rows: [
          ['PSA 10', '55/45 或更佳', '75/25 或更佳', '極高', '最高溢價'],
          ['PSA 9', '60/40 或更佳', '90/10 或更佳', '中等', '常見'],
          ['PSA 8', '65/35 或更佳', '90/10 或更佳', '較低', '明顯偏差'],
          ['PSA 7', '70/30 或更佳', '更寬鬆', '低', '價值下滑'],
        ],
      },
    },
    {
      id: 'common-issues',
      title: '常見置中問題與避免方法',
      paragraphs: [
        '出廠切割偏移：出廠切割不均。購買裸卡時即用置中工具嚴格檢查，勿等送鑑才發現。',
        '印刷偏移：圖案本身不在卡片中心。需多角度觀察整體眼感，邊框數字達標但圖案偏了仍可能降分。',
        'TCG 特殊性：寶可夢等窄邊框設計，置中要求更嚴苛，55/45 容錯更小。',
        '提交前清單：只送置中達標且邊角、表面、邊緣皆優的裸卡。香港藏家可經 [138 Arena 代送鑑定](/business/psa-grading/) 交卡及取件並追蹤批次。記錄測量數據與照片作佐證。',
      ],
    },
    {
      id: 'practical-tips',
      title: '實戰建議：提高 PSA 10 成功率',
      paragraphs: [
        '裸卡篩選流程：先看置中 → 再看邊角與表面。若正面任一軸超過 55/45，先評估 PSA 9 是否仍具經濟意義，再決定批量送鑑或高價購買。',
        '網上購買鑑定卡：要求平整高解析正反面掃描，用 [置中計算器](/tools/card-centering/) 鑑定卡模式篩選。傾斜拍攝的鑑定卡照片會隱藏偏斜。',
        '送鑑時機：選積壓不嚴重時段，申報合理保險價值。若置中是唯一弱點且其他條件極佳，可考慮 [Regrade](/guides/regrade-or-reholder/)，需承擔降分風險。',
        '拿到 PSA 10 後：立即加裝 [磁吸鑑定卡保護殼](/products/psa-protectors/)，避免展示或攜帶時刮花外殼、影響轉售。詳見 [裸卡到受保護鑑定卡：送鑑後加裝保護殼](/guides/grade-or-protect-first/)。',
      ],
    },
    {
      id: 'bottom-line',
      title: '先量邊距，再付送鑑費',
      paragraphs: [
        'PSA 10 置中（正面 55/45、背面 75/25）有一定容忍度，但要穩定達 PSA 10，仍需近乎完美的裸卡品相。送鑑與購買 PSA 10 前，先用工具量度正反面邊距。',
      ],
    },
  ],
  faq: [
    {
      q: '2025 年 PSA 10 置中標準是多少？',
      a: '正面 55/45 或更佳（兩軸皆須達標），背面 75/25 或更佳。2025 年初正面由 60/40 收緊至 55/45。',
    },
    {
      q: '正面 60/40 還有機會拿 PSA 10 嗎？',
      a: '2025 新規後機會很低。60/40 正面通常上限為 PSA 9，即使邊角與表面極佳。',
    },
    {
      q: '送鑑前如何量度置中？',
      a: '分別量正反面左右、上下邊框。可用卡尺或本站免費置中計算器，以平整掃描為佳。',
    },
  ],
  midCta: {
    afterSectionId: 'psa-10-standard',
    title: '上傳照片，30 秒比對 PSA 10 門檻',
    body: '平面掃描或賣家照片即可。比對正反面是否達 55/45 與 75/25，再決定是否付送鑑費。',
    primary: { label: '免費置中計算器', href: '/tools/card-centering/' },
    secondary: { label: 'PSA 代送鑑定', href: '/business/psa-grading/' },
  },
  cta: {
    title: '邊距達標？安排送鑑',
    body: '置中通過後，可經香港合作店舖代送 PSA，或為已取回的鑑定卡加裝保護殼。',
    primary: { label: 'PSA 代送鑑定', href: '/business/psa-grading/' },
    secondary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['grade-or-protect-first', 'regrade-or-reholder', 'choose-35pt-slab-protector', 'display-graded-cards'],
  sources: [
    {
      label: 'PSA 鑑定標準, Gem Mint 10 置中',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'SGC 鑑定等級, Pristine 10 置中',
      href: 'https://www.gosgc.com/card-grading/scale',
    },
    {
      label: 'CGC Cards, 鑑定等級（各級置中要求）',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
