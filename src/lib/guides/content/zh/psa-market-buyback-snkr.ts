import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-market-buyback-snkr',
  title: 'SNKRDUNK 秋葉原買取參考價',
  badge: 'SNKR回收價參考',
  lead:
    '以下買取價摘錄自 SNKRDUNK 秋葉原官方帳號每日公布，僅供市場參考，並非 Appaw Store 或 138 Arena 的收卡價格。實際可否成交、最終金額以該店當日公告為準。',
  metaDescription:
    'SNKRDUNK 秋葉原每日買取價，僅供市場參考，並非 Appaw Store 或 138 Arena 的收卡價格。資料日期為 2026-10-01 至 2026-10-10。',
  published: '2026-10-09',
  updated: '2026-10-10',
  readTime: '參考',
  heroSpecs: [
    { label: '日期範圍', value: '2026-10-01 至 2026-10-10' },
    { label: '來源', value: 'SNKRDUNK 秋葉原每日公布' },
    { label: '貨幣', value: '日圓（¥）' },
    {
      label: '頁面性質',
      value: '日本市場參考，並非 Appaw Store 或 138 Arena 的收卡價格',
    },
  ],
  sections: [
    {
      id: 'browse-cards',
      title: '瀏覽卡牌',
      paragraphs: [
        '瀏覽頁每張卡片顯示最近一則公布的買取參考價，並非 Appaw Store 或 138 Arena 的收卡價格。[瀏覽卡牌](/guides/psa-market-buyback-snkr/browse/)。',
      ],
    },
    {
      id: 'grading-next',
      title: '若要提交鑑定',
      paragraphs: [
        '本頁任何數字都不是 Appaw Store 或 138 Arena 按這些價格收卡的報價。',
        '香港收藏者可預約 [PSA評級代送鑑定](/business/psa-grading/)。提交之後，可於 [查看現有進度](/business/psa-grading/track/) 查閱批次狀態。',
        '鑑定殼返回後的保存與換殼，請參閱 [鑑定卡防紫外線](/guides/uv-protection-graded-cards/) 與 [PSA 換殼指南](/guides/psa-reholder-guide/)。',
      ],
    },
  ],
  cta: {
    title: '將卡牌提交 PSA 鑑定',
    body: 'Appaw Store 並不按本頁的 SNKRDUNK 價格收卡。若要將卡牌送交 PSA 鑑定，請使用鑑定提交服務。等級由 PSA 決定。',
    primary: { label: 'PSA評級代送鑑定', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'psa-reholder-guide'],
  sources: [
    {
      label: 'SNKRDUNK 秋葉原官方帳號',
      href: 'https://x.com/snkrdunk_akiba',
    },
  ],
};

export default guide;
