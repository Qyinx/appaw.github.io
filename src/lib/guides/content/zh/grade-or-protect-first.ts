import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: '裸卡送鑑與鑑定卡保護策略',
  badge: '流程',
  lead:
    '送鑑是增值進攻；保護 Slab 是守住成果的防守。大部分收藏者顛倒了先後次序。',
  published: '2026-06-07',
  updated: '2026-07-12',
  readTime: '9 分鐘',
  heroImage: '/images/background/grade-or-protect-first.png',
  heroSpecs: [
    { label: '提交門檻', value: '裸卡 $25+，預期 2–4× 溢價' },
    { label: '裸卡提交', value: '進攻：追升值' },
    { label: '鑑定卡保護', value: '防守：守住價值' },
    { label: '完整路徑', value: '裸卡 → 鑑定 → 外殼' },
  ],
  sections: [
    {
      id: 'why-both-matter',
      title: '送鑑與保護是兩個階段，並非二選一',
      paragraphs: [
        'PSA 卡片從裸卡到鑑定磚，先做增值（送鑑），再做保值（保護）。送鑑選對時機，價值才跳得起來；磚回來後立刻加外殼，才守得住。',
        '同一週常有人問兩件事：「這張裸卡要不要送？」「這張 PSA 10 要不要加保護殼？」兩個獨立決定。按順序想，別當成二選一。',
      ],
      bridge: '先談裸卡經濟學。鑑定磚到手當日，便進入防守階段。',
    },
    {
      id: 'when-to-submit-raw',
      title: '何時裸卡送鑑才划算',
      paragraphs: [
        '提交裸卡是追升值的玩法，不是每張卡都值得付送鑑費。送錯了，錢白花，或者標籤拉低轉售價。',
        '值得送：品相接近 Gem Mint（PSA 10 範圍），裸卡行情 $25+，PSA 10 預期至少 2–4× 裸卡價；熱門 Rookie 或稀缺 TCG（寶可夢、MTG 等）高分需求強。eBay Authenticity Guarantee 或 PSA 優惠期間，風險稍低。',
        '別送：裸卡低於 $20–25，送鑑費吃光溢價；邊角磨損、表面刮痕明顯，多半 PSA 8 以下；PSA backlog 嚴重或暫停服務；純收藏、沒有轉售打算。',
        '打包前：Penny Sleeve + Card Saver；查 PSA Pop Report 看 gem 數量；算成本選服務等級（Value、Express 等）；用免費 [卡牌置中工具](/tools/card-centering/) 量置中，見 [PSA 10 置中標準](/guides/psa-10-centering-requirements/)。',
      ],
      specs: [
        { label: 'PSA 10 正面 (2025+)', value: '55/45 或更佳' },
        { label: 'PSA 10 背面', value: '75/25 或更佳' },
        { label: '經濟門檻', value: '裸卡 $25+，2–4× 溢價才合算' },
        { label: '篩選項目', value: '置中 + 表面 + 邊角' },
      ],
      bridge: '磚回來，工作就換了。從這裡開始是防守。',
    },
    {
      id: 'when-to-protect-graded',
      title: '何時需要加強保護 PSA 鑑定卡',
      paragraphs: [
        '鑑定殼封了卡，塑料仍會刮、霧、裂，展示價和買家信心都會掉。保護是用你付過的鑑定費守成果。',
        '鑑定卡到手、核對證書後，儘快加裝 [磁吸防UV鑑定卡保護殼](/products/psa-protectors/)。35PT 貼合 PSA/CGC 磚，剛性金屬框比 Slab Sleeve 軟套更能防刮、防擠。UV 前板減慢標籤與卡面褪色。',
        '高價 PSA 10 或稀有卡另需陰涼乾燥、恆溫恆濕存放。運送、卡展或長期保管時多層包裝並投保。',
        '外殼輕微磨損，考慮 [PSA Reholder（重新裝殼）](/guides/regrade-or-reholder/)。嚴重損壞或刻意追更高分，再選 Regrade（重新評級）。',
        '少用手直接摸；避開直曬、高溫和濕度劇變；定期檢查 Slab。鑑定殼是封裝展示用，不是背包或卡展反覆易手的旅行殼，見 [UV 保存指南](/guides/uv-protection-graded-cards/) 與 [35PT 保護殼選購](/guides/choose-35pt-slab-protector/)。',
      ],
      specs: [
        { label: '應加外殼', value: '展示、攜帶、交易、寄送' },
        { label: '高價卡', value: '磁吸硬殼 + 穩定溫濕存放' },
        { label: '外殼規格', value: '標準 35PT PSA / CGC' },
      ],
    },
    {
      id: 'strategy-comparison',
      title: '裸卡提交 vs 鑑定卡保護：策略比較',
      paragraphs: [
        '兩個階段，兩種心態，進攻 vs 防守。對照如下。',
      ],
      table: {
        headers: ['面向', '裸卡提交（增值策略）', '鑑定卡保護（保值策略）'],
        rows: [
          ['階段', '裸卡未評級階段', '已 Slab 鑑定階段'],
          ['主要目的', '提升市場價值與流通性', '維持外觀與既有價值'],
          ['風險重點', '降分、費用高、等待時間長', '外殼損傷、環境劣化'],
          ['成本', '較高（送鑑費 + 運費）', '較低（護套、儲存設備）'],
          ['適合對象', '高潛力、品相優良的裸卡', '所有已 Slab 鑑定卡，尤其是高價值卡'],
          ['心態', '積極進攻', '穩健防守'],
        ],
      },
    },
    {
      id: 'practical-advice',
      title: '實務決策建議',
      paragraphs: [
        '完整流程：先篩裸卡是否值得送鑑，磚一取回就切保護模式。',
        '裸卡路徑：量置中 → 放大鏡看表面與邊角 → 經濟合理才送鑑 → 取回後在 [psacard.com/cert](https://www.psacard.com/cert) 核對證書 → 加 [外層保護殼](/products/psa-protectors/) → 展示、交易或寄送。',
        '購買鑑定卡路徑：核對賣家照片與 registry → 收貨即加外殼 → 記錄購入價與證書。無需送鑑步驟，但保護同樣必要。',
        '高價值卡：先做成本效益分析。香港藏家可到合作店舖 [138 Arena](/business/psa-grading/)（銅鑼灣謝斐道522號1/F）交卡及取件，代送 PSA 並提供進度查詢。送鑑費用、政策與週期以 [PSA 官網](https://www.psacard.com) 為準。',
        '新手：先拿低中價位卡練提交與保護，再碰高價 grail。',
      ],
    },
    {
      id: 'bottom-line',
      title: '結語：進攻與防守並行',
      paragraphs: [
        '兩條路終點相同：證書已核對、已加外殼的鑑定卡。差別只在於鑑定費是你自己付，還是向他人買下已完成標籤。',
      ],
    },
  ],
  faq: [
    { q: '應先送鑑還是先加保護殼？', a: '裸卡經濟與品相合理時送鑑；鑑定磚到手或購入後應立即加外層保護。' },
    { q: '什麼時候值得付 PSA 送鑑費？', a: '裸卡約 25 美元以上，且 PSA 10 預期售價可達裸卡 2–4 倍，置中與表面達 gem 水準。' },
    { q: '已鑑定還需要外殼嗎？', a: '展示、運送、轉售皆需要。鑑定殼易刮花褪色，UV 外殼可保護標籤。' },
  ],
  cta: {
    title: 'Slab 到手，先加外殼',
    body: '保護已有或剛收到的鑑定卡。裸卡送鑑前，先用免費置中工具核對賣家照片；香港藏家可到 138 Arena 交卡及取件。',
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
