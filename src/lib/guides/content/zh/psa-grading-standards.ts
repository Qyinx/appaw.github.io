import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-grading-standards',
  title: 'PSA 10 評級標準拆解：置中 55/45 門檻與門市初步評估',
  badge: '鑑定規格',
  lead:
    '一文看懂 PSA 10 與 9 分數巨大溢價！完整拆解 1–10 評級量表、55/45 置中門檻、Qualifier 扣分代碼與成交紀錄。附 138 Arena 門市現場卡況初步評估服務。',
  published: '2026-06-18',
  updated: '2026-08-08',
  readTime: '14 分鐘',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: '累計認證', value: '6500 萬件以上（PSA 官網）' },
    { label: 'PSA 10 正面', value: '55/45 或更佳' },
    { label: 'PSA 10 背面', value: '75/25 或更佳' },
    { label: 'Qualifier', value: 'OC · ST · PD · OF · MK · MC' },
  ],
  sections: [
    {
      id: 'what-is-psa',
      title: 'PSA 評級是什麼',
      paragraphs: [
        'PSA（Professional Sports Authenticator）為全球主要第三方卡牌鑑定機構之一。據 [PSA 官網 About 頁](https://www.psacard.com/info/about-psa) 所示，自 1991 年成立以來累計認證逾 6500 萬件藏品。此為官方案件宣傳數字，非即時統計。',
        '對收藏家與投資者而言，PSA 評級是買賣雙方共用的品相語言：數字越高，代表四角、邊緣、表面與置中越接近出廠狀態。',
      ],
      bulletGroups: [
        {
          label: '延伸閱讀',
          items: [
            {
              label: 'PSA 公司簡介（6500 萬件認證數字出處）',
              text: '[psacard.com/info/about-psa](https://www.psacard.com/info/about-psa)',
            },
            {
              label: 'PSA 官方評級標準',
              text: '[psacard.com/gradingstandards](https://www.psacard.com/gradingstandards)',
            },
            {
              label: 'PSA 10 置中門檻',
              text: '本站 [PSA 10 置中標準](/guides/psa-10-centering-requirements/)',
            },
          ],
        },
      ],
    },
    {
      id: 'grade-scale',
      title: 'PSA 官方 1–10 評分標準',
      paragraphs: [
        'PSA 以以下五項綜合評分，1 分為品相極差，10 分 Gem Mint 為近乎完美。下表為各等級官方狀態與核心外觀要求。',
      ],
      bulletGroups: [
        {
          label: '評分維度',
          items: [
            { label: '四角（Corners）', text: '尖銳度與磨損程度。' },
            { label: '邊緣（Edges）', text: '泛白、缺口與磨損。' },
            { label: '表面（Surface）', text: '刮痕、污漬、印刷瑕疵。' },
            { label: '置中（Centering）', text: '正背面影像對稱比例。' },
            { label: '印刷（Print）', text: '清晰度、色準與出廠缺陷。' },
          ],
        },
      ],
      table: {
        headers: ['分數 / 代碼', '鑑定狀態', '核心外觀要求'],
        rows: [
          [
            'PSA 10 (GM-MT)',
            'Gem Mint',
            '四角銳利、無污漬、印刷光澤佳；放大鏡下僅極微小瑕疵。正面置中 ≤55/45，背面 ≤75/25。',
          ],
          [
            'PSA 9 (MINT)',
            'Mint',
            '品相極佳，僅有非常微小且不明顯的出廠瑕疵或輕微對稱偏差。',
          ],
          [
            'PSA 8 (NM-MT)',
            'Near Mint-Mint',
            '視覺優異；仔細檢查可見微小角落磨損或輕微印刷瑕疵。',
          ],
          [
            'PSA 7 (NM)',
            'Near Mint',
            '表面可能有輕微磨損、邊緣泛白或微弱蠟痕，主體仍完好。',
          ],
          [
            'PSA 6 (EX-MT)',
            'Excellent-Mint',
            '瑕疵較明顯，如輕微表面刮痕或邊緣磨損。',
          ],
          [
            'PSA 5 (EX)',
            'Excellent',
            '角落略圓、光澤減退，或帶輕微印刷線。',
          ],
          [
            'PSA 4 (VG-EX)',
            'Very Good-Excellent',
            '磨損更明顯，可能有輕度折痕或表面污漬。',
          ],
          [
            'PSA 3 (VG)',
            'Very Good',
            '明顯折痕或擦傷，四角顯著磨損與變圓。',
          ],
          [
            'PSA 2 (GOOD)',
            'Good',
            '邊緣與表面嚴重磨損，光澤消失，帶較深折痕。',
          ],
          [
            'PSA 1.5 / 1 (FR/PR)',
            'Fair / Poor',
            '嚴重髒污、撕裂、塗鴉、人為破壞或受潮折損。',
          ],
        ],
      },
    },
    {
      id: 'qualifiers',
      title: 'PSA Qualifier 扣分標籤',
      paragraphs: [
        '部分卡片整體品相達到特定分數，但若存在單一重大瑕疵，評級員會加上 Qualifier（修飾標籤），例如標示為「PSA 8 OC」。在二手市場中，收藏家普遍偏好 NQ（No Qualifier，無限定標籤）評級，因為單一分數能更直觀地反映整體品相。',
      ],
      bulletGroups: [
        {
          label: '常見 Qualifier',
          items: [
            {
              label: 'OC（Off-Center）',
              text: '影像嚴重偏離中心，未達該分數應有的對稱比例。',
            },
            {
              label: 'ST（Staining）',
              text: '表面或背面有明顯污垢、液體殘留或包裝蠟油污染。',
            },
            {
              label: 'PD（Print Defect）',
              text: '原廠印刷瑕疵，如嚴重油墨污點、印刷線或暈染。',
            },
            {
              label: 'OF（Out of Focus）',
              text: '圖案印刷模糊、重影或焦距不準。',
            },
            {
              label: 'MK（Marks）',
              text: '人為標記：簽名、塗字，或以彩筆塗黑掩蓋白邊。',
            },
            {
              label: 'MC（Miscut）',
              text: '裁切嚴重失誤，邊緣不平或殘留相鄰卡片圖案。',
            },
            {
              label: 'NQ（No Qualifier）',
              text: '無上述標記，分數即最終品相解讀。',
            },
          ],
        },
      ],
      bridge: '熟悉量表等級與扣分標籤後，以下透過國際公開拍賣的指標紀錄，直觀呈現頂級品相在二次市場所引發的溢價效益。',
    },
    {
      id: 'record-sales',
      title: 'PSA 10 天價成交紀錄',
      paragraphs: [
        'PSA 10 Gem Mint 在拍賣市場常出現數量級溢價。以下三筆公開成交說明市場如何為完美品相定價。',
      ],
      bulletGroups: [
        {
          label: '公開成交紀錄',
          items: [
            {
              label: '1998 寶可夢插畫家皮卡超, PSA 10',
              text: '成交價 **527.5 萬美元**（約 385 萬英鎊）。YouTuber Logan Paul 於 2023 年私人交易購得；[Guinness World Records](https://www.guinnessworldrecords.com/news/2022/4/logan-paul-owns-5-275-million-pokemon-card-after-record-breaking-trade-697189) 載有這筆交易紀錄。',
            },
            {
              label: '1993 萬智牌 Alpha 黑蓮花, PSA 10',
              text: '2023 年拍賣以 **54 萬美元**（約 42.8 萬英鎊）成交。競技已禁用，但 PSA 10 仍是 TCG 史上最具象徵意義的高分標本之一。',
            },
            {
              label: '1998 日版銀卡皮卡超（第二屆錦標賽）PSA 10',
              text: '全球僅少數幾張的賽事獎勵卡，2023 年以 **44.4 萬美元**（約 34.73 萬英鎊）售出。寶可夢早期錦標賽卡的高分標本，在拍場上向來搶手。',
            },
          ],
        },
      ],
      callout:
        '天價案例多為全球僅數張的 PSA 10。一般熱門卡 PSA 10 與 PSA 9 的溢價差距仍可能達數倍，提交鑑定前先用量度工具篩選，見 [裸卡到受保護鑑定卡：提交鑑定後加裝保護殼](/guides/grade-or-protect-first/)。',
    },
    {
      id: 'bottom-line',
      title: '結語：先讀懂分數，再支付鑑定費用',
      paragraphs: [
        'PSA 1–10 評分標準與 Qualifier 修飾標籤是全球 TCG 交易市場的共通語言。在正式提交鑑定前，對照官方等級表與置中門檻進行預先篩選，能有效避開不必要的鑑定開支。購入高價鑑定卡時，亦應於官方數據庫查驗編號，確保珍藏安全。',
      ],
      bulletGroups: [
        {
          label: '下一步',
          items: [
            {
              label: '指南索引',
              text: '參閱更多 [收藏指南索引](/guides/)，全面掌握鑑定防護知識。',
            },
            {
              label: '香港代送鑑定',
              text: '可親臨銅鑼灣合作門市 138 Arena 面交評估卡況及提交鑑定。現場提供專業驗卡與清潔保養，協助降低扣分風險，詳見 [PSA 收藏卡代送鑑定](/business/psa-grading/)。',
            },
            {
              label: '置中篩選',
              text: '提交鑑定前可使用 [免費置中計算器](/tools/card-centering/) 精確比對正背面邊距。',
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: '拍賣前應該先送 PSA 評級嗎？',
      a: '多數情況建議先提交鑑定。PSA 標籤提供權威真偽與品相背書，消除買家疑慮，常能吸引更多競標者並抬高成交價。若裸卡品相明顯不足 PSA 8，或市值低於鑑定費用，則可先評估經濟性再決定。',
    },
    {
      q: '低分稀有卡還有市場價值嗎？',
      a: '有。稀有度常凌駕品相。2025 年初，一張品相極差、邊緣疑似以黑筆掩蓋泛白的萬智牌黑蓮花（無限版）仍在拍賣拍出約 5,200 英鎊。夠稀有的卡，低分也不容小覷。',
    },
    {
      q: 'PSA 鑑定費用用如何計算？',
      a: '依服務等級（Value、Regular、Express 等）與申報價值（Declared Value）而定；大量提交鑑定另有批量方案。最新價目與週期請查 psacard.com/services。',
    },
    {
      q: '收到評級後如何驗證鑑定殼真偽？',
      a: '每張 PSA 卡標籤印有認證編號。至 psacard.com/cert 輸入編號，核對照片、等級與卡片資訊是否與實物一致。建議搭配 UV 黑光燈、標籤世代與外殼觸感做多重交叉驗證。',
    },
    {
      q: '覺得分數被評低，可以重新鑑定嗎？',
      a: '可以提交 Regrade（重新評級），卡片再次進入評級流程。需注意可能升分、維持或降分。',
    },
  ],
  midCta: {
    afterSectionId: 'qualifiers',
    title: '支付鑑定費用前：先測量置中，再查驗假殼',
    body: '上傳裸卡或賣家照片比對 PSA 10 門檻；購入鑑定卡則交叉驗證證書與外殼。',
    primary: { label: '免費置中計算器', href: '/tools/card-centering/' },
    secondary: { label: 'PSA 鑑定殼真偽驗證指南', href: '/guides/identify-fake-psa-slabs/' },
  },
  cta: {
    title: '提交鑑定前先測量邊距',
    body: '上傳照片比對正背面置中是否符合 PSA 10 的 55/45 門檻，理性評估提交鑑定的價值。香港藏家亦可親臨 138 Arena 門市，由 Appaw 團隊提供專業驗卡與清潔保養服務，全力協助珍藏爭取最佳評級。',
    primary: { label: '免費置中計算器', href: '/tools/card-centering/' },
    secondary: { label: 'PSA 代送鑑定', href: '/business/psa-grading/' },
  },
  relatedSlugs: [
    'psa-10-centering-requirements',
    'grade-or-protect-first',
    'identify-fake-psa-slabs',
    'regrade-or-reholder',
  ],
  sources: [
    {
      label: 'PSA, About PSA（1991 年起累計認證逾 6500 萬件）',
      href: 'https://www.psacard.com/info/about-psa',
    },
    {
      label: 'PSA, 評級標準',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'Cullen of Surrey, PSA Grading Standards（參考）',
      href: 'https://cullensofsurrey.co.uk/blog/psa-grading-standards',
    },
    {
      label: 'Guinness World Records, Logan Paul Pikachu Illustrator 交易',
      href: 'https://www.guinnessworldrecords.com/news/2022/4/logan-paul-owns-5-275-million-pokemon-card-after-record-breaking-trade-697189',
    },
    {
      label: 'Polygon, Alpha Black Lotus PSA 10 拍賣',
      href: 'https://www.polygon.com/23644519/magic-the-gathering-black-lotus-auction-price-2023/',
    },
    {
      label: 'The Gamer, 銀卡皮卡超 44.4 萬美元成交',
      href: 'https://www.thegamer.com/pikachu-silver-trophy-card-444000-dollars-trading-card-game-second-highest-sale/',
    },
  ],
};

export default guide;
