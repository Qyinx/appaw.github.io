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
  heroImage: '/images/background/psa-10-centering-requirements.png',
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
        '55/45 的正面比例意味著較寬的邊框在該軸（左/右或上/下）上最多只能佔總邊框寬度的 55%。測量從卡片邊緣到印刷邊框的距離，比較兩側，先列出較大的一側。',
        '例如：左側邊緣 2.2 毫米，右側邊緣 1.8 毫米，同軸。總長度為 4.0 毫米。較寬的一側佔 2.2 ÷ 4.0 = 55%。該比求初步合乎PSA10要求。然後重複垂直軸的操作。',
        '無邊框的全圖卡牌和現代體育卡牌，在沒有外邊框的情況下，其內部印刷元素的計算方法相同。如果畫面邊框模糊不清，請使用現有PSA 10級的卡牌掃描圖作為參考。',
      ],
    },
    {
      id: 'front-vs-back',
      title: '正面與背面的容差',
      paragraphs: [
        'PSA對卡片背面的瑕疵容許度更高：Gem Mint 10評級要求背面瑕疵度達到75/25或更高。工廠生產的卡片背面通常比正面瑕疵度低。即使卡片正面看起來完美無瑕，如果背面瑕疵度略有偏差但符合75/25標準，仍然可以獲得Gem Mint 10評級。',
        '實際上，卡片正面是決定其等級的關鍵因素。收藏家很少能見到正面評級為 65/35 的精品卡，因為背面通常都很完美。在支付評級費用或鑑定卡的價格前，請務必先拍攝並測量卡片正反兩面。',
      ],
      specs: [
        { label: 'PSA 10 正面（2025+）', value: '≤ 55/45' },
        { label: 'PSA 10 背面', value: '≤ 75/25' },
        { label: '2025 前 PSA 10 正面', value: '曾為 60/40' },
      ],
    },
    {
      id: '2025-change',
      title: '2025年初發生了哪些變化',
      paragraphs: [
        'PSA將Gem Mint等級的正面標準從60/40調整為55/45，更接近其他評級機構的標準，以及市場的預期。背面的標準仍然保持為75/25。在舊的標準下，如果卡牌的邊緣瑕疵度較小，可能會被評為PSA 10，但現在這樣的卡牌如果只有置中問題，很可能會被評為PSA 9。',
        '單憑證書編號無法判斷所採用的標準。對於高價值的鑑定卡，購買前請務必進行測量。如今，58/42 的正面尺寸是 9 級，而不是「可能 10 級」。',
      ],
    },
    {
      id: 'measure-first',
      title: '何時量度',
      paragraphs: [
        '在網上購買評級卡時：要求提供正面和背面的高清平鋪掃描圖。在為一張接近PSA 10級的卡片支付接近PSA 10級的價格之前，請務必使用居中校正工具檢查圖片。傾斜角度拍攝的卡片照片會掩蓋卡片的傾斜問題，而這可能會導致卡片最終評級降至PSA 9級。',
        '提交裸卡之前：請使用卡尺或可拖曳參考線的中心定位工具對平整的掃描件進行校準。手機斜角拍攝的照片會使比例失真幾個百分點，這足以導致評級邊緣卡片出現錯誤。',
        '如果卡片正面任一邊的讀數低於 55/45，在進行批量送檢或支付過高價格購買評級盒之前，請先評估這張卡片在 PSA 9 級時是否仍然具有經濟意義。卡片表面和邊角仍然很重要，但居中性是最快的篩選標準。',
        '我們的免費卡片居中計算器會根據您上傳的檔案，對照 PSA、BGS 和 SGC 的標準，讓您可以看到每個等級的合格/不合格情況，而無需手動計算。',
      ],
    },
  ],
  cta: {
    title: '數分鐘檢查邊距',
    body: '上傳掃描或賣家照片、對齊參考線，比較正背面百分比與 PSA 10、9、8 門檻。',
    primary: { label: '免費置中計算器', href: '/tools/card-centering/' },
    secondary: { label: '保護鑑定卡', href: '/products/psa-protectors/' },
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
