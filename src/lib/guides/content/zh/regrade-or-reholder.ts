import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'regrade-or-reholder',
  title: 'PSA 重新評級與更換新殼：何時選擇',
  badge: '鑑定卡流程',
  lead:
    '鑑定殼出現刮痕，未必代表評分有問題。更換新殼（Reholder）更換外殼；重新評級（Regrade）重新評分。選錯服務，可能白付費用，或失去已有的 PSA 10。',
  published: '2026-06-13',
  updated: '2026-07-12',
  readTime: '9 分鐘',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'Regrade 風險', value: 'PSA 10 易降分' },
    { label: 'Reholder', value: '同分數，新外殼' },
    { label: 'Regrade', value: '全面重新評級，可升可降' },
    { label: 'Reholder 風險', value: '低（非零）' },
  ],
  sections: [
    {
      id: 'why-it-matters',
      title: '為什麼選對服務很重要',
      paragraphs: [
        'PSA 鑑定卡外殼難免出現刮痕、霧化、邊角磨損或標籤褪色。Reholder 與 Regrade 是最常見的兩個選項，目的完全不同。',
        'Reholder 更換外殼與標籤耗材，分數通常不變——像替鑑定卡換一件新外套。Regrade 重新審核全部品相面向，分數可能上升、維持或下降。外殼受損而分數滿意 → Reholder；願承擔降分風險追更高分 → Regrade。',
      ],
      bridge: '先釐清 Reholder 做什麼、不做什麼。',
    },
    {
      id: 'what-is-reholder',
      title: 'Reholder（重新裝殼）是什麼？',
      paragraphs: [
        'Reholder 是 PSA 提供的基礎更新服務：將卡片從原有鑑定殼取出，放入最新塑膠外殼與標籤。原有等級、認證編號與鑑定結果通常維持不變。',
        '適合時機：鑑定殼僅有輕微刮痕、表面霧化、邊角輕微磨損或標籤略微褪色；希望統一收藏系列外觀；純粹提升美觀或轉售吸引力，不想改變目前等級。',
        'PSA 仍會進行基本真偽與完整性檢查。若發現卡片有明顯新損壞或其他疑慮，可能轉為重新評級。殼體是唯一問題時，Reholder 是最安全且經濟的選擇。',
      ],
      specs: [
        { label: '等級', value: '通常維持不變' },
        { label: '認證編號', value: '多數保留' },
        { label: '費用 / 時間', value: '較低、較短' },
        { label: '風險', value: '低（非零）' },
      ],
      bridge: '若目標是改分數而非改外觀，才考慮 Regrade。',
    },
    {
      id: 'what-is-regrade',
      title: 'Regrade（重新評級）是什麼？',
      paragraphs: [
        'Regrade 讓卡片接受全新品相評估。PSA 完整重新檢查邊角、置中、表面、清潔度等面向，並給出全新等級。',
        '適合時機：認為當初評級被低估，希望挑戰更高分數；鑑定殼嚴重損壞必須取出全面處理；接受可能降分的風險，追求更高市場價值。',
        '降分風險明顯，高分卡（PSA 10）尤其如此。2025 年起 PSA 10 正面置中收緊至 55/45，舊標籤在現行標準下可能不再通過。寄出前可用免費 [卡牌置中工具](/tools/card-centering/) 的鑑定卡模式預查置中。',
      ],
      specs: [
        { label: '等級', value: '可能上升、維持或下降' },
        { label: '認證編號', value: '通常產生新編號' },
        { label: '費用 / 時間', value: '較高、較長' },
        { label: '風險', value: '高，降分可能性大' },
      ],
      bridge: '下表對照兩項服務的關鍵差異。',
    },
    {
      id: 'comparison',
      title: 'Reholder 與 Regrade 詳細比較',
      paragraphs: [
        'Reholder 更新外殼、通常保留評級；Regrade 重新打開品相記錄，結果不可預測。',
      ],
      table: {
        headers: ['項目', 'Reholder（重新裝殼）', 'Regrade（重新評級）'],
        rows: [
          ['等級變化', '通常維持不變', '可能上升、維持或下降'],
          ['檢查程度', '基本真偽與外觀完整性', '完整重新品相審核'],
          ['適合情境', '輕微外殼磨損、統一收藏風格', '挑戰分數、鑑定殼嚴重損壞'],
          ['費用', '較低', '較高'],
          ['風險程度', '低（非零）', '高（降分可能性大）'],
          ['認證編號', '多數保留', '通常產生新編號'],
          ['認證資料庫照片', '多數更新', '一定重新掃描'],
        ],
      },
    },
    {
      id: 'when-to-choose',
      title: '實務選擇建議',
      paragraphs: [
        '優先選 Reholder：主要目的是改善外觀、統一系列風格，且對目前等級滿意。殼體是唯一問題時，付 Regrade 費用屬浪費。',
        '選 Regrade：明確希望挑戰更高分數，或鑑定殼損壞嚴重到必須全面檢查。先算期望值：升級可能帶來的價值是否足以覆蓋費用與降分風險。',
        '高價值卡提醒：PSA 10 重新送審風險最高，微小瑕疵可能掉到 PSA 9。寄送前可先聯絡 PSA 客服，或透過授權經銷商提交。',
        '決策流程：於 [psacard.com/cert](https://www.psacard.com/cert) 核實證書 → 平整拍攝正面/背面 → 鑑定卡模式量度置中 → 放大鏡檢查四角與表面 → 僅殼體不合格則 Reholder；置中與肉眼觀感明顯優於標籤且數字合理，再考慮 Regrade。',
      ],
    },
    {
      id: 'before-you-ship',
      title: '寄送前注意事項',
      paragraphs: [
        '寄送前拍攝多角度高解析度照片與影片，記錄目前鑑定殼與卡片狀態。',
        '詳閱 PSA 官網最新服務政策：[psacard.com/services](https://www.psacard.com/services)。費用與流程可能調整。',
        '申報價值要合理，以確保保險保障。鑑定殼已明顯破裂時，PSA 通常視為需審核案件，增加轉 Regrade 的機率。',
        '更換新殼或重新評級完成後，日常攜帶或卡展交接前應加裝 [抗 UV 外殼](/products/psa-protectors/)。評級殼為展示級，非背包防護。',
      ],
    },
    {
      id: 'bottom-line',
      title: '結語',
      paragraphs: [
        'Reholder 適合外觀問題；Regrade 適合願承擔風險、追求更高分數。仍不確定？寄出高價卡前先閱讀 [PSA 10 置中標準](/guides/psa-10-centering-requirements/) 及 [PSA 鑑定殼真偽驗證指南](/guides/identify-fake-psa-slabs/)。',
      ],
    },
  ],
  faq: [
    { q: 'PSA Reholder 是什麼？', a: '更換外殼與標籤耗材，等級與證書編號通常不變，適合外殼外觀問題。' },
    { q: 'PSA Regrade 是什麼？', a: '完整重新審核，分數可能升、維持或降。PSA 10 重新評級降分風險最高。' },
    { q: '外殼刮花應 Reholder 還是 Regrade？', a: '僅塑料受損且滿意現有分數 → Reholder。願承擔降分風險追更高分 → Regrade。' },
  ],
  midCta: {
    afterSectionId: 'comparison',
    title: '不確定？先上傳照片測量置中',
    body: '鑑定卡模式下比對置中與降分風險，再決定寄 Reholder 還是 Regrade。',
    primary: { label: '免費置中工具', href: '/tools/card-centering/' },
    secondary: { label: 'PSA 10 置中標準', href: '/guides/psa-10-centering-requirements/' },
  },
  cta: {
    title: '寄出前先篩選置中',
    body: '上傳鑑定卡照片、切換鑑定卡模式，依置中閱讀 Regrade 升值與降級風險，瀏覽器免費使用。',
    primary: { label: '免費置中工具', href: '/tools/card-centering/' },
    secondary: { label: '更換新殼後加裝保護', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'identify-fake-psa-slabs', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA, 評級標準及殼體服務',
      href: 'https://www.psacard.com/services',
    },
  ],
};

export default guide;
