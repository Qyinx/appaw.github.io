import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: 'From Raw Card to Protected Slab: Grading Then Outer Case',
  badge: 'Workflow',
  lead:
    'A raw card only justifies a PSA fee when it is worth about $25 or more and a PSA 10 could sell for two to four times that figure. Protection is a separate step that starts the day the slab lands, because a raw card does not fit a 35PT outer case. "Grade or protect first" is a false fork: the two happen at different moments on the same path.',
  metaDescription:
    'Grade or protect first? Neither. Raw cards need $25+ value and 2-4x PSA 10 upside to justify grading fees; finished slabs need a 35PT outer case. Full workflow.',
  published: '2026-06-07',
  updated: '2026-10-20',
  readTime: '9 min',
  heroImage: '/images/background/grade-or-protect-first.png',
  heroSpecs: [
    { label: 'Submit threshold', value: 'Raw $25+, 2–4× slab premium' },
    { label: 'Phase 1', value: 'On raw cardboard, decide whether the PSA fee is worth paying' },
    { label: 'Phase 2', value: 'Once the slab is yours, add an outer protector' },
    { label: 'Full path', value: 'Evaluate the raw card, submit for grading, then fit an outer case' },
  ],
  sections: [
    {
      id: 'why-both-matter',
      title: 'Grading and protection are not either/or',
      paragraphs: [
        'Search queries like "grade or protect first" sound like a fork. In practice there is no conflict: on raw cardboard you decide whether the PSA fee is worth paying, and once a slab lands or you buy graded, the next step is an outer case. The same card never faces both choices at once.',
        'The common miss is skipping protection after a slab returns, or merging two separate questions into one. Path A starts with a raw card you submit for grading; Path B starts with a finished slab you buy. Both paths merge at the same point: outer-case protection.',
      ],
      bridge: 'Path A comes first, and its deciding factor is economics: does the grading fee buy more value than it costs?',
    },
    {
      id: 'when-to-submit-raw',
      title: 'Path A: when raw submission pays the PSA fee',
      paragraphs: [
        'Submitting raw is an upside play, and not every card earns the fee. A bad submit wastes money or returns a label that hurts resale.',
        'Good candidates share three traits: the condition looks Gem Mint-capable, the raw market value is $25 or more, and the expected PSA 10 resale is at least two to four times the raw price. Hot rookie sports cards and scarce TCG cards such as Pokémon or MTG, where high grades sell quickly, fit this profile, and eBay Authenticity Guarantee or PSA promo windows can reduce the risk further.',
        'Skipping submission is correct when the raw value sits under $20 to $25 and fees would eat the upside, when visible corner wear or surface scratches will likely cap the grade at PSA 8 or below, when a PSA backlog or service pause makes timing poor, or when the card is a pure long-term personal hold with zero resale intent.',
        'Before you submit, screen the card yourself: measure centering with our free [Card Centering Tool](/tools/card-centering/) against the [PSA 10 centering requirements](/guides/psa-10-centering-requirements/), and sleeve the card for transport so it does not pick up scratches on the way. Tier selection, declared value, and paperwork are handled with Appaw on-site rather than being homework. Hong Kong collectors can book online and complete intake at partner venue [138 Arena](/business/psa-grading/) in Causeway Bay: 138 Arena handles the venue and collects payment, while Appaw Store completes intake and a preliminary inspection before confirming the PSA tier. That inspection is a reference only; PSA sets the final grade.',
      ],
      specs: [
        { label: 'PSA 10 front (2025+)', value: '55/45 or better' },
        { label: 'PSA 10 back', value: '75/25 or better' },
        { label: 'Economics', value: 'Raw $25+, 2–4× premium to justify' },
        { label: 'Screen first', value: 'Check centering, surface condition, and corner completeness' },
      ],
      formula: {
        eyebrow: 'Submit or skip',
        result: 'Expected Value (EV)',
        terms: [
          { text: 'PSA 10 value × gem probability', hint: 'Check recent sold prices' },
          { op: '+', text: 'PSA 9 value × (1 − probability)', hint: 'The realistic fallback' },
          { op: '−', text: 'Grading fee + shipping', hint: 'Paid either way' },
        ],
      },
      bridge: 'Once the slab returns, the job switches to phase two: protecting what the label is worth.',
    },
    {
      id: 'when-to-protect-graded',
      title: 'Paths A/B merge: protect once the slab is yours',
      paragraphs: [
        'A slab seals the card, but it does not make the plastic invincible. Scratches, haze, and cracks on the holder still hurt display value and buyer confidence, so an outer case defends the grade you paid for.',
        'When a graded slab arrives or you buy graded, verify the cert on [psacard.com/cert](https://www.psacard.com/cert), then install a [magnetic graded slab protector](/products/psa-protectors/). The 35PT rigid case with a metal frame fits PSA/CGC holders, beats soft slab sleeves for scratch and crush resistance, and the UV-rated front panel slows label and surface fade.',
        'High-value PSA 10s or keys also need cool, dry, stable storage. Shipping, card shows, or long-term holds call for layered packing and insurance.',
        'If the holder shows light wear, consider a [PSA reholder](/guides/psa-reholder-guide/). If you believe the grade itself was too low, weigh the [regrade strategy](/guides/psa-review-vs-crack/) before paying new fees.',
        'Minimize bare-hand contact, keep slabs out of direct sun and away from heat spikes and humidity swings, and inspect holders regularly. Grader plastic is built for sealing and display, not for backpack travel or hand-offs at meets; see the [UV storage guide](/guides/uv-protection-graded-cards/) and the [35PT case fit guide](/guides/choose-35pt-slab-protector/) for details.',
      ],
      specs: [
        { label: 'Protect when', value: 'Displaying, travelling, trading, or shipping the slab' },
        { label: 'High-value keys', value: 'Magnetic case + stable storage' },
        { label: 'Outer case target', value: 'Standard 35PT PSA / CGC' },
      ],
    },
    {
      id: 'workflow-paths',
      title: 'Two paths, one finish line',
      paragraphs: [
        'The step-by-step comparison below is a workflow, not a strategy fork. Both paths end with a verified cert inside a protected slab.',
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
        'Path A runs in a fixed order. Measure centering first, then inspect the surface and corners under a loupe. Submit only if the economics work, verify the cert on [psacard.com/cert](https://www.psacard.com/cert) when the slab returns, install an [outer protector](/products/psa-protectors/), and only then display, trade, or ship it.',
        'Path B is shorter. Match the seller\'s photos to the PSA cert database before paying, install the outer case on delivery day, and log the purchase price and cert number for your records.',
        'High-value cards deserve the expected-value math from Path A before any fee is paid. Hong Kong collectors drop off and pick up at partner venue [138 Arena](/business/psa-grading/) (Causeway Bay, 522 Jaffe Road, 1/F): 138 Arena handles the venue and collects payment, while Appaw Store runs intake, the preliminary inspection, PSA grading submission, and follow-up. That inspection is a reference only; PSA sets the final grade. Returned slabs are held by Appaw Store, and the fourteen-day pickup window starts when the WhatsApp or email notice is issued. For fees, policies, and queue times, [PSA\'s site](https://www.psacard.com) and the Appaw pricing table are the sources of truth.',
        'New collectors should practice on low-to-mid value copies before chasing grail submissions and grail protection setups.',
      ],
    },
    {
      id: 'bottom-line',
      title: 'Two paths, same endpoint',
      paragraphs: [
        'Both paths end with a verified cert inside a protected slab. The only difference is whether you paid the grading fees yourself or bought the finished label from someone else.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do grading and outer-case protection relate?',
      a: 'They are sequential steps, not either/or. Submit raw when condition and economics justify the fee, then protect the slab immediately once it returns or when you buy graded.',
    },
    {
      q: 'When is raw submission worth the PSA fee?',
      a: 'Usually when the raw value is $25 or more and a PSA 10 could sell for two to four times that, with gem-capable centering and surface.',
    },
    {
      q: 'Do I need an outer case if the card is already slabbed?',
      a: 'Yes for display, travel, and resale. Grader plastic scratches and fades, and an outer UV case shields the label.',
    },
    {
      q: 'What if my slab comes back scratched or hazy?',
      a: 'Light holder wear does not require a new grade. A PSA reholder swaps the case and label while keeping the grade and cert number, and an outer protector prevents the wear from returning.',
    },
  ],
  midCta: {
    afterSectionId: 'when-to-submit-raw',
    title: 'Raw in hand? Measure centering before you submit',
    body: 'Screen margins with the free tool before you pay grading fees. Hong Kong collectors can book online and complete intake at 138 Arena: 138 Arena handles the venue and collects payment, while Appaw Store runs PSA grading submission and follow-up. If the slab is already back, skip to the outer case.',
    primary: { label: 'Free Centering Calculator', href: '/tools/card-centering/' },
    secondary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
  },
  cta: {
    title: 'Slab in hand? Add the outer case',
    body: 'Fit an outer case on slabs you already own or have just collected. Screen raw copies with the free centering tool before you pay grading fees. Hong Kong collectors who want to submit for grading book online, then complete intake face to face at 138 Arena. 138 Arena handles the venue and collects payment, while Appaw Store runs PSA grading submission and follow-up. The preliminary inspection on arrival is a reference only; PSA sets the final grade.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'choose-35pt-slab-protector', 'uv-protection-graded-cards', 'psa-reholder-guide'],
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
