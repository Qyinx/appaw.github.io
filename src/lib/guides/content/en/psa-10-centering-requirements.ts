import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-10-centering-requirements',
  title: 'PSA 10 Centering Requirements Explained',
  description:
    'PSA Gem Mint 10 needs 55/45 front and 75/25 back centering. Use the ratios to screen seller photos before you buy graded, or measure raw copies before you submit.',
  badge: 'Grading Spec',
  lead:
    'Centering is the fastest check you can run from a desk. Use it when a PSA 10 listing looks too cheap, or when you screen a raw copy before fees. PSA tightened the front rule in early 2025. If you still aim for old 60/40 front margins, expect more PSA 9 labels coming back.',
  published: '2026-06-07',
  updated: '2026-06-09',
  readTime: '6 min',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'PSA 10 front', value: '55/45 or better' },
    { label: 'PSA 10 back', value: '75/25 or better' },
    { label: 'PSA 9 front', value: '60/40 or better' },
    { label: 'PSA 9 back', value: '90/10 or better' },
  ],
  sections: [
    {
      id: 'psa-10-centering-requirements',
      title: 'What Centering Is Required for a PSA 10?',
      paragraphs: [
        'PSA Gem Mint 10 requires 55/45 or better centering on the front and 75/25 or better on the back. PSA tightened the front rule from 60/40 to 55/45 in early 2025. Both left/right and top/bottom axes must pass on each side.',
        'Centering alone does not guarantee a PSA 10 — corners, edges, and surface still count — but it is the fastest check you can run from a photo before you pay grading fees or PSA 10 slab prices.',
      ],
    },
    {
      id: 'read-the-ratio',
      title: 'How to Read a Centering Ratio',
      paragraphs: [
        'A 55/45 front ratio means the wider border can take up at most 55% of the total border width on that axis (left/right or top/bottom). Measure from the card edge to the printed frame, compare both sides, and express the larger share first.',
        'Example: left border 2.2 mm, right border 1.8 mm on the same axis. Total 4.0 mm. Wider side is 2.2 ÷ 4.0 = 55%. That axis passes PSA 10. Repeat for the perpendicular axis. Both axes must pass.',
        'Borderless full-art Pokémon and modern sports photos need the same math on inner print elements when outer borders are absent. Use a reference PSA 10 scan if the frame is ambiguous.',
      ],
    },
    {
      id: 'front-vs-back',
      title: 'Front vs Back Tolerance',
      paragraphs: [
        'PSA allows more slack on the back: 75/25 or better for Gem Mint 10. Factory backs are often worse than fronts. A card that looks perfect face-up can still gem if the reverse is slightly off but inside 75/25.',
        'The front is the grade limiter in practice. Collectors rarely see a 65/35 front card gem because the back is perfect. Always photograph and measure both sides before paying grading fees or trusting a PSA 10 ask price.',
      ],
      specs: [
        { label: 'PSA 10 front (2025+)', value: '≤ 55/45' },
        { label: 'PSA 10 back', value: '≤ 75/25' },
        { label: 'Pre-2025 PSA 10 front', value: 'Was 60/40' },
      ],
    },
    {
      id: '2025-change',
      title: 'What Changed in Early 2025',
      paragraphs: [
        'PSA moved Gem Mint front centering from 60/40 to 55/45 to align closer with SGC and stricter market expectations. The back rule stayed at 75/25. Cards that would have squeaked a 10 under the old front rule now land at PSA 9 if centering was the only flaw.',
        'Cert numbers alone do not tell you which standard applied. For high-value submits or slab purchases, measure anyway. A 58/42 front today is a 9, not a "maybe 10".',
      ],
    },
    {
      id: 'measure-first',
      title: 'When to Measure',
      paragraphs: [
        'Buying graded online: ask for flat, high-res front and back scans. Run them through a centering tool before you pay PSA 10 money on a borderline listing. Slab photos at an angle hide skew that drops a card to PSA 9.',
        'Before you submit raw: use calipers or a centering tool with draggable guides on a flat scan. Phone photos at an angle distort ratios by several percentage points. That is enough to mis-grade a borderline card.',
        'If either front axis reads worse than 55/45, decide whether the card still makes financial sense at PSA 9 before you rush a bulk submit or overpay for a slab. Surface and corners still matter, but centering is the fastest filter.',
        'Our free Card Centering Calculator runs PSA, BGS, and SGC tables against your upload so you see pass/fail per grade tier without manual math.',
      ],
    },
  ],
  cta: {
    title: 'Check your margins in minutes',
    body: 'Upload a scan or seller photo, align the guides, and compare front and back percentages to PSA 10, 9, and 8 thresholds.',
    primary: { label: 'Free Centering Calculator', href: '/tools/card-centering/' },
    secondary: { label: 'Protect the returned slab', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['grade-or-protect-first', 'choose-35pt-slab-protector'],
  sources: [
    {
      label: 'PSA Grading Standards — Gem Mint 10 centering',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'SGC Grading Scale — Pristine 10 centering',
      href: 'https://www.gosgc.com/card-grading/scale',
    },
    {
      label: 'CGC Cards — grading scale (centering by grade)',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
