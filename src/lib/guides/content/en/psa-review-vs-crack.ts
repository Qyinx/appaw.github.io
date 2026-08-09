import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-review-vs-crack',
  title: 'PSA Regrade Strategy: Review vs Crack & Resubmit',
  badge: 'Advanced Strategy',
  lead:
    'For advanced collectors, upgrading a PSA 9 to a PSA 10 is the ultimate value multiplier. However, submitting an encased card for a PSA Review is notoriously difficult due to anchoring bias. Cracking the slab and submitting it raw eliminates this bias but introduces significant downgrade risks. Always run the Expected Value (EV) math before deciding to break plastic.',
  published: '2026-08-09',
  updated: '2026-08-09',
  readTime: '10 min',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    {
      label: 'Review (In Slab)',
      value: 'Zero downgrade risk, but success rate is extremely low due to anchoring bias',
    },
    {
      label: 'Crack & Resubmit',
      value: 'Submitting raw eliminates bias but exposes you to strict current standards and downgrades',
    },
    {
      label: 'EV Threshold',
      value: 'The expected value of a regrade should be 1.5x to 2x the current slab value',
    },
    {
      label: 'Crossover Minimum',
      value: 'You can set a Minimum Grade when crossing BGS/CGC slabs over to PSA',
    },
  ],
  sections: [
    {
      id: 'anchoring-effect',
      title: 'Why PSA Reviews rarely work',
      paragraphs: [
        'PSA offers a "Review" service, which allows you to submit a graded card in its current holder to be evaluated for a higher grade. The main appeal of this route is safety: if the grader decides the card does not warrant a bump, they leave it in its original slab and return it to you with the grade intact.',
        'Despite the safety net, experienced collectors rarely use this service. The culprit is anchoring bias. When a grader looks at a card already labeled a PSA 9, human nature prompts them to look for the flaw that kept it from being a 10, rather than evaluating it with a blank slate.',
        'Overcoming the decision of the previous grader requires overwhelming evidence of a mistake. As a result, in-slab Reviews often end in paying full grading fees just to have the card returned exactly as it was. For those who truly believe their card is underscored, cracking the slab has become the default strategy.',
      ],
      bridge: 'If a Review is too heavily biased, cracking the slab offers a fresh start—but with severe consequences if you are wrong.',
    },
    {
      id: 'crack-and-resubmit',
      title: 'The risks of Crack & Resubmit',
      paragraphs: [
        'Cracking and resubmitting means physically breaking the PSA slab, removing the card, and submitting it as a raw, unassessed item. This entirely removes the anchoring bias, forcing the grader to evaluate the card strictly on its current merits without any historical context.',
        'While the upside of securing a fresh PSA 10 is massive, the risks are equally steep. First is the physical danger: cracking a sonic-welded slab requires precision, and one slip of a tool can dent a corner or scratch the surface, destroying the card’s value instantly. Second is the downgrade risk. PSA tightened its Gem Mint 10 centering standards to a strict 55/45 ratio in 2025. A card that squeaked by as a 9 years ago might legitimately be an 8 under today’s microscope.',
        'This is a one-way street. Once the plastic is broken, the price floor of the PSA 9 is gone. If the card comes back an 8, you have paid grading fees twice to actively destroy your own equity.',
      ],
      bridge: 'To navigate these high-stakes decisions rationally, collectors must rely on probability math rather than gut feeling.',
    },
    {
      id: 'expected-value-math',
      title: 'The Expected Value (EV) framework',
      paragraphs: [
        'Never crack a slab based on intuition. Use an Expected Value (EV) check first to see whether the upside covers the downside and fees.',
        'Consider a card worth $200 in a PSA 9, $800 in a PSA 10, and $50 in a PSA 8. If you are highly confident (60% chance of a 10, 40% chance of an 8), and grading costs $50, your EV is ($800 × 0.6) + ($50 × 0.4) - $50 = $450. Because $450 is significantly higher than your current $200 baseline, cracking makes mathematical sense.',
        'Rule of thumb: Only attempt a crack and resubmit if the calculated EV is at least 1.5x to 2x the value of your current slab, and only if you have rigorously pre-screened the card yourself. Hong Kong collectors can also drop off at [138 Arena](/business/psa-grading/) before cracking: Appaw’s on-site preliminary inspection checks centering, surface dents, and corners, then estimates a realistic grade band. Basic cleaning before submission further reduces point-deduction risk from dust or oils.',
      ],
      formula: {
        result: 'Expected Value (EV)',
        eyebrow: 'Crack decision math',
        terms: [
          { text: 'PSA 10 value × upgrade probability', hint: 'Payoff if it lands a 10' },
          { op: '+', text: 'PSA 8 value × downgrade probability', hint: 'Payoff if it falls to an 8' },
          { op: '−', text: 'Submission & shipping fees', hint: 'Costs subtracted once' },
        ],
      },
      bridge: 'If you are dealing with slabs from competitors like BGS or CGC, the math shifts slightly due to the Crossover service.',
    },
    {
      id: 'crossover-minimum-grade',
      title: 'Crossing over from BGS/CGC',
      paragraphs: [
        'If you want to move a BGS or CGC slab into a PSA holder, you can use PSA’s Crossover service. This allows you to submit the card in its competitor slab while specifying a "Minimum Grade" on your submission form.',
        'For example, you can submit a BGS 9.5 and set the Minimum Grade to PSA 10. The grader evaluates the card through the BGS plastic. If they believe it meets the PSA 10 standard, they break it out and reslab it. If they feel it falls short of your minimum, they return it untouched in the BGS slab (though you still pay the grading fee).',
        'While this sounds ideal, it suffers from the same anchoring bias and visibility issues as a Review. Graders are naturally conservative when evaluating surface condition through thick, scuffed competitor plastic. Consequently, many high-end collectors still prefer cracking BGS slabs themselves to ensure a fair, raw evaluation by PSA. Once you commit to a raw resubmission, Hong Kong collectors can hand cards to Appaw’s PSA proxy at 138 Arena for batched shipping and online progress tracking.',
      ],
    },
  ],
  faq: [
    {
      q: 'Will my card get downgraded if a PSA Review fails?',
      a: 'No. If the grader determines your card does not meet the higher grade, it will be returned to you in its original holder with the original grade intact. There is no downgrade risk, though you still lose the grading fee.',
    },
    {
      q: 'Why do collectors crack slabs instead of using Review?',
      a: 'Cracking a slab removes anchoring bias. When a grader sees a card already graded a 9, they instinctively look for the flaw. Submitting it raw forces a completely fresh, unbiased evaluation.',
    },
    {
      q: 'What are the risks of cracking a slab?',
      a: 'You face physical risk (accidentally damaging the card while breaking the plastic) and grade risk (today’s stricter standards might result in a lower grade than the card originally held).',
    },
    {
      q: 'Can Hong Kong collectors submit crack-and-resubmit or crossover through a proxy?',
      a: 'Yes. Drop off at 138 Arena in Causeway Bay. Appaw provides on-site preliminary condition checks and basic cleaning, then batches cards to PSA. Screening before you crack helps you decide whether the EV justifies the downgrade risk.',
    },
  ],
  midCta: {
    afterSectionId: 'expected-value-math',
    title: 'Screen on-site before you crack',
    body: 'Hong Kong collectors can visit 138 Arena for Appaw’s centering, surface, and corner check—then decide whether crack-and-resubmit is still worth it.',
    primary: { label: 'PSA submission (HK)', href: '/business/psa-grading/' },
    secondary: { label: 'Free Centering Tool', href: '/tools/card-centering/' },
  },
  cta: {
    title: 'Screen first, then submit in Hong Kong',
    body: 'PSA 10 now requires a strict 55/45 front centering ratio. Run the free centering tool before you destroy a slab. Hong Kong collectors can also drop off at 138 Arena: Appaw provides professional inspection and basic cleaning, helping you chase the best grade without paying fees on cards that should stay put.',
    primary: { label: 'PSA submission (HK)', href: '/business/psa-grading/' },
    secondary: { label: 'Free Centering Tool', href: '/tools/card-centering/' },
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
