import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-review-vs-crack',
  title: 'PSA 升分策略：原殼重評 (Review) 與破殼重送的期望值分析',
  badge: '進階策略',
  lead:
    '對於追求極致品相的高階藏家，將 PSA 9 升分為 PSA 10 是創造倍數溢價的核心策略。然而，選擇帶殼的 PSA Review 服務往往會受到評級員的「定錨效應」影響而難以成功；自行破殼重送（Crack & Resubmit）雖能排除既有偏見，卻必須承擔卡片降級的風險。決策前，務必透過 EV（期望值）算式精算潛在回報。',
  published: '2026-08-09',
  updated: '2026-08-30',
  readTime: '10 分鐘',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    {
      label: '原殼重評 (Review)',
      value: '安全無降級風險（未過維持原分數），但受定錨效應影響，升分機率極低',
    },
    {
      label: '破殼重送 (Crack & Resubmit)',
      value: '以裸卡重新提交，排除既有分數偏見，但伴隨降分風險',
    },
    {
      label: '期望值 (EV) 門檻',
      value: '建議升分後的市值需為現有價值的 1.5 至 2 倍以上，才值得承擔風險',
    },
    {
      label: '跨評最低分數 (Minimum Grade)',
      value: '將 BGS/CGC 轉送 PSA 時，可設定最低接受分數以防降級',
    },
  ],
  sections: [
    {
      id: 'anchoring-effect',
      title: '為什麼原殼重評 (Review) 很難成功？',
      paragraphs: [
        'PSA 官方提供 Review 服務，允許藏家在不破壞原有鑑定殼的情況下，支付完整鑑定費要求重新審核分數。這項服務的最大優勢是「安全」：如果評級員認為卡片未達更高標準，原有的分數與標籤將維持不變，卡片直接原樣寄回。',
        '然而，多數資深藏家極少使用 Review 服務。原因在於心理學上的「定錨效應」（Anchoring Effect）。當評級員拿到一個標註著 PSA 9 的卡磚時，他的第一直覺是「尋找這張卡為什麼只有 9 分的瑕疵」，而不是「用全新的眼光審視它是否值得 10 分」。',
        '要推翻前一位評級員的結論，需要極端強烈的證據。在多數情況下，Review 案件最終只會浪費鑑定費，而無法獲得期望的升級。因此，對於真正有把握的卡片，破殼重送成為了主流策略。',
      ],
      bridge: '如果 Review 難以成功，破殼重送（Crack & Resubmit）則提供了另一條充滿風險與機遇的路徑。',
    },
    {
      id: 'crack-and-resubmit',
      title: '破殼重送 (Crack & Resubmit) 的機遇與代價',
      paragraphs: [
        '破殼重送是指藏家自行使用工具將鑑定殼破壞，取出卡片後，以完全未鑑定的「裸卡」狀態重新提交給 PSA。這樣做可以徹底消除定錨效應，讓評級員在沒有任何歷史紀錄干擾的情況下，重新給定分數。',
        '這種策略的潛在回報巨大，但也伴隨著兩大風險。首先是物理損壞風險：自行破殼若操作不當，極易刮傷卡片表面或壓損邊角，直接導致卡片報廢。其次是降級風險：若先前的 PSA 9 其實是寬鬆標準下的產物，以現今更嚴格的 55/45 置中標準重新審核，很有可能直接降為 PSA 8。',
        '這是一場沒有回頭路的博弈。一旦破殼，原本 PSA 9 的價值支撐便蕩然無存；若重評結果不如預期，藏家不僅損失了兩次鑑定費，更蒙受了卡片跌價的雙重打擊。',
      ],
      bridge: '為了理性評估是否值得冒險，我們必須導入金融市場常用的期望值模型。',
    },
    {
      id: 'expected-value-math',
      title: '決策框架：期望值 (EV) 算式',
      paragraphs: [
        '在決定破殼重送前，切勿憑直覺行事。我們建議用期望值（Expected Value, EV）估算潛在回報是否足以覆蓋風險。',
        '假設一張卡片目前 PSA 9 市值 $200，PSA 10 市值 $800，PSA 8 市值 $50。若您極具信心（預估有 60% 機率拿 10，40% 機率降至 8），且扣除 $50 的鑑定與物流成本，EV 為 ($800 × 0.6) + ($50 × 0.4) - $50 = $450。因為 $450 遠大於目前的 $200，這是一次值得嘗試的重評。',
        '經驗法則：除非期望值（EV）達到現有卡磚價值的 1.5 至 2 倍，且您對現行 PSA 置中與表面標準有深刻理解，否則請保持原狀或僅申請換殼。香港藏家在破殼前，亦可親臨 [138 Arena](/business/psa-grading/)（合作場地），由 Appaw 現場初步評估置中比例、表面壓痕與邊角完整度，並預測可能的分數門檻；同時附設基本清潔保養，降低提交鑑定時因灰塵或油脂造成的扣分風險。',
      ],
      formula: {
        result: '期望值 (EV)',
        eyebrow: '破殼決策算式',
        terms: [
          { text: 'PSA 10 市值 × 升分機率', hint: '成功升至 10 的期望回報' },
          { op: '+', text: 'PSA 8 市值 × 降分機率', hint: '未達標時可能跌至 8' },
          { op: '−', text: '鑑定與物流費用', hint: '提交成本一併扣除' },
        ],
      },
      bridge: '如果您持有的不是 PSA 的鑑定卡，而是 BGS 或 CGC，跨評則有另一套規則。',
    },
    {
      id: 'crossover-minimum-grade',
      title: 'BGS / CGC 跨評 (Crossover) 與最低分數設定',
      paragraphs: [
        '若您希望將 BGS 或 CGC 的鑑定卡轉為 PSA 體系，您可以直接帶殼提交 Crossover 服務。這項服務允許您在申請單上設定「最低接受分數」（Minimum Grade）。',
        '例如，您將一張 BGS 9.5 送交 PSA 跨評，並設定 Minimum Grade 為 10。PSA 會在不破殼的情況下進行預檢，若評級員認為它具備 PSA 10 的水準，才會破開 BGS 殼並重新封裝為 PSA 10；若評級員認為它只有 PSA 9 的水準（未達您設定的最低門檻），則會將卡片保留在原 BGS 殼內退還給您。',
        '這看似完美，但同樣面臨定錨效應與「隔殼觀火」的限制。評級員隔著厚重的 BGS 外殼很難精確判斷表面微小刮痕，因此在保守起見下，往往不會給出 10 分。因此，許多進階藏家在跨評時，仍會選擇先自行破殼，以獲取最公平的裸卡審視。若您已決定以裸卡重新提交，可透過 Appaw PSA評級代送鑑定於 138 Arena 面交，由專人協助批次轉送並於網上查看現有進度。',
      ],
    },
  ],
  faq: [
    {
      q: 'PSA Review (原殼重評) 失敗會被降分嗎？',
      a: '不會。如果評級員認為卡片未達更高的分數，您的卡片會維持原有的分數與標籤原樣寄回。這項服務沒有降級風險，但同樣需要支付完整的鑑定費用。',
    },
    {
      q: '為什麼破殼重送 (Crack & Resubmit) 的升分機率較高？',
      a: '因為破殼後以裸卡提交，能徹底消除評級員對既有分數的「定錨效應」，讓他們在沒有歷史標籤干擾的情況下，用全新的眼光審視卡片。',
    },
    {
      q: '破殼重送有什麼風險？',
      a: '兩大風險：第一是自行破殼時不慎損壞卡片；第二是若早年的評分標準較寬鬆，以現行嚴格標準重新檢驗，極有可能得到比原本更低的分數。',
    },
    {
      q: '香港可以透過 PSA評級代送鑑定辦理破殼重送或跨評嗎？',
      a: '可以。香港藏家可於銅鑼灣 138 Arena 當面辦理。138 Arena 負責場務及收費；Appaw Store 完成點收與初步檢視，再將卡牌併入 PSA評級代送鑑定批次。該檢視僅供參考，最終分數由 PSA 決定。破殼前先做初步檢視，有助判斷升分期望值是否值得承擔降級風險。',
    },
  ],
  midCta: {
    afterSectionId: 'expected-value-math',
    title: '破殼前，先做現場卡況初步評估',
    body: '香港藏家可親臨 138 Arena，由 Appaw 完成點收與初步檢視，核對置中、表面與邊角。該檢視僅供參考，最終分數由 PSA 決定。其後再決定是否破殼重送。138 Arena 負責場務及收費；Appaw Store 負責評級代送鑑定及跟進。',
    primary: { label: 'PSA評級代送鑑定', href: '/business/psa-grading/' },
    secondary: { label: '免費置中工具', href: '/tools/card-centering/' },
  },
  cta: {
    title: '重送前先評估，香港可面交辦理評級代送鑑定',
    body: 'PSA 10 現時要求正面 55/45 的置中比例。決定破殼重送前，請先使用免費置中工具測量邊距。香港藏家如欲提交鑑定，可先於網站預約，再到銅鑼灣 138 Arena 當面辦理。138 Arena 負責場務及收費；Appaw Store 負責評級代送鑑定及跟進，並可調整最終應付金額。現場初步檢視僅供參考，最終分數由 PSA 決定，以免白白付出鑑定費用。',
    primary: { label: 'PSA評級代送鑑定', href: '/business/psa-grading/' },
    secondary: { label: '免費置中工具', href: '/tools/card-centering/' },
  },
  relatedSlugs: ['psa-reholder-guide', 'psa-10-centering-requirements', 'hong-kong-tcg-grading-guide'],
  sources: [
    {
      label: 'PSA Review Service',
      href: 'https://www.psacard.com/services/tradingcardgrading/review',
    },
  ],
};

export default guide;
