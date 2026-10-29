import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-2026-policy-timeline',
  title: '2026 PSA 政策變動時間線：Value 停收與重開、香港收件中心、價目調整',
  badge: '政策追蹤',
  lead:
    '2026 年是 PSA 對亞太區藏家變動最大的一年：香港收件中心成立、Value 方案停收再重開、價目與預計工期多次調整。本頁按日期整理每項官方變動、生效範圍與對香港藏家的實際影響，並附上官方來源以便核實。PSA 每有新公告，本頁會相應更新。',
  metaDescription:
    '2026 PSA 政策時間線：香港收件中心成立、Value 停收與 10 月重開、Standard／Priority 價目與工期調整，逐項附生效日期、影響與官方來源，持續更新。',
  published: '2026-10-29',
  updated: '2026-10-29',
  readTime: '7 分鐘',
  notice: '本頁為持續更新文件：PSA 每有政策公告，時間線與「最後更新」日期會同步修訂。',
  heroImage: '/images/background/psa-grading-standards.png',
  heroSpecs: [
    {
      label: '覆蓋範圍',
      value: 'PSA 官方政策：收件渠道、方案開停、價目與預計工期調整',
    },
    {
      label: '適用地區',
      value: '香港及亞太區（APAC）藏家；部分變動屬全球適用',
    },
    {
      label: '更新方式',
      value: 'PSA 發布新公告時更新；每項變動附官方來源連結',
    },
    {
      label: '價目查詢',
      value: 'Appaw Store 最新服務費以 PSA評級代送鑑定頁面價目表為準',
    },
  ],
  sections: [
    {
      id: 'timeline',
      title: '2026 年變動總覽',
      paragraphs: [
        '下表按生效日期排列 2026 年 PSA 主要政策變動，並簡述對香港藏家的影響。',
      ],
      table: {
        headers: ['日期', '變動', '對香港藏家的影響'],
        rows: [
          [
            '2026-02-10',
            'PSA 調整官方價目：Regular 由 US$74.99 加至 US$79.99',
            '代送服務費隨官方成本上調；舊價目表即時失效',
          ],
          [
            '2026-02-18',
            'PSA 香港收件中心（Submission Center）成立，亞太區（日本及中國除外）訂單改經香港',
            '可自行開設 Collectors 帳戶經尖沙咀收件中心送件，或繼續使用本地代送；評級仍在美國進行',
          ],
          [
            '2026-06-02',
            'Value 系列方案暫停接收新訂單（官網標示 Currently Unavailable）',
            '最低門檻一度升至 Regular；預算型批次需暫停或改送其他評級公司',
          ],
          [
            '2026-10-04',
            '價目與方案結構調整：Standard／Priority 等方案定價與預計工期更新',
            'Standard 預計工期縮短；代送價目表同步轉用新時段',
          ],
          [
            '2026-10-28/29',
            'Value 方案重開收件',
            '低價值卡（申報價值 USD 500 或以下）重新有預算選項；Appaw Store 服務費 HKD 390 起',
          ],
        ],
      },
      bridge: '以下逐項展開各變動的細節與核實方法，先講影響最深遠的香港收件中心。',
    },
    {
      id: 'hk-submission-center',
      title: '2026-02-18：PSA 香港收件中心成立',
      paragraphs: [
        'PSA 於 2026 年 2 月 18 日宣布成立香港收件中心。由當日起，亞太區客戶（日本及中國除外，涵蓋香港、澳門、新加坡、馬來西亞、台灣、泰國、菲律賓、印尼、南韓及越南）須經香港中心提交訂單，以減低美國關稅與清關延誤風險。卡片仍然送往美國 PSA 總部評級，完成後寄回香港中心，再轉交客戶。',
        '自行送件流程：首次使用須先申請將 IP 地址列入白名單（官方指需時約 3–5 個工作天），之後方可在 PSA Online Submission Center 建立訂單。收件地址為九龍尖沙咀廣東道 33 號中港城；亦可預約星期一至五辦公時間親自交件及取件。包裝要求為每張卡先放入卡套，再裝入 Card Saver 半硬卡夾，按訂單順序疊好；不接受硬卡夾或螺絲卡磚。',
        '香港中心接受標準尺寸卡、現代卡（1980 年起）、舊卡（1979 年或之前）、足球貼紙及 Dual Service；暫不接受卡包、門票、漫畫、雜誌、Reholder、Crossover、超大卡及 PSA Vault。進度方面，PSA 表明不會主動定期通知，客戶須自行上網查閱訂單狀態。',
      ],
      callout:
        '自行經官方中心送件與使用本地代送並不衝突：官方路線需自行處理開戶、填單、包裝及進度查詢；代送則由店方整合批次並跟進。兩者的評級工序相同，分別在於流程由誰處理。',
      bridge: '收件渠道變更之後，年中最影響預算的是 Value 系列停收。',
    },
    {
      id: 'value-pause',
      title: '2026-06-02：Value 系列停收',
      paragraphs: [
        'Value 系列原本是 PSA 門檻最低的方案：申報價值上限 USD 500，工期最長但單價最低，適合一次過提交大量低價值卡。2026 年 6 月 2 日起，PSA 將 Value 系列標示為暫停接收新訂單（Currently Unavailable），官方仍然開放的最低方案變成 Regular US$79.99（申報價值上限 USD 1,500，預計 70–80 個工作天）。對慣常以量取勝的批次而言，每張卡的送鑑成本即時跳升一截，不少藏家索性暫停送件。',
        '停收期間，部分店方仍沿用 Value 舊價目表招攬，方案其實已無法提交，下單前應以 PSA 官網的 Currently Unavailable 標示為準。預算型需求則流向其他評級公司（如 CGC），或者乾脆擱置送鑑計劃，等方案重開再算。',
      ],
      bridge: 'Value 停收四個多月後，PSA 先在 10 月初調整整體價目，再在月底重開 Value。',
    },
    {
      id: 'oct-fee-restructure',
      title: '2026-10-04：價目與預計工期調整',
      paragraphs: [
        '2026 年 10 月 4 日起，PSA 更新了方案價目與預計工期。以官方價目為準，主要方案為 Standard、Priority、Express、Super Express 及 Premier；與上一時段相比，Standard 及 Priority 的預計工期有所縮短。Appaw Store 價目表同日起轉用新時段，並保留舊時段價目供對照。',
        '以下為調整前後的預計工期對照（以 PSA 公布為準，實際以訂單正式登錄系統之日起計）：',
      ],
      table: {
        headers: ['方案', '申報價值上限', '調整前預計工期', '調整後預計工期'],
        rows: [
          ['Standard', 'USD 1,000', '約 90–100 個工作天', '約 70–80 個工作天'],
          ['Priority', 'USD 1,500', '約 70–80 個工作天', '約 50–60 個工作天'],
          ['Express', 'USD 2,500', '約 20–30 個工作天', '約 20–30 個工作天'],
          ['Super Express', 'USD 5,000', '約 7–10 個工作天', '約 7–10 個工作天'],
          ['Premier', 'USD 10,000', '約 7 個工作天', '約 7 個工作天'],
        ],
      },
      callout:
        '預計工期僅為官方估計，由 PSA 將訂單正式登錄系統之日起計，不包括來回運輸及未入系統前的等候。PSA 保留因收件量調整價格、方案及工期的權利。',
      bridge: '價目調整之後不到一個月，停收已久的 Value 系列正式回歸。',
    },
    {
      id: 'value-reopen',
      title: '2026-10-28/29：Value 方案重開',
      paragraphs: [
        '2026 年 10 月 28 日至 29 日，PSA 重開 Value 方案收件，結束自 6 月 2 日起近五個月的停收期。重開後條款維持：申報價值上限 USD 500，預計工期約 90–100 個工作天，為目前官方價目中單價最低的方案。Appaw Store 對應的 Value 服務費為 HKD 390 起；PSA 官方美元定價以官網價目頁為準。',
        '最直接的影響是低價值卡批次恢復可行：停收期間最低只能選 Regular US$79.99，現在預算型批次可以回到 Value。同一時間，10 月 4 日的新工期已經生效，Standard 及 Priority 的預計工期較停收前縮短，預算與速度之間的取捨要重新計算。還有一點值得留意：積壓數月的 Value 需求可能在短期內推高該方案的收件量，實際工期有機會偏離官方估計。',
        '實務建議：Value 重開不代表適合所有卡。申報價值一旦超出 USD 500 上限，PSA 有權強制升級方案並收取差額（Upcharge），補價後總成本可能高於直接選用 Standard。送件前應先參考近期成交價，確認卡片評級後市值不會接近上限。判斷哪些卡值得送鑑、哪些應留作裸卡買賣，可參考 [裸卡到受保護鑑定卡](/guides/grade-or-protect-first/) 的成本效益分析。',
      ],
      bridge: '政策變動如此頻密，與其依賴二手消息，不如學會自行核實。',
    },
    {
      id: 'how-to-verify',
      title: '如何自行核實 PSA 最新政策',
      paragraphs: [
        'PSA 官網價目頁是唯一即時反映變動的來源：方案開停（Currently Unavailable 標示）、美元定價及預計工期均以該頁為準。任何店方價目表（包括 Appaw Store）都是以官方價目為基礎加服務費，官方改價當日即時失效。',
        '結構性變動則要看 PSA 官方公告（Articles／News），例如香港收件中心成立及亞太區收件安排。此類公告通常先於價目頁更新，涉及收件渠道時須特別留意適用地區。',
        '店方層面，Appaw Store [PSA評級代送鑑定](/business/psa-grading/) 頁面的價目表設有新舊時段對照，會在官方調整後同步更新服務費。每批訂單的實際狀態，可憑登記的電話號碼及參考編號在 [進度查詢](/business/psa-grading/track/) 頁面核實。',
      ],
    },
  ],
  faq: [
    {
      q: '2026 年 Value 方案停收了多久？',
      a: 'PSA 於 2026 年 6 月 2 日起將 Value 系列標示為暫停接收新訂單，並於 2026 年 10 月 28 日至 29 日重開，停收期近五個月。停收期間官方最低可用方案一度為 Regular US$79.99（申報價值上限 USD 1,500）。',
    },
    {
      q: '香港收件中心成立後，卡是否在香港評級？',
      a: '不是。香港中心只負責收件及轉運，卡片仍然送往美國 PSA 總部評級，完成後寄回香港中心，再轉交客戶。',
    },
    {
      q: '2026 年 10 月價目調整後，哪些方案工期縮短了？',
      a: '以 PSA 公布為準，Standard 由約 90–100 個工作天縮短至約 70–80 個工作天，Priority 由約 70–80 個工作天縮短至約 50–60 個工作天；Express、Super Express 及 Premier 維持不變。預計工期由訂單正式登錄系統之日起計。',
    },
    {
      q: 'Value 重開後，什麼卡適合用 Value 方案？',
      a: '申報價值上限 USD 500、預計工期約 90–100 個工作天。適合評級後市值明顯低於上限、不急於取回的卡。若評級後市值超出上限，PSA 有權強制升級方案並收取差額；送件前應先參考近期成交價。',
    },
    {
      q: '本頁多久更新一次？',
      a: '本頁為持續更新文件，沒有固定週期：PSA 每有政策公告（方案開停、價目、工期、收件渠道），時間線與「最後更新」日期會相應修訂，並附官方來源連結。',
    },
  ],
  midCta: {
    afterSectionId: 'value-reopen',
    title: 'Value 重開，考慮是否送鑑？',
    body: '送件前先核實卡片評級後市值會否超出申報上限，並可使用免費置中工具自行篩選。確認方案後可預約 138 Arena 面交。',
    primary: { label: 'PSA評級代送鑑定價目', href: '/business/psa-grading/' },
    secondary: { label: '免費置中工具', href: '/tools/card-centering/' },
  },
  cta: {
    title: '以最新價目預約送件',
    body: 'Appaw Store 價目表設新舊時段對照，與 PSA 官方調整同步。預約後到銅鑼灣 138 Arena 當面交卡，憑登記的電話號碼及參考編號可查閱每批進度。',
    primary: { label: 'PSA評級代送鑑定', href: '/business/psa-grading/' },
    secondary: { label: '查詢批次進度', href: '/business/psa-grading/track/' },
  },
  relatedSlugs: [
    'hong-kong-tcg-grading-guide',
    'psa-grading-standards',
    'grade-or-protect-first',
    'psa-reholder-guide',
  ],
  sources: [
    {
      label: 'PSA 鑑定服務價目',
      href: 'https://www.psacard.com/services',
    },
    {
      label: 'PSA：亞太區客戶新提交流程（2026-02-18）',
      href: 'https://www.psacard.com/articles/articleview/15674/submitting-from-apac',
    },
    {
      label: 'PSA：香港收件中心成立公告',
      href: 'https://www.psacard.com/articles/articleview/15624/psa-expands-global-footprint-with-new-hong-kong-submission-center',
    },
    {
      label: 'Appaw Store PSA評級代送鑑定價目（新舊時段對照）',
      href: 'https://appaw.store/zh/business/psa-grading/',
    },
  ],
};

export default guide;
