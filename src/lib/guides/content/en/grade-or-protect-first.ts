import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'grade-or-protect-first',
  title: 'When to Grade vs Protect Your Cards',
  description:
    'Already graded? Protect the outer case first. Considering a submit? Check centering and condition. A simple framework for slab collectors and HK trading.',
  badge: 'Workflow',
  lead:
    'Most readers here already hold PSA or CGC slabs. Outer protection is step one for display, travel, and Hong Kong card meets. If you still have raw copies on the grading path, centering and surface checks come before fees.',
  published: '2026-06-07',
  updated: '2026-06-07',
  readTime: '5 min',
  heroSpecs: [
    { label: 'Protect when', value: 'Slab in daily use' },
    { label: 'Grade when', value: 'Raw + gem potential' },
    { label: 'PSA 10 front', value: '55/45 or better' },
    { label: 'HK slab trade', value: 'Protect before meet' },
  ],
  sections: [
    {
      id: 'protect-first',
      title: 'Protect First (Already Graded)',
      paragraphs: [
        'Slabs straight from the grader ride home in thin plastic wraps. That is not showroom or travel armor. Sleeve the slab in a rigid 35PT aluminum or acrylic case before you toss it in a backpack, ship to a buyer, or bring it to a Hong Kong card meet.',
        'Protect immediately when the slab will sit on a desk, in a shop case, or change hands at locals where scuffs transfer to the grader label. Outer cases take the hit so the cert stays clean for resale.',
        'UV-rated outer glass matters when the slab lives near a window or under bright display LEDs for months. Pair protection with 45–55% RH storage if you are in a humid district.',
      ],
    },
    {
      id: 'grade-first',
      title: 'Considering Grading (Before You Slab)',
      paragraphs: [
        'Send raw only when centering, surface, corners, and edges all look gem-capable and the raw-to-slab price gap covers fees plus shipping both ways. Run a centering check before you pay. A 62/38 front is PSA 9 math, not 10 hope.',
        'High-volume modern bulk only makes sense with a spreadsheet: expected gem rate times slab premium minus per-card service level and insurance. One chase card can carry a batch; do not assume it.',
        'If you already own the slab version, skip re-grading unless you suspect tampering. Focus spend on outer protection and cert verification instead.',
      ],
    },
    {
      id: 'order-of-ops',
      title: 'Suggested Order of Operations',
      paragraphs: [
        'Already graded: verify cert on registry, install outer protector on arrival, log buy price and cert number, then display, trade at HK meets, or ship.',
        'Considering grading: measure centering, inspect surface under a loupe, submit if numbers work, install outer protector when the slab returns, then list or trade.',
      ],
    },
    {
      id: 'when-to-wait',
      title: 'When to Wait on Both',
      paragraphs: [
        'Heavily played raw copies with soft corners are not grading candidates unless the card is so rare that Authentic status still clears costs.',
        'If PSA turnaround or pricing does not fit your timeline, wait on the submit. Market hype cycles change; gem slabs do not appear overnight.',
        'For mid-tier modern cards, trading slabs locally with clear cert photos often beats forcing a raw submit where one grade step barely moves price.',
      ],
    },
  ],
  cta: {
    title: 'Ready for the next step?',
    body: 'Protect slabs you own or just received. Use the centering tool when screening raw submits or seller photos before you buy graded.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'Trading & services', href: '/business/' },
  },
  relatedSlugs: ['psa-10-centering-requirements', 'uv-protection-graded-cards'],
  sources: [
    {
      label: 'PSA Grading Standards',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'PSA — how to submit and pack cards',
      href: 'https://www.psacard.com/info/shipguide',
    },
    {
      label: 'CGC Cards — trading card grading overview',
      href: 'https://www.cgccards.com/card-grading/trading-card-grading/',
    },
  ],
};

export default guide;
