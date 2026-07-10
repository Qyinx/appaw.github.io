import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-grading-standards',
  title: 'PSA Grading Standards, Qualifiers & Record Sales Explained',
  badge: 'Grading Spec',
  lead:
    'A PSA 10 can sell for six figures. A PSA 9 on the same card might not clear four. The gap is not luck. It is the 1–10 scale, Qualifier codes, and centering rules buyers already use at checkout.',
  published: '2026-06-18',
  updated: '2026-07-11',
  readTime: '14 min',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'Items graded', value: '65 million+ certified' },
    { label: 'PSA 10 front', value: '55/45 or better' },
    { label: 'PSA 10 back', value: '75/25 or better' },
    { label: 'Qualifiers', value: 'OC · ST · PD · OF · MK · MC' },
  ],
  sections: [
    {
      id: 'what-is-psa',
      title: 'PSA grades are the checkout language',
      paragraphs: [
        'PSA (Professional Sports Authenticator), founded by David Hall in 1991, is one of the world\'s largest third-party card grading companies, over 65 million items certified to date. For collectors and investors, a PSA grade is the shared condition language: higher numbers mean sharper corners, cleaner surfaces, and better centering closer to factory state.',
      ],
      bulletGroups: [
        {
          label: 'Further reading',
          items: [
            {
              label: 'PSA official grading standards',
              text: '[psacard.com/gradingstandards](https://www.psacard.com/gradingstandards)',
            },
            {
              label: 'PSA 10 centering thresholds',
              text: 'Our [PSA 10 centering requirements](/guides/psa-10-centering-requirements/)',
            },
          ],
        },
      ],
    },
    {
      id: 'grade-scale',
      title: 'PSA 1–10 Grade Scale',
      paragraphs: [
        'PSA scores five factors together. Grade 1 is very poor; Grade 10 Gem Mint is near-perfect. The table below lists each official designation and core visual requirements.',
      ],
      bulletGroups: [
        {
          label: 'Scoring factors',
          items: [
            { label: 'Corners', text: 'Sharpness and wear at all four corners.' },
            { label: 'Edges', text: 'Whitening, chips, and edge wear.' },
            { label: 'Surface', text: 'Scratches, stains, and print flaws.' },
            { label: 'Centering', text: 'Front and back image symmetry.' },
            { label: 'Print', text: 'Clarity, color, and factory defects.' },
          ],
        },
      ],
      table: {
        headers: ['Grade / Code', 'Designation', 'Core Requirements'],
        rows: [
          [
            'PSA 10 (GM-MT)',
            'Gem Mint',
            'Sharp corners, no stains, strong print gloss; only tiny flaws under magnification. Front centering ≤55/45, back ≤75/25.',
          ],
          [
            'PSA 9 (MINT)',
            'Mint',
            'Excellent condition with only very minor, unobtrusive factory flaws or slight symmetry deviation.',
          ],
          [
            'PSA 8 (NM-MT)',
            'Near Mint-Mint',
            'Strong eye appeal; close inspection may reveal slight corner wear or minor print flaws.',
          ],
          [
            'PSA 7 (NM)',
            'Near Mint',
            'Light surface wear, edge whitening, or faint wax lines possible; card body remains sound.',
          ],
          [
            'PSA 6 (EX-MT)',
            'Excellent-Mint',
            'More visible flaws such as light surface scratches or edge wear.',
          ],
          [
            'PSA 5 (EX)',
            'Excellent',
            'Slightly rounded corners, reduced gloss, or light print lines.',
          ],
          [
            'PSA 4 (VG-EX)',
            'Very Good-Excellent',
            'Clearer wear; possible light creases or surface staining.',
          ],
          [
            'PSA 3 (VG)',
            'Very Good',
            'Obvious creases or scuffs; significant corner rounding.',
          ],
          [
            'PSA 2 (GOOD)',
            'Good',
            'Heavy edge and surface wear; gloss gone; deeper creases.',
          ],
          [
            'PSA 1.5 / 1 (FR/PR)',
            'Fair / Poor',
            'Severe staining, tears, writing, tampering, or water damage.',
          ],
        ],
      },
    },
    {
      id: 'qualifiers',
      title: 'PSA Qualifier Codes',
      paragraphs: [
        'A card may meet a numeric grade overall but carry a Qualifier when one major flaw is present, shown as "PSA 8 OC" on the label. Many collectors prefer NQ (No Qualifier) grades for cleaner interpretation.',
      ],
      bulletGroups: [
        {
          label: 'Common Qualifiers',
          items: [
            {
              label: 'OC (Off-Center)',
              text: 'Image significantly off-center; symmetry falls below the threshold for that grade.',
            },
            {
              label: 'ST (Staining)',
              text: 'Visible dirt, liquid residue, or wax/oil contamination on front or back.',
            },
            {
              label: 'PD (Print Defect)',
              text: 'Factory print flaw, heavy ink spots, print lines, or bleeding.',
            },
            {
              label: 'OF (Out of Focus)',
              text: 'Blurry, doubled, or poorly focused print.',
            },
            {
              label: 'MK (Marks)',
              text: 'Human marks: pen signatures, writing, or ink used to hide edge whitening.',
            },
            {
              label: 'MC (Miscut)',
              text: 'Severe factory miscut, uneven edges or adjacent-card image bleed.',
            },
            {
              label: 'NQ (No Qualifier)',
              text: 'No qualifier applied; the number stands alone.',
            },
          ],
        },
      ],
    },
    {
      id: 'record-sales',
      title: 'Record PSA 10 Sales',
      paragraphs: [
        'PSA 10 Gem Mint signals extreme scarcity plus authentication, top grades at auction often command order-of-magnitude premiums. Three public sales illustrate how the market prices perfection.',
      ],
      bulletGroups: [
        {
          label: 'Public sales',
          items: [
            {
              label: '1998 Pokémon Illustrator Pikachu, PSA 10',
              text: 'Sold for **$5.275 million** (~£3.85 million). YouTuber Logan Paul acquired it in a private 2023 transaction, widely cited as the most expensive trading card ever sold.',
            },
            {
              label: '1993 Magic Alpha Black Lotus, PSA 10',
              text: 'Sold for **$540,000** (~£428K) at auction in 2023. Banned in tournament play, but as a TCG history icon, PSA 10 condition makes it a trophy collectible.',
            },
            {
              label: '1998 Japanese Silver Pikachu Trophy (2nd Tournament), PSA 10',
              text: 'Sold for **$444,000** (~£347K) in 2023, proof of Pokémon tournament prize cards\' auction dominance.',
            },
          ],
        },
      ],
      callout:
        'Record sales involve globally tiny PSA 10 populations. On mainstream hot cards, PSA 10 vs PSA 9 spreads can still be multiples, screen raw copies before submitting. See [grade vs protect workflow](/guides/grade-or-protect-first/).',
    },
    {
      id: 'bottom-line',
      title: 'Read the grade before you pay',
      paragraphs: [
        'PSA 1–10 and Qualifiers are the market\'s shared vocabulary. Cross-check the scale and centering thresholds before submitting; verify cert numbers and slab authenticity before buying.',
      ],
      bulletGroups: [
        {
          label: 'Next steps',
          items: [
            {
              label: 'Guides index',
              text: 'More workflows in our [guides index](/guides/).',
            },
            {
              label: 'Hong Kong submission',
              text: 'Drop off and pick up at partner store 138 Arena, Causeway Bay — we submit to PSA on your behalf with online tracking. See [PSA collectibles submission](/business/psa-grading/).',
            },
            {
              label: 'Centering screen',
              text: 'Screen raw cards with the [free centering tool](/tools/card-centering/) before submitting.',
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Should I grade before auction?',
      a: 'Usually yes. A PSA label backs authenticity and condition, reduces buyer doubt, and often draws more bidders at higher final prices. Skip if condition likely caps below PSA 8 or raw value cannot cover grading fees.',
    },
    {
      q: 'Do low-grade rare cards still hold value?',
      a: 'Yes, rarity often beats condition. In early 2025, a heavily worn Unlimited Black Lotus with suspected ink touch-up on whitening still sold for about £5,200 at auction.',
    },
    {
      q: 'How are PSA grading fees calculated?',
      a: 'Fees depend on service tier and declared value; bulk tiers exist for large submissions. Check psacard.com/services for current pricing and turnaround.',
    },
    {
      q: 'How do I verify my PSA slab after grading?',
      a: 'Enter the certification number at psacard.com/cert and confirm photos, grade, and card details match the slab. Cross-check with UV blacklight, label era, and shell feel.',
    },
    {
      q: 'Can I regrade if I think the score is too low?',
      a: 'Yes, submit for Regrade. Outcomes can be higher, unchanged, or lower.',
    },
  ],
  cta: {
    title: 'Measure centering before you submit',
    body: 'Upload a scan or seller photo and compare front/back percentages against PSA 10 thresholds before paying grading fees.',
    primary: { label: 'Free centering tool', href: '/tools/card-centering/' },
    secondary: { label: 'PSA submission (HK)', href: '/business/psa-grading/' },
  },
  relatedSlugs: [
    'psa-10-centering-requirements',
    'grade-or-protect-first',
    'identify-fake-psa-slabs',
    'regrade-or-reholder',
  ],
  sources: [
    {
      label: 'PSA, Grading Standards',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'Cullen of Surrey, PSA Grading Standards (reference)',
      href: 'https://cullensofsurrey.co.uk/blog/psa-grading-standards',
    },
    {
      label: 'Guinness World Records, Logan Paul Pikachu Illustrator trade',
      href: 'https://www.guinnessworldrecords.com/news/2022/4/logan-paul-owns-5-275-million-pokemon-card-after-record-breaking-trade-697189',
    },
    {
      label: 'Polygon, Alpha Black Lotus PSA 10 auction',
      href: 'https://www.polygon.com/23644519/magic-the-gathering-black-lotus-auction-price-2023/',
    },
    {
      label: 'The Gamer, Silver Pikachu $444K sale',
      href: 'https://www.thegamer.com/pikachu-silver-trophy-card-444000-dollars-trading-card-game-second-highest-sale/',
    },
  ],
};

export default guide;
