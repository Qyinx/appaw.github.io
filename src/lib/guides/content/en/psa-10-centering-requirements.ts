import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-10-centering-requirements',
  title: 'PSA 10 Centering Requirements Explained',
  badge: 'Grading Spec',
  lead:
    'PSA 9 is the most expensive grade. Not because the card is bad. Because centering failed by a few percent and you still paid the full grading fee. Measure first. It is the cheapest filter you have.',
  published: '2026-06-07',
  updated: '2026-08-05',
  readTime: '10 min',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: '2025+ change', value: 'Front tightened from 60/40 to 55/45' },
    { label: 'PSA 10 front', value: '55/45 or better' },
    { label: 'PSA 10 back', value: '75/25 or better' },
    { label: 'PSA 9 front', value: '60/40 or better' },
  ],
  sections: [
    {
      id: 'psa-10-standard',
      title: 'The 55/45 rule that decides PSA 10 vs 9',
      paragraphs: [
        'Per PSA\'s published standards ([psacard.com/gradingstandards](https://www.psacard.com/gradingstandards)), Gem Mint 10 centering breaks down as follows:',
        'Front: 55/45 or better on both axes, left/right and top/bottom. A 55/45 ratio means the wider border takes at most 55% of total border width on that axis (the other side is 45%). Perfect is 50/50; 55/45 is already near indistinguishable to the naked eye.',
        'Back: 75/25 or better, more slack than the front. Factory backs often run worse than faces; a card can still gem when the reverse stays inside 75/25.',
        'PSA tightened Gem Mint front centering from 60/40 to 55/45 in early 2025. A 60/40 front usually caps at PSA 9 even when corners and surface are elite. Graders have final say. Strong eye appeal can forgive tiny variance on some copies, but hot rookies and high-value cards get stricter reads.',
        'Centering alone does not guarantee PSA 10. Corners, edges, and surface still score. It is the fastest check you can run from a photo before grading fees or PSA 10 slab prices.',
      ],
      specs: [
        { label: 'PSA 10 front (2025+)', value: '≤ 55/45' },
        { label: 'PSA 10 back', value: '≤ 75/25' },
        { label: 'Pre-2025 PSA 10 front', value: 'Was 60/40' },
      ],
      bridge: 'Your margins pass. That still does not mean PSA 10. Corners and surface decide the rest.',
    },
    {
      id: 'why-centering-matters',
      title: 'Why centering drives resale price',
      paragraphs: [
        'Centering shapes visual balance and market price. PSA 10 premiums are steep, a well-centered gem often trades at multiples of a PSA 9 copy of the same card.',
        'Modern print is better, but factory cuts still drift. TCG cards (Pokémon, etc.) with narrow borders show centering issues more often than classic sports stock. Off-center raw copies landing at PSA 9 is the most common grading disappointment.',
        'In practice, the front limits the grade. You rarely see a 65/35 front gem just because the back is perfect. Photograph and measure both sides before you submit or pay PSA 10 money.',
      ],
    },
    {
      id: 'how-to-measure',
      title: 'How to Measure Centering Accurately',
      paragraphs: [
        'Recommended tools: digital calipers for precision; jeweler\'s loupe; phone macro plus our [free Card Centering Calculator](/tools/card-centering/), upload a scan or seller photo, align guides, and read pass/fail against PSA, BGS, and SGC tiers.',
        'Steps: measure front and back separately. Horizontal, measure left and right borders; wider side ÷ (left + right) × 100. Vertical, top and bottom. Front both axes must hit ≤ 55/45; back ≤ 75/25.',
        'Example: left 2.2 mm, right 1.8 mm → 2.2 ÷ 4.0 = 55% → 55/45, axis passes. Left 2.5 mm, right 1.5 mm → 62.5/37.5, unlikely to gem.',
        'Borderless full-art TCG and sports photos use the same math on inner print frames. When borders are ambiguous, compare to a known PSA 10 scan. Angled phone shots skew ratios by several points, enough to mis-read a borderline card. Use flat scans or straight-on shots.',
      ],
    },
    {
      id: 'grade-comparison',
      title: 'PSA 10 Centering vs Other Grades',
      paragraphs: [
        'Grade thresholds and market impact at a glance. Match your target before you pay gem prices for mint-nine margins.',
      ],
      table: {
        headers: ['Grade', 'Front centering', 'Back centering', 'Difficulty', 'Market impact'],
        rows: [
          ['PSA 10', '55/45 or better', '75/25 or better', 'Very high', 'Top premium'],
          ['PSA 9', '60/40 or better', '90/10 or better', 'Moderate', 'Common'],
          ['PSA 8', '65/35 or better', '90/10 or better', 'Lower', 'Visible skew'],
          ['PSA 7', '70/30 or better', 'More slack', 'Low', 'Value drop'],
        ],
      },
    },
    {
      id: 'common-issues',
      title: 'Common Centering Problems',
      paragraphs: [
        'Factory cut drift: uneven trim at production. Screen every raw purchase with a centering tool, do not discover it at grading checkout.',
        'Print shift: artwork sits off-center even when border math looks close. Check overall eye appeal from multiple angles.',
        'TCG narrow borders: Pokémon and similar designs leave less margin for error, 55/45 tolerance bites harder.',
        'Pre-submit checklist: only send copies that pass centering plus strong corners, surface, and edges. Hong Kong collectors drop off at [138 Arena PSA submission](/business/psa-grading/). We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection. Batch tracking is available online. Save measurements and photos as your paper trail.',
      ],
    },
    {
      id: 'practical-tips',
      title: 'Raise Your PSA 10 Hit Rate',
      paragraphs: [
        'Raw screening order: centering first → corners and surface second. If either front axis reads worse than 55/45, decide whether PSA 9 still makes financial sense before bulk submit or overpaying for a slab.',
        'Buying graded online: demand flat, high-res front and back scans; run [graded-slab mode](/tools/card-centering/) on listing photos. Angled slab shots hide skew.',
        'Submit timing: pick a reasonable queue window and declare accurate insured value. If centering is the only weak point and everything else is elite, [a regrade strategy](/guides/psa-review-vs-crack/) is an option, downgrade risk included.',
        'After a PSA 10 returns: fit a [magnetic graded slab protector](/products/psa-protectors/) before display or travel so holder scuffs do not eat resale. See [raw to protected slab workflow](/guides/grade-or-protect-first/).',
      ],
    },
    {
      id: 'bottom-line',
      title: 'Measure before fees',
      paragraphs: [
        'PSA 10 centering (55/45 front, 75/25 back) allows some slack, but stable gems still need near-perfect raw copies. Measuring early is the best ROI move: fewer wasted submits, better buys, cleaner resale.',
      ],
    },
  ],
  faq: [
    {
      q: 'What centering does PSA 10 require in 2025?',
      a: 'Front 55/45 or better on both axes. Back 75/25 or better. PSA tightened the front from 60/40 in early 2025.',
    },
    {
      q: 'Can a card gem with 60/40 front centering?',
      a: 'Unlikely after the 2025 rule change. A 60/40 front usually caps at PSA 9 even with elite corners and surface.',
    },
    {
      q: 'How do I measure centering before submitting?',
      a: 'Measure left/right and top/bottom borders on front and back. Use calipers or the free card centering tool with a flat scan.',
    },
    {
      q: 'Is back centering as strict as the front?',
      a: 'No. PSA 10 allows 75/25 on the back versus 55/45 on the front.',
    },
  ],
  midCta: {
    afterSectionId: 'psa-10-standard',
    title: 'Measure your copy against PSA 10 now',
    body: 'Upload a flat scan or seller photo and compare front and back margins to the 55/45 and 75/25 thresholds. Hong Kong collectors can drop off at 138 Arena. We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection.',
    primary: { label: 'Free Centering Calculator', href: '/tools/card-centering/' },
    secondary: { label: 'PSA submission (HK)', href: '/business/psa-grading/' },
  },
  cta: {
    title: 'Check your margins in minutes',
    body: 'Centering passes? Drop off at 138 Arena. We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection.',
    primary: { label: 'Free Centering Calculator', href: '/tools/card-centering/' },
    secondary: { label: 'PSA submission (HK)', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['grade-or-protect-first', 'psa-review-vs-crack', 'choose-35pt-slab-protector', 'display-graded-cards'],
  sources: [
    {
      label: 'PSA Grading Standards, Gem Mint 10 centering',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'SGC Grading Scale, Pristine 10 centering',
      href: 'https://www.gosgc.com/card-grading/scale',
    },
    {
      label: 'CGC Cards, grading scale (centering by grade)',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
