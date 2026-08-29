import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'identify-fake-psa-slabs',
  title: 'PSA 鑑定殼真偽驗證指南',
  badge: '真偽',
  lead:
    '在二手市場購入 PSA 鑑定卡時，官方證書查詢通過並不完全等同於收到真品，高仿假卡磚經常盜用公開資料庫中的真實認證編號。藏家須以 psacard.com/cert 核對、UV 黑光燈、外殼觸感、全息標籤與微型小字世代（編號 27xxxxxx、43xxxxxx、5xxxxxxx）進行五步交叉驗證，以免誤購假 PSA 鑑定殼。',
  published: '2026-06-08',
  updated: '2026-08-30',
  readTime: '12 分鐘',
  heroImage: '/images/background/identify-fake-psa-slabs.png',
  heroSpecs: [
    { label: '核心原則', value: '結合多項特徵交叉驗證，切勿單憑單一指標定論' },
    { label: '數據庫防偽', value: '即便官方數據庫查詢有效，實物仍需防範編號被盜用' },
    { label: 'UV 螢光分水嶺', value: '認證編號 #43xxxxxx 之後的標籤方具備正面螢光隱藏字' },
    { label: '首要查驗程序', value: '前往 [psacard.com/cert](https://www.psacard.com/cert) 手動輸入編號核對' },
  ],
  sections: [
    {
      id: 'why-cross-check',
      title: '為什麼不能只靠一種方法',
      paragraphs: [
        '由於高分 PSA 鑑定卡具備顯著的市場溢價，市面上相繼出現偽造標籤、仿冒外殼、盜用真品編號甚至架設假查詢網頁等手段。現時二手市場仍不時有高仿假卡磚流傳。',
        '單一維度的防偽特徵均不足以單獨定論。線上查詢通過僅代表第一關驗證，因為造假者能輕易複製真實號碼。藏家必須將線上數據查詢與實物細節測試疊加比對，從多個角度綜合判斷。',
      ],
    },
    {
      id: 'cert-lookup',
      title: '第一步：線上認證查詢',
      paragraphs: [
        '每張 PSA 官方鑑定卡標籤上，均印有獨一無二的認證編號（Certification Number）。',
        '請直接前往 PSA 官方認證查詢網頁：[psacard.com/cert](https://www.psacard.com/cert)。建議自行於瀏覽器輸入網址，切勿盲目信任賣家截圖中的超連結或 QR 碼，以免導向偽造的查詢網站。',
        '輸入編號後，必須仔細核對查詢結果與實物是否完全吻合，包括卡牌照片（對照卡面邊角微小瑕疵與列印特徵）、年份、角色名稱、評級分數（Grade）及特殊標記（如 1st Edition、Rookie 等）。',
        '若網站顯示「找不到證書編號」，應立即中止交易。若查詢結果顯示為其他卡款（例如查詢結果為 1986 年籃球卡，實物卻是寶可夢卡），即代表該認證編號已被盜用。請截圖保存官方記錄以作憑證。',
      ],
      specs: [
        { label: '官方查證網址', value: '僅限官方 [www.psacard.com/cert](https://www.psacard.com/cert) 入口' },
        { label: '必須核對項目', value: '卡牌照片、年份、角色名稱、評級分數與特殊標記' },
        { label: '查證結果定義', value: '數據相符僅代表完成第一關，仍需進行實物細節檢測' },
      ],
      bridge: '官方數據庫記錄相符僅代表完成第一關；要確認實物外殼與標籤未被替換，下一步需運用 UV 黑光燈檢測防偽墨水反應。',
    },
    {
      id: 'uv-blacklight',
      title: '第二步：UV 黑光燈測試',
      paragraphs: [
        '手持式波長 365nm 或 395nm 的 UV 黑光燈，是辨識假殼與偽造標籤成本最低且極為有效的物理檢測工具。對於經常進行二手交易或收藏高價鑑定卡的藏家而言，隨身配備一支黑光燈能即時過濾絕大多數低劣高仿。',
      ],
      bulletGroups: [
        {
          label: '標籤正面',
          items: [
            {
              label: '編號 43 開頭前：',
              text: '在 UV 燈照射下無明顯螢光隱藏字樣。',
            },
            {
              label: '編號 43 開頭後：',
              text: '特定區域會顯現螢光隱藏的「PSA」字樣或官方圖案，發光均勻且邊緣清晰。',
            },
          ],
        },
        {
          label: '標籤背面',
          items: [
            {
              label: '全時期：',
              text: '核心大 PSA Logo 周圍應均勻出現 6 個小型發光的 PSA Logo 圖案（編號 #43 前後版本皆然）。',
            },
          ],
        },
      ],
      videos: [
        {
          src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-uv-reflection-front.mp4',
          caption:
            'PSA 標籤正面 UV 反光對比（左：編號 43xxxxxx 後顯現隱藏文字 / 右：編號 43xxxxxx 前無反應）',
        },
        {
          src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-uv-reflection-back.mp4',
          caption: 'PSA 標籤背面 UV 反光對比（左右均顯現 6 個微型 Logo）',
        },
      ],
      callout:
        '假貨常見特徵：發光位置錯位、螢光亮度異常過亮或過暗、圖案邊緣模糊甚至對 UV 燈完全無反應。',
      specs: [
        { label: '正面（#43 前）', value: 'UV 下無隱藏字樣' },
        { label: '正面（#43 後）', value: '隱藏 PSA 圖案，均勻發光' },
        { label: '背面（全時期）', value: '主 Logo 周圍 6 個小 Logo' },
        { label: '假貨徵象', value: '錯位、過亮/過暗、模糊或無反應' },
      ],
    },
    {
      id: 'holder-physical',
      title: '第三步：外殼物理與觸感',
      paragraphs: [
        '真品 PSA 壓克力鑑定外殼具備極嚴格的專利開模規格與超音波焊接工藝。透過檢視外殼結構與立體觸感，能在數分鐘內辨識出外殼是否屬真品或曾被二次拆封。',
        '首先，真品外殼底部右側（或背面，視標籤世代而定）設有清晰的凸起 PSA Logo，手指撫過能感受到細緻的立體雕刻質感，假貨則多為平印或觸感生硬。多數現代 PSA 鑑定殼底部左側亦刻有清晰的「21」數字標記。',
        '其次，真品採用高清澈度的硬質壓克力，邊緣焊接超音波接縫極為平整且不含膠水痕跡；內部固定卡片的內槽四角應呈完美的 90 度直角，而非圓角。若外殼壓克力質地偏軟、容易彎曲，或超音波接縫出現不規則撬痕與大面積霧化，均屬高度可疑的撬殼重封特徵。',
      ],
      specs: [
        { label: '官方 Logo 觸感', value: '外殼底部右側設有立體凸起的 PSA Logo' },
        { label: '模具標記', value: '多數現代外殼底部左側刻有清晰「21」數字' },
        { label: '卡槽幾何結構', value: '內部固定卡片的內槽四角為 90 度直角，非圓角' },
        { label: '超音波焊接接縫', value: '壓克力邊緣接縫平整焊接，無撬痕或殘留膠痕' },
      ],
    },
    {
      id: 'label-magnification',
      title: '第四步：標籤細節放大檢查',
      paragraphs: [
        '官方標籤印刷細節是假貨最難完美複製的核心防偽環節。利用 10× 珠寶放大鏡或手機微距鏡頭，按證書編號段檢查全息防偽貼紙與微型印刷小字，能輕易揪出印製瑕疵。',
      ],
      subsections: [
        {
          title: '2017 年前後：有無全息貼',
          paragraphs: [
            '在證書編號 27xxxxxx 之前（約 2017 年以前），PSA 採用舊版標準標籤，排版較為簡樸且不具備複雜的全息防偽貼紙。自 27xxxxxx 之後，PSA 官方於標籤正面下方正式引進長方形全息防偽貼紙（Hologram Logo），並全面升級字體與防偽排版。',
          ],
          bulletGroups: [
            {
              label: '',
              items: [
                {
                  label: '編號 27xxxxxx 之前（舊版樣式）：',
                  text: '標籤正面「沒有」右下角的全息防偽貼紙，背面也沒有任何防偽設計。字體與排版較為傳統。',
                  images: [
                    {
                      src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-front-old-label.jpg',
                      caption: '27xxxxxx 號前舊版標籤正面（正下方無長方形全息防偽貼紙）',
                    },
                    {
                      src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-back-old-label.jpg',
                      caption: '27xxxxxx 號前舊版標籤背面外觀',
                    },
                  ],
                },
                {
                  label: '編號 27xxxxxx 之後（現行樣式基礎）：',
                  text: '標籤正面下方加入長方形 PSA 全息防偽標籤（Hologram Logo），字體重新設計，線條更銳利。',
                },
              ],
            },
          ],
        },
        {
          title: '2021 退市過渡期：CLCT → PSA 小字',
          paragraphs: [
            '27xxxxxx 之後標籤具備 LightHouse™ 雙色反射，視覺效果大致相若。PSA 母公司 2021 年初私有化、自納斯達克退市後，標籤內微型小字（Microtext）在 4xxxxxxx～5xxxxxxx 區間逐步由「NASDAQ : CLCT」改為「PSA」。兩個編號段內皆曾見 CLCT 與 PSA 並存，無固定切點，須放大實測，請勿單憑證書編號推斷。',
          ],
        },
        {
          title: '標籤全息圖案與隱藏小字（一般光線下傾斜觀察）',
          level: 4,
        },
        {
          title: '編號 4xxxxxxx 之前（27xxxxxx～39xxxxxx）',
          level: 4,
          paragraphs: [
            '具備 LightHouse™ 雙色反射。特定角度轉動標籤，防偽圖案內微型隱藏字體一律為「NASDAQ : CLCT」（退市前母公司股票代號）。',
          ],
          videos: [
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-front-old-version.mp4',
              caption: '4xxxxxxx 號前標籤正面反光情況（放大可見隱藏小字為 NASDAQ : CLCT）',
            },
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-back-old-version.mp4',
              caption: '4xxxxxxx 號前標籤背面反光情況（放大可見隱藏小字為 NASDAQ : CLCT）',
            },
          ],
        },
        {
          title: '編號 4xxxxxxx～5xxxxxxx（過渡期）',
          level: 4,
          paragraphs: [
            '退市改組期間，PSA 逐步汰換標籤耗材。4xxxxxxx 與 5xxxxxxx 兩段內皆曾實測到 CLCT 與 PSA 微型小字並存，編號較前段者較可能仍為 CLCT，較後段者較可能已改 PSA，但無固定切點。買此區間的 PSA 鑑定卡，須傾斜標籤、放大確認實際小字。',
          ],
        },
        {
          title: '編號 6xxxxxxx 起（過渡期結束後）',
          level: 4,
          paragraphs: [
            '過渡期結束後，全息圖案內微型隱藏字體已全面改為「PSA」。5xxxxxxx 末段仍可能見 CLCT，以實測為準。',
          ],
          videos: [
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-front-new-version.mp4',
              caption: '5xxxxxxx 後標籤正面反光情況（放大可見隱藏小字為 PSA）',
            },
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-back-new-version.mp4',
              caption: '5xxxxxxx 後標籤背面反光情況（放大可見隱藏小字為 PSA）',
            },
          ],
        },
      ],
      specs: [
        { label: '放大倍率', value: '建議 10× 以上放大鏡或手機微距' },
        { label: '雙色反光', value: '傾斜觀察時顯現 LightHouse™ 雙色反射' },
        { label: '編號 #27 分水嶺', value: '此編號之後方具備長方形全息防偽貼紙' },
        { label: '編號 #4xxxxxxx–5xxxxxxx', value: '此區間 CLCT 與 PSA 兩種小字並存，須實測' },
        { label: '假貨特徵', value: '標籤微型小字與認證編號世代不符' },
      ],
    },
    {
      id: 'advanced-buying',
      title: '第五步：進階驗證與購買注意',
      paragraphs: [
        '核對卡牌本體品相：外殼結構正常之餘，仍需獨立檢查卡面印刷清晰度、色澤光彩，以及高分數（特別是 PSA 10）的物理品相是否合理。',
        '識別賣家可疑警訊：若賣家拒絕提供多角度高清影片、拒絕 UV 測試、不接受 PSA 官方複檢，或售價遠低於市場行情且無法提供合理解釋，均屬於高風險警訊。',
        '買家安全交易建議：優先選擇提供第三方認證保證的平台或信譽良好的卡店。若手中持有高價裸卡並計劃提交鑑定，可前往 [138 Arena](/business/psa-grading/)（合作場地）當面辦理。138 Arena 負責場務及收費；Appaw Store 負責點收、初步檢視及評級代送鑑定跟進。進行大額交易時，務必選擇設有爭議申訴機制的平台。',
        '疑遭偽造的處理程序：拍攝標籤細節、證書資訊及接縫並保存對話紀錄；若官方數據庫記錄不符，請立即向交易平台申訴並聯繫 PSA 官方進行查證。',
      ],
    },
    {
      id: 'practice-habit',
      title: '五步疊加，風險才降',
      paragraphs: [
        '偽造技術不斷演變，單一防偽特徵難免被破譯。唯有將官方數據庫查詢、UV 黑光燈測試、外殼物理觸感、標籤放大檢查與賣家背景進行多重疊加驗證，方能將交易風險降至最低。',
        '初入門藏家建議先以常規卡牌練習驗證流程，熟練後再處理高價值珍藏。驗證確認真偽無誤後，再加裝外層防護硬殼，順序切勿顛倒。',
        '確認 PSA 鑑定卡為真品後，於日常攜帶或陳列時加裝 [鑑定卡保護殼](/products/psa-protectors/)，能防止壓克力外殼受損並阻隔紫外線，全方位守護珍藏的市場價值。',
      ],
    },
  ],
  faq: [
    {
      q: '證書查詢通過就代表真品嗎？',
      a: '並非如此。近年高仿假卡磚經常直接複製官方資料庫中的真實認證編號，因此即使 psacard.com/cert 顯示「有效」，亦不代表實物為真品。藏家仍需結合 UV 黑光燈測試、標籤世代細節與壓克力外殼開模特徵進行多重交叉比對。',
    },
    {
      q: '編號 #43 之後的 PSA 鑑定卡，UV 燈下應有何反應？',
      a: '在 365nm 或 395nm UV 黑光燈照射下，編號 43xxxxxx 之後的正面標籤特定區域會顯現出發光均勻清晰的隱藏「PSA」螢光圖案；而背面標籤則會在核心 Logo 周圍均勻顯現 6 個微型發光的 PSA 螢光 Logo。',
    },
    {
      q: '可以信任賣家截圖裡的 QR code 或網址連結嗎？',
      a: '切勿盲目信任。造假者可能架設仿冒的查詢頁面並透過 QR 碼引導買家。建議自行於瀏覽器網址列輸入 psacard.com/cert 並手動輸入認證編號查核。',
    },
    {
      q: '需要多少倍率的放大鏡方能清晰檢視標籤微型小字？',
      a: '建議使用至少 10× 倍率的珠寶放大鏡或手機微距拍攝模式。在自然光或強光下稍微傾斜標籤角度，即可清楚辨識微型印刷小字為「NASDAQ : CLCT」還是「PSA」。',
    },
  ],
  midCta: {
    afterSectionId: 'uv-blacklight',
    title: '黑光燈驗證通過？上架或展示前加裝防護',
    body: '通過檢測的鑑定卡在日常攜帶、交流或擺放陳列時，壓克力外殼仍可能因摩擦留下刮痕。上架或攜帶前加裝剛性防護硬殼，能有效延長藏品美觀。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡防紫外線指南', href: '/guides/uv-protection-graded-cards/' },
  },
  cta: {
    title: '先查證真偽，再加裝防護',
    body: '完成五步細節驗證後，建議為鑑定卡加裝可減少刮痕並阻隔紫外線的硬質保護殼。若手頭持有裸卡並計劃提交鑑定，香港藏家可先於網站預約，再到銅鑼灣 138 Arena 當面辦理。138 Arena 負責場務及收費；Appaw Store 負責 PSA評級代送鑑定及跟進，並可調整最終應付金額。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA評級代送鑑定', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['psa-reholder-guide', 'grade-or-protect-first', 'psa-10-centering-requirements', 'choose-35pt-slab-protector'],
  sources: [
    {
      label: 'PSA, 證書查詢',
      href: 'https://www.psacard.com/cert',
    },
    {
      label: 'PSA, 評級標準',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'Card Codex, How to Identify Fake PSA Slabs（參考）',
      href: 'https://cardcodex.com/blog/how-to-identify-fake-psa-slabs/',
    },
  ],
};

export default guide;
