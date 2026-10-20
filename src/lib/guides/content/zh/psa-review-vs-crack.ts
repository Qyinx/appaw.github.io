import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-review-vs-crack',
  title: 'PSA 升分策略：原殼重評（Review）與破殼重送的期望值分析',
  badge: '進階策略',
  lead:
    'PSA 9 升 PSA 10 只有兩條路：原殼重評（Review）或破殼重送（Crack & Resubmit）。經驗法則是升分後的期望值須達現時卡磚市值的 1.5 至 2 倍才值得嘗試。Review 安全但受評級員定錨效應影響，升分機率極低；破殼雖然可排除既有分數偏見，但須承擔降級風險，決策前應先計算期望值（EV）。',
  metaDescription:
    'PSA 9 想升 10？原殼重評（Review）受定錨效應影響難成功，破殼重送可排除偏見但有降級風險。附期望值（EV）算法、1.5 至 2 倍門檻法則、兩條路徑風險比較表、BGS/CGC 跨評最低分數設定，以及香港提交鑑定的方法。香港藏家可先到 138 Arena 作現場卡況初步評估，再決定是否破殼重送。',
  published: '2026-08-09',
  updated: '2026-10-20',
  readTime: '10 分鐘',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    {
      label: '原殼重評（Review）',
      value: '安全無降級風險（未過維持原分數），但受定錨效應影響，升分機率極低',
    },
    {
      label: '破殼重送（Crack & Resubmit）',
      value: '以裸卡重新提交，排除既有分數偏見，但伴隨降分風險',
    },
    {
      label: '期望值（EV）門檻',
      value: '建議升分後的市值需為現有價值的 1.5 至 2 倍以上，才值得承擔風險',
    },
    {
      label: '跨評最低分數（Minimum Grade）',
      value: '將 BGS/CGC 轉送 PSA 時，可設定最低接受分數以防降級',
    },
  ],
  sections: [
    {
      id: 'anchoring-effect',
      title: '為什麼原殼重評（Review）很難成功？',
      paragraphs: [
        'PSA 官方提供 Review 服務，允許藏家在不破壞原有鑑定殼的情況下，支付完整鑑定費要求重新審核分數。這項服務的最大優勢是安全：如果評級員認為卡片未達更高標準，原有分數與標籤將維持不變，卡片直接原樣寄回。',
        '然而，多數資深藏家極少使用 Review 服務，原因在於心理學上的定錨效應（Anchoring Effect）。當評級員拿到一張標註 PSA 9 的卡磚時，第一直覺是尋找這張卡為什麼只有 9 分的瑕疵，而不是以全新眼光審視它是否值得 10 分。',
        '要推翻前一位評級員的結論，需要極端強烈的證據。在多數情況下，Review 案件最終只是白白付出鑑定費，而無法獲得期望的升級。因此，對於真正有把握的卡片，破殼重送成為主流策略。',
      ],
      bridge: '如果原殼重評難以推翻既有分數，破殼重送便是另一條路徑，但判斷錯誤的代價同樣沉重。',
    },
    {
      id: 'crack-and-resubmit',
      title: '破殼重送（Crack & Resubmit）的機遇與代價',
      paragraphs: [
        '破殼重送是指藏家自行使用工具將鑑定殼破壞，取出卡片後，以完全未鑑定的裸卡狀態重新提交給 PSA。這樣做可以徹底消除定錨效應，讓評級員在沒有任何歷史紀錄干擾的情況下重新給定分數。',
        '這種策略的潛在回報是一張全新的 PSA 10，但伴隨兩大風險。首先是物理損壞風險：自行破殼若操作不當，極易刮傷卡面或壓損邊角，直接導致卡片報廢。其次是降級風險：若先前的 PSA 9 是寬鬆標準下的產物，以 2025 年收緊後的 55/45 置中標準重新審核，很可能直接降為 PSA 8。',
        '破殼後並無回頭空間：自行破殼時可能損壞卡面或邊角；原 PSA 9 標籤的價值支撐會即時消失；若重評結果低於預期，更須同時承受兩次鑑定費與市值下跌。',
      ],
      bridge: '面對這種高風險決策，與其憑感覺，不如用期望值（EV）把回報與代價計算清楚。',
    },
    {
      id: 'expected-value-math',
      title: '決策框架：期望值（EV）算式',
      paragraphs: [
        '決定破殼重送前，請勿單憑直覺行事。應先以期望值（Expected Value, EV）估算潛在回報是否足以覆蓋風險與費用。',
        '假設一張卡片目前 PSA 9 市值 $200，PSA 10 市值 $800，PSA 8 市值 $50。若您極具信心（預估 60% 機率升至 10，40% 機率降至 8），扣除 $50 鑑定與物流成本後，EV 為（$800 × 0.6）+（$50 × 0.4）− $50 = $450。由於 $450 遠高於目前的 $200，這次破殼在數學上成立。',
        '經驗法則：除非期望值達到現有卡磚價值的 1.5 至 2 倍，且您已對照現行 PSA 置中與表面標準完成篩選，否則宜保持原狀或僅申請換殼。香港藏家在破殼前，可預約後前往 [138 Arena](/business/psa-grading/)，由 Appaw Store 現場初步評估置中比例、表面壓痕與邊角完整度，作為是否破殼的參考；該檢視僅供參考，最終分數由 PSA 決定。138 Arena 負責場務及收費。',
      ],
      table: {
        headers: ['評估維度', '原殼重評（Review）', '破殼重送（Crack & Resubmit）'],
        rows: [
          ['降級風險', '無；未通過則維持原分數', '全部承受；可能低於原分數'],
          ['定錨效應', '高；評級員看得見原標籤', '無；以裸卡重新評估'],
          ['物理風險', '無；鑑定殼保持密封', '破殼過程可能損壞卡片'],
          ['證書編號', '保留原有編號', '發放全新編號'],
          ['適用情境', '低價值卡磚、風險承受度低', 'EV 達 1.5 至 2 倍的高價 PSA 9'],
        ],
      },
      formula: {
        result: '期望值（EV）',
        eyebrow: '破殼決策算式',
        terms: [
          { text: 'PSA 10 市值 × 升分機率', hint: '成功升至 10 的期望回報' },
          { op: '+', text: 'PSA 8 市值 × 降分機率', hint: '未達標時可能跌至 8' },
          { op: '−', text: '鑑定與物流費用', hint: '提交成本一併扣除' },
        ],
      },
      bridge: '如果您持有的不是 PSA 鑑定卡，而是 BGS 或 CGC，跨評則有另一套規則。',
    },
    {
      id: 'crossover-minimum-grade',
      title: 'BGS / CGC 跨評（Crossover）與最低分數設定',
      paragraphs: [
        '若您希望將 BGS 或 CGC 的鑑定卡轉為 PSA 體系，可以直接帶殼提交 Crossover 服務。這項服務允許您在申請單上設定最低接受分數（Minimum Grade）。',
        '例如，您將一張 BGS 9.5 送交 PSA 跨評，並設定 Minimum Grade 為 10。PSA 會在不破殼的情況下進行預檢：若評級員認為它具備 PSA 10 的水準，才會破開 BGS 殼並重新封裝為 PSA 10；若認為它未達您設定的最低門檻，則會將卡片保留在原 BGS 殼內退還，惟鑑定費仍需支付。',
        '設定最低分數可減少意外降級，但定錨效應與隔殼檢視的限制依然存在。評級員隔著厚重的 BGS 外殼難以精確判斷表面微小刮痕，取態往往保守，因此許多進階藏家在跨評時仍會先自行破殼，再以裸卡提交。若已決定以裸卡重新提交，香港藏家可預約後前往 138 Arena 面交：138 Arena 負責場務及收費，Appaw Store 將卡牌併入 PSA評級代送鑑定批次，並可於網上查看現有進度。',
      ],
    },
  ],
  faq: [
    {
      q: 'PSA Review（原殼重評）失敗會被降分嗎？',
      a: '不會。如果評級員認為卡片未達更高分數，卡片會維持原有分數與標籤原樣寄回。這項服務沒有降級風險，但同樣需要支付完整的鑑定費用。',
    },
    {
      q: '為什麼破殼重送（Crack & Resubmit）的升分機率較高？',
      a: '因為破殼後以裸卡提交，能徹底消除評級員對既有分數的定錨效應，讓他們在沒有歷史標籤干擾的情況下，以全新眼光審視卡片。',
    },
    {
      q: '破殼重送有什麼風險？',
      a: '主要有兩大風險：第一是自行破殼時不慎損壞卡片；第二是若早年的評分標準較寬鬆，以現行嚴格標準重新檢驗，極有可能得到比原本更低的分數。',
    },
    {
      q: '香港可以透過 PSA評級代送鑑定辦理破殼重送或跨評嗎？',
      a: '可以。香港藏家可預約後前往銅鑼灣 138 Arena 當面辦理。138 Arena 負責場務及收費；Appaw Store 完成點收與初步檢視，再將卡牌併入 PSA評級代送鑑定批次。該檢視僅供參考，最終分數由 PSA 決定。破殼前先做初步檢視，有助判斷升分期望值是否值得承擔降級風險。',
    },
  ],
  midCta: {
    afterSectionId: 'expected-value-math',
    title: '破殼前，先做現場卡況初步評估',
    body: '香港藏家可預約後前往 138 Arena，由 Appaw Store 點收並初步檢視置中、表面與邊角。該檢視僅供參考，最終分數由 PSA 決定。其後再決定是否破殼重送。138 Arena 負責場務及收費；Appaw Store 負責 PSA評級代送鑑定及跟進。',
    primary: { label: 'PSA評級代送鑑定', href: '/business/psa-grading/' },
    secondary: { label: '免費置中工具', href: '/tools/card-centering/' },
  },
  cta: {
    title: '重送前先評估，香港可面交辦理 PSA評級代送鑑定',
    body: 'PSA 10 現時要求正面 55/45 的置中比例，決定破殼重送前請先使用免費置中工具測量邊距。香港藏家如欲提交鑑定，可先於網站預約，再到銅鑼灣 138 Arena 當面辦理。138 Arena 負責場務及收費；Appaw Store 負責 PSA評級代送鑑定及跟進。現場初步檢視僅供參考，最終分數由 PSA 決定，以免白白付出鑑定費用。',
    primary: { label: 'PSA評級代送鑑定', href: '/business/psa-grading/' },
    secondary: { label: '免費置中工具', href: '/tools/card-centering/' },
  },
  relatedSlugs: ['psa-reholder-guide', 'psa-10-centering-requirements', 'hong-kong-tcg-grading-guide'],
  sources: [
    {
      label: 'PSA Review Service',
      href: 'https://www.psacard.com/services/tradingcardgrading/review',
    },
    {
      label: 'PSA 鑑定標準（2025 年置中門檻）',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'PSA Trading Card Grading 服務與收費',
      href: 'https://www.psacard.com/services/tradingcardgrading',
    },
  ],
};

export default guide;
