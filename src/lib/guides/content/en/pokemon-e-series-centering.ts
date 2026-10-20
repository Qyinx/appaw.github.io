import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'pokemon-e-series-centering',
  title: 'How to Measure Pokémon e-Series (e-Reader) Centering',
  badge: 'Centering',
  lead:
    'Pokémon e-Series (e-Reader) cards are dual-border: check each of two paired sides for 45/55. Do not compare left–right or top–bottom the way you would on a normal single-border card. Measure wrong before you submit and you can waste the grading fee; a centering pass still does not guarantee a PSA 10.',
  metaDescription:
    'e-Reader / e-Series cards are dual-border: compare the blue pair (top and right) and red pair (left and bottom) for 45/55, never left-right or top-bottom.',
  published: '2026-10-13',
  updated: '2026-10-20',
  readTime: '12 min',
  heroSpecs: [
    { label: 'Card layout', value: 'Dual-border: thin and thick borders on the same face' },
    { label: 'Blue pair (thin)', value: 'Compare top with right' },
    { label: 'Red pair (thick)', value: 'Compare left with bottom' },
    { label: 'Centering pass talk', value: 'Each paired side within 45/55' },
  ],
  sections: [
    {
      id: 'why-it-matters',
      title: 'Why e-Series centering must be measured correctly',
      paragraphs: [
        'If you measure centering wrong before you submit, you can waste the grading fee. Most single-border Pokémon cards let you compare left with right and top with bottom. Pokémon e-Series (also called e-Reader) cards use a dual-border layout: thin and thick borders sit on the same face, so single-border habits do not transfer.',
        'Centering is one of the few dimensions collectors can quantify in millimetres before paying a grading fee. Corners and surface usually need a loupe and experience, but border widths can be re-checked with a caliper or a flat scan. On a layout this unusual, knowing which sides to compare matters more than rushing into a booking.',
        'A centering pass still does not mean the whole card is a PSA 10. Corners, edges, and surface carry real weight. This guide only shows how to measure the two paired sides on e-Series cards so you can clear the most common structural mistake before you submit.',
      ],
      bridge: 'Once the stakes are clear, the next step is what dual-border actually looks like and why left–right fails.',
    },
    {
      id: 'dual-border-layout',
      title: 'Dual-border layout: thin and thick on one face',
      paragraphs: [
        'An e-Series / e-Reader front shows two border thicknesses at once. The thinner and thicker runs are not mirrored as a clean left–right or top–bottom pair. If you still compare left with right the way you would on a single-border card, the ratio has nothing to do with the pairs graders check, so a precise millimetre reading still answers the wrong question.',
        'In practice, first identify which sides are thin and which are thick, then form the pairs. The thin sides form the blue pair; the thick sides form the red pair. Work each pair on its own. Never mix a thin reading and a thick reading in the same ratio.',
        'The gold inner border is the end point that keeps measurements consistent. Measure from the physical outer edge of the card to the inner edge of the gold line, not to artwork edges or fuzzy print boundaries that shift from person to person.',
      ],
      bridge: 'With the layout in mind, three rules lock out the mistakes collectors make most often.',
    },
    {
      id: 'three-rules',
      title: 'Three rules you should not break',
      paragraphs: [
        'First, do not compare left with right. On e-Series cards those sides sit on different border thicknesses, so a left–right ratio is not the check that matters and can make a card look safer or worse than it is.',
        'Second, do not compare top with bottom. Top and bottom also sit on different thicknesses. The usual single-border “horizontal / vertical axis” habit has to stop here.',
        'Third, measure straight runs only: outer edge of the card to the inner edge of the gold border. Skip corners, curved art, and the bumps on the bottom edge. Those spots make millimetre readings jump and pull the 45/55 call off track.',
      ],
      bridge: 'With the rules fixed, here is how to choose a tool and take each side cleanly.',
    },
    {
      id: 'how-to-measure',
      title: 'How to measure each side',
      paragraphs: [
        'A digital caliper that reads to 0.1 mm or finer is the most repeatable option. A steady steel ruler plus magnification can work in a pinch, but repeats on the same side usually wander more than a caliper. For a digital assist, shoot a top-down macro or use a flat scan, then load it into our [free centering calculator](/tools/card-centering/). Many calculator defaults assume single-border left–right and top–bottom pairs, so on e-Series you still have to interpret the readings against the two paired sides yourself.',
        'On each side, take one straight stretch only: outer edge as the start, inner gold border as the end. Avoid corners, ink bleed, and warped paper. Measure the same side two or three times, keep the reading that repeats, and write it down before you move on.',
        'View the card from directly above when you photograph or scan. A tilted shot introduces perspective error that can shift the ratio by a few percentage points, especially on the narrow thin borders. Soft, even light helps; strong glare on the gold line can hide the true inner edge.',
      ],
      bridge: 'Once each side has a clean reading, the next step is deciding which pairs to compare.',
    },
    {
      id: 'two-paired-sides',
      title: 'The two paired sides: blue and red',
      paragraphs: [
        'On e-Reader cards you compare two paired sides, not neighbouring sides and not a simple left–right or top–bottom habit from single-border cards. The thin border forms the blue pair; the thick border forms the red pair. Calculate each pair on its own, then check both against 45/55.',
        'The blue pair (thin) compares top with right. The red pair (thick) compares left with bottom. A short mnemonic helps: thin is top and right; thick is left and bottom. If the pairs are wrong, every percentage that follows sits on a false premise.',
      ],
      table: {
        headers: ['Pair', 'Sides to compare', 'Border', 'How to calculate'],
        rows: [
          ['Blue pair (thin)', 'top and right', 'thin', 'Record both readings, then wider ÷ sum of both'],
          ['Red pair (thick)', 'left and bottom', 'thick', 'Record both readings, then wider ÷ sum of both'],
        ],
      },
      callout:
        'Use the millimetre readings on your own card. The worked example in the next section only shows the ratio formula; it is not a measured result from a specific card.',
      bridge: 'With both pairs identified, convert the millimetre readings into a 45/55 pass or fail.',
    },
    {
      id: 'centering-pass',
      title: 'What “centering pass” means: how to calculate 45/55',
      paragraphs: [
        'For each pair, work out the ratio on its own. The common rule of thumb is that each pair should fall within 45/55 to sit inside the PSA 10 centering band. In other words, the wider side must not exceed 55% of that pair’s combined width, and the narrower side should not fall below 45%.',
        'Steps: measure sides A and B for one pair, sum them as A + B, then compute max(A, B) ÷ (A + B). If the result is ≤ 0.55, that pair sits inside 45/55. If it is clearly above 0.55, the pair is outside the PSA 10 centering band under that framing.',
        'Worked example (thick red pair): suppose left is 7.5 mm and bottom is 6.6 mm, sum 14.1 mm. Wider side 7.5 ÷ 14.1 ≈ 0.532, about 53/47, still inside 45/55. If left becomes 8.4 mm and bottom stays 6.6 mm, sum 15.0 mm, wider side 8.4 ÷ 15.0 = 0.56, or 56/44, which breaks the 55/45 ceiling.',
        'Run the same check on the blue pair independently. A passing red pair does not rescue a failing blue pair. Both pairs must sit inside the band before you treat centering as cleared under that framing.',
      ],
      specs: [
        { label: 'Blue pair (thin)', value: 'Compare top with right; target ≤ 55/45' },
        { label: 'Red pair (thick)', value: 'Compare left with bottom; target ≤ 55/45' },
        { label: 'Pass condition', value: 'Both paired sides within 45/55' },
      ],
      bridge: 'Centering is only one part of the grade; after it passes, still check corners, surface, and whether the fee makes sense.',
    },
    {
      id: 'after-centering',
      title: 'After centering looks fine',
      paragraphs: [
        'Centering is only one part of the grade. Corner integrity, edge wear, surface dents, print flaws, and cleanliness can still drop the score. An e-Series card with clean paired sides can still miss PSA 10 if the corners are soft or the surface is scratched.',
        'If you plan to submit, cross-check our [PSA 10 centering requirements](/guides/psa-10-centering-requirements/) for how single-border front and back thresholds differ, and read [grading standards](/guides/psa-grading-standards/) for how other defects usually weigh in. On the money side, compare the grading fee with the price gap between your realistic grades so you are not paying full freight on a card that only barely clears centering while other flaws stack up.',
        'Hong Kong collectors can book through Appaw [PSA grading submission](/business/psa-grading/) and complete face-to-face intake at 138 Arena. A preliminary inspection on arrival is a reference only; PSA sets the final grade.',
      ],
      bridge: 'Before you pay the fee, clear the mistakes collectors make most often on this layout.',
    },
    {
      id: 'common-mistakes',
      title: 'Common measurement and judgment mistakes',
      paragraphs: [
        'Comparing left and right: that is a single-border habit and produces a ratio graders do not use on e-Series cards, so you can overrate or underrate centering.',
        'Comparing top and bottom: those sides sit on different thicknesses, so the habit misleads in the same way.',
        'Measuring corners, curved art, or bottom bumps: a distorted reading makes the 45/55 check unreliable; go back to a straight run from outer edge to inner gold border.',
        'Checking only one pair: a passing blue pair does not clear a failing red pair; both must pass.',
        'Assuming a centering pass means PSA 10 overall: corners, edges, and surface still matter. Passing centering is not a full grade promise.',
        'Judging the gold inner edge from a tilted or glare-heavy photo: perspective and reflection hide the true boundary; switch to a top-down shot or a flat scan.',
      ],
    },
    {
      id: 'bottom-line',
      title: 'Confirm both paired sides before you pay the fee',
      paragraphs: [
        'The core of e-Series / e-Reader centering is one sentence: use two paired sides (thin top with right, thick left with bottom), check each for 45/55, and do not fall back to left–right or top–bottom. Measure only straight runs from outer edge to inner gold border, and skip corners and bumps.',
        'After both pairs pass, still check corners, surface, and market spread before you pay. If the pairs or measure points are wrong, every percentage that follows sits on a false premise. Measure correctly first, then decide whether to submit. That is the lowest-cost filter you have.',
      ],
    },
  ],
  faq: [
    {
      q: 'Why can’t I compare left and right on e-Reader cards?',
      a: 'e-Series / e-Reader cards are dual-border. The thin and thick borders form two paired sides (top with right, and left with bottom), not the usual left–right or top–bottom pairs. A left–right ratio is not the check used for this layout.',
    },
    {
      q: 'Which sides belong to the blue pair and the red pair?',
      a: 'The blue pair (thin) compares top with right. The red pair (thick) compares left with bottom. Calculate each pair on its own and do not mix readings across pairs.',
    },
    {
      q: 'What is the 45/55 check in this guide?',
      a: 'For each paired side, the ratio should fall within 45/55: the wider side must not exceed 55% of that pair’s combined width. That is a centering guideline, not a full grade guarantee.',
    },
    {
      q: 'Does passing centering mean PSA 10?',
      a: 'No. Corner integrity, edges, and surface still matter. Passing centering does not mean the whole card is a PSA 10.',
    },
    {
      q: 'What tool should I use to measure?',
      a: 'A digital caliper is ideal for measuring outer edge to inner gold border on a straight run. A flat scan can help you double-check. Skip corners and bottom bumps so the reading stays accurate.',
    },
  ],
  midCta: {
    afterSectionId: 'two-paired-sides',
    title: 'Check margins before you pay the fee',
    body: 'Use a flat scan or caliper readings on both paired sides, then decide whether submission still makes sense. Hong Kong collectors can book PSA grading submission and complete face-to-face intake at 138 Arena.',
    primary: { label: 'Free Centering Calculator', href: '/tools/card-centering/' },
    secondary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
  },
  cta: {
    title: 'Margins look good? Arrange submission',
    body: 'If both paired sides look inside 45/55 and the rest of the card looks strong, book online and complete face-to-face intake at 138 Arena: 138 Arena handles the venue and collects payment, while Appaw Store runs PSA grading submission and follow-up. The preliminary inspection on arrival is a reference only; PSA sets the final grade.',
    primary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
    secondary: { label: 'PSA 10 centering requirements', href: '/guides/psa-10-centering-requirements/' },
  },
  relatedSlugs: [
    'psa-10-centering-requirements',
    'psa-grading-standards',
    'grade-or-protect-first',
    'hong-kong-tcg-grading-guide',
  ],
  sources: [
    {
      label: 'PSA grading standards (official site)',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'Bulbapedia, e-Reader (e-Series overview)',
      href: 'https://bulbapedia.bulbagarden.net/wiki/E-Reader',
    },
  ],
};

export default guide;
