import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: 'From Raw Card to Protected Slab: Grading Then Outer Case',
  badge: 'Workflow',
  lead:
    '"Grade or protect first" is the wrong question: raw cards do not fit a 35PT outer case. Grading and protection are sequential steps at different moments. Both paths end with a protected slab; raw submit usually needs $25+ raw value and a 2–4× PSA 10 upside.',
  published: '2026-06-07',
  updated: '2026-08-05',
  readTime: '9 min',
  heroImage: '/images/background/grade-or-protect-first.png',
  heroSpecs: [
    { label: 'Submit threshold', value: 'Raw $25+, 2–4× slab premium' },
    { label: 'Phase 1', value: 'Raw: decide if submit pays' },
    { label: 'Phase 2', value: 'Slab: add outer case' },
    { label: 'Full path', value: 'Raw → grade → outer case' },
  ],
  sections: [
    {
      id: 'why-both-matter',
      title: 'Grading and protection are not either/or',
      paragraphs: [
        'Search queries like "grade or protect first" sound like a fork. In practice there is no conflict: on raw cardboard you decide whether the PSA fee is worth paying; once a slab lands or you buy graded, the next step is an outer case. The same card never faces both choices at once.',
        'The common miss is skipping protection after a slab returns, or merging two separate questions into one. Path A: you own raw and submit for grading. Path B: you buy a finished slab. Both paths merge at outer-case protection.',
      ],
      bridge: 'Path A economics first. Protection starts the day the slab lands.',
    },
    {
      id: 'when-to-submit-raw',
      title: 'Path A: when raw submission pays the PSA fee',
      paragraphs: [
        'Submitting raw is an upside play, not every card earns the fee. A bad submit wastes money or returns a label that hurts resale.',
        'Good candidates: condition looks Gem Mint-capable (PSA 10 range), raw market value is $25+ with expected PSA 10 resale at least 2–4× raw; hot rookie sports cards or scarce TCG (Pokémon, MTG) where high grades sell fast; eBay Authenticity Guarantee or PSA promo windows reduce risk.',
        'Skip submission: raw value under $20–25 where fees eat the upside; visible corner wear, surface scratches, or other flaws likely cap at PSA 8 or below; PSA backlog or service pause makes timing poor; pure long-term personal hold with zero resale intent.',
        'Before you pack: Penny sleeve + Card Saver; check PSA Pop Report for gem counts; run cost math and pick a service tier (Value, Express, etc.); screen centering free in our [Card Centering Tool](/tools/card-centering/), see [PSA 10 centering requirements](/guides/psa-10-centering-requirements/). Hong Kong collectors can drop off at partner store [138 Arena](/business/psa-grading/) (Causeway Bay). We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection. Then we confirm your PSA tier.',
      ],
      specs: [
        { label: 'PSA 10 front (2025+)', value: '55/45 or better' },
        { label: 'PSA 10 back', value: '75/25 or better' },
        { label: 'Economics', value: 'Raw $25+, 2–4× premium to justify' },
        { label: 'Screen first', value: 'Centering + surface + corners' },
      ],
      bridge: 'Slab returns switch the job to phase two: outer protection.',
    },
    {
      id: 'when-to-protect-graded',
      title: 'Paths A/B merge: protect once the slab is yours',
      paragraphs: [
        'A slab seals the card, it does not make the plastic invincible. Scratches, haze, and cracks on the holder still hurt display value and buyer confidence. An outer case defends the grade you paid for.',
        'When a graded slab arrives or you buy graded, verify the cert on [psacard.com/cert](https://www.psacard.com/cert), then install a [magnetic graded slab protector](/products/psa-protectors/). The 35PT rigid case with a metal frame fits PSA/CGC holders, beats soft slab sleeves for scratch and crush resistance, and the UV-rated front panel slows label and surface fade.',
        'High-value PSA 10s or keys also need cool, dry, stable storage. Shipping, card shows, or long-term holds need layered packing and insurance.',
        'Light holder wear → consider [PSA reholder](/guides/regrade-or-reholder/). Severe damage or a deliberate grade chase → regrade instead.',
        'Minimize bare-hand contact; keep slabs out of direct sun, heat spikes, and humidity swings; inspect holders regularly. Grader plastic is for seal and display, not backpack or meet hand-offs, see [UV storage guide](/guides/uv-protection-graded-cards/) and [35PT case fit guide](/guides/choose-35pt-slab-protector/).',
      ],
      specs: [
        { label: 'Protect when', value: 'Display, travel, trade, ship' },
        { label: 'High-value keys', value: 'Magnetic case + stable storage' },
        { label: 'Outer case target', value: 'Standard 35PT PSA / CGC' },
      ],
    },
    {
      id: 'workflow-paths',
      title: 'Two paths, one finish line',
      paragraphs: [
        'Step-by-step comparison below, not a strategy fork. Both paths end with a verified cert inside a protected slab.',
      ],
      table: {
        headers: ['Step', 'Path A: own raw', 'Path B: buy graded'],
        rows: [
          ['1', 'Measure centering; check $25+ economics', 'Match seller photos to cert lookup'],
          ['2', 'Submit if math works; wait for return', '(no submit step)'],
          ['3', 'Slab arrives; verify cert', 'Verify cert on delivery'],
          ['4', 'Install outer protector', 'Install outer protector'],
          ['5', 'Display, trade, or store', 'Display, trade, or store'],
        ],
      },
    },
    {
      id: 'practical-advice',
      title: 'Practical step checklist',
      paragraphs: [
        'Path A: measure centering → loupe surface and corners → submit if math works → verify cert on [psacard.com/cert](https://www.psacard.com/cert) → install an [outer protector](/products/psa-protectors/) → display, trade, or ship.',
        'Path B: match seller photos to PSA cert database → outer case on delivery → log price and cert number.',
        'High-value cards: run expected-value math first. Hong Kong collectors drop off and pick up at partner store [138 Arena](/business/psa-grading/) (Causeway Bay, 522 Jaffe Road, 1/F) for face-to-face condition evaluation and PSA proxy submission. We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection. Then we confirm your service tier. Fees, policies, and queue times: [PSA\'s site](https://www.psacard.com) is source of truth.',
        'New collectors: practice on low-to-mid copies before chasing grail submits and grail protection setups.',
      ],
    },
    {
      id: 'bottom-line',
      title: 'Two paths, same endpoint',
      paragraphs: [
        'Both paths end with a verified cert inside a protected slab. The only difference is whether you paid grading fees yourself or bought the finished label from someone else.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do grading and outer-case protection relate?',
      a: 'Sequential steps, not either/or. Submit raw when condition and economics justify the fee. Protect the slab immediately once it returns or when you buy graded.',
    },
    {
      q: 'When is raw submission worth the PSA fee?',
      a: 'Usually when raw value is $25+ and a PSA 10 could sell for 2–4× raw, with gem-capable centering and surface.',
    },
    {
      q: 'Do I need an outer case if the card is already slabbed?',
      a: 'Yes for display, travel, and resale. Grader plastic scratches and fades; an outer UV case shields the label.',
    },
  ],
  midCta: {
    afterSectionId: 'when-to-submit-raw',
    title: 'Raw in hand? Measure centering before you submit',
    body: 'Screen margins free before you pay grading fees. Hong Kong collectors can drop off at 138 Arena. We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection. Slab already back? Skip to the outer case.',
    primary: { label: 'Free Centering Calculator', href: '/tools/card-centering/' },
    secondary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
  },
  cta: {
    title: 'Slab in hand? Add the outer case',
    body: 'Shield slabs you own or just received. Screen raw copies with the free centering tool before you pay grading fees. Hong Kong collectors can drop off at 138 Arena. We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA submission (HK)', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'choose-35pt-slab-protector', 'uv-protection-graded-cards', 'regrade-or-reholder'],
  sources: [
    {
      label: 'PSA, Grading Standards (Gem Mint centering and condition)',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'PSA, How to Submit and Pack Cards',
      href: 'https://www.psacard.com/info/shipguide',
    },
    {
      label: 'PSA, Cert Verification and Registry',
      href: 'https://www.psacard.com/cert',
    },
    {
      label: 'CGC Cards, Trading Card Grading Overview',
      href: 'https://www.cgccards.com/card-grading/trading-card-grading/',
    },
  ],
};

export default guide;
