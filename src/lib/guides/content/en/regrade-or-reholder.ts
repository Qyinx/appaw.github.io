import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'regrade-or-reholder',
  title: 'PSA Regrade vs Reholder — When to Choose Each',
  description:
    'Reholder keeps your grade and fixes the case. Regrade re-scores every subgrade and can upgrade or downgrade. Screen centering on a slab photo before you pay either fee.',
  badge: 'Slab Workflow',
  lead:
    'A cracked corner on the plastic, a foggy label, or a nagging feeling that your PSA 9 "looks like a 10" — collectors hit these forks often. Reholder and regrade are not the same service. Pick wrong and you either waste money or lose a grade you already earned.',
  published: '2026-06-13',
  updated: '2026-06-13',
  readTime: '7 min',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'Reholder', value: 'Same grade, new case' },
    { label: 'Regrade', value: 'Full re-score — up or down' },
    { label: 'Screen first', value: 'Centering from slab photo' },
    { label: 'PSA 10 front (2025+)', value: '55/45 or better' },
  ],
  sections: [
    {
      id: 'regrade-vs-reholder',
      title: 'What Is the Difference Between PSA Regrade and Reholder?',
      paragraphs: [
        'PSA reholder replaces the outer holder and label when the card inside is unchanged and PSA approves the request. Your numeric grade stays the same — PSA 9 remains PSA 9. Collectors use it for cracked cases, scratched plastic, faded labels, or upgrading to a newer holder style.',
        'PSA regrade sends the card through full grading again. Every subgrade — centering, corners, edges, surface — is scored under today\'s standards. The result can match your old label, jump from PSA 9 to PSA 10, or drop from PSA 10 to PSA 9 or lower.',
        'Crossover and review services follow similar risk profiles: you are asking PSA to re-open the card\'s condition record. Budget for downgrade risk, not just upside.',
      ],
    },
    {
      id: 'when-reholder',
      title: 'When Reholder Is the Safer Choice',
      paragraphs: [
        'Choose reholder when the card and grade are fine but the shell is not: hairline cracks at screw posts, cloudy inner plastic, label peeling, or a case style that hurts display value. None of those change what graders would score on the cardboard.',
        'Reholder is also the right call when centering on a straight slab photo already matches or exceeds your current label and you have no reason to believe corners or surface were under-scored. Paying regrade fees when the case is the only problem burns cash.',
        'If you bought a slab online and cert verification passes but the holder looks abused in hand, reholder plus an outer [UV-rated protector](/products/psa-protectors/) is a common Hong Kong collector path before shelving or trading.',
      ],
    },
    {
      id: 'when-regrade',
      title: 'When Regrade May Be Worth the Fee',
      paragraphs: [
        'Regrade makes sense when you have evidence the card exceeds its label — not just hope. Strong signals: flat scans showing Gem Mint centering on a PSA 9, documented surface improvement after careful cleaning (only where safe for cardboard), or a pre-2025 PSA 10 front that would fail today\'s 55/45 rule and you want confirmation.',
        'Run the numbers. Expected value = (probability of higher grade × price at higher grade) − (probability of lower grade × loss) − service fees − shipping and insurance. One chase Pokémon or sports rookie can justify the bet; a stack of bulk modern copies rarely does.',
        'Use our free [Card Centering Tool](/tools/card-centering/) in Graded slab mode. Correct tilt with Adjust image, align guides on the card face inside the plastic, and read the screening line. Centering worse than PSA 8 tolerance is a downgrade risk flag before you submit.',
      ],
      specs: [
        { label: 'Reholder', value: 'Case / label issue only' },
        { label: 'Regrade', value: 'Believe subgrades beat label' },
        { label: 'Screen', value: 'Centering + corners + surface' },
      ],
    },
    {
      id: 'downgrade-risk',
      title: 'Can Regrading Downgrade Your Card?',
      paragraphs: [
        'Yes. Mechanical regrade is not a free lottery ticket. PSA 10 copies from older holder eras sometimes return as PSA 9 when front centering is measured at 58/42 under the 2025 Gem Mint front rule, or when surface specks that passed years ago fail today.',
        'Centering is the subgrade you can pre-check from photos. If our analyzer shows front margins beyond 65/35, treat regrade as high downgrade risk unless you accept a PSA 7 or 8 outcome. Slab glare hides skew — shoot straight-on or scan through the case.',
        'Reholder on an approved standard request does not re-open subgrades. That is why "case looks bad, centering looks great" almost always points to reholder first.',
      ],
    },
    {
      id: 'workflow',
      title: 'A Practical Decision Workflow',
      paragraphs: [
        'Step 1 — Verify the cert on psacard.com. Step 2 — Photograph front and back flat. Step 3 — Measure centering in Graded slab mode. Step 4 — Loupe corners and surface under good light. Step 5 — If only the case fails, request reholder. If centering and eye appeal beat the label and math works, consider regrade.',
        'After either service, fit a magnetic outer case before daily carry or Hong Kong card-meet hand-offs. Grader plastic is display-grade, not backpack armor.',
        'Still unsure? Read [PSA 10 centering requirements](/guides/psa-10-centering-requirements/) and [spot fake PSA slabs](/guides/identify-fake-psa-slabs/) before you mail valuable cardboard.',
      ],
    },
  ],
  cta: {
    title: 'Screen centering before you mail',
    body: 'Upload a slab photo, switch to Graded slab mode, and read regrade vs downgrade risk from centering — free in your browser.',
    primary: { label: 'Free Centering Tool', href: '/tools/card-centering/' },
    secondary: { label: 'Protect after reholder', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'identify-fake-psa-slabs', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA — Grading standards & holder services',
      href: 'https://www.psacard.com/services',
    },
  ],
};

export default guide;
