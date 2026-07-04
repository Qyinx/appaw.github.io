import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: 'Raw Card Grading vs Graded Slab Protection',
  badge: 'Workflow',
  lead:
    'Grading is how you make money on a card. Protection is how you keep it. Most collectors get the order backwards.',
  published: '2026-06-07',
  updated: '2026-06-17',
  readTime: '9 min',
  heroImage: '/images/background/grade-or-protect-first.png',
  heroSpecs: [
    { label: 'Submit threshold', value: 'Raw $25+, 2–4× slab premium' },
    { label: 'Raw submit', value: 'Offense: chase upside' },
    { label: 'Slab protection', value: 'Defense: keep value' },
    { label: 'Full path', value: 'Raw → grade → outer case' },
  ],
  sections: [
    {
      id: 'why-both-matter',
      title: 'Grade and protect are two phases, not a fork',
      paragraphs: [
        'Moving from raw cardboard to a PSA slab marks two phases: the upside phase (grading) and the preservation phase (protection). Submit at the right moment and value can jump. Protect the slab afterward and you keep that gain.',
        'Collectors often ask both questions in the same week: "Should I send this raw copy?" and "Do I need a protector for this PSA 10?" Separate decisions. Think in sequence, not either/or. Together they form a complete strategy.',
      ],
      bridge: 'Raw economics first. Protection kicks in the day the slab lands.',
    },
    {
      id: 'when-to-submit-raw',
      title: 'When raw submission pays the PSA fee',
      paragraphs: [
        'Submitting raw is an active upside play, not every card earns the fee. A bad submit wastes money or returns a label that hurts resale.',
        'Good candidates: condition looks Gem Mint-capable (PSA 10 range), raw market value is $25+ with expected PSA 10 resale at least 2–4× raw; hot rookie sports cards or scarce TCG (Pokémon, MTG) where high grades sell fast; you want easier resale and cleaner display; eBay Authenticity Guarantee or PSA promo windows reduce risk.',
        'Skip submission: raw value under $20–25 where fees eat the upside; visible corner wear, surface scratches, or other flaws likely cap at PSA 8 or below; PSA backlog or service pause makes timing poor; pure long-term personal hold with zero resale intent.',
        'Before you pack: Penny sleeve + Card Saver; check PSA Pop Report for gem counts; run cost math and pick a service tier (Value, Express, etc.); screen centering free in our [Card Centering Tool](/tools/card-centering/), see [PSA 10 centering requirements](/guides/psa-10-centering-requirements/).',
      ],
      specs: [
        { label: 'PSA 10 front (2025+)', value: '55/45 or better' },
        { label: 'PSA 10 back', value: '75/25 or better' },
        { label: 'Economics', value: 'Raw $25+, 2–4× premium to justify' },
        { label: 'Screen first', value: 'Centering + surface + corners' },
      ],
      bridge: 'Slab returns change the job. From here, defense takes over.',
    },
    {
      id: 'when-to-protect-graded',
      title: 'When to add graded slab protection',
      paragraphs: [
        'A slab seals the card, it does not make the plastic invincible. Scratches, haze, and cracks on the holder still hurt display value and buyer confidence. Protection is how you defend the grade you paid for.',
        'Protect immediately when: a graded slab arrives, verify the cert, then install a [magnetic graded slab protector](/products/psa-protectors/). The 35PT rigid case with a metal frame fits PSA/CGC holders, beats soft slab sleeves for scratch and crush resistance, and the UV-rated front panel slows label and surface fade; high-value PSA 10s or keys also need cool, dry, stable storage; shipping, card shows, or long-term holds need layered packing and insurance.',
        'Light holder wear → consider [PSA reholder](/guides/regrade-or-reholder/). Severe damage or a deliberate grade chase → regrade instead.',
        'Daily rules: minimize bare-hand contact; keep slabs out of direct sun, heat spikes, and humidity swings; inspect holders regularly. Grader plastic is for seal and display, not backpack or meet hand-offs, see [UV storage guide](/guides/uv-protection-graded-cards/) and [35PT case fit guide](/guides/choose-35pt-slab-protector/).',
      ],
      specs: [
        { label: 'Protect when', value: 'Display, travel, trade, ship' },
        { label: 'High-value keys', value: 'Magnetic case + stable storage' },
        { label: 'Outer case target', value: 'Standard 35PT PSA / CGC' },
      ],
    },
    {
      id: 'strategy-comparison',
      title: 'Raw Submit vs Slab Protection',
      paragraphs: [
        'Two phases, two mindsets, offense vs defense. Key rows below.',
      ],
      table: {
        headers: ['Dimension', 'Raw submit (offense)', 'Slab protection (defense)'],
        rows: [
          ['Phase', 'Ungraded raw cardboard', 'Sealed graded slab'],
          ['Primary goal', 'Raise market value and liquidity', 'Keep look and existing value'],
          ['Main risks', 'Downgrade, high fees, long turnaround', 'Holder damage, environment decay'],
          ['Typical cost', 'Higher (grading + shipping)', 'Lower (sleeves, storage gear)'],
          ['Best for', 'High-upside raw with clean condition', 'Every slab, especially high-value copies'],
          ['Mindset', 'Active offense', 'Steady defense'],
        ],
      },
    },
    {
      id: 'practical-advice',
      title: 'Practical Decision Flow',
      paragraphs: [
        'Full loop: screen raw for submit economics → slab returns → switch to protection mode immediately. Both halves close the loop.',
        'Raw path: measure centering → loupe surface and corners → submit if math works → verify cert on [psacard.com/cert](https://www.psacard.com/cert) → install an [outer protector](/products/psa-protectors/) → display, trade, or ship.',
        'Graded purchase path: match seller photos to registry → outer case on delivery → log price and cert. No submit step, protection still required.',
        'High-value cards: run detailed expected-value math; use authorised PSA dealers or backed platforms when stakes are high. Fees, policies, and queue times change, treat [PSA\'s site](https://www.psacard.com) as source of truth.',
        'New collectors: practice on low-to-mid copies before chasing grail submits and grail protection setups.',
      ],
    },
    {
      id: 'bottom-line',
      title: 'Pick the right phase at the right moment',
      paragraphs: [
        'Both paths end with a verified cert inside a protected slab. The only fork is whether you paid grading fees yourself or bought the finished label from someone else.',
      ],
    },
  ],
  faq: [
    {
      q: 'Should I grade or protect a card first?',
      a: 'Grade raw cards when condition and economics justify the fee. Protect the slab immediately once it returns or when you buy graded.',
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
  cta: {
    title: 'Slab arrived? Protect it first',
    body: 'Shield slabs you own or just received. Screen raw copies or seller photos with the free centering tool before you pay grading fees.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA 10 centering guide', href: '/guides/psa-10-centering-requirements/' },
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
