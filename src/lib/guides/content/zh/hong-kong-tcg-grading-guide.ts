import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'hong-kong-tcg-grading-guide',
  title: '香港 TCG 卡牌提交鑑定：138 Arena PSA 代送流程',
  badge: '香港',
  lead:
    '香港 TCG 收藏家可於銅鑼灣 138 Arena 面交評估卡況及提交鑑定，代送寶可夢、One Piece、MTG 及運動卡至 PSA。服務費由 HKD 850 起。每批附有 BAT 參考編號，可於網上查看現有進度。',
  published: '2026-07-13',
  updated: '2026-07-13',
  readTime: '7 分鐘',
  heroImage: '/images/background/psa-grading-standards.png',
  heroSpecs: [
    { label: '交收地點', value: '銅鑼灣 138 Arena' },
    { label: '服務費', value: 'HKD 850 起（REG）' },
    { label: '進度查詢', value: '電話 + BAT 編號' },
    { label: '卡牌類別', value: 'PTCG、One Piece、MTG、運動卡' },
  ],
  sections: [
    {
      id: 'who-this-is-for',
      title: '誰適合香港 TCG 提交鑑定',
      paragraphs: [
        '此流程適合欲將寶可夢 TCG、One Piece、Magic: The Gathering 或運動卡送交 PSA 鑑定的香港收藏家。Appaw 於 138 Arena 面交收件後，代您協調送交 PSA。',
        '接受裸卡或套袋卡。高價值卡牌或需配合 PSA 服務等級填寫申報價值文件。支付鑑定費用前，建議先以置中工具檢查邊距，現代 TCG 印刷品的 PSA 10 置中要求相當嚴格。',
      ],
    },
    {
      id: 'how-it-works',
      title: '由面交提交到鑑定卡磚',
      paragraphs: [
        '先預約銅鑼灣 138 Arena 面交時段，帶同卡牌、所選 PSA 服務等級及聯絡電話。店員核對清單後，按等級分配 BAT 批次參考編號，再轉送 PSA 鑑定。',
        'PSA 鑑定期間，各階段進度會同步至 [PSA 代送進度查詢](/business/psa-grading/track/)。您須同時輸入收據上的電話號碼及 BAT 參考編號，方可查看批次現有進度。',
        '鑑定卡磚返港後，我們會發出取件通知。請於指定期限內到 138 Arena 取件。展示或寄送前，建議加裝 [鑑定卡保護殼](/products/psa-protectors/)。',
      ],
      bridge: '提交鑑定前先檢查置中。',
    },
    {
      id: 'before-you-submit',
      title: '提交鑑定前置中檢查',
      paragraphs: [
        'PSA 會評估置中、邊角、邊緣及表面。只有置中可於提交鑑定前以照片先行篩選。請使用免費 [卡牌置中工具](/tools/card-centering/)，對照 PSA 10 門檻（正面 55/45、背面 75/25）。',
        '裸卡經濟效益及鑑定後外層保護，可參閱 [裸卡到受保護鑑定卡](/guides/grade-or-protect-first/) 及 [PSA 10 置中要求](/guides/psa-10-centering-requirements/)。',
      ],
    },
  ],
  faq: [
    {
      q: '香港 TCG 卡牌可以提交 PSA 鑑定嗎？',
      a: '可以。寶可夢 TCG、One Piece、MTG 及運動卡之裸卡或套袋卡，均可於 138 Arena 透過 Appaw 代送鑑定服務提交。',
    },
    {
      q: '如何查看批次現有進度？',
      a: '於查詢頁面輸入收據上的電話號碼及 BAT 參考編號，兩者缺一不可。',
    },
    {
      q: '接受郵寄提交嗎？',
      a: '不接受。僅限於 138 Arena 面交評估卡況及提交鑑定及取件。',
    },
  ],
  cta: {
    title: '預約香港 PSA 代送鑑定',
    body: '銅鑼灣 138 Arena 面交收件。憑電話及 BAT 參考編號查看每批現有進度。',
    primary: { label: 'PSA 代送鑑定', href: '/business/psa-grading/' },
    secondary: { label: '免費置中工具', href: '/tools/card-centering/' },
  },
  relatedSlugs: ['psa-grading-standards', 'psa-10-centering-requirements', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA 鑑定服務',
      href: 'https://www.psacard.com/services',
    },
    {
      label: 'Appaw PSA 代送鑑定',
      href: 'https://appaw.store/zh/business/psa-grading/',
    },
  ],
};

export default guide;
