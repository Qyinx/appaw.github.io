import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: '裸卡送鑑與鑑定卡保護策略',
  badge: '流程',
  lead:
    '送鑑是增值進攻；保護 Slab 是守住成果的防守。大部分收藏者顛倒了先後次序。',
  published: '2026-06-07',
  updated: '2026-07-11',
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
        'PSA 卡片從裸卡到鑑定卡，代表收藏的「增值階段」與「保值階段」。正確把握提交時機，能讓卡片價值大幅提升；妥善保護鑑定卡，則能守住來之不易的升值成果。',
        '同一週常同時遇到兩個問題：「這張裸卡要不要送？」「這張 PSA 10 要不要加保護殼？」這是兩個獨立決定。用順序思考，不要用對立思考，兩者結合才能形成完整收藏策略。',
      ],
      bridge: '先談裸卡經濟學。鑑定磚到手當日，便進入防守階段。',
    },
    {
      id: 'when-to-submit-raw',
      title: '何時裸卡送鑑才划算',
      paragraphs: [
        '提交裸卡是積極的增值策略，但並非所有卡片都適合送鑑。錯誤提交可能導致費用浪費或價值下降。',
        '適合提交：卡片品相接近 Gem Mint（接近 PSA 10），裸卡市場價值在 25 美元以上，且預期 PSA 10 售價至少為裸卡價的 2–4 倍；熱門球星 Rookie 卡、限量 TCG 卡（寶可夢、MTG 等），高分鑑定卡市場需求強勁；希望提升轉售流通性與展示效果；遇到 eBay Authenticity Guarantee 等保障購買，或 PSA 官方優惠活動期間。',
        '不建議提交：裸卡價值低於 20–25 美元的低價卡，送鑑費容易超過升值空間；品相已有明顯邊角磨損、表面刮痕等瑕疵，容易拿到 PSA 8 以下；PSA 提交 backlog 嚴重或服務暫停期間；純粹個人長期收藏，無轉售意圖。',
        '提交前準備：使用 Penny Sleeve + Card Saver 半硬護卡保護；查詢 PSA Pop Report，了解同類卡高分數量；計算成本效益，選擇合適服務等級（Value、Express 等）；用免費 [卡牌置中工具](/tools/card-centering/) 量度置中，詳見 [PSA 10 置中標準](/guides/psa-10-centering-requirements/)。',
      ],
      specs: [
        { label: 'PSA 10 正面 (2025+)', value: '55/45 或更佳' },
        { label: 'PSA 10 背面', value: '75/25 或更佳' },
        { label: '經濟門檻', value: '裸卡 $25+，2–4× 溢價才合算' },
        { label: '篩選項目', value: '置中 + 表面 + 邊角' },
      ],
    },
    {
      id: 'when-to-protect-graded',
      title: '何時需要加強保護 PSA 鑑定卡',
      paragraphs: [
        '鑑定卡雖然提供密封保護，但外殼仍容易出現刮痕、霧化或破裂，影響美觀與二手市場價值。保護鑑定卡是守住價值的必要防守策略。',
        '需要加強保護：鑑定卡到手、核對證書後，儘快加装 [磁吸防UV鑑定卡保護殼](/products/psa-protectors/)，35PT 貼合 PSA/CGC 鑑定殼，剛性金屬邊框比 Slab Sleeve 軟套更能防刮、防擠壓，UV 防護前板減慢標籤與卡面褪色；高價值 PSA 10 或稀有卡另需陰涼乾燥、恆溫恆濕存放；運送、參加卡展或長期存放時，務必多層包裝並投保。',
        '外殼出現輕微磨損時，考慮 [PSA Reholder（重新裝殼）](/guides/regrade-or-reholder/)；若嚴重損壞或想挑戰更高分數，再選擇 Regrade（重新評級）。',
        '日常原則：減少裸手直接觸摸；避免陽光直射、高溫與濕度變化；定期檢查 Slab 狀況，及早處理問題。鑑定殼用於封裝與展示，不是背包或卡展反覆易手的旅行殼，詳見 [UV 保存指南](/guides/uv-protection-graded-cards/) 與 [35PT 保護殼選購](/guides/choose-35pt-slab-protector/)。',
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
        '兩者分別對應收藏的不同階段與心態，進攻增值 vs 防守保值。下表整理關鍵對照。',
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
        '整體收藏流程：先評估裸卡是否值得送鑑，成功 Slab 化後立即轉入保護模式，兩者結合才能形成閉環。',
        '裸卡路徑：量置中 → 放大鏡看表面與邊角 → 經濟合理才送鑑 → 取回後在 [psacard.com/cert](https://www.psacard.com/cert) 核對證書 → 加 [外層保護殼](/products/psa-protectors/) → 展示、交易或寄送。',
        '購買鑑定卡路徑：核對賣家照片與 registry → 收貨即加外殼 → 記錄購入價與證書。無需送鑑步驟，但保護同樣必要。',
        '高價值卡：先做成本效益分析。香港藏家可到合作店舖 [138 Arena](/business/psa-grading/)（銅鑼灣謝斐道522號1/F）交卡及取件，代送 PSA 並提供進度查詢。送鑑費用、政策與週期以 [PSA 官網](https://www.psacard.com) 為準。',
        '新手建議：從低中價位卡片開始練習提交與保護，累積經驗後再處理高價值收藏品。',
      ],
    },
    {
      id: 'bottom-line',
      title: '結語：進攻與防守並行',
      paragraphs: [
        'PSA 裸卡提交與鑑定卡保護雖然屬於不同階段，卻是相輔相成的收藏智慧。懂得在正確時機選擇正確策略，不僅能有效降低風險，更能讓收藏既能增值，又能長久保值。',
        '無論剛入門或專注投資，理性判斷與妥善保護都是成功關鍵。兩條路徑終點相同：已核對證書、已加外殼的鑑定卡。差別只在於鑑定費是自己付，還是向他人購買已完成標籤。',
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
