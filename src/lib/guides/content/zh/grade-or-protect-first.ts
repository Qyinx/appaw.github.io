import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: '何時鑑定 vs 何時先保護鑑定卡',
  description:
    '已有鑑定卡？先上外保護殼。仍在考慮送評？先查置中與品相。面向磚收藏者及香港交易的決策框架。',
  badge: '流程',
  lead:
    '多數讀者已持有 PSA 或 CGC 鑑定卡。外層保護是展示、攜帶及香港卡展交易的第一步。若仍有裸卡準備送評，置中與表面檢查應先於送評費用。',
  published: '2026-06-07',
  updated: '2026-06-07',
  readTime: '5 分鐘',
  heroSpecs: [
    { label: '先保護', value: '磚日常使用' },
    { label: '先鑑定', value: '裸卡 + gem 潛力' },
    { label: 'PSA 10 正面', value: '55/45 或更佳' },
    { label: '香港磚交易', value: '卡展前先保護' },
  ],
  sections: [
    {
      id: 'protect-first',
      title: '先保護（已有鑑定卡）',
      paragraphs: [
        '剛從鑑定公司取回的磚，通常只有薄塑膠套。這不足以應付展示、旅行或寄售。放入背包、寄給買家或帶去香港卡展前，應先套上 35PT 硬質鋁合金或壓克力外殼。',
        '磚會放桌面、店舖櫃或卡展上頻繁易手時，應立即保護。外殼承受刮痕，鑑定標籤保持清晰，轉售時更有利。',
        '磚長期放窗邊或明亮 LED 展示下，防 UV 外層玻璃很重要。身處潮濕地區，儲存環境維持 45–55% RH 一併處理。',
      ],
    },
    {
      id: 'grade-first',
      title: '考慮鑑定（送評前）',
      paragraphs: [
        '僅當置中、表面、邊角都達 gem 水準，且裸卡與鑑定卡價差足以覆蓋雙程費用時，才送裸卡。付款前先量置中。正面 62/38 是 PSA 9 的數學，不是 10 的指望。',
        '大量現代卡 bulk 送評需試算：預期 gem 率 × 鑑定卡溢價 − 單張服務費及保險。一張 chase 可帶動整批，勿假設必然。',
        '若已持有鑑定卡版本，除非懷疑竄改，否則不必重送。把預算放在外保護殼及證書核對。',
      ],
    },
    {
      id: 'order-of-ops',
      title: '建議順序',
      paragraphs: [
        '已有鑑定卡：到貨核對 registry 證書 → 安裝外保護殼 → 記錄購入價及證書編號 → 展示、香港卡展交易或寄送。',
        '考慮送評：量置中 → 放大鏡檢查表面 → 數字合理才送鑑定公司 → 磚寄回後裝外保護殼 → 上架或交易。',
      ],
    },
    {
      id: 'when-to-wait',
      title: '兩者皆可緩',
      paragraphs: [
        '重度磨損、邊角發軟的裸卡，除非極稀有到 Authentic 仍可回本，否則不宜送評。',
        '若 PSA 週期或價格不合時程，暫緩送評。市場 hype 會變，gem 磚不會一夜出現。',
        '中價現代卡，本地以磚交易並附上清晰證書照片，往往比硬送裸卡更划算，尤其差一級只動幾十美元時。',
      ],
    },
  ],
  cta: {
    title: '下一步',
    body: '保護你已有或剛收到的磚。篩選裸卡送評或購買鑑定卡前，用置中工具核對賣家照片。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '交易及服務', href: '/business/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'uv-protection-graded-cards'],
  sources: [
    {
      label: 'PSA 鑑定標準',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'PSA — 送評包裝指引',
      href: 'https://www.psacard.com/info/shipguide',
    },
    {
      label: 'CGC Cards — TCG 鑑定概覽',
      href: 'https://www.cgccards.com/card-grading/trading-card-grading/',
    },
  ],
};

export default guide;
