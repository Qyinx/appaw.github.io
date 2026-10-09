import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-market-buyback-snkr',
  title: 'SNKRDUNK 秋葉原買取參考價',
  badge: '市場參考',
  lead:
    '以下買取價摘錄自 SNKRDUNK 秋葉原官方帳號每日公布，僅供市場參考，並非 Appaw Store 或 138 Arena 的收卡價格。實際可否成交、最終金額以該店當日公告為準。',
  metaDescription:
    'SNKRDUNK 秋葉原每日買取價，僅供市場參考，並非 Appaw Store 或 138 Arena 的收卡價格。資料日期為 2026-10-01 至 2026-10-09。',
  published: '2026-10-09',
  updated: '2026-10-09',
  readTime: '參考表',
  notice: '而家以已過閘文字價為主；圖價／密佈 POP 未齊，陸續補。',
  heroSpecs: [
    { label: '日期範圍', value: '2026-10-01 至 2026-10-09' },
    { label: '來源', value: 'SNKRDUNK 秋葉原每日公布' },
    { label: '貨幣', value: '日圓（¥）' },
    {
      label: '頁面性質',
      value: '日本市場參考，並非 Appaw Store 或 138 Arena 的收卡價格',
    },
  ],
  sections: [
    {
      id: 'buyback-prices',
      title: '買取參考價',
      paragraphs: [
        '可按日期篩選，或以卡名、卡號搜尋。未標示 PSA 等級的列以破折號表示。來源連結會開啟該列對應的 SNKRDUNK 秋葉原原帖。',
      ],
      embed: 'snkr-buyback-prices',
    },
    {
      id: 'image-boards',
      title: '圖板與 POP',
      paragraphs: [
        '以下為同期圖板、密佈 POP，以及其他未寫入價格表的每日公布。圖片尚未逐格核對，因此這裡不列出任何金額。每列只有日期與原帖連結。',
      ],
      embed: 'snkr-buyback-announcements',
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
