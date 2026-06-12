import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'regrade-or-reholder',
  title: 'PSA 重評 vs 換殼 — 如何選擇',
  description:
    '換殼保留原評級並更換外殼；重評重新檢查所有子項，可能升級或降級。付費前先以鑑定卡照片篩選置中。',
  badge: '鑑定卡流程',
  lead:
    '殼角破裂、標籤模糊，或覺得 PSA 9「看起來像 10」——收藏家常面臨這個分岔。換殼與重評不是同一項服務。選錯要么白費錢，要么丟掉已有評級。',
  published: '2026-06-13',
  updated: '2026-06-13',
  readTime: '7 分鐘',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: '換殼', value: '同評級，新外殼' },
    { label: '重評', value: '全面重評 — 可升可降' },
    { label: '先篩選', value: '磚照置中檢查' },
    { label: 'PSA 10 正面 (2025+)', value: '55/45 或更佳' },
  ],
  sections: [
    {
      id: 'regrade-vs-reholder',
      title: 'PSA 重評與換殼有何分別？',
      paragraphs: [
        'PSA 換殼在卡面不變且 PSA 批准申請後，更換外殼與標籤。數字評級不變——PSA 9 仍是 PSA 9。適用於殼體破裂、塑膠刮痕、標籤褪色，或升級至新款殼體。',
        'PSA 重評將卡牌重新送檢。置中、四角、邊緣、表面均依現行標準評分。結果可能與舊標籤相同、由 PSA 9 升至 PSA 10，或由 PSA 10 降至 PSA 9 或更低。',
        '交叉評級及覆核服務風險類似：您要求 PSA 重新打開卡牌狀況記錄。預算須涵蓋降級風險，而非只計升值。',
      ],
    },
    {
      id: 'when-reholder',
      title: '何時換殼較安全',
      paragraphs: [
        '卡面與評級無問題但外殼欠佳時選換殼：螺絲位細裂、內層塑膠發霧、標籤剝落，或舊款殼影響展示。這些不會改變紙卡本身的評分。',
        '若在平整磚照上置中已達或超過現有標籤，且無理由懷疑四角或表面被低估，亦應換殼而非重評。殼體是唯一問題時付重評費用屬浪費。',
        '網購鑑定卡且證書核實通過，但實物殼體受損，常見做法是換殼後再加裝 [抗 UV 外殼](/products/psa-protectors/)，再上架或交易。',
      ],
    },
    {
      id: 'when-regrade',
      title: '何時值得考慮重評',
      paragraphs: [
        '有證據顯示卡牌優於標籤——而非單憑感覺——才考慮重評。強信號：平整掃描顯示 Gem Mint 置中但標籤為 PSA 9；或 pre-2025 PSA 10 正面在現行 55/45 下需確認。',
        '先算期望值：（較高評級概率 × 較高評級價格）−（較低評級概率 × 損失）− 服務費 − 運費及保險。一張追逐級寶可夢或運動卡新秀或可賭；大量現代普卡批量重評通常不划算。',
        '使用免費 [卡牌置中工具](/tools/card-centering/) 的「鑑定卡」模式。以「調整圖片」校正傾斜，將導線對齊殼內卡面，閱讀篩選結果。置中低於 PSA 8 容差即為送重評前的降級風險訊號。',
      ],
      specs: [
        { label: '換殼', value: '僅殼體／標籤問題' },
        { label: '重評', value: '相信子項優於標籤' },
        { label: '篩選', value: '置中 + 四角 + 表面' },
      ],
    },
    {
      id: 'downgrade-risk',
      title: '重評會令卡牌降級嗎？',
      paragraphs: [
        '會。機械重評不是免費抽獎。舊殼時代的 PSA 10 在 2025 正面 55/45 規則下量得 58/42，或當年通過的表面瑕疵現今不通過，可能變為 PSA 9。',
        '置中是唯一能從照片預查的子項。若分析器顯示正面邊距超過 65/35，除非接受 PSA 7 或 8，否則應視重評為高降級風險。殼體反光會隱藏偏斜——請正上方拍攝或穿透殼體掃描。',
        '獲批准的標準換殼申請不會重新打開子項。因此「殼體差、置中好」幾乎總應先換殼。',
      ],
    },
    {
      id: 'workflow',
      title: '實用決策流程',
      paragraphs: [
        '第一步——在 psacard.com 核實證書。第二步——平整拍攝正反面。第三步——以鑑定卡模式量度置中。第四步——在良好光線下用放大鏡檢查四角與表面。第五步——僅殼體不合格則換殼；若置中與肉眼觀感優於標籤且數字合理，再考慮重評。',
        '無論哪項服務，日常攜帶或香港卡展交接前應裝磁吸外殼。評級殼為展示級，非背包防護。',
        '仍不確定？寄出高價卡前先閱讀 [PSA 10 置中標準](/guides/psa-10-centering-requirements/) 及 [辨識假 PSA 殼](/guides/identify-fake-psa-slabs/)。',
      ],
    },
  ],
  cta: {
    title: '寄出前先篩選置中',
    body: '上傳鑑定卡照片、切換鑑定卡模式，依置中閱讀重評升值與降級風險——瀏覽器免費使用。',
    primary: { label: '免費置中工具', href: '/tools/card-centering/' },
    secondary: { label: '換殼後加裝保護', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'identify-fake-psa-slabs', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA — 評級標準及殼體服務',
      href: 'https://www.psacard.com/services',
    },
  ],
};

export default guide;
