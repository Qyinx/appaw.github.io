import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'identify-fake-psa-slabs',
  title: '如何辨識 PSA 真偽鑑定卡',
  badge: '真偽',
  lead:
    'PSA 鑑定殼是保值與品相的代名詞，高溢價也招來假標籤、假外殼、偽造查詢頁。本指南以證書編號對照 UV 反應、標籤全息世代與外殼觸感，五步交叉驗證——高價鑑定卡在完成檢查前，一律視為未經驗證。',
  published: '2026-06-08',
  updated: '2026-06-19',
  readTime: '12 分鐘',
  heroImage: '/images/background/identify-fake-psa-slabs.png',
  heroSpecs: [
    { label: '第一步', value: '[psacard.com/cert](https://www.psacard.com/cert) 查證' },
    { label: 'UV 分水嶺', value: '編號 #43 後正面隱藏字' },
    { label: '標籤世代', value: 'LightHouse™ 全息圖案自 #27xxxxxxx 後 · #4xxxxxxx～5xxxxxxx 為 CLCT → PSA 微型小字過渡期' },
    { label: '核心原則', value: '多重交叉檢查，勿單信一步' },
  ],
  sections: [
    {
      id: 'why-cross-check',
      title: '為什麼不能只靠一種方法',
      paragraphs: [
        '在卡牌收藏市場，PSA 評級卡（Slab）長期代表保值與品相保證。假貨從假標籤、假外殼，到盜用真實證書編號、仿冒查詢頁面，手法持續升級。2025–2026 年仍有高仿案例流入市場。',
        '沒有任何單一檢查能達到 100% 準確。線上查詢通過只是「過第一關」——高仿常盜用真實認證編號。下文整理由淺入深的五步驗證流程，疊加使用才能大幅降低風險。',
      ],
    },
    {
      id: 'cert-lookup',
      title: '第一步：線上認證查詢',
      paragraphs: [
        '每張 PSA 鑑定卡標籤都印有 Certification Number（認證編號）。這是必做的基礎檢查。',
        '前往 PSA 官方認證查詢頁：[psacard.com/cert](https://www.psacard.com/cert)。自行輸入網址，勿信任賣家截圖中的連結或 QR 碼。',
        '輸入編號後，確認查詢結果與實物完全匹配：卡片照片（含邊角磨損、瑕疵位置）、年份、球員/角色名稱、等級（Grade）、特殊標記（如 1st Edition、Rookie 等）。',
        '若網站回傳「找不到證書編號」，立即停止。若查詢顯示 1986 Fleer Jordan，你手上卻是 2023 寶可夢，代表編號被盜用。截圖保存查詢結果，付款前完成此步。',
      ],
      specs: [
        { label: '查證網址', value: '僅 [www.psacard.com/cert](https://www.psacard.com/cert)' },
        { label: '必對項目', value: '照片、年份、角色、等級、標記' },
        { label: '通過意味', value: '過第一關，仍需後續檢查' },
      ],
    },
    {
      id: 'uv-blacklight',
      title: '第二步：UV 黑光燈測試',
      paragraphs: [
        'UV 黑光燈是辨識 PSA 真偽最實用的快速工具之一，市售價格低廉，建議每位認真收藏者備一支。',
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
              label: '編號 43 開頭前：',
              text: '核心大 PSA Logo 周圍應均勻出現 6 個小型發光的 PSA Logo 圖案。',
            },
            {
              label: '編號 43 開頭後：',
              text: '核心大 PSA Logo 周圍應均勻出現 6 個小型發光的 PSA Logo 圖案。',
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
        '真品PSA鑑定卡塑膠外殼有嚴格製造標準，幾分鐘內可完成觸感與外觀檢查。',
        'PSA Logo 觸感：鑑定卡底部右側（或背面，依年份而定）有凸起的 PSA Logo，手指輕觸能明顯感覺立體感。假貨多為平印或觸感生硬。',
        '「21」標記：多數現代 鑑定卡底部左側有清晰的「21」刻印。',
        '塑膠質感：真品堅硬、清澈、重量適中，邊緣焊接平整，無明顯裂縫或大面積霧面。內部卡片固定槽四個角落應為精準 90 度直角，而非圓角。',
        '厚度與密封：真品邊緣較薄，整體手感沉穩。外殼易彎曲或有重新開封痕跡，需高度懷疑。',
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
        '標籤是假貨最容易露餡之處。PSA 在不同歷史時期經歷過幾次重大的標籤與防偽技術改版，用放大鏡（建議 10 倍以上）或手機 macro 模式仔細觀察這些世代特徵，能幫你快速過濾掉低劣的仿冒品。',
      ],
      subsections: [
        {
          title: '關鍵分水嶺一：編號 27xxxxxx（轉換為現行樣式）',
          paragraphs: [
            '在編號 27xxxxxx 之前（約 2017 年前），PSA 使用的是非常早期的舊款標籤，外觀較為樸素、無複雜防偽；而從 27xxxxxx 之後，PSA 正式確立了現今我們所熟知的標籤外觀架構：',
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
                  text: '首度在標籤正面下方加入了長方形的 PSA 全息防偽標籤（Hologram Logo），字體也經過重新設計，線條更為銳利、細緻。',
                },
              ],
            },
          ],
        },
        {
          title: '關鍵分水嶺二：編號 4xxxxxxx～5xxxxxxx（NASDAQ : CLCT → PSA 微型小字過渡期）',
          paragraphs: [
            '雖然從 27xxxxxx 之後都具備 LightHouse™ 雙色反射技術，視覺效果大致相約。但因 PSA 母公司於 2021 年初完成私有化並自納斯達克退市，標籤內隱藏的防偽微型小字（Microtext）在編號 4xxxxxxx 至 5xxxxxxx 區間逐步由「NASDAQ : CLCT」改為「PSA」——此 4xxxxxxx～5xxxxxxx 區間為過渡期，兩個編號段內皆曾發現 CLCT 與 PSA 兩種小字並存，無固定切點，須以放大鏡實測，勿單靠證書編號推斷。',
          ],
        },
        {
          title: '標籤全息圖案與隱藏小字表現（一般光線下傾斜觀察）',
          level: 4,
        },
        {
          title: '編號 4xxxxxxx 之前（27xxxxxx ～ 39xxxxxxx）',
          level: 4,
          paragraphs: [
            '具備 LightHouse™ 雙色反射，特定角度下轉動，防偽圖案內的微型隱藏字體一律顯示為「NASDAQ : CLCT」（退市前母公司的股票代號）。',
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
            '退市改組期間，PSA 逐步汰換標籤耗材。4xxxxxxx 與 5xxxxxxx 兩個編號段內皆曾實測到 CLCT 與 PSA 微型小字並存——編號較前段者較可能仍為 CLCT，較後段者較可能已改為 PSA，但無固定切點。購買此區間鑑定卡時，務必傾斜標籤、放大確認實際小字內容。',
          ],
        },
        {
          title: '編號 5xxxxxxx 之後（6xxxxxxx 起）',
          level: 4,
          paragraphs: [
            '過渡期結束後，全息圖案內的微型隱藏字體已全面改為「PSA」。',
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
        '卡片本身品相：即使 鑑定卡外觀正常，仍要檢查印刷清晰度、顏色正確性，以及高分卡（尤其 PSA 10）的品相是否合理。',
        '賣家行為警訊：不願提供多角度影片、拒絕 UV 測試、不接受 PSA 官方複檢、價格遠低於市價且無合理解釋、付款後才提供證書編號、催促當日匯款或加密貨幣且無買家保障。',
        '購買建議：優先選有 PSA 官方認證服務的平台、大型信譽店家，或自行送 PSA 重新鑑定。高價值卡片值得這筆保障費用。首次交易使用有爭議窗口的平台。',
        '若已懷疑是假貨：拍攝標籤、證書、接縫各角度照片並保存聊天記錄；在 psacard.com 查證並截圖不符結果；透過 eBay、COMC 等有買家保障的平台立即申訴；必要時聯繫 PSA 提供證據。',
      ],
    },
    {
      id: 'practice-habit',
      title: '謹慎是最好的收藏習慣',
      paragraphs: [
        'PSA 假 鑑定卡技術持續進步，唯有結合線上查詢、UV 測試、物理檢查與賣家背景調查，才能大幅降低風險。',
        '新手建議從低價卡片練習驗證技巧，累積經驗後再挑戰高價品項。保護荷包與收藏熱情，安全愉快的收藏從「驗證」開始。',
        '確認 鑑定卡真偽後，日常攜帶或展示前可加装 [保護殼](/products/psa-protectors/)。鑑定確認標籤真實，保護殼則防止刮花與紫外線損害，維持轉售價值。',
      ],
    },
  ],
  cta: {
    title: '先查證，再加殼',
    body: '五步交叉驗證通過後，硬質外殼在展示或運輸中保護鑑定標籤免受刮花與紫外線。',
    primary: { label: '鑑定卡保護殼', href: '/products/psa-protectors/' },
    secondary: { label: '鑑定 vs 保護流程', href: '/guides/grade-or-protect-first/' },
  },
  relatedSlugs: ['regrade-or-reholder', 'grade-or-protect-first', 'psa-10-centering-requirements', 'choose-35pt-slab-protector'],
  sources: [
    {
      label: 'PSA — 證書查詢',
      href: 'https://www.psacard.com/cert',
    },
    {
      label: 'PSA — 評級標準',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'Card Codex — How to Identify Fake PSA Slabs（參考）',
      href: 'https://cardcodex.com/blog/how-to-identify-fake-psa-slabs/',
    },
  ],
};

export default guide;
