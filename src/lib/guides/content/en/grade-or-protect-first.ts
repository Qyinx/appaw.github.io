import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: 'When to Submit Raw Cards and When to Protect Graded Slabs',
  description:
    'Grading and outer protection are separate steps for different card states. A clear sequence for raw submits, slabs you already own, and when to pause on either.',
  badge: 'Workflow',
  lead:
    'Grading and protecting a slab are not competing choices. They apply at different moments. A raw card may need submission. A graded slab that comes back from PSA or CGC needs an outer case before daily use. Many collectors do both over time — one card state does not cancel the other.',
  published: '2026-06-07',
  updated: '2026-06-08',
  readTime: '6 min',
  heroImage: '/images/background/grade-or-protect-first.png',
  heroSpecs: [
    { label: 'Raw card', value: 'Screen → submit if numbers work' },
    { label: 'Graded slab', value: 'Protect on arrival' },
    { label: 'Full path', value: 'Raw → grade → outer case' },
    { label: 'PSA 10 front (2025+)', value: '55/45 or better' },
  ],
  sections: [
    {
      id: 'two-states',
      title: 'Two Card States, Two Actions',
      paragraphs: [
        'Start with what you are holding. A raw card is still loose — grading is how you lock condition and authenticity into a numbered cert. A graded slab is already sealed inside the grader\'s case — your next job is to shield that case from scratches, UV, and bag pressure.',
        'The title sounds like a fork because collectors ask both questions in the same week: "Should I send this raw copy?" and "Do I need a protector for this PSA 10?" Those are separate decisions. Owning graded cards does not mean you will never submit raw copies again, and submitting raw cards does not replace outer protection once the slab returns.',
        'Think in sequence, not either/or. Raw screening comes before fees. Outer protection comes after the slab is in your hands — whether you graded it yourself or bought it graded.',
      ],
    },
    {
      id: 'raw-screening',
      title: 'Raw Cards: Screen Before You Pay Fees',
      paragraphs: [
        'Submission makes sense when centering, surface, corners, and edges look capable of the grade you need, and when the slab premium at that grade covers service level, shipping, insurance, and the risk of a lower label. PSA publishes separate tolerances for Gem Mint 10, Mint 9, and lower steps — centering is often the first filter because you can measure it from photos.',
        'Run a centering check before you pack. Under PSA\'s current Gem Mint standard, a front ratio near 62/38 is Mint 9 territory, not a realistic PSA 10 target. Surface flaws under a loupe, soft corners, or print lines cap the outcome regardless of borders.',
        'Bulk modern submits only work with math: expected gem rate × per-card slab premium − per-card service and return shipping. One chase card can carry a batch; assuming every copy gems is how stacks of PSA 8s pile up.',
        'If you already own the graded version of the same card, re-submitting the raw copy rarely helps unless you suspect tampering or a mislabel. Budget is usually better spent verifying the cert and fitting an outer protector.',
      ],
      specs: [
        { label: 'PSA 10 front (2025+)', value: '55/45 or better' },
        { label: 'PSA 10 back', value: '75/25 or better' },
        { label: 'Screen first', value: 'Centering + surface + corners' },
      ],
    },
    {
      id: 'protect-graded',
      title: 'Graded Slabs: Protect as Soon as They Arrive',
      paragraphs: [
        'The grader\'s case was built to seal and display the card, not to survive a backpack, shop counter, or repeated hand-offs at a Hong Kong card meet. Thin outer wrap from the return package is transit packaging, not daily armor.',
        'Install a rigid 35PT outer case before the slab rides in a bag, ships to a buyer, or sits under bright display light for months. The outer shell takes scuffs and pressure so the cert label stays readable for resale.',
        'UV-rated front glass matters when the slab lives near windows or LED cases — the inner grader plastic passes most UV. Pair protection with stable humidity if you are in a damp district; see our UV storage guide for RH targets.',
      ],
      specs: [
        { label: 'Protect when', value: 'Display, travel, trade, ship' },
        { label: 'Grader case role', value: 'Seal + label, not travel shell' },
        { label: 'Outer case target', value: 'Standard 35PT PSA / CGC profile' },
      ],
    },
    {
      id: 'full-sequence',
      title: 'Suggested Sequence End to End',
      paragraphs: [
        'Raw path: measure centering → loupe surface and corners → submit if economics work → on return, verify cert number on the grader registry → install outer protector → log buy price and cert → display, trade, or ship.',
        'Graded purchase path: confirm cert photos match registry → install outer protector on delivery → log purchase price and cert → display, trade, or ship. No submission step required.',
        'Both paths end the same way: a protected slab with a verified cert. The only difference is whether you paid grading fees yourself or paid another collector for the finished label.',
      ],
    },
    {
      id: 'when-to-pause',
      title: 'When to Pause on Grading or Protection',
      paragraphs: [
        'Pause grading when the raw copy is heavily played — soft corners and creases cap the grade unless the card is so rare that even an Authentic label clears costs. Pause when turnaround or service pricing does not fit your timeline; market hype moves faster than grader queues.',
        'Pause buying outer protection only when the slab stays in short-term vault storage and never moves. The moment it travels to a show or buyer, the grader case alone is not enough.',
        'For mid-tier modern cards, buying an existing slab with clear cert photos often beats submitting raw when one grade step barely moves price. Protection still applies either way once the slab is yours.',
      ],
    },
  ],
  cta: {
    title: 'Next step for your card state',
    body: 'Protect slabs you own or just received. Use the free centering tool when screening raw copies or seller photos before you buy graded.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA 10 centering guide', href: '/guides/psa-10-centering-requirements/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'choose-35pt-slab-protector', 'uv-protection-graded-cards'],
  sources: [
    {
      label: 'PSA — Grading Standards (Gem Mint centering and condition)',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'PSA — How to Submit and Pack Cards',
      href: 'https://www.psacard.com/info/shipguide',
    },
    {
      label: 'PSA — Cert Verification and Registry',
      href: 'https://www.psacard.com/cert',
    },
    {
      label: 'CGC Cards — Trading Card Grading Overview',
      href: 'https://www.cgccards.com/card-grading/trading-card-grading/',
    },
    {
      label: 'CGC Cards — Grading Scale',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
