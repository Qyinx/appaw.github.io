import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'regrade-or-reholder',
  title: 'PSA Regrade vs Reholder: When to Choose',
  badge: 'Slab Workflow',
  lead:
    'A scratched slab is not always a grading problem. Reholder fixes the shell. Regrade reopens the score. Pick wrong and you pay twice or lose a PSA 10 you already had.',
  published: '2026-06-13',
  updated: '2026-08-05',
  readTime: '9 min',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'Regrade risk', value: 'Downgrade likely on PSA 10' },
    { label: 'Reholder', value: 'Same grade, new case' },
    { label: 'Regrade', value: 'Full re-score, up or down' },
    { label: 'Reholder risk', value: 'Low (not zero)' },
  ],
  sections: [
    {
      id: 'why-it-matters',
      title: 'Shell wear is routine. Service choice is not.',
      paragraphs: [
        'In graded card collecting and resale, slab wear is routine, scratches, cloudy plastic, corner scuffs, faded labels. Reholder and regrade are the usual fixes, but they solve different problems.',
        'Reholder is a new jacket: better looks, grade usually unchanged. Regrade is a full physical: every subgrade re-opened, score can rise, hold, or drop. Know the gap before you pay either fee.',
      ],
      bridge: 'Cosmetic damage? Reholder first. Chasing a higher number? Read regrade next.',
    },
    {
      id: 'what-is-reholder',
      title: 'Reholder refreshes the shell, not the score',
      paragraphs: [
        'Reholder is PSA\'s baseline refresh service, the goal is to make an old slab look new again.',
        'PSA removes the card from the old case and seals it in current plastic and label stock. In most cases, your grade, certification number, and grading outcome stay the same.',
        'Use it when: the slab has light scratches, surface haze, minor corner wear, or slight label fade but the card inside is fine; you want a uniform look across a collection (e.g. all new-label holders); you care about display or resale appeal, not changing the number on the label.',
        'PSA still runs basic authenticity and integrity checks. New damage, colour loss, or other flags can trigger a full regrade and a grade change, low risk, but not zero.',
        'PSA\'s own guidance: reholder fits slabs with cosmetic holder issues and no serious card concerns. When the case is the only problem, reholder is the safest, cheapest path.',
      ],
      specs: [
        { label: 'Grade', value: 'Usually unchanged' },
        { label: 'Cert number', value: 'Often retained' },
        { label: 'Fee / turnaround', value: 'Lower / shorter' },
        { label: 'Risk', value: 'Low (not zero)' },
      ],
      bridge: 'Regrade is the opposite bet: full inspection, unpredictable label.',
    },
    {
      id: 'what-is-regrade',
      title: 'Regrade reopens every subgrade',
      paragraphs: [
        'Regrade is a full re-inspection, the same depth as submitting the card fresh.',
        'PSA re-scores corners, centering, edges, surface, and cleanliness under today\'s standards. The result can match your old label, jump (PSA 9 → 10), or fall (PSA 10 → 9 or lower).',
        'Use it when: you believe the card was under-scored and want to chase a higher grade; the slab is badly cracked or broken and the card must come out; you want today\'s grading rules applied to an older label; you accept downgrade risk for upside on market value.',
        'Downgrade risk is real on high grades, PSA 10 copies get scrutinised hardest. Since early 2025, Gem Mint front centering tightened to 55/45; slabs that passed under old rules may not today. Screen centering free in [Card Centering Tool](/tools/card-centering/) graded-slab mode before you mail.',
      ],
      specs: [
        { label: 'Grade', value: 'Can rise, hold, or drop' },
        { label: 'Cert number', value: 'Usually new number' },
        { label: 'Fee / turnaround', value: 'Higher / longer' },
        { label: 'Risk', value: 'High, downgrade common' },
      ],
    },
    {
      id: 'comparison',
      title: 'Reholder vs Regrade at a Glance',
      paragraphs: [
        'Core split: reholder refreshes the shell and usually keeps the grade; regrade re-opens the condition record with unpredictable results. Key rows below.',
      ],
      table: {
        headers: ['Item', 'Reholder', 'Regrade'],
        rows: [
          ['Grade change', 'Usually unchanged', 'Can rise, hold, or drop'],
          ['Inspection depth', 'Basic auth and integrity', 'Full re-score on all subgrades'],
          ['Best for', 'Light shell wear, uniform collection look', 'Chasing a higher grade, severe slab damage'],
          ['Fee', 'Lower', 'Higher'],
          ['Risk', 'Low (not zero)', 'High, downgrade likely'],
          ['Cert number', 'Often retained', 'Usually new number issued'],
          ['Registry photo', 'Often updated', 'Always rescanned'],
        ],
      },
    },
    {
      id: 'when-to-choose',
      title: 'Which One to Pick',
      paragraphs: [
        'Default to reholder when you want better looks or a matching set and the grade already satisfies you. Paying regrade fees when only the plastic failed burns cash.',
        'Choose regrade only when you explicitly want to chase a higher grade, or the slab is damaged enough that a full inspection is unavoidable. Run expected value: does upside cover fees plus downgrade loss?',
        'High-value warning: re-submitting PSA 10 is the riskiest bet, tiny flaws often return as PSA 9 and crush resale. Contact PSA support or submit through an authorised dealer when stakes are high.',
        'Decision flow: verify cert on [psacard.com/cert](https://www.psacard.com/cert) → flat front/back photos → graded-slab centering check → loupe corners and surface → reholder if only the case fails; regrade only when centering and eye appeal clearly beat the label and the math works. Hong Kong collectors can visit [138 Arena](/business/psa-grading/). We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection.',
      ],
    },
    {
      id: 'before-you-ship',
      title: 'Before You Ship',
      paragraphs: [
        'Shoot high-res photos and video from every angle. Document slab and card condition before the package leaves your hands. Hong Kong collectors can drop off at [138 Arena](/business/psa-grading/). We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection.',
        'Read PSA\'s current service terms: [psacard.com/services](https://www.psacard.com/services). Fees and workflows change over time.',
        'Declare insured value accurately. A visibly cracked slab often routes to review and raises the odds of a full regrade instead of a straight reholder.',
        'After either service, fit an outer [UV-rated protector](/products/psa-protectors/) before daily carry or card-meet hand-offs. Grader plastic is display-grade, not backpack armor.',
      ],
    },
    {
      id: 'bottom-line',
      title: 'Match the service to the problem',
      paragraphs: [
        'Reholder suits collectors who want clean display without touching the grade. Regrade suits collectors who accept downgrade risk for upside. Still unsure? Read [PSA 10 centering requirements](/guides/psa-10-centering-requirements/) and the [PSA slab authentication guide](/guides/identify-fake-psa-slabs/) before you mail valuable cardboard.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is PSA reholder?',
      a: 'PSA replaces the outer case and label stock while usually keeping the same grade and cert number. Best for cosmetic shell wear.',
    },
    {
      q: 'What is PSA regrade?',
      a: 'A full re-inspection under current standards. The grade can rise, hold, or drop. Downgrade risk is highest on PSA 10 copies.',
    },
    {
      q: 'Should I reholder or regrade a scratched slab?',
      a: 'Reholder if only the plastic failed and the grade satisfies you. Regrade only when you accept downgrade risk for upside.',
    },
  ],
  midCta: {
    afterSectionId: 'comparison',
    title: 'Not sure? Upload a photo and measure centering',
    body: 'In graded-slab mode, compare centering and downgrade risk before you mail. Hong Kong collectors can drop off at 138 Arena. We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection.',
    primary: { label: 'Free Centering Tool', href: '/tools/card-centering/' },
    secondary: { label: 'PSA 10 centering requirements', href: '/guides/psa-10-centering-requirements/' },
  },
  cta: {
    title: 'Screen centering before you mail',
    body: 'Upload a slab photo, switch to Graded slab mode, and read regrade upside vs downgrade risk, free in your browser.',
    primary: { label: 'Free Centering Tool', href: '/tools/card-centering/' },
    secondary: { label: 'Protect after reholder', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'identify-fake-psa-slabs', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA, Grading standards & holder services',
      href: 'https://www.psacard.com/services',
    },
  ],
};

export default guide;
