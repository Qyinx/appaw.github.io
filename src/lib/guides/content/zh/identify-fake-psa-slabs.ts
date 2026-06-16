import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'identify-fake-psa-slabs',
  title: '如何辨識 PSA 真偽鑑定卡',
  description:
    '五步交叉驗證 PSA 鑑定殼：證書查詢、UV 黑光燈、外殼觸感、標籤放大檢查，以及購買前的賣家警訊。降低假 Slab 受騙風險。',
  badge: '真偽',
  lead:
    'PSA 鑑定殼是保值與品相的代名詞，高溢價也招來假標籤、假外殼、偽造查詢頁。2020–2022 收藏熱潮後，不少新手因缺乏經驗受損。核心原則：高價 Slab 在完成多重交叉檢查前，一律視為「未經驗證」。',
  published: '2026-06-08',
  updated: '2026-06-17',
  readTime: '10 分鐘',
  heroImage: '/images/background/identify-fake-psa-slabs.png',
  heroSpecs: [
    { label: '第一步', value: '[psacard.com/cert](https://www.psacard.com/cert) 查證' },
    { label: '最快工具', value: 'UV 黑光燈' },
    { label: '外殼標記', value: '凸起 PSA Logo +「21」' },
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
        '每張 PSA Slab 標籤都印有 Certification Number（認證編號）。這是必做的基礎檢查。',
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
        '標籤正面：真品在特定區域會出現隱藏的「PSA」文字或圖案，發光均勻清晰（PSA編號43後才開始有配備）。',
        '標籤背面：PSA Logo 周圍應出現 6 個小型 PSA Logo 圖案。',
        '假貨常見特徵：發光位置錯誤、亮度異常、圖案模糊或完全不發光。不同年代 Slab 細節略有差異，整體安全特徵一致。若賣家拒絕 UV 測試或只提供單角度照片，是重大警訊。',
      ],
      specs: [
        { label: '正面', value: '隱藏 PSA 圖案，均勻發光（PSA編號43後才開始有配備）' },
        { label: '背面', value: 'Logo 周圍 6 個小 Logo' },
        { label: '假貨徵象', value: '錯位、過亮/過暗、模糊或無反應' },
      ],
    },
    {
      id: 'holder-physical',
      title: '第三步：外殼物理與觸感',
      paragraphs: [
        '真品 PSA Slab 塑膠外殼有嚴格製造標準，幾分鐘內可完成觸感與外觀檢查。',
        'PSA Logo 觸感：Slab 底部右側（或背面，依年份而定）有凸起的 PSA Logo，手指輕觸能明顯感覺立體感。假貨多為平印或觸感生硬。',
        '「21」標記：多數現代 Slab 底部左側有清晰的「21」刻印。',
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
        '標籤是假貨最容易露餡之處。用放大鏡或手機 macro 模式仔細觀察。',
        '字體特徵：例如「GEM MINT 10」中的 G 字尾巴應乾淨無多餘小尾；年份中的「2」字形狀正確。假標籤常見像素階梯或墨色不均。',
        '反光與安全圖案：不同角度光線下，真品標籤呈現「燈塔」般的特殊反光，並有微型 PSA Logo 隱藏圖案。扁平、單色或像素化的全息效果通常是偽造印刷。',
        '顏色、對齊與透光：標籤顏色均勻，對強光觀察背面，真品能隱約透出對面文字；假標籤通常過厚或過不透明。',
        '並排比較最有效：將可疑 Slab 與同年代、同標籤類型的可信樣本並置，紅色色調、全息深度或標籤位置的差異會立刻顯現。',
      ],
      specs: [
        { label: '放大倍率', value: '10× 以上' },
        { label: '重點字體', value: 'GEM MINT 10、年份數字' },
        { label: '反光', value: '傾斜時多色「燈塔」效果' },
      ],
    },
    {
      id: 'advanced-buying',
      title: '第五步：進階驗證與購買注意',
      paragraphs: [
        '卡片本身品相：即使 Slab 外觀正常，仍要檢查印刷清晰度、顏色正確性，以及高分卡（尤其 PSA 10）的品相是否合理。',
        '賣家行為警訊：不願提供多角度影片、拒絕 UV 測試、不接受 PSA 官方複檢、價格遠低於市價且無合理解釋、付款後才提供證書編號、催促當日匯款或加密貨幣且無買家保障。',
        '購買建議：優先選有 PSA 官方認證服務的平台、大型信譽店家，或自行送 PSA 重新鑑定。高價值卡片值得這筆保障費用。首次交易使用有爭議窗口的平台。',
        '若已懷疑是假貨：拍攝標籤、證書、接縫各角度照片並保存聊天記錄；在 psacard.com 查證並截圖不符結果；透過 eBay、COMC 等有買家保障的平台立即申訴；必要時聯繫 PSA 提供證據。',
      ],
    },
    {
      id: 'practice-habit',
      title: '謹慎是最好的收藏習慣',
      paragraphs: [
        'PSA 假 Slab 技術持續進步，唯有結合線上查詢、UV 測試、物理檢查與賣家背景調查，才能大幅降低風險。',
        '新手建議從低價卡片練習驗證技巧，累積經驗後再挑戰高價品項。保護荷包與收藏熱情，安全愉快的收藏從「驗證」開始。',
        '確認 Slab 真偽後，日常攜帶或展示前可加装 [保護殼](/products/psa-protectors/)。鑑定確認標籤真實，保護殼則防止刮花與紫外線損害，維持轉售價值。',
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
