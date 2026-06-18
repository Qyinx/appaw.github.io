import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'display-graded-cards',
  title: '鑑定卡展示指南：如何安全又美觀地陳列你的鑑定卡',
  badge: '展示',
  lead:
    '卡片評級完成後，下一步就是如何展示。好的展示能提升藏品的價值；糟糕的展示則會刮傷卡片套、使標籤褪色，並降低轉售價值。展示和保護是同一回事。',
  published: '2026-06-09',
  updated: '2026-06-17',
  readTime: '9 分鐘',
  heroImage: '/images/background/display-graded-cards.png',
  heroSpecs: [
    { label: '標準磚規格', value: '35PT PSA / CGC' },
    { label: 'UV 目標', value: '400 nm 以下 >95%' },
    { label: '層架間距', value: '≥ 5 mm' },
    { label: '光線', value: '間接 LED，避開直射陽光' },
  ],
  sections: [
    {
      id: 'why-display-matters',
      title: '為什麼展示需要特別注意',
      paragraphs: [
        '鑑定卡雖有塑封保護，外殼仍易受刮痕、指紋、陽光 UV 與灰塵影響。錯誤展示可能讓 Slab 外觀變差，進而影響轉售價值。',
        '目標是讓 PSA 或 CGC 標籤與卡面清晰可見，同時保護內層鑑定殼免受刮痕、擠壓及紫外線累積褪色。展示用途有別於長期封存——你需要能穩放層架、方便拍照，又不損害磚體。',
      ],
    },
    {
      id: 'basic-display',
      title: '基礎展示方式',
      paragraphs: [
        '適合新手與中小型收藏，成本低、易上手。',
        'Slab 護套 + 活頁夾（Binder）：為每張 Slab 套上透明 Slab Sleeve，再放入 3 孔或 4 孔活頁夾。方便翻閱、攜帶、防刮防塵。選擇帶軟質內襯的優質 Binder，避免 Slab 互相摩擦。',
        '單張展示架（Stand）：亞克力或塑料 Slab 展示架，適合書桌或展示櫃上直立、平放重點卡（如 PSA 10 Rookie）。',
        '磁吸硬殼：將 Slab 放入 [磁吸鋁合金鑑定卡保護殼](/products/psa-protectors/)——35PT 貼合 PSA/CGC，N52 磁吸、>95% UV 防護前板，邊角保護優於軟套，具藝廊級展示效果。適合高價值鑑定卡書桌或層架陳列，無需在內層鑑定殼上鑽孔固定。',
      ],
      specs: [
        { label: '日常收納', value: 'Slab Sleeve + Binder' },
        { label: '重點單張', value: '展示架或磁吸硬殼' },
        { label: '高價卡', value: '磁吸硬殼 + 間接光' },
      ],
    },
    {
      id: 'advanced-display',
      title: '進階與大型收藏展示',
      paragraphs: [
        '展示櫃與展示盒：專用 Slab Display Case 可存多張磚，具防塵與 UV 功能；木質或玻璃展示櫃適合客廳、收藏室，搭配低色溫、無 UV 的 LED 照明；抽屜式收納櫃適合大量收藏、分類管理。',
        '牆面展示：浮動相框（Floating Frame）或專用 Slab 牆架，將重點鑑定卡垂直展示。務必遠離陽光直射窗口，使用 UV 防護玻璃或亞克力板；僅用承重符合每件 74–150 g 的固定方式，香港潮濕夏季後黏貼掛鉤容易失效。',
        '卡展或活動：使用可攜帶展示箱 + 多層包裝，準備備用護套；重要卡片額外投保。同一塊磚固定使用同一外層保護殼，展示照片與庫存記錄較易一致。',
        '層架展示：鑑定卡磚直立排列，殼與殼之間至少留 5 mm 間距。切勿裸磚平放堆疊十層以上——重量加震動可能損害內殼接合位。',
      ],
    },
    {
      id: 'protection-habits',
      title: '展示時的保護重點',
      paragraphs: [
        '環境控制：陰涼乾燥存放，避免高溫、濕度劇變與陽光直射。香港單位可配合除濕劑；詳見 [防 UV 保存指南](/guides/uv-protection-graded-cards/)。',
        'UV 防護：選具 UV 阻擋功能的護套、硬殼或展示箱（400 nm 以下 >95%），防止標籤與卡面褪色。窗邊直射陽光下，玻璃後的 UVA 仍會隨季節累積。',
        '日常維護：減少裸手觸摸，僅拿護套或外殼邊緣；用微濕軟布清潔外殼，勿用紙巾擦塑料；輕微磨損考慮 [PSA Reholder](/guides/regrade-or-reholder/)。',
        '堆疊原則：避免長時間垂直重壓或裸磚平放堆疊，防止邊角變形。長時間展示時應不時轉換LED燈下展示的鑑卡，加裝鑑定卡保護殼可以大幅度減緩紫外線照射，但長時間照射帶來的熱量會影響鑑定卡。'
      ],
    },
    {
      id: 'tools-comparison',
      title: '展示方式與配件一覽',
      paragraphs: [
        '依收藏規模與卡片價值選擇展示層級——下表整理常見配置。',
      ],
      table: {
        headers: ['展示方式', '推薦配件', '適合規模', '保護等級'],
        rows: [
          ['日常收納', 'Slab Sleeve + Binder', '中小型', '高'],
          ['單張重點展示', '磁吸硬殼 / 展示架', '任何規模', '極高'],
          ['大量陳列', '展示櫃 / Display Case', '大型', '高'],
          ['牆面展示', 'Floating Frame + UV 板', '重點卡', '中高'],
        ],
      },
    },
    {
      id: 'practical-tips',
      title: '實務建議',
      paragraphs: [
        '依卡片價值分級展示：高價值 PSA 10 或稀有卡使用 [磁吸鑑定卡保護殼](/products/psa-protectors/) 等最高等級保護展示；普通卡以 Binder 收納為主。',
        '美觀與實用平衡：按系列、球星、年份分類，讓收藏更有系統。書桌展示時面板稍離螢幕反光區，全像卡拍照層次較佳。',
        '新手起步：從 Slab Sleeve + Binder 開始，重點卡逐步升級磁吸硬殼或展示櫃。購買前確認 fit——標準 35PT PSA/CGC 外徑，詳見 [35PT 保護殼選購](/guides/choose-35pt-slab-protector/)。',
        '香港家居：寧可將單件保護殼掛於內牆，也不要放在下午有陽光的窗台。到門市試 fit 時，可帶一塊磚測試標籤與卡面是否完整露出。',
      ],
    },
    {
      id: 'bottom-line',
      title: '結語：看起來好，也要留得住',
      paragraphs: [
        '展示 PSA 鑑定卡是展現收藏成果，也是保護價值的重要環節。選擇適合空間與預算的方式，結合正確保護習慣，才能讓鑑定卡長久保持最佳狀態。',
        '無論剛開始收集或已有豐富收藏，安全美觀的展示都能提升收藏樂趣——前提是標籤清晰可讀、外殼無新增損傷。',
      ],
    },
  ],
  cta: {
    title: '展示級鑑定卡保護',
    body: '磁吸 PSA 卡殼採 >95% 抗 UV 玻璃，適用標準 35PT PSA/CGC 鑑定磚，書桌或層架展示皆宜。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡防 UV 指南', href: '/guides/uv-protection-graded-cards/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'choose-35pt-slab-protector', 'grade-or-protect-first', 'regrade-or-reholder'],
  sources: [
    {
      label: 'PSA — 鑑定殼尺寸',
      href: 'https://www.psacard.com/info/cardspsagrades',
    },
    {
      label: 'Tru Vue 常見問題 — 收藏品 UV 過濾',
      href: 'https://tru-vue.com/frequently-asked-questions/',
    },
  ],
};

export default guide;
