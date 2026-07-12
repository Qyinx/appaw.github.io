import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: '裸卡到受保護鑑定卡：送鑑後加裝保護殼',
  badge: '流程',
  lead:
    '「先送鑑還是先加殼」並非二選一：裸卡無法加 35PT 保護殼，兩者屬不同時間點的連續步驟。路徑匯於鑑定卡加外層保護殼；裸卡送鑑門檻約 $25+，PSA 10 預期售價須達裸卡 2–4 倍。',
  published: '2026-06-07',
  updated: '2026-07-12',
  readTime: '9 分鐘',
  heroImage: '/images/background/grade-or-protect-first.png',
  heroSpecs: [
    { label: '送鑑門檻', value: '裸卡 $25+，預期 2–4× 溢價' },
    { label: '階段一', value: '裸卡：評估是否送鑑' },
    { label: '階段二', value: '鑑定卡：加外層保護殼' },
    { label: '完整路徑', value: '裸卡 → 送鑑 → 保護殼' },
  ],
  sections: [
    {
      id: 'why-both-matter',
      title: '送鑑與加殼不是二選一',
      paragraphs: [
        '搜尋「先送鑑還是先保護」常令人以為須在兩者間擇一。實務上兩者無衝突：裸卡階段決定是否付送鑑費；鑑定卡到手或購入後，下一步是加外層保護殼。同一張卡不會在同一時間點面臨此抉擇。',
        '常見疏漏是送鑑回來後未即時加殼，或把兩個獨立問題混為一談。路徑 A：自有裸卡，經送鑑取得鑑定卡；路徑 B：直接購入鑑定卡。兩條路徑於加保護殼後匯合。',
      ],
      bridge: '先談路徑 A 的裸卡經濟學。鑑定卡到手當日，進入階段二。',
    },
    {
      id: 'when-to-submit-raw',
      title: '路徑 A：裸卡何時值得送鑑',
      paragraphs: [
        '提交裸卡旨在提升市值，並非每張卡都值得付送鑑費。送錯則費用白付，或標籤分數拉低轉售價。',
        '值得送：品相接近 Gem Mint（PSA 10 範圍），裸卡行情 $25+，PSA 10 預期至少 2–4× 裸卡價；熱門新秀卡或稀缺 TCG（寶可夢、MTG 等）高分需求強。eBay Authenticity Guarantee 或 PSA 優惠期間，風險稍低。',
        '不宜送：裸卡低於 $20–25，送鑑費吃光溢價；邊角磨損、表面刮痕明顯，多半 PSA 8 以下；PSA 積壓嚴重或暫停服務；純收藏、無轉售打算。',
        '打包前：分幣護套與半硬卡夾；查 PSA Pop Report 看 PSA 10 數量；核算成本並選服務等級（Value、Express 等）；用免費 [卡牌置中工具](/tools/card-centering/) 量置中，見 [PSA 10 置中標準](/guides/psa-10-centering-requirements/)。',
      ],
      specs: [
        { label: 'PSA 10 正面 (2025+)', value: '55/45 或更佳' },
        { label: 'PSA 10 背面', value: '75/25 或更佳' },
        { label: '經濟門檻', value: '裸卡 $25+，2–4× 溢價才合算' },
        { label: '篩選項目', value: '置中 + 表面 + 邊角' },
      ],
      bridge: '鑑定卡取回後，工作轉入階段二：加外層保護。',
    },
    {
      id: 'when-to-protect-graded',
      title: '路徑 A/B 匯合：鑑定卡到手後加殼',
      paragraphs: [
        '鑑定殼封裝了卡面，塑料外殼仍會刮擦、霧化、龜裂，展示價與買家信心皆受影響。加殼是用已付的送鑑費守住標籤價值。',
        '鑑定卡到手或購入後，核對 [證書查詢](https://www.psacard.com/cert) 無誤，儘快加裝 [磁吸防UV鑑定卡保護殼](/products/psa-protectors/)。35PT 貼合 PSA/CGC 鑑定卡磚，剛性金屬邊框較軟質護套更能防刮、防擠；UV 前板減慢標籤與卡面褪色。',
        '高價 PSA 10 或稀有卡另需陰涼乾燥、恆溫恆濕存放。運送、卡展或長期保管時多層包裝並投保。',
        '外殼輕微磨損，考慮 [PSA Reholder（重新裝殼）](/guides/regrade-or-reholder/)。嚴重損壞或刻意追更高分，再選 Regrade（重新評級）。',
        '減少裸手觸摸；避開直射陽光、高溫與濕度劇變；定期檢查鑑定殼。原廠鑑定殼供封裝展示，非背包或卡展反覆易手的旅行殼，見 [鑑定卡防紫外線指南](/guides/uv-protection-graded-cards/) 與 [如何選擇 35PT 鑑定卡保護殼](/guides/choose-35pt-slab-protector/)。',
      ],
      specs: [
        { label: '應加外殼', value: '展示、攜帶、交易、寄送' },
        { label: '高價卡', value: '磁吸硬殼 + 穩定溫濕存放' },
        { label: '外殼規格', value: '標準 35PT PSA / CGC' },
      ],
    },
    {
      id: 'workflow-paths',
      title: '兩條路徑，同一終點',
      paragraphs: [
        '下表為逐步驟對照，非策略二選一。兩條路徑終點皆為：證書已核對、已加外層保護殼的鑑定卡。',
      ],
      table: {
        headers: ['步驟', '路徑 A：自有裸卡', '路徑 B：購入鑑定卡'],
        rows: [
          ['1', '量置中、評估品相與 $25+ 經濟性', '核對賣家照片與證書查詢'],
          ['2', '值得則送鑑並等待取回', '（無需送鑑）'],
          ['3', '鑑定卡到手，核對證書', '收貨即核對證書'],
          ['4', '加裝外層保護殼', '加裝外層保護殼'],
          ['5', '展示、交易或收納', '展示、交易或收納'],
        ],
      },
    },
    {
      id: 'practical-advice',
      title: '實務步驟清單',
      paragraphs: [
        '路徑 A：量置中 → 放大鏡檢查表面與邊角 → 經濟合理則送鑑 → 取回後於 [psacard.com/cert](https://www.psacard.com/cert) 核對證書 → 加 [外層保護殼](/products/psa-protectors/) → 展示、交易或寄送。',
        '路徑 B：核對賣家照片與 PSA 認證資料庫 → 收貨即加外殼 → 記錄購入價與證書編號。',
        '高價值卡：先做成本效益分析。香港藏家可到合作店舖 [138 Arena](/business/psa-grading/)（銅鑼灣謝斐道522號1/F）交卡及取件，代送 PSA 並提供進度查詢。送鑑費用、政策與週期以 [PSA 官網](https://www.psacard.com) 為準。',
        '新手：先以低中價位卡練熟送鑑與保護流程，再處理夢幻級卡牌。',
      ],
    },
    {
      id: 'bottom-line',
      title: '結語：兩條路，同一終點',
      paragraphs: [
        '兩條路徑終點相同：證書已核對、已加外殼的鑑定卡。差別只在於送鑑費由你支付，抑或向他人購下已完成標籤的鑑定卡。',
      ],
    },
  ],
  faq: [
    {
      q: '送鑑與加保護殼是什麼關係？',
      a: '先後順序，非二選一。手上有裸卡且經濟與品相合理時送鑑；鑑定卡到手或購入後應立即加外層保護殼。',
    },
    {
      q: '什麼時候值得付 PSA 送鑑費？',
      a: '裸卡約 25 美元以上，且 PSA 10 預期售價可達裸卡 2–4 倍，置中與表面達 PSA 10 水準。',
    },
    {
      q: '已鑑定還需要外殼嗎？',
      a: '展示、運送、轉售皆需要。鑑定殼易刮花褪色，UV 外殼可保護標籤。',
    },
  ],
  midCta: {
    afterSectionId: 'when-to-submit-raw',
    title: '裸卡在手？先量置中再送鑑',
    body: '付送鑑費前，用免費工具核對置中與邊距。鑑定卡已到手則直接選保護殼。',
    primary: { label: '免費置中計算器', href: '/tools/card-centering/' },
    secondary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
  },
  cta: {
    title: '鑑定卡到手，加裝外層保護殼',
    body: '保護已有或剛收到的鑑定卡。裸卡送鑑前，先用免費置中工具評估是否值得付費；香港藏家可到 138 Arena 交卡及取件。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA 代送鑑定', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'choose-35pt-slab-protector', 'uv-protection-graded-cards', 'regrade-or-reholder'],
  sources: [
    {
      label: 'PSA, 鑑定標準（Gem Mint 置中與品相）',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'PSA, 送鑑包裝指引',
      href: 'https://www.psacard.com/info/shipguide',
    },
    {
      label: 'PSA, 證書查詢',
      href: 'https://www.psacard.com/cert',
    },
    {
      label: 'CGC Cards, TCG 鑑定概覽',
      href: 'https://www.cgccards.com/card-grading/trading-card-grading/',
    },
  ],
};

export default guide;
