import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'display-graded-cards',
  title: '鑑定卡展示指南：安全佈置與保護設置',
  badge: '展示',
  lead:
    '轉售前買家先看鑑定殼外觀。一道刮痕或霧化標籤，議價往往先輸一半，卡面尚未受損亦然。展示即是保護，同時讓藏品可見。',
  published: '2026-06-09',
  updated: '2026-07-13',
  readTime: '9 分鐘',
  heroImage: '/images/background/display-graded-cards.png',
  heroSpecs: [
    { label: 'UV 目標', value: '400 nm 以下 >95%' },
    { label: '標準磚規格', value: '35PT PSA / CGC' },
    { label: '層架間距', value: '≥ 5 mm' },
    { label: '光線', value: '間接 LED，避開直射陽光' },
  ],
  sections: [
    {
      id: 'why-display-matters',
      title: '展示與保護是同一項工作',
      paragraphs: [
        '鑑定殼封裝了卡面，外殼仍易受刮痕、指紋、紫外線與灰塵影響。展示不當會令鑑定殼外觀變差，進而影響轉售議價。',
        '目標是讓 PSA 或 CGC 標籤與卡面清晰可見，同時保護內層鑑定殼免受刮擦、擠壓及紫外線累積褪色。展示有別於長期封存：須能穩放層架、方便拍照，又不損害鑑定卡磚。',
      ],
      bridge: '大量收藏從低成本收納開始；重點收藏的卡牌與高價單張再升級硬殼。',
    },
    {
      id: 'basic-display',
      title: '基礎展示：活頁夾、展示架、磁吸硬殼',
      paragraphs: [
        '適合新手與中小型收藏，成本較低、易於上手。',
        '鑑定卡護套 + 活頁夾：為每張鑑定卡套上透明護套，再放入三孔或四孔活頁夾。方便翻閱、攜帶、防塵防刮。選用帶軟質內襯的活頁夾，避免鑑定卡互相摩擦。',
        '單張展示架：亞克力或塑料展示架，適合書桌或展示櫃上直立、平放重點收藏的卡牌（如 PSA 10 新秀卡）。',
        '磁吸硬殼：將鑑定卡放入 [磁吸防UV鑑定卡保護殼](/products/psa-protectors/)，35PT 貼合 PSA/CGC，N52 磁吸、>95% UV 阻擋前板，邊角保護優於軟套，適合高價值鑑定卡書桌或層架陳列，無需在內層鑑定殼上鑽孔固定。',
      ],
      specs: [
        { label: '日常收納', value: '護套 + 活頁夾' },
        { label: '重點單張', value: '展示架或磁吸硬殼' },
        { label: '高價卡', value: '磁吸硬殼 + 間接光' },
      ],
    },
    {
      id: 'advanced-display',
      title: '進階與大型收藏展示',
      paragraphs: [
        '展示櫃與展示盒：多張鑑定卡展示盒具防塵與 UV 功能；木質或玻璃展示櫃適合客廳、收藏室，搭配低色溫、無紫外線的 LED 照明。',
        '抽屜式收納櫃適合大量收藏的分類管理。',
        '牆面展示：浮動相框或專用牆架，將重點鑑定卡垂直展示。務必遠離直射陽光窗口，使用抗 UV 玻璃或壓克力板；固定方式須承重每件 74–150 g，香港潮濕夏季後黏貼掛鉤容易失效。',
        '卡展或活動：使用可攜帶展示箱與多層包裝，準備備用護套；重要卡片額外投保。同一塊鑑定卡固定使用同一外層保護殼，展示照片與庫存記錄較易一致。',
        '層架展示：鑑定卡磚直立排列，外殼之間至少留 5 mm 間距。請勿將裸磚平放堆疊十層以上，重量與震動可能損害內殼接合位。',
      ],
    },
    {
      id: 'protection-habits',
      title: '展示時的保護重點',
      paragraphs: [
        '環境控制：陰涼乾燥存放，避免高溫、濕度劇變與直射陽光。香港住宅可配合除濕劑；詳見 [鑑定卡防紫外線指南](/guides/uv-protection-graded-cards/)。',
        'UV 防護：選具 UV 阻擋功能的護套、硬殼或展示箱（400 nm 以下 >95%），防止標籤與卡面褪色。窗邊直射陽光下，玻璃後的 UVA 仍會隨季節累積。',
        '日常維護：減少裸手觸摸，僅拿護套或外殼邊緣；以微濕軟布清潔外殼，請勿以紙巾擦拭塑料；若外殼出現輕微磨損，可考慮透過 [PSA Reholder](/guides/regrade-or-reholder/) 更換新殼。',
        '堆疊原則：避免長時間垂直重壓或裸磚平放堆疊，防止邊角變形。卡展 LED 燈下宜定期輪換展示的鑑定卡；外層保護殼可減緩紫外線，但長時間照射產生的熱量仍會影響鑑定卡。',
      ],
    },
    {
      id: 'tools-comparison',
      title: '展示方式與配件一覽',
      paragraphs: [
        '依收藏規模與卡片價值選擇展示層級，下表整理常見配置。',
      ],
      table: {
        headers: ['展示方式', '推薦配件', '適合規模', '保護等級'],
        rows: [
          ['日常收納', '護套 + 活頁夾', '中小型', '高'],
          ['重點單張展示', '磁吸硬殼 / 展示架', '任何規模', '極高'],
          ['大量陳列', '展示櫃 / 展示盒', '大型', '高'],
          ['牆面展示', '浮動相框 + UV 板', '重點單張', '中高'],
        ],
      },
    },
    {
      id: 'practical-tips',
      title: '實務建議',
      paragraphs: [
        '依卡片價值分級展示：高價值 PSA 10 或稀有卡使用 [磁吸鑑定卡保護殼](/products/psa-protectors/)；普通卡以活頁夾收納為主。',
        '美觀與實用並重：按系列、球星、年份分類。書桌展示時面板稍離螢幕反光區，全息閃卡拍照層次較佳。',
        '新手起步：從護套 + 活頁夾開始，重點收藏的卡牌逐步升級磁吸硬殼或展示櫃。購買前確認貼合度，標準 35PT PSA/CGC 外徑，詳見 [如何選擇 35PT 鑑定卡保護殼](/guides/choose-35pt-slab-protector/)。',
        '香港家居：寧可將單件保護殼掛於內牆，也不要放在下午有陽光的窗台。到門市試貼合時，可帶一塊鑑定卡磚，確認標籤與卡面是否完整露出。',
      ],
    },
    {
      id: 'bottom-line',
      title: '標籤清晰、外殼無新損傷',
      paragraphs: [
        '展示應增添賞玩樂趣，同時不增加鑑定殼損傷。若標籤仍清晰可讀、外殼無新刮痕，展示配置即屬有效。',
      ],
    },
  ],
  faq: [
    { q: '在家展示鑑定卡最好的方式是？', a: '大量收納用活頁護套；重點收藏的卡牌用 35PT 磁吸 UV 玻璃殼放桌面或層架。' },
    { q: '鑑定磚可以平放堆疊嗎？', a: '避免裸磚長時間平放堆高。直立排列，外殼間至少留 5 mm。' },
    { q: '窗邊光線會令鑑定磚褪色嗎？', a: '會，即使已加外殼。請用抗 UV 玻璃或壓克力，並避開直射陽光。' },
  ],
  midCta: {
    afterSectionId: 'basic-display',
    title: '重點卡牌上磁吸硬殼，其餘進活頁夾',
    body: '高價單張用 >95% UV 玻璃硬殼展示；大量收藏以活頁夾防刮防塵即可。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡防紫外線指南', href: '/guides/uv-protection-graded-cards/' },
  },
  cta: {
    title: '展示級鑑定卡保護',
    body: '磁吸 PSA 卡殼採 >95% 抗 UV 玻璃，適用標準 35PT PSA/CGC 鑑定磚，書桌或層架展示皆宜。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡防 UV 指南', href: '/guides/uv-protection-graded-cards/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'choose-35pt-slab-protector', 'grade-or-protect-first', 'regrade-or-reholder'],
  sources: [
    {
      label: 'PSA, 鑑定殼尺寸',
      href: 'https://www.psacard.com/info/cardspsagrades',
    },
    {
      label: 'Tru Vue 常見問題, 收藏品 UV 過濾',
      href: 'https://tru-vue.com/frequently-asked-questions/',
    },
  ],
};

export default guide;
