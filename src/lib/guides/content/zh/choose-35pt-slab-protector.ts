import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'choose-35pt-slab-protector',
  title: '如何選擇鑑定卡保護殼',
  description:
    '對照鑑定卡外徑選購 35PT PSA卡殼：量度方法、合 fit 檢查表，以及選購 PSA卡保護殼時應避開的產品類型。',
  badge: 'Slab 硬件',
  lead:
    '卡展和店舖裡大多數 鑑定卡都落在35PT。合尺寸的保護殼能固定標籤位置、減少背包擠壓，展示時也不會左右晃動。',
  published: '2026-06-07',
  updated: '2026-06-07',
  readTime: '6 分鐘',
  heroImage: '/images/background/guide-35pt-slab-protector.png',
  heroSpecs: [
    { label: 'PSA 磚外徑', value: '3.16 × 5.32 × 0.27 in' },
    { label: '磚 profile 帶', value: '25–40 PT 級' },
    { label: 'Appaw 殼外徑', value: '8.7 × 14.2 × 0.98 cm' },
    { label: '適用規格', value: '標準 35PT PSA / CGC' },
  ],
  sections: [
    {
      id: 'what-35pt-means',
      title: '35PT 指的是什麼',
      paragraphs: [
        '商品頁的 PT 即千分之一英寸。PSA、CGC 將大部分現代 TCG 及運動卡放入 25–40 PT 厚度帶的鑑定殼。2023 年起，該帶使用的薄款外殼約 3.16 英寸寬、5.32 英寸高、0.27 英寸深。',
        '「35PT 保護殼」指外殼內腔按標準鑑定卡 profile 開模，並非保護殼本身只有 0.035 英寸厚。你要對的是鑑定卡的外長、外寬、外深，以及足夠的側壁剛性，令磚在殼內不會鬆動。',
      ],
      specs: [
        { label: '標準磚（2023+）', value: '80 × 135 × 6.9 mm 外徑' },
        { label: 'PSA 外徑（2023+ 薄款）', value: '3.16 × 5.32 × 0.27 in' },
        { label: '厚卡（>40 PT）', value: '舊款深殼' },
      ],
    },
    {
      id: 'measure-before-buy',
      title: '購買前先量',
      paragraphs: [
        '將鑑定卡平放，用直尺或游標卡尺量外寬、外高。比較厚度時，可將兩塊磚疊放：35PT 級 holder 明顯薄過厚卡或簽名卡的舊款深殼。',
        'CGC 與 PSA 標準磚尺寸接近，一款標明 35PT 的鋁合金殼通常兩者通用。若你收藏厚卡、簽名 subgrade 或非標尺寸，請先查該鑑定公司的 holder 規格，勿假設同一款殼可包全部。',
      ],
    },
    {
      id: 'fit-checklist',
      title: '避免退貨的適配檢查清單',
      paragraphs: [
        '磚應平貼底面，四角不翹起。標準 PSA 10 寶可夢鑑定卡不應需要泡棉墊片。正面必須完整看到 PSA / CGC 標籤。',
        '側壁要夠硬。薄膠殼會變形，衝擊直接傳到內層鑑定殼。鋁合金框架加平背板在本地卡展或寄送時較能分散受力。',
        '開合方式影響日常換卡。磁吸（N52 等級常見於高階殼）可快速更換展示卡，無需在螺絲位反覆磨損。',
      ],
      specs: [
        { label: '角位空隙', value: '每邊 < 0.5 mm' },
        { label: '標籤視野', value: 'PSA / CGC 全可見' },
        { label: '開合', value: '磁吸或螺絲（忌彈夾）' },
      ],
    },
  ],
  cta: {
    title: '為標準 35PT 鑑定卡而設',
    body: 'Appaw Store 磁吸鋁合金殼適用 PSA、CGC 35PT profile，>95% 抗 UV 玻璃及 N52 磁吸。',
    primary: { label: '查看 PSA卡殼及鑑定卡殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡防 UV', href: '/guides/uv-protection-graded-cards/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA — 25–40 PT 薄款鑑定殼（2023）',
      href: 'https://www.psacard.com/articles/articleview/10838/psa-unveils-thinner-card-holder-for-thicker-cards',
    },
    {
      label: 'PSA — 現行 holder 尺寸',
      href: 'https://www.psacard.com/info/cardspsagrades',
    },
    {
      label: 'CGC Cards — 鑑定等級與 holder 概覽',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
