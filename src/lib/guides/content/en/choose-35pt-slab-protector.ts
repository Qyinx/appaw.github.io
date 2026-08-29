import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'choose-35pt-slab-protector',
  title: 'How to Choose a 35PT Graded Card Case',
  badge: 'Slab Hardware',
  lead:
    'A loose slab in a bag can chip the corner of a label that still costs two hundred dollars at resale. Most PSA and CGC holders at card shows sit in the same 35PT thickness band. The outer case only protects the brick if the inner cavity matches that outer width, height, and depth.',
  published: '2026-06-07',
  updated: '2026-08-30',
  readTime: '6 min',
  heroImage: '/images/background/guide-35pt-slab-protector.png',
  heroSpecs: [
    { label: 'Target fit', value: 'Standard 35PT PSA / CGC' },
    { label: 'PSA slab (ext.)', value: '3.16 × 5.32 × 0.27 in' },
    { label: 'Slab profile band', value: '25–40 PT class' },
    { label: 'Appaw case (ext.)', value: '8.7 × 14.2 × 0.98 cm' },
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
      bridge: 'Once the 35PT band is clear, measure the actual outer dimensions of your slab before you order a case.',
    },
    {
      id: 'measure-before-buy',
      title: 'Measure outer width, height, and depth',
      paragraphs: [
        'Lay the slab on a flat surface. Measure outer width and height with a ruler or calipers. Compare depth by stacking two slabs: a 35PT-class holder feels noticeably slimmer than vintage thick-case Pokémon holos or relic cards.',
        'CGC and PSA standard slabs are close enough that one 35PT-rated case with a rigid metal frame usually fits both. If you collect thick subgrades, autograph cards, or oddball sizes, check the grader\'s holder chart before assuming one protector covers the whole run.',
      ],
    },
    {
      id: 'fit-checklist',
      title: 'Fit Checklist That Saves Returns',
      paragraphs: [
        'The slab should seat flat with no corner lift. You should not need foam shims for a standard PSA 10 Pokémon slab. The label must stay fully readable through the front panel.',
        'Look for rigid sidewalls. Thin acrylic shells flex and transfer shock to the inner case. A metal frame plus a flat back plate spreads impact better when you travel to locals or ship domestically.',
        'Closure type matters for daily swaps. Magnetic latches (N52 grade is common on premium cases) let you rotate display pieces without screwdriver wear on the slab screw posts.',
      ],
      specs: [
        { label: 'Corner gap', value: 'Less than 0.5 mm of play on each side of a standard slab' },
        { label: 'Label clearance', value: 'The full PSA or CGC label remains readable through the front panel' },
        { label: 'Closure', value: 'Magnetic latch or metal screws; avoid clip-flex shells that transfer shock' },
      ],
    },
  ],
  faq: [
    {
      q: 'What does 35PT mean on a slab protector listing?',
      a: 'It means the outer case is moulded for standard PSA and CGC holders in the 25–40 PT thickness band, not that the protector itself is 0.035 in thick.',
    },
    {
      q: 'Will one 35PT case fit both PSA and CGC slabs?',
      a: 'Standard PSA and CGC slabs in the 35PT class are close enough that one rigid 35PT-rated case usually fits both. Thick relics, autograph cards, and non-standard holders still need a separate size check.',
    },
    {
      q: 'How should a slab sit inside the protector?',
      a: 'The slab should sit flat with no corner lift, the official label fully visible, and less than 0.5 mm of gap on each side of a standard PSA 10 Pokémon holder. Foam shims should not be required.',
    },
    {
      q: 'Can I return a protector after it arrives?',
      a: 'Yes. If any problem arises within fourteen days after the customer receives the goods, the customer may return the protector. The buyer pays the shipping cost of the return.',
    },
  ],
  cta: {
    title: 'Built for standard 35PT slabs',
    body: 'Appaw Store\'s magnetic UV glass case is sized for standard 35PT PSA and CGC holders, with glass that blocks more than 95% of ultraviolet below 400 nm and an N52 magnetic closure. Once a slab is collected at 138 Arena after PSA returns it, fit the outer case before display or travel. Hong Kong collectors who want to submit for grading book online, then complete intake face to face at 138 Arena in Causeway Bay. 138 Arena handles the floor and collects payment. Appaw Store runs PSA grading submission and follow-up, and may adjust the final amount. If any problem arises within fourteen days after the customer receives the protector, the customer may return it. The buyer pays the shipping cost of the return.',
    primary: { label: 'See Graded Card Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA, thinner holder for 25–40 PT cards (2023)',
      href: 'https://www.psacard.com/articles/articleview/10838/psa-unveils-thinner-card-holder-for-thicker-cards',
    },
    {
      label: 'PSA, current holder sizes',
      href: 'https://www.psacard.com/info/cardspsagrades',
    },
    {
      label: 'CGC Cards, grading scale and holder overview',
      href: 'https://www.cgccards.com/card-grading/grading-scale/',
    },
  ],
};

export default guide;
