import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'choose-35pt-slab-protector',
  title: '如何選擇 35PT 鑑定卡保護殼',
  badge: '鑑定卡硬體',
  lead:
    '背包中一塊未固定穩妥的鑑定卡磚，可能撞損價值 200 美元的標籤角。卡展上大部分 PSA/CGC 鑑定卡磚皆落在 35PT 厚度帶。對準尺寸規格，保護殼才有效。',
  published: '2026-06-07',
  updated: '2026-07-12',
  readTime: '6 分鐘',
  heroImage: '/images/background/guide-35pt-slab-protector.png',
  heroSpecs: [
    { label: 'PSA 磚外徑', value: '3.16 × 5.32 × 0.27 in' },
    { label: '磚規格帶', value: '25–40 PT 級' },
    { label: 'Appaw 殼外徑', value: '8.7 × 14.2 × 0.98 cm' },
    { label: '適用規格', value: '標準 35PT PSA / CGC' },
  ],
  sections: [
    {
      id: 'what-35pt-means',
      title: '35PT 指的是什麼',
      paragraphs: [
        '商品頁的 PT 即千分之一英寸。PSA、CGC 將大部分現代 TCG 及運動卡放入 25–40 PT 厚度帶的鑑定殼。2023 年起，該帶使用的薄款外殼約 3.16 英寸寬、5.32 英寸高、0.27 英寸深。',
        '「35PT 保護殼」指外殼內腔按標準鑑定卡尺寸規格開模，並非保護殼本身只有 0.035 英寸厚。須對準鑑定卡的外長、外寬、外深，以及足夠的側壁剛性，令鑑定卡磚在殼內不會鬆動。',
      ],
      specs: [
        { label: '標準磚（2023+）', value: '80 × 135 × 6.9 mm 外徑' },
        { label: 'PSA 外徑（2023+ 薄款）', value: '3.16 × 5.32 × 0.27 in' },
        { label: '厚卡（>40 PT）', value: '舊款深殼' },
      ],
      bridge: '確認厚度帶後，購買前先量度外徑。',
    },
    {
      id: 'measure-before-buy',
      title: '購買前先量度外徑',
      paragraphs: [
        '將鑑定卡平放，以直尺或游標卡尺量度外寬與外高。比較厚度時，可將兩塊鑑定卡磚疊放：35PT 級鑑定殼明顯薄於厚卡或簽名卡的舊款深殼。',
        'CGC 與 PSA 標準磚尺寸接近，一款標明 35PT、具剛性金屬邊框的保護殼通常兩者通用。若收藏厚卡、簽名分項評分或非標尺寸，請先查該鑑定公司的鑑定殼規格，勿假設同一款殼可適用全部。',
      ],
    },
    {
      id: 'fit-checklist',
      title: '避免退貨的適配檢查清單',
      paragraphs: [
        '鑑定卡磚應平貼底面，四角不翹起。標準 PSA 10 寶可夢鑑定卡不應需要泡棉墊片。正面必須完整看到 PSA / CGC 標籤。',
        '側壁要夠硬。薄膠殼會變形，衝擊直接傳到內層鑑定殼。金屬邊框加平背板在本地卡展或寄送時較能分散受力。',
        '開合方式影響日常換卡。磁吸（N52 等級常見於高階殼）可快速更換展示卡，無需在螺絲位反覆磨損。',
      ],
      specs: [
        { label: '角位空隙', value: '每邊 < 0.5 mm' },
        { label: '標籤視野', value: 'PSA / CGC 全可見' },
        { label: '開合', value: '磁吸或螺絲（忌彈夾）' },
      ],
    },
  ],
  faq: [
    { q: '商品頁的 35PT 是什麼意思？', a: '指外殼依標準 PSA/CGC 25–40 PT 厚度帶的鑑定磚外型設計，不是外殼本身厚 0.035 英寸。' },
    { q: '一個 35PT 殼能同時裝 PSA 和 CGC 嗎？', a: '標準 PSA 與 CGC 35PT 級鑑定磚尺寸接近，一個 35PT 規格硬殼通常可共用。' },
    { q: '鑑定磚在保護殼內應如何貼合？', a: '平放、四角不翹、標籤完整可見，標準 PSA 10 寶可夢磚每側間隙宜小於 0.5 mm。' },
  ],
  cta: {
    title: '為標準 35PT 鑑定卡而設',
    body: 'Appaw Store 磁吸防UV殼適用 PSA、CGC 35PT 尺寸規格，>95% 抗 UV 玻璃及 N52 磁吸。',
    primary: { label: '查看鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡防 UV', href: '/guides/uv-protection-graded-cards/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA, 25–40 PT 薄款鑑定殼（2023）',
      href: 'https://www.psacard.com/articles/articleview/10838/psa-unveils-thinner-card-holder-for-thicker-cards',
    },
    {
      label: 'PSA, 現行鑑定殼尺寸',
      href: 'https://www.psacard.com/info/cardspsagrades',
    },
    {
      label: 'CGC Cards, 鑑定等級與鑑定殼概覽',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
