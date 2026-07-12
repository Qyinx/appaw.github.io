import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'identify-fake-psa-slabs',
  title: 'PSA 鑑定殼真偽驗證指南',
  badge: '真偽',
  lead:
    '證書查詢通過不代表真品。高仿常盜用真實認證編號。以下五步實物檢查，才是證書查詢顯示「有效」之後該做的。',
  published: '2026-06-08',
  updated: '2026-07-12',
  readTime: '12 分鐘',
  heroImage: '/images/background/identify-fake-psa-slabs.png',
  heroSpecs: [
    { label: '核心原則', value: '多重交叉檢查，勿單信一步' },
    { label: '盜用編號', value: '查詢通過，實物仍可能假' },
    { label: 'UV 分水嶺', value: '編號 #43 後正面隱藏字' },
    { label: '第一步', value: '[psacard.com/cert](https://www.psacard.com/cert) 查證' },
  ],
  sections: [
    {
      id: 'why-cross-check',
      title: '為什麼不能只靠一種方法',
      paragraphs: [
        'PSA 鑑定卡有溢價，假標、假殼、盜號、仿查詢頁都會跟著來。2025–2026 仍有高仿流入。',
        '單一檢查皆不足以單獨定論。查詢通過只是第一關；高仿常盜用真實認證編號。下面五步從線上查到實物，須疊加使用。',
      ],
    },
    {
      id: 'cert-lookup',
      title: '第一步：線上認證查詢',
      paragraphs: [
        '每張 PSA 鑑定卡標籤都印有 Certification Number（認證編號）。',
        '前往 PSA 官方認證查詢頁：[psacard.com/cert](https://www.psacard.com/cert)。自行輸入網址，勿信任賣家截圖中的連結或 QR 碼。',
        '輸入編號後，確認查詢結果與實物完全匹配：卡片照片（含邊角磨損、瑕疵位置）、年份、球員/角色名稱、等級（Grade）、特殊標記（如 1st Edition、Rookie 等）。',
        '若網站回傳「找不到證書編號」，立即停止。若查詢顯示 1986 Fleer Jordan，你手上卻是 2023 寶可夢，代表編號被盜用。截圖保存查詢結果，付款前完成此步。',
      ],
      specs: [
        { label: '查證網址', value: '僅 [www.psacard.com/cert](https://www.psacard.com/cert)' },
        { label: '必對項目', value: '照片、年份、角色、等級、標記' },
        { label: '通過意味', value: '過第一關，仍需後續檢查' },
      ],
      bridge: '查詢能過，不代表實物對。第二步：十餘元的 UV 黑光燈，多數賣家不願讓買家測試。',
    },
    {
      id: 'uv-blacklight',
      title: '第二步：UV 黑光燈測試',
      paragraphs: [
        '黑光燈便宜，桌上放一支。常摸鑑定卡的話，值得備。',
      ],
      bulletGroups: [
        {
          label: '標籤正面',
          items: [
            {
              label: '編號 43 開頭前：',
              text: '在 UV 燈下無明顯隱藏字樣。',
            },
            {
              label: '編號 43 開頭後：',
              text: '特定區域會出現隱藏的「PSA」文字或圖案，發光均勻清晰。',
            },
          ],
        },
        {
          label: '標籤背面',
          items: [
            {
              label: '全時期：',
              text: '核心大 PSA Logo 周圍應均勻出現 6 個小型發光的 PSA Logo 圖案（編號 #43 前後皆同）。',
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
        '假貨常見特徵：發光位置錯誤、亮度異常、圖案模糊或完全不發光。',
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
        '真品 PSA 鑑定卡塑膠外殼規格固定，幾分鐘內摸完。',
        'PSA Logo 觸感：底部右側（或背面，依年份而定）有凸起 Logo，手指輕觸有立體感。假貨多為平印或觸感生硬。',
        '「21」標記：多數現代 PSA 鑑定卡底部左側有清晰「21」刻印。',
        '塑膠質感：真品堅硬、清澈、重量適中，邊緣焊接平整，無明顯裂縫或大面積霧面。內部卡片固定槽四角應為 90 度直角，非圓角。',
        '厚度與密封：真品邊緣較薄，手感沉穩。外殼易彎曲或有重新開封痕跡，需高度懷疑。',
      ],
      specs: [
        { label: 'Logo', value: '底部右側凸起立體' },
        { label: '「21」', value: '現代殼底部左側刻印' },
        { label: '內槽角', value: '90 度直角，非圓角' },
        { label: '接縫', value: '平整焊接，無膠痕' },
      ],
    },
    {
      id: 'label-magnification',
      title: '第四步：標籤細節放大檢查',
      paragraphs: [
        '標籤是假貨最易破綻之處。按編號段檢查有無全息貼、傾斜反光小字；10× 放大鏡或手機微距即可。',
      ],
      subsections: [
        {
          title: '2017 年前後：有無全息貼',
          paragraphs: [
            '編號 27xxxxxx 之前（約 2017 年前），PSA 用舊款標籤，外觀樸素、無複雜防偽。27xxxxxx 之後，標籤正面下方加入長方形 PSA 全息貼：',
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
            '27xxxxxx 之後標籤具備 LightHouse™ 雙色反射，視覺效果大致相若。PSA 母公司 2021 年初私有化、自納斯達克退市後，標籤內微型小字（Microtext）在 4xxxxxxx～5xxxxxxx 區間逐步由「NASDAQ : CLCT」改為「PSA」。兩個編號段內皆曾見 CLCT 與 PSA 並存，無固定切點，須放大實測，勿單靠證書編號推斷。',
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
        { label: '放大倍率', value: '10× 以上' },
        { label: '反光', value: '傾斜時雙色「LightHouse™」反射效果' },
        { label: '#27 分水嶺', value: '之後才有右下角全息貼紙' },
        { label: '#4xxxxxxx–5xxxxxxx 過渡期', value: '兩段皆見 CLCT 與 PSA 小字，須實測' },
        { label: '假貨徵象', value: '編號段與實測小字明顯不符' },
      ],
    },
    {
      id: 'advanced-buying',
      title: '第五步：進階驗證與購買注意',
      paragraphs: [
        '卡片本身品相：外殼正常，仍要查印刷清晰度、顏色，以及高分卡（尤其 PSA 10）品相是否合理。',
        '賣家警訊：不提供多角度影片、拒絕 UV 測試、不接受 PSA 複檢、價格遠低市價且說不清原因、付款後才給證書編號、催促當日匯款或加密貨幣且無買家保障。',
        '購買建議：優先有 PSA 認證服務的平台、信譽店家，或高價卡自行送 PSA 重鑑。首次交易走有爭議窗口的平台。',
        '已懷疑假貨：拍標籤、證書、接縫各角度並存聊天記錄；psacard.com 查證截圖不符結果；eBay、COMC 等平台立即申訴；必要時聯繫 PSA。',
      ],
    },
    {
      id: 'practice-habit',
      title: '五步疊加，風險才降',
      paragraphs: [
        '假貨技術持續演變。證書查詢、UV、觸感與結構檢查、賣家背景須疊加使用，風險才會降低。',
        '新手宜先以低價卡練熟流程，再處理高價卡。驗證通過後再加保護殼，順序不可顛倒。',
        '確認 PSA 鑑定卡真偽後，日常攜帶或展示前可加裝 [保護殼](/products/psa-protectors/)。標籤查證無誤後，外層硬殼可防刮、防 UV，轉售價值才守得住。',
      ],
    },
  ],
  faq: [
    {
      q: '證書查詢通過就代表真品嗎？',
      a: '不是。高仿常盜用被盜的認證編號，psacard.com/cert 仍可能顯示有效。還需 UV、標籤世代與外殼檢查。',
    },
    {
      q: '編號 #43 之後的 PSA 鑑定卡，UV 應有什麼反應？',
      a: '正面標籤黑光下應見隱藏 PSA 字樣或圖案；背面應見六個均勻微型標誌。',
    },
    {
      q: '可以相信賣家截圖裡的 QR code 嗎？',
      a: '不要。請自行輸入 psacard.com/cert。QR 與連結可能導向仿冒查詢頁。',
    },
    {
      q: '需要多少倍放大鏡看標籤小字？',
      a: '至少 10×。一般光線下傾斜標籤，依編號段讀 CLCT 或 PSA。',
    },
  ],
  midCta: {
    afterSectionId: 'uv-blacklight',
    title: '黑光燈通過？展示前先加殼',
    body: '查過的鑑定磚放窗邊、卡展易手，仍可能留下刮痕與 UV 褪色。上架或攜帶前加剛性外層保護殼。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定卡防紫外線指南', href: '/guides/uv-protection-graded-cards/' },
  },
  cta: {
    title: '先查證，再加殼',
    body: '五步交叉驗證通過後，硬質外殼展示或運輸時防刮、防 UV。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '裸卡到受保護鑑定卡：送鑑後加裝保護殼', href: '/guides/grade-or-protect-first/' },
  },
  relatedSlugs: ['regrade-or-reholder', 'grade-or-protect-first', 'psa-10-centering-requirements', 'choose-35pt-slab-protector'],
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
