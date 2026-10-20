import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-10-centering-requirements',
  title: 'PSA 10 Centering Requirements: 55/45 Front, 75/25 Back',
  badge: 'Grading Spec',
  lead:
    'PSA 10 centering is 55/45 or better on the front and 75/25 or better on the back, tightened from 60/40 in early 2025. A 60/40 front usually caps at PSA 9 with the full grading fee still due, which makes measuring margins before you submit the cheapest filter available.',
  metaDescription:
    'PSA 10 centering requirements: front 55/45, back 75/25 since the 2025 rule change. See grade thresholds, the PSA 9 vs 10 price gap, and how to measure margins.',
  published: '2026-06-07',
  updated: '2026-10-20',
  readTime: '10 min',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'PSA 10 front', value: '55/45 or better' },
    { label: 'PSA 10 back', value: '75/25 or better' },
    { label: '2025+ change', value: 'Front tightened from 60/40 to 55/45' },
    { label: 'PSA 9 front', value: '60/40 or better' },
  ],
  sections: [
    {
      id: 'psa-10-standard',
      title: 'The 55/45 rule that decides PSA 10 vs 9',
      paragraphs: [
        'Per PSA\'s published standards ([psacard.com/gradingstandards](https://www.psacard.com/gradingstandards)), Gem Mint 10 centering is defined by two thresholds, one for the front and one for the back.',
        'The front must measure 55/45 or better on both axes, left/right and top/bottom. A 55/45 ratio means the wider border takes at most 55% of the total border width on that axis, with the other side at 45%. Perfect centering is 50/50, and 55/45 is already near indistinguishable to the naked eye.',
        'The back is allowed more slack at 75/25 or better. Factory backs often run worse than faces, so a card can still gem when the reverse stays inside 75/25.',
        'PSA tightened Gem Mint front centering from 60/40 to 55/45 in early 2025. A 60/40 front usually caps at PSA 9 even when corners and surface are elite. Graders have final say, and strong eye appeal can forgive tiny variance on some copies, but hot rookies and high-value cards get stricter reads.',
        'Centering alone does not guarantee PSA 10, because corners, edges, and surface still score. It is simply the fastest check you can run from a photo before paying grading fees or PSA 10 slab prices.',
      ],
      specs: [
        { label: 'PSA 10 front (2025+)', value: '≤ 55/45' },
        { label: 'PSA 10 back', value: '≤ 75/25' },
        { label: 'Pre-2025 PSA 10 front', value: 'Was 60/40' },
      ],
      bridge: 'Clear margins are only the first gate. The next section explains why that gate decides most of the resale price.',
    },
    {
      id: 'why-centering-matters',
      title: 'Why centering drives resale price',
      paragraphs: [
        'Centering shapes visual balance, and visual balance sets the market price. A well-centered PSA 10 often trades at two to four times the price of a PSA 9 copy of the same card, so a few percent of border drift carries real money.',
        'Modern print quality is better, but factory cuts still drift. TCG cards such as Pokémon use narrow borders that expose centering flaws far more than classic sports stock, and an off-center raw copy landing at PSA 9 is the most common grading disappointment.',
        'In practice the front limits the grade. You rarely see a 65/35 front gem just because the back is perfect, so photograph and measure both sides before you submit or pay PSA 10 money.',
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
      bridge: 'Once the economics are clear, the next step is measuring your own copy accurately.',
    },
    {
      id: 'how-to-measure',
      title: 'How to Measure Centering Accurately',
      paragraphs: [
        'For precision, measure with digital calipers or inspect through a jeweler\'s loupe. For speed, take a phone macro shot or a flat scan and upload it to our [free Card Centering Calculator](/tools/card-centering/), which overlays guides and reads pass/fail against PSA, BGS, and SGC tiers.',
        'Measure the front and back separately. On the horizontal axis, measure the left and right borders and divide the wider side by their sum, then multiply by 100. Repeat for the top and bottom borders on the vertical axis. The front must hit 55/45 or better on both axes and the back 75/25 or better.',
        'Worked example: with a left border of 2.2 mm and a right border of 1.8 mm, the wider side divides as 2.2 ÷ 4.0, which is 55%, so the axis passes at exactly 55/45. A left border of 2.5 mm against 1.5 mm gives 62.5/37.5, which is unlikely to gem.',
        'Borderless full-art TCG cards and sports photos use the same math on the inner print frame. When borders are ambiguous, compare against a known PSA 10 scan. Angled phone shots skew ratios by several points, which is enough to misread a borderline card, so always use flat scans or straight-on shots.',
      ],
    },
    {
      id: 'grade-comparison',
      title: 'PSA 10 Centering vs Other Grades',
      paragraphs: [
        'The table below maps each grade to its official centering threshold and typical market impact. Match your target grade before paying gem prices for mint-nine margins.',
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
        'Factory cut drift is the most frequent culprit: the production trim cuts one side wider than the other. Screen every raw purchase with a centering tool instead of discovering the drift at grading checkout.',
        'Print shift is subtler. The border math can look close while the artwork itself sits off-center, so check overall eye appeal from multiple angles rather than trusting the ruler alone.',
        'Narrow-border TCG designs such as Pokémon leave very little room for error, because the 55/45 tolerance translates into a fraction of a millimeter on each side.',
        'Before submitting, send only copies that pass centering plus strong corners, surface, and edges. Hong Kong collectors drop off at [138 Arena](/business/psa-grading/), which handles the venue and collects payment, while Appaw Store runs the PSA grading submission and follow-up. The preliminary inspection on arrival is a reference only, and batch tracking is available online. Save your measurements and photos as a paper trail.',
      ],
    },
    {
      id: 'practical-tips',
      title: 'Raise Your PSA 10 Hit Rate',
      paragraphs: [
        'Screen raw cards in a fixed order: check centering first, then corners and surface. If either front axis reads worse than 55/45, run the expected value math above and decide whether a likely PSA 9 still makes financial sense before you bulk submit or overpay for a slab.',
        'When buying graded online, demand flat, high-resolution front and back scans and run [graded-slab mode](/tools/card-centering/) on the listing photos, because angled slab shots hide skew.',
        'Time your submission around a reasonable queue window and declare an accurate PSA declared value. If centering is the only weak point on an otherwise elite card, [a regrade strategy](/guides/psa-review-vs-crack/) is an option, provided you accept the downgrade risk.',
        'After a PSA 10 returns, fit a [magnetic graded slab protector](/products/psa-protectors/) before display or travel so holder scuffs do not eat into resale value. See the [raw to protected slab workflow](/guides/grade-or-protect-first/) for the full sequence.',
      ],
    },
    {
      id: 'bottom-line',
      title: 'Measure before fees',
      paragraphs: [
        'PSA 10 centering (55/45 front, 75/25 back) allows some slack, but stable gems still need near-perfect raw copies. Measuring early is the practical first step: fewer wasted submissions, better buys, and cleaner resale.',
      ],
    },
  ],
  faq: [
    {
      q: 'What centering does PSA 10 require in 2025?',
      a: 'Front 55/45 or better on both axes, and back 75/25 or better. PSA tightened the front threshold from 60/40 in early 2025.',
    },
    {
      q: 'Can a card gem with 60/40 front centering?',
      a: 'Unlikely after the 2025 rule change. A 60/40 front usually caps at PSA 9 even with elite corners and surface.',
    },
    {
      q: 'How do I measure centering before submitting?',
      a: 'Measure the left/right and top/bottom borders on both the front and the back. Digital calipers work for precision, and the free card centering tool reads the ratios from a flat scan.',
    },
    {
      q: 'Is back centering as strict as the front?',
      a: 'No. PSA 10 allows 75/25 on the back versus 55/45 on the front, so a slightly loose reverse can still gem.',
    },
  ],
  midCta: {
    afterSectionId: 'psa-10-standard',
    title: 'Measure your copy against PSA 10 now',
    body: 'Upload a flat scan or seller photo and compare front and back margins to the 55/45 and 75/25 thresholds. Hong Kong collectors can then book online and complete intake at 138 Arena if they decide the fee is worth paying.',
    primary: { label: 'Free Centering Calculator', href: '/tools/card-centering/' },
    secondary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
  },
  cta: {
    title: 'Check your margins in minutes',
    body: 'If the margins pass, Hong Kong collectors who want to submit for grading book online, then complete intake face to face at 138 Arena. 138 Arena handles the venue and collects payment, while Appaw Store runs the PSA grading submission and follow-up. The preliminary inspection on arrival is a reference only, and PSA sets the final grade.',
    primary: { label: 'Free Centering Calculator', href: '/tools/card-centering/' },
    secondary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
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
