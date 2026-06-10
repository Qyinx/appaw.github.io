import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'choose-35pt-slab-protector',
  title: 'How to Choose a 35PT Graded Card Case',
  description:
    'Match your PSA or CGC slab to a 35PT PSA slab case: external dimensions, fit checks, and what to skip before you buy a graded card protector.',
  badge: 'Slab Hardware',
  lead:
    'Most PSA and CGC slabs you see at card shows sit in the same thickness band: standard 35PT holders. A protector that fits that profile keeps the label visible, stops corner crush in a bag, and does not wobble on a shelf.',
  published: '2026-06-07',
  updated: '2026-06-07',
  readTime: '6 min',
  heroImage: '/images/background/guide-35pt-slab-protector.png',
  heroSpecs: [
    { label: 'PSA slab (ext.)', value: '3.16 × 5.32 × 0.27 in' },
    { label: 'Slab profile band', value: '25–40 PT class' },
    { label: 'Appaw case (ext.)', value: '8.7 × 14.2 × 0.98 cm' },
    { label: 'Target fit', value: 'Standard 35PT PSA / CGC' },
  ],
  sections: [
    {
      id: 'what-35pt-means',
      title: 'What 35PT Actually Refers To',
      paragraphs: [
        'In slab listings, PT means thousandths of an inch. PSA and CGC size standard holders for the 25–40 PT band, which covers most modern TCG and sports inserts. Since 2023, PSA\'s slimmer case for that band measures about 3.16 in wide, 5.32 in tall, and 0.27 in deep on the outside.',
        '"35PT protector" on a product page means the outer case is cut for that standard slab profile, not that the protector itself is 0.035 in thick. You are shopping for outer length, width, and depth that match a graded brick, plus enough rigidity that the slab cannot rattle.',
      ],
      specs: [
        { label: 'Standard slab (2023+)', value: '80 × 135 × 6.9 mm ext.' },
        { label: 'PSA ext. (2023+ slim)', value: '3.16 × 5.32 × 0.27 in' },
        { label: 'Thick cards (>40 PT)', value: 'Older deep PSA holder' },
      ],
    },
    {
      id: 'measure-before-buy',
      title: 'Measure Before You Buy',
      paragraphs: [
        'Lay the slab on a flat surface. Measure outer width and height with a ruler or calipers. Compare depth by stacking two slabs: a 35PT-class holder feels noticeably slimmer than vintage thick-case Pokémon holos or relic cards.',
        'CGC and PSA standard slabs are close enough that one 35PT-rated aluminum case usually fits both. If you collect thick subgrades, autograph cards, or oddball sizes, check the grader\'s holder chart before assuming one protector covers the whole run.',
      ],
    },
    {
      id: 'fit-checklist',
      title: 'Fit Checklist That Saves Returns',
      paragraphs: [
        'The slab should seat flat with no corner lift. You should not need foam shims for a standard PSA 10 Pokémon slab. The label must stay fully readable through the front panel.',
        'Look for rigid sidewalls. Thin acrylic shells flex and transfer shock to the inner case. Aluminum framing plus a flat back plate spreads impact better when you travel to locals or ship domestically.',
        'Closure type matters for daily swaps. Magnetic latches (N52 grade is common on premium cases) let you rotate display pieces without screwdriver wear on the slab screw posts.',
      ],
      specs: [
        { label: 'Corner gap', value: '< 0.5 mm each side' },
        { label: 'Label clearance', value: 'Full PSA / CGC visible' },
        { label: 'Closure', value: 'Magnetic or screw (no clip flex)' },
      ],
    },
  ],
  cta: {
    title: 'Built for standard 35PT slabs',
    body: 'Appaw Store\'s magnetic aluminum case is sized for PSA and CGC 35PT profiles, with >95% UV-blocking glass and N52 closure.',
    primary: { label: 'See Graded Card Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'UV protection for slabs', href: '/guides/uv-protection-graded-cards/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA — thinner holder for 25–40 PT cards (2023)',
      href: 'https://www.psacard.com/articles/articleview/10838/psa-unveils-thinner-card-holder-for-thicker-cards',
    },
    {
      label: 'PSA — current holder sizes',
      href: 'https://www.psacard.com/info/cardspsagrades',
    },
    {
      label: 'CGC Cards — grading scale and holder overview',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
