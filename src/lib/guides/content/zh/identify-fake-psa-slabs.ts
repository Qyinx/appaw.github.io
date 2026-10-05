import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'identify-fake-psa-slabs',
  title: 'PSA 鑑定殼真偽驗證指南',
  badge: '真偽',
  lead:
    '查到證書編號，只代表資料庫裡有這張卡，並不代表手上的殼就是那張。請自行開啟官方查詢頁，再配合黑光燈、外殼觸感與標籤放大檢查。任何一步對不上，都不宜付款。',
  published: '2026-06-08',
  updated: '2026-10-05',
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
        '高分鑑定卡存在價差，因此市場上出現偽造標籤、仿殼、盜用真編號，以至假查詢頁等手法。',
        '官方查詢通過只是第一關，因為編號可以被抄錄。黑光燈、外殼觸感與放大檢查應與查詢結果互相對照；任何一步對不上，都不宜付款。',
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
        '手持式波長 365nm 或 395nm 的 UV 黑光燈，是辨識假殼與偽造標籤成本較低且實用的物理檢測工具。對於經常進行二手交易或收藏高價鑑定卡的藏家而言，隨身配備一支黑光燈，有助即時過濾大部分粗劣仿品。',
        '下面影片裡的卡都是真卡，用來對照真品反應。沒有螢光反應的那一邊同樣是真卡，只是所屬世代不同。',
      ],
      subsections: [
        {
          title: '標籤正面',
          bulletGroups: [
            {
              label: '',
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
          ],
          videos: [
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-uv-reflection-front.mp4',
              caption:
                '片內的卡都是真卡。PSA 標籤正面 UV 反光對比（左：編號 43xxxxxx 後顯現隱藏文字 / 右：編號 43xxxxxx 前無反應）',
            },
          ],
        },
        {
          title: '標籤背面',
          bulletGroups: [
            {
              label: '',
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
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-uv-reflection-back.mp4',
              caption: '片內的卡都是真卡。PSA 標籤背面 UV 反光對比（左右均顯現 6 個微型 Logo）',
            },
          ],
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
        '請以手指觸摸外殼上的官方 Logo。真品 Logo 應為凸起浮雕；位置視世代而定，可能在底部右側，也可能在背面，背面出現並不構成問題。若為平印，或摸起來完全平坦，則應提高警覺。',
        '多數現代殼底部左側刻有「21」；舊殼不一定有此標記。因此，沒有「21」不能單獨作為假殼依據。',
        '內槽四角應為直角而非圓角；超音波接縫應平整，不應有膠水痕跡。若外殼偏軟、可彎曲、接縫有撬痕或大片霧化，則不宜付款。',
      ],
      specs: [
        { label: '官方 Logo 觸感', value: '底部右側或背面，視世代而定；應為凸起，平印則需提高警覺' },
        { label: '模具標記', value: '多數現代外殼底部左側刻有清晰「21」數字' },
        { label: '卡槽幾何結構', value: '內部固定卡片的內槽四角為 90 度直角，非圓角' },
        { label: '超音波焊接接縫', value: '壓克力邊緣接縫平整焊接，無撬痕或殘留膠痕' },
      ],
    },
    {
      id: 'label-magnification',
      title: '第四步：標籤細節放大檢查',
      paragraphs: [
        '官方標籤印刷細節是假貨最難完美複製的核心防偽環節。利用 10× 珠寶放大鏡或手機微距鏡頭，按證書編號段檢查全息防偽貼紙與微型印刷小字，有助發現印製瑕疵。',
        '下面影片裡的卡都是真卡。CLCT 和 PSA 都是真品標籤，不是真假對照。',
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
                      caption: '圖內的卡都是真卡。27xxxxxx 號前舊版標籤正面（正下方無長方形全息防偽貼紙）',
                    },
                    {
                      src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-back-old-label.jpg',
                      caption: '圖內的卡都是真卡。27xxxxxx 號前舊版標籤背面外觀',
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
              caption: '片內的卡都是真卡。4xxxxxxx 號前標籤正面反光情況（放大可見隱藏小字為 NASDAQ : CLCT）',
            },
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-back-old-version.mp4',
              caption: '片內的卡都是真卡。4xxxxxxx 號前標籤背面反光情況（放大可見隱藏小字為 NASDAQ : CLCT）',
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
              caption: '片內的卡都是真卡。5xxxxxxx 後標籤正面反光情況（放大可見隱藏小字為 PSA）',
            },
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-back-new-version.mp4',
              caption: '片內的卡都是真卡。5xxxxxxx 後標籤背面反光情況（放大可見隱藏小字為 PSA）',
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
        '買家安全交易建議：優先選擇提供第三方認證保證的平台或信譽良好的卡店。若手中持有高價裸卡並計劃提交鑑定，可前往 [138 Arena](/business/psa-grading/)（銅鑼灣謝斐道 522 號 1/F）當面辦理。138 Arena 負責場務及收費；Appaw Store 負責點收、初步檢視及評級代送鑑定跟進。進行大額交易時，務必選擇設有爭議申訴機制的平台。',
        '疑遭偽造的處理程序：拍攝標籤細節、證書資訊及接縫並保存對話紀錄；若官方數據庫記錄不符，請立即向交易平台申訴並聯繫 PSA 官方進行查證。',
      ],
    },
    {
      id: 'practice-habit',
      title: '付款前對一次',
      paragraphs: [
        '以下每一項都應核對相符；若有任何一項對不上，都不宜付款。',
        '建議先以普通卡練習這五個步驟，再處理高價卡交易。',
      ],
      bulletGroups: [
        {
          label: '',
          items: [
            {
              label: '證書：',
              text: '請自行開啟 psacard.com/cert，核對卡面、年份、名稱與分數是否相符。賣家提供的連結與 QR 碼不能代替官方查詢。',
            },
            {
              label: '黑光燈：',
              text: '編號 43 開頭之後，正面才有隱藏 PSA；背面各時期均為主 Logo 旁 6 個小 Logo。若出現錯位、過亮、模糊或完全沒有反應，應提高警覺。',
            },
            {
              label: '外殼：',
              text: 'Logo 應為凸起；位於底部右側或背面均屬正常，視世代而定。若為平印，則需提高警覺。內槽四角應為直角；接縫若大片霧化，亦不宜付款。',
            },
            {
              label: '標籤：',
              text: '請傾斜標籤並放大查看小字。4 與 5 開頭區間沒有固定切點，CLCT 與 PSA 都曾出現；應以手上實物為準，不要單憑編號推斷。',
            },
            {
              label: '對上之後：',
              text: '確認真偽後，再考慮加裝 [鑑定卡保護殼](/products/psa-protectors/)。應先查證，再加殼，順序不宜顛倒。',
            },
          ],
        },
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
      a: '建議使用至少 10× 倍率的珠寶放大鏡或手機微距拍攝模式。在自然光或強光下稍微傾斜標籤角度，可以辨識微型印刷小字是「NASDAQ : CLCT」還是「PSA」。',
    },
  ],
  midCta: {
    afterSectionId: 'advanced-buying',
    title: '五步都對上之後，再考慮加裝防護',
    body: '若五步驗證均相符，才較適合上架或攜帶；即使如此，壓克力外殼仍可能被刮花，加裝硬質保護殼有助減少刮痕。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡防紫外線指南', href: '/guides/uv-protection-graded-cards/' },
  },
  cta: {
    title: '先查證真偽，再加裝防護',
    body: '完成五步細節驗證後，建議為鑑定卡加裝可減少刮痕並阻隔紫外線的硬質保護殼。若手頭持有裸卡並計劃提交鑑定，香港藏家可先於網站預約，再到銅鑼灣謝斐道 522 號 1/F（138 Arena）當面辦理。138 Arena 負責場務及收費；Appaw Store 負責 PSA評級代送鑑定及跟進，並可調整最終應付金額。',
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
