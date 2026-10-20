import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-review-vs-crack',
  title: 'PSA Regrade Strategy: Review vs Crack & Resubmit',
  badge: 'Advanced Strategy',
  lead:
    'Only chase a PSA 10 when the expected value reaches 1.5 to 2 times the current slab value. An in-slab PSA Review is the safe route but rarely upgrades, because the grader already sees the existing 9. Cracking the slab removes that anchoring bias but can return a lower grade, so run the expected-value math before you break the plastic.',
  metaDescription:
    'PSA Review rarely upgrades a 9 because graders already see the label. Crack and resubmit removes bias but can drop the grade. Run EV math before you crack.',
  published: '2026-08-09',
  updated: '2026-10-20',
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
        'PSA offers a "Review" service, which allows you to submit a graded card in its current holder to be evaluated for a higher grade. The main appeal of this route is safety: if the grader decides the card does not warrant a bump, they leave it in its original slab and return it with the grade intact.',
        'Despite the safety net, experienced collectors rarely use this service, and the reason is anchoring bias. When a grader looks at a card already labeled a PSA 9, human nature prompts them to hunt for the flaw that kept it from a 10, rather than evaluating the card with a blank slate.',
        'Overcoming the decision of the previous grader requires overwhelming evidence of a mistake. As a result, in-slab Reviews often end in paying full grading fees just to have the card returned exactly as it was. For collectors who truly believe their card is underscored, cracking the slab has become the default strategy.',
      ],
      bridge: 'If a Review is too heavily biased, cracking the slab offers a fresh start, but the cost of being wrong is severe.',
    },
    {
      id: 'crack-and-resubmit',
      title: 'The risks of Crack & Resubmit',
      paragraphs: [
        'Cracking and resubmitting means physically breaking the PSA slab, removing the card, and submitting it as a raw, unassessed item. This entirely removes the anchoring bias, forcing the grader to evaluate the card strictly on its current merits without any historical context.',
        'The upside is a fresh PSA 10, but two risks travel with it. First is the physical danger: cracking a sonic-welded slab requires precision, and one slip of a tool can dent a corner or scratch the surface, destroying the card\'s value instantly. Second is the downgrade risk. PSA tightened its Gem Mint 10 centering standard to 55/45 in 2025, so a card that squeaked by as a 9 years ago might legitimately be an 8 under today\'s standards.',
        'Once cracked, there is no going back. You risk damaging the card while opening the holder, you lose the PSA 9 label as a price floor, and if the new grade comes back lower you will have paid grading fees twice while the card\'s market value falls.',
      ],
      bridge: 'Decisions this expensive should not run on gut feeling. The next section turns them into arithmetic.',
    },
    {
      id: 'expected-value-math',
      title: 'The Expected Value (EV) framework',
      paragraphs: [
        'Never crack a slab based on intuition. Run an Expected Value (EV) check first to see whether the upside covers the downside and the fees.',
        'Consider a card worth $200 in a PSA 9, $800 in a PSA 10, and $50 in a PSA 8. If you are highly confident (60% chance of a 10, 40% chance of an 8), and grading costs $50, your EV is ($800 × 0.6) + ($50 × 0.4) − $50 = $450. Because $450 is significantly higher than your current $200 baseline, cracking makes mathematical sense.',
        'Rule of thumb: only attempt a crack and resubmit if the calculated EV is at least 1.5x to 2x the value of your current slab, and only after screening the card against current PSA centering and surface standards. Hong Kong collectors can drop off at [138 Arena](/business/psa-grading/) before cracking: Appaw Store completes a preliminary inspection of centering, surface dents, and corners as a decision aid (a reference only; PSA sets the final grade), while 138 Arena handles the venue and collects payment.',
      ],
      table: {
        headers: ['Factor', 'Review (In Slab)', 'Crack & Resubmit'],
        rows: [
          ['Downgrade risk', 'None; grade stays if rejected', 'Full; card can return lower'],
          ['Anchoring bias', 'High; grader sees the old label', 'None; evaluated as raw'],
          ['Physical risk', 'None; slab stays sealed', 'Card can be damaged while cracking'],
          ['Cert number', 'Original kept', 'New cert number issued'],
          ['Best for', 'Low-value slabs, risk-averse owners', 'High-value 9s with EV ≥ 1.5–2x'],
        ],
      },
      formula: {
        result: 'Expected Value (EV)',
        eyebrow: 'Crack decision math',
        terms: [
          { text: 'PSA 10 value × upgrade probability', hint: 'Payoff if it lands a 10' },
          { op: '+', text: 'PSA 8 value × downgrade probability', hint: 'Payoff if it falls to an 8' },
          { op: '−', text: 'Submission & shipping fees', hint: 'Costs subtracted once' },
        ],
      },
      bridge: 'If you are dealing with slabs from competitors like BGS or CGC, the math shifts slightly because of the Crossover service.',
    },
    {
      id: 'crossover-minimum-grade',
      title: 'Crossing over from BGS/CGC',
      paragraphs: [
        'If you want to move a BGS or CGC slab into a PSA holder, you can use PSA\'s Crossover service. This allows you to submit the card in its competitor slab while specifying a "Minimum Grade" on your submission form.',
        'For example, you can submit a BGS 9.5 and set the Minimum Grade to PSA 10. The grader evaluates the card through the BGS plastic. If they believe it meets the PSA 10 standard, they break it out and reslab it. If they feel it falls short of your minimum, they return it untouched in the BGS slab, though you still pay the grading fee.',
        'A minimum grade reduces surprise downgrades, but the same anchoring and through-plastic visibility limits apply. Graders are naturally conservative when judging surface condition through thick, scuffed competitor plastic, so many advanced collectors still crack BGS slabs themselves before a raw PSA submission. Once you commit to a raw resubmission, Hong Kong collectors can hand cards to Appaw Store at 138 Arena: 138 Arena handles the venue and collects payment, while Appaw Store batches the cards for PSA grading submission and provides online progress tracking.',
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
      a: 'You face physical risk, meaning you might damage the card while breaking the plastic, and grade risk, meaning today\'s stricter standards might return a lower grade than the card originally held.',
    },
    {
      q: 'Can Hong Kong collectors submit crack-and-resubmit or crossover through Appaw PSA grading submission?',
      a: 'Yes. Book online, then complete intake at 138 Arena in Causeway Bay. 138 Arena handles the venue and collects payment, while Appaw Store completes a preliminary inspection and batches the cards for PSA grading submission. That inspection is a reference only. Screening before you crack helps you decide whether the expected value justifies the downgrade risk.',
    },
  ],
  midCta: {
    afterSectionId: 'expected-value-math',
    title: 'Screen on-site before you crack',
    body: 'Hong Kong collectors can visit 138 Arena for Appaw\'s centering, surface, and corner check, then decide whether crack-and-resubmit is still worth it. 138 Arena handles the venue and collects payment; Appaw Store runs the service and follow-up.',
    primary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
    secondary: { label: 'Free Centering Tool', href: '/tools/card-centering/' },
  },
  cta: {
    title: 'Screen first, then submit in Hong Kong',
    body: 'PSA 10 now requires a 55/45 front centering ratio, so run the free centering tool before you destroy a slab. Hong Kong collectors who want to submit for grading book online, then complete intake face to face at 138 Arena. 138 Arena handles the venue and collects payment, while Appaw Store runs PSA grading submission and follow-up. The preliminary inspection on arrival is a reference only; PSA sets the final grade.',
    primary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
    secondary: { label: 'Free Centering Tool', href: '/tools/card-centering/' },
  },
  relatedSlugs: ['psa-reholder-guide', 'psa-10-centering-requirements', 'hong-kong-tcg-grading-guide'],
  sources: [
    {
      label: 'PSA Review Service',
      href: 'https://www.psacard.com/services/tradingcardgrading/review',
    },
    {
      label: 'PSA Grading Standards (2025 centering thresholds)',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'PSA Trading Card Grading services and fees',
      href: 'https://www.psacard.com/services/tradingcardgrading',
    },
  ],
};

export default guide;
