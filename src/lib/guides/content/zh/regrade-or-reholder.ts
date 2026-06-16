import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'regrade-or-reholder',
  title: 'PSA Regrade vs Reholder — 如何選擇',
  description:
    '換殼保留原評級、更新外殼；重評全面重審品相，可能升級或降級。比較費用、風險與適用情境，選對 PSA 服務避免不必要損失。',
  badge: '鑑定卡流程',
  lead:
    'Slab 刮痕、霧化、邊角磨損或標籤褪色時，收藏者常寄回 PSA 處理。最常見兩個選項是 Reholder（重新裝殼）與 Regrade（重新評級）——服務內容、費用、風險差異很大。選錯要麼白費錢，要麼丟掉已有評級。',
  published: '2026-06-13',
  updated: '2026-06-17',
  readTime: '9 分鐘',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'Reholder', value: '同評級，新外殼' },
    { label: 'Regrade', value: '全面重評 — 可升可降' },
    { label: 'Reholder 風險', value: '低（非零）' },
    { label: 'Regrade 風險', value: '降分可能性大' },
  ],
  sections: [
    {
      id: 'why-it-matters',
      title: '為什麼選對服務很重要',
      paragraphs: [
        '在 PSA 評級卡的收藏與交易過程中，Slab 外殼難免出現刮痕、霧化、邊角磨損或標籤褪色。此時 Reholder 與 Regrade 是最常見的兩個選項，但兩者目的完全不同。',
        'Reholder 像「換一件新外衣」——改善外觀，原則上保留等級。Regrade 像「全身體檢」——重新審核所有品相面向，分數可能上升、維持或下降。清楚差異，才能避免不必要損失。',
      ],
    },
    {
      id: 'what-is-reholder',
      title: 'Reholder（重新裝殼）是什麼？',
      paragraphs: [
        'Reholder 是 PSA 提供的基礎更新服務，主要目的是讓舊 Slab 煥然一新。',
        'PSA 會將卡片從原有外殼取出，重新放入最新塑膠外殼與標籤。原則上，原有等級（Grade）、認證編號（Certification Number）與鑑定結果均維持不變。',
        '適合時機：Slab 僅有輕微刮痕、表面霧化、邊角輕微磨損或標籤略微褪色，整體狀況良好；希望統一收藏系列外觀（例如舊標籤全部換成新款）；純粹提升美觀或轉售吸引力，不想改變目前等級。',
        'PSA 仍會進行基本真偽與完整性檢查。若發現卡片有明顯新損壞、褪色或其他疑慮，可能轉為重新評級，甚至導致等級調整——風險低，但非零。',
        '官方建議：適用於外觀有輕微問題、卡片本身無重大疑慮的 Slab。殼體是唯一問題時，Reholder 是最安全且經濟的選擇。',
      ],
      specs: [
        { label: '等級', value: '原則上維持不變' },
        { label: '認證編號', value: '多數情況保留' },
        { label: '費用 / 時間', value: '較低、較短' },
        { label: '風險', value: '低（非零）' },
      ],
    },
    {
      id: 'what-is-regrade',
      title: 'Regrade（重新評級）是什麼？',
      paragraphs: [
        'Regrade 是更徹底的審核服務，等同讓卡片接受一次全新的品相評估。',
        'PSA 會完整重新檢查邊角、置中、表面、清潔度等所有面向，並給出全新等級。分數有可能上升、維持，也有可能下降。',
        '適合時機：你認為當初評級被低估，希望挑戰更高分數（例如 PSA 9 衝 PSA 10）；Slab 嚴重損壞（破裂、明顯影響卡片），必須取出全面處理；想用 PSA 最新評級標準重新審核舊卡；接受可能降分的風險，追求更高市場價值。',
        '降分風險明顯，特別是高分卡（PSA 10）更容易因細微瑕疵被挑剔。2025 年起 PSA 10 正面置中標準收緊至 55/45，舊標籤在現行標準下可能不再通過。寄出前可用免費 [卡牌置中工具](/tools/card-centering/) 的鑑定卡模式預查置中。',
      ],
      specs: [
        { label: '等級', value: '可能上升、維持或下降' },
        { label: '認證編號', value: '通常產生新編號' },
        { label: '費用 / 時間', value: '較高、較長' },
        { label: '風險', value: '高 — 降分可能性大' },
      ],
    },
    {
      id: 'comparison',
      title: 'Reholder 與 Regrade 詳細比較',
      paragraphs: [
        '兩者核心差異在於：Reholder 更新外殼、原則上保留評級；Regrade 重新打開品相記錄，結果不可預測。下表整理關鍵對照。',
      ],
      table: {
        headers: ['項目', 'Reholder（重新裝殼）', 'Regrade（重新評級）'],
        rows: [
          ['等級變化', '原則上維持不變', '可能上升、維持或下降'],
          ['檢查程度', '基本真偽與外觀完整性檢查', '完整重新品相審核'],
          ['適合情境', '輕微外殼磨損、統一收藏風格', '想挑戰分數、Slab 嚴重損壞'],
          ['費用', '較低', '較高'],
          ['風險程度', '低（但非零）', '高（降分可能性大）'],
          ['認證編號', '多數情況保留', '通常會產生新編號'],
          ['照片更新', '多數情況會更新', '一定會重新掃描'],
        ],
      },
    },
    {
      id: 'when-to-choose',
      title: '實務選擇建議',
      paragraphs: [
        '優先選 Reholder：主要目的是改善外觀、統一系列風格，且對目前等級滿意。殼體是唯一問題時，付 Regrade 費用屬浪費。',
        '選 Regrade：只有當你明確希望挑戰更高分數，或 Slab 損壞嚴重到必須全面檢查時才考慮。先算期望值：升級可能帶來的價值是否足以覆蓋費用與降分風險。',
        '高價值卡特別提醒：PSA 10 重新送審風險最高，許多人因微小瑕疵掉到 PSA 9，價值大幅下滑。寄送前可先聯絡 PSA 客服，或透過授權經銷商提交以降低風險。',
        '決策流程：第一步在 [psacard.com/cert](https://www.psacard.com/cert) 核實證書 → 平整拍攝正反面 → 鑑定卡模式量度置中 → 放大鏡檢查四角與表面 → 僅殼體不合格則 Reholder；置中與肉眼觀感明顯優於標籤且數字合理，再考慮 Regrade。',
      ],
    },
    {
      id: 'before-you-ship',
      title: '寄送前注意事項',
      paragraphs: [
        '寄送前務必拍攝多角度高解析度照片與影片，詳細記錄目前 Slab 與卡片狀態。',
        '詳細閱讀 PSA 官網最新服務政策：[psacard.com/services](https://www.psacard.com/services)。費用與流程可能隨時間調整。',
        '申報價值要合理，以確保保險保障。若 Slab 已明顯破裂，PSA 通常視為需審核案件，增加轉 Regrade 的機率。',
        '無論哪項服務，換殼或重評完成後，日常攜帶或卡展交接前應加裝 [抗 UV 外殼](/products/psa-protectors/)。評級殼為展示級，非背包防護。',
      ],
    },
    {
      id: 'bottom-line',
      title: '結語',
      paragraphs: [
        'Reholder 適合追求美觀與安全；Regrade 適合願意承擔風險、追求更高價值的收藏者。清楚了解兩者差異，才能讓 PSA 收藏更專業且安心。',
        '仍不確定？寄出高價卡前先閱讀 [PSA 10 置中標準](/guides/psa-10-centering-requirements/) 及 [辨識假 PSA 殼](/guides/identify-fake-psa-slabs/)。',
      ],
    },
  ],
  cta: {
    title: '寄出前先篩選置中',
    body: '上傳鑑定卡照片、切換鑑定卡模式，依置中閱讀 Regrade 升值與降級風險——瀏覽器免費使用。',
    primary: { label: '免費置中工具', href: '/tools/card-centering/' },
    secondary: { label: '換殼後加裝保護', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'identify-fake-psa-slabs', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA — 評級標準及殼體服務',
      href: 'https://www.psacard.com/services',
    },
  ],
};

export default guide;
