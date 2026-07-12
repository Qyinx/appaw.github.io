import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'uv-protection-graded-cards',
  title: '鑑定卡防紫外線指南',
  badge: '保存',
  lead:
    '鑑定殼雖已封裝，全息閃卡仍有風險。香港潮濕夏季加上窗邊陽光，兩個季節即可令追卡失去光澤。',
  published: '2026-06-07',
  updated: '2026-07-12',
  readTime: '7 分鐘',
  heroImage: '/images/background/uv-protection-graded-cards.png',
  heroSpecs: [
    { label: '香港室內 RH（平均）', value: '70–80%' },
    { label: '鑑定卡防UV保護殼', value: '400 nm 以下 >95%' },
    { label: '最佳儲存濕度', value: '45–55%' },
    { label: '鑑定殼內層', value: '345 nm 以上阻隔極少' },
  ],
  sections: [
    {
      id: 'why-uv-matters',
      title: '鑑定殼已密封，紫外線仍可進入',
      paragraphs: [
        'PSA、CGC 鑑定殼採用透明塑料，能透過大部分可見光，有利展示，但無法阻擋紫外線。300–400 nm 波段的紫外線會破壞磚內寶可夢全息閃卡、運動卡及復古邊框的油墨和箔層。',
        '損傷會隨時間累積。朝南窗邊架上的鑑定卡，在外殼邊緣出現磨損前，卡面可能已出現色差。標明 400 nm 以下 >95% 阻隔的展示級壓克力或玻璃，比市售透明壓克力能大幅減少照射。',
        '畫框行業常以 Tru Vue / PPFA 標準為參考：300–380 nm 波段阻隔 97%，是博物館裝裱基準。展示級抗 UV 玻璃以 400 nm 以下 >95% 為常用目標，涵蓋全息閃卡與鍍鉻層的褪色波段。',
      ],
      specs: [
        { label: '風險波段', value: '300–400 nm（UVA / 近紫外線）' },
        { label: '鑑定卡防UV保護殼', value: '400 nm 以下 >95%' },
        { label: '普通壓克力', value: '345 nm 以上阻隔極少' },
      ],
      bridge: '阻擋紫外線之餘，香港濕度是另一項隱性威脅。',
    },
    {
      id: 'case-vs-room',
      title: '外殼玻璃與室內照明',
      paragraphs: [
        '將鑑定卡放入防紫外線外殼，等於多一層過濾。外層面板先承受照射，內層鑑定標籤和卡面收到的輻射更少。在桌面或卡展展位上，於 LED 與日光混合環境下輪換展示時尤其重要。',
        'LED 室內燈的紫外線少於直射陽光，但仍會產生熱量。即使放在防紫外線外殼內，亦應避免鑑定卡長時間直射陽光。同一位置每日曝曬，任何塑料都無法永久完全阻擋紫外線。',
      ],
    },
    {
      id: 'humidity-hk',
      title: '香港及沿海濕度',
      paragraphs: [
        '鑑定殼封住了卡，但不是防潮箱。多年後濕氣仍會緩慢滲透鑑定殼。香港室內相對濕度大部分時間約 70–80%。超過 60% RH 時，開架存放的鑑定卡可能出現標籤起霧或全息閃卡面波紋。',
        '潮濕城市的收藏家通常以 45–55% RH 電子乾燥櫃存放鑑定卡磚。此範圍保持卡紙穩定，又不會過乾令邊角反捲。穩定比追求完美數值重要：一週內 40% 到 75% 的波動，比穩定 52% 傷害更大。',
        '封閉盒內放矽膠乾燥劑對少量鑑定卡有效，但需定期再生。鑑定卡磚增多後，小型防潮箱（20–40 公升，可容納數十塊磚）是常見升級。',
      ],
      specs: [
        { label: '最佳儲存濕度', value: '45–55%' },
        { label: '風險閾值', value: '> 60% 持續一段長時間' },
        { label: '合適溫度範圍', value: '16–25 °C' },
      ],
    },
    {
      id: 'daily-habits',
      title: '日常可做的習慣',
      paragraphs: [
        '鑑定卡直立放在有襯墊的架子上，勿平放堆疊十層。重量加濕度變化會壓到最底層鑑定磚的外殼。',
        '用超細纖維布擦拭外保護殼，勿用紙巾，紙巾會在壓克力上留下細刮痕。',
        '郵寄鑑定卡時，用氣泡膜包裹外保護殼，再放入硬質郵袋。若包裹到達時內層鑑定殼已裂，防 UV 和濕度控制都失去意義。',
      ],
    },
  ],
  faq: [
    { q: '鑑定殼能擋住 UV 嗎？', a: '不能。鑑定殼主要通過可見光，340 nm 以上 UV 阻隔有限，長期日照仍會令全息閃卡與鍍鉻層褪色。' },
    { q: '展示盒應達什麼 UV 標準？', a: '400 nm 以下阻隔 >95% 為常用目標；博物館裝裱常參考 300–380 nm 97%。' },
    { q: '香港收藏者宜維持多少濕度？', a: '防潮箱 45–55% RH 較常見。香港室內常達 70–80%，長期恐致標籤霧化。' },
  ],
  midCta: {
    afterSectionId: 'why-uv-matters',
    title: '窗邊展示？加一層 >95% UV 玻璃',
    body: '外層保護殼先擋紫外線，內層標籤與全息閃卡收到的輻射更少。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡展示指南', href: '/guides/display-graded-cards/' },
  },
  cta: {
    title: '展示同時防曬',
    body: '鑑定卡保護殼採紫外線阻隔率 >95% 的玻璃，密封標準 35PT PSA / CGC 鑑定卡，適用於家庭或展覽展示。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '裸卡到受保護鑑定卡：送鑑後加裝保護殼', href: '/guides/grade-or-protect-first/' },
  },
  relatedSlugs: ['choose-35pt-slab-protector', 'grade-or-protect-first', 'display-graded-cards'],
  sources: [
    {
      label: 'Tru Vue 常見問題, PPFA 97% UV 標準（300–380 nm）',
      href: 'https://tru-vue.com/frequently-asked-questions/',
    },
    {
      label: 'ACRYLITE Gallery UV filtering（OP3）',
      href: 'https://www.acrylite.co/products/brands/acrylite-gallery/uv-filtering',
    },
    {
      label: 'ACRYLITE 擠出板透光率, 普通板與 OP3',
      href: 'https://www.acrylite.co/files/content/acrylite.co/00-global/documents/technical-product-briefs/ACRYLITE-Extruded-Light-Transmission-Reflectance-Information.pdf',
    },
  ],
};

export default guide;
