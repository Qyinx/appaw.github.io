import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-10-centering-requirements',
  title: 'PSA 10 置中標準詳解',
  description:
    'PSA Gem Mint 10 正面 55/45、背面 75/25 置中標準、測量方法與各等級對照。送評裸卡或購買 PSA 10 前篩選置中，提升成功率。',
  badge: '鑑定規格',
  lead:
    '置中（Centering）是 PSA 10 Gem Mint 的關鍵門檻之一。邊角尖銳、表面無瑕，置中偏差過大仍難拿最高等級。許多收藏者送評後因置中未達標拿到 PSA 9，白白浪費評級費。提前量度，是最划算的篩選。',
  published: '2026-06-07',
  updated: '2026-06-17',
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
        '正面（Front）：必須達 55/45 或更佳——左右、上下兩軸皆須達標。55/45 表示較寬邊框不得超過該軸總邊框寬度的 55%（另一側 45%）。完美置中為 50/50；55/45 已非常接近肉眼難辨的完美狀態。',
        '背面（Back）：容忍度較寬，需達 75/25 或更佳。工廠印刷背面常比正面差，只要仍在 75/25 內，正面達標的卡仍可能 gem。',
        'PSA 於 2025 年初將 Gem Mint 正面由 60/40 收緊至 55/45。偏差達 60/40 通常只能拿 PSA 9，即使邊角、表面極佳。Grader 有最終裁量權——眼感（Eye Appeal）出色時可能對微小偏差網開一面，但熱門 Rookie 或高價卡通常執行更嚴。',
        '置中本身不保證 PSA 10——角位、邊緣、表面仍計分——但它是送評或購買 PSA 10 前，最快可從照片完成的檢查。',
      ],
      specs: [
        { label: 'PSA 10 正面（2025+）', value: '≤ 55/45' },
        { label: 'PSA 10 背面', value: '≤ 75/25' },
        { label: '2025 前 PSA 10 正面', value: '曾為 60/40' },
      ],
    },
    {
      id: 'why-centering-matters',
      title: '為什麼置中如此重要',
      paragraphs: [
        '置中直接影響視覺平衡與市場價值。PSA 10 溢價極高，置中完美的 PSA 10 往往比 PSA 9 貴出數倍。',
        '現代印刷雖進步，裸卡切割仍易偏移——TCG 卡（如寶可夢）邊框較窄，置中問題比傳統運動卡更常見。置中不良是裸卡送評後掉到 PSA 9 的最常見原因之一。',
        '實務上，正面是等級限制因素。收藏家很少見到 65/35 正面仍 gem 的案例——購買或送評前，務必拍攝並量度正反面。',
      ],
    },
    {
      id: 'how-to-measure',
      title: '如何準確測量置中',
      paragraphs: [
        '推薦工具：數位卡尺（最精準）；放大鏡或 Jeweler\'s Loupe；手機 macro 模式配合 [免費置中計算器](/tools/card-centering/)——上傳掃描或賣家照片，對齊導線，自動比對 PSA、BGS、SGC 各級門檻。',
        '測量步驟：分別量正面與背面。水平：測左、右邊框寬度，較寬側 ÷（左+右）×100。垂直：測上、下邊框。正面兩軸皆需 ≤55/45，背面 ≤75/25。',
        '實例：左 2.2 mm、右 1.8 mm → 2.2÷4.0=55% → 55/45，該軸可接受。左 2.5 mm、右 1.5 mm → 62.5/37.5，很可能無法 PSA 10。',
        '無外邊框的全圖 TCG 或運動卡，對內部印刷元素用相同算法。邊框模糊時，參考已知 PSA 10 掃描圖。斜角手機照會扭曲比例數個百分點——足以誤判邊界卡；請用平整掃描或正上方拍攝。',
      ],
    },
    {
      id: 'grade-comparison',
      title: 'PSA 10 置中 vs 其他等級',
      paragraphs: [
        '各等級置中門檻與市場影響對照如下。送評前先對照目標等級，避免為 PSA 10 價格付給 PSA 9 品相。',
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
        'Factory Cut 偏移：出廠切割不均。購買裸卡時即用置中工具嚴格檢查，勿等送評才發現。',
        '印刷偏移：圖案本身不在卡片中心。需多角度觀察整體眼感，邊框數字達標但圖案偏了仍可能降分。',
        'TCG 特殊性：寶可夢等窄邊框設計，置中要求更嚴苛——55/45 容錯更小。',
        '提交前清單：只送置中達標且邊角、表面、邊緣皆優的裸卡；高價卡可先找授權經銷商預檢；記錄測量數據與照片作佐證。',
      ],
    },
    {
      id: 'practical-tips',
      title: '實戰建議：提高 PSA 10 成功率',
      paragraphs: [
        '裸卡篩選流程：先看置中 → 再看邊角與表面。若正面任一軸超過 55/45，先評估 PSA 9 是否仍具經濟意義，再決定 bulk 送評或高價購買。',
        '購買鑑定卡 online：要求平整高解析正反面掃描，用 [置中計算器](/tools/card-centering/) 鑑定卡模式篩選。傾斜 slab 照會隱藏偏斜。',
        '送評時機：選 backlog 不嚴重時段，申報合理保險價值。若置中是唯一弱點且其他條件極佳，可考慮 [Regrade](/guides/regrade-or-reholder/)——需承擔降分風險。',
        '拿到 PSA 10 後：立即加裝 [磁吸鑑定卡保護殼](/products/psa-protectors/)，避免展示或攜帶時刮花外殼、影響轉售。詳見 [裸卡送評 vs 鑑定卡保護](/guides/grade-or-protect-first/)。',
      ],
    },
    {
      id: 'bottom-line',
      title: '結語：先量邊距，再付評級費',
      paragraphs: [
        'PSA 10 置中（正面 55/45、背面 75/25）有一定容忍度，但要穩定 gem，仍需近乎完美的裸卡品相。提前精準測量置中，是最划算的投資——避開無謂評級費，提升收藏與轉售價值。',
        '掌握置中標準後，搭配邊角、表面、邊緣等其他要素，送評與購買 PSA 10 會更有把握。細心準備，永遠比事後後悔便宜。',
      ],
    },
  ],
  cta: {
    title: '數分鐘檢查邊距',
    body: '上傳掃描或賣家照片、對齊參考線，比較正背面百分比與 PSA 10、9、8 門檻。',
    primary: { label: '免費置中計算器', href: '/tools/card-centering/' },
    secondary: { label: '保護鑑定卡', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['grade-or-protect-first', 'regrade-or-reholder', 'choose-35pt-slab-protector', 'display-graded-cards'],
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
